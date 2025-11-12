import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { GoogleGenerativeAI } from "@google/generative-ai";
import mongoose from "mongoose";
import SRSForm from "@/models/SRSForm";
import dbConnect from "@/lib/mongodb";
import { uploadMarkdownToCloudinary } from "@/lib/cloudinary";
import { generatePDF } from "@/lib/pdfGenerator";
import { generateSimplePDF } from "@/lib/simplePdfGenerator";
import { uploadPDFToCloudinary } from "@/lib/cloudinaryPDF";

const JWT_SECRET = process.env.JWT_SECRET;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Retry function with exponential backoff
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isLastRetry = i === maxRetries - 1;
      
      // Check if it's a retryable error (429 = rate limit, 503 = overloaded, 500 = server error)
      const statusCode = error?.status || error?.response?.status || error?.code;
      const errorMessage = error?.message || '';
      const isRetryableError = 
        statusCode === 503 || 
        statusCode === 429 || 
        statusCode === 500 ||
        errorMessage.includes("overloaded") ||
        errorMessage.includes("rate limit") ||
        errorMessage.includes("RESOURCE_EXHAUSTED");
      
      if (isLastRetry || !isRetryableError) {
        throw error;
      }
      
      // Calculate delay with exponential backoff: baseDelay * 2^i + random jitter
      const delay = baseDelay * Math.pow(2, i) + Math.random() * 1000;
      console.log(`Retry attempt ${i + 1}/${maxRetries} after ${Math.round(delay)}ms due to error:`, errorMessage || statusCode);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

export async function POST(req) {
  await dbConnect();

  // Get token from Authorization header
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.split(" ")[1];

  let userId;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    userId = decoded.id;
  } catch (err) {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { ...fields } = body;

    // Build Gemini prompt (same as before)
    const prompt = `
Generate a detailed Software Requirement Specification (SRS) document in markdown format, following IEEE standards. Use clear, formal language. Expand and organize the provided points into comprehensive sections. Format with numbered sections and markdown headings. Include all relevant IEEE sections, even if some fields are empty.

## 1. Introduction
- **Project Name:** ${fields.projectName}
- **Purpose:** ${fields.purpose}
- **Scope:** ${fields.scope}
- **Definitions/Acronyms:** ${fields.definitions}
- **References:** ${fields.references}

## 2. Overall Description
- **Product Perspective:** ${fields.productPerspective}
- **Product Functions:** ${fields.productFunctions}
- **User Classes:** ${fields.userClasses}
- **Operating Environment:** ${fields.operatingEnvironment}
- **Design Constraints:** ${fields.constraints}
- **User Documentation:** ${fields.userDocumentation}
- **Assumptions & Dependencies:** ${fields.assumptions}

## 3. System Features (Functional Requirements)
${
  Array.isArray(fields.features)
    ? fields.features
        .map(
          (f, i) =>
            `### 3.${i + 1} ${f.name}\n- **Description:** ${
              f.description
            }\n- **Functional Requirements:** ${f.requirements}`
        )
        .join("\n\n")
    : ""
}

## 4. External Interface Requirements
- **User Interfaces:** ${fields.userInterfaces}
- **Hardware Interfaces:** ${fields.hardwareInterfaces}
- **Software Interfaces:** ${fields.softwareInterfaces}
- **Communication Interfaces:** ${fields.communicationInterfaces}

## 5. Non-Functional Requirements
- **Performance Requirements:** ${fields.performance}
- **Security Requirements:** ${fields.security}
- **Reliability & Availability:** ${fields.reliability}
- **Maintainability & Supportability:** ${fields.maintainability}
- **Usability:** ${fields.usability}
- **Portability:** ${fields.portability}

## 6. Other Requirements
- **Business Rules:** ${fields.businessRules}
- **Legal/Regulatory Compliance:** ${fields.legalCompliance}
- **Standards Compliance:** ${fields.standardsCompliance}

## 7. Appendices
- **Glossary:** ${fields.glossary}
- **Other Notes:** ${fields.notes}

Format the response as markdown only. Do not include any explanations or JSON. Use markdown headings and bullet points where appropriate.
`;

    // Generate markdown with Gemini
    console.log("Generating SRS with Gemini API...");
    const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
    const result = await model.generateContent(prompt);
    const markdown = result.response.text();
    console.log("Successfully generated SRS document");

    // Generate PDF from markdown
    console.log("Generating PDF from markdown...");
    let pdfBuffer = null;
    let pdfUrl = null;
    try {
      pdfBuffer = await generatePDF(markdown, fields.projectName || "SRS-Document");
      console.log("PDF generated successfully, size:", pdfBuffer.length, "bytes");
      
      // Upload PDF to Cloudinary
      try {
        pdfUrl = await uploadPDFToCloudinary(pdfBuffer, fields.projectName || "srs-document");
        console.log("PDF uploaded to Cloudinary:", pdfUrl);
      } catch (pdfUploadError) {
        console.error("PDF upload to Cloudinary failed:", pdfUploadError);
      }
    } catch (pdfError) {
      console.error("Puppeteer PDF generation failed:", pdfError);
      console.error("Error details:", pdfError.message);
      
      // Try fallback simple PDF generator
      try {
        console.log("Attempting fallback simple PDF generation...");
        pdfBuffer = await generateSimplePDF(markdown, fields.projectName || "SRS-Document");
        console.log("Fallback PDF generated successfully, size:", pdfBuffer.length, "bytes");
        
        // Upload fallback PDF to Cloudinary
        try {
          pdfUrl = await uploadPDFToCloudinary(pdfBuffer, fields.projectName || "srs-document");
          console.log("Fallback PDF uploaded to Cloudinary:", pdfUrl);
        } catch (fallbackUploadError) {
          console.error("Fallback PDF upload failed:", fallbackUploadError);
        }
      } catch (fallbackError) {
        console.error("Fallback PDF generation also failed:", fallbackError);
        // Continue without PDF - not critical
      }
    }

    // Upload markdown to Cloudinary with error handling
    let cloudinaryUrl = null;
    try {
      cloudinaryUrl = await uploadMarkdownToCloudinary(markdown, fields.projectName || "srs-document");
      console.log("Cloudinary markdown upload successful:", cloudinaryUrl);
    } catch (cloudinaryError) {
      console.error("Cloudinary markdown upload failed:", cloudinaryError);
      // Continue with saving to database, but without cloudinaryUrl
    }

    // Save form data and markdown URL to MongoDB
    console.log("Saving to MongoDB with userId:", userId);
    console.log("Converting userId to ObjectId for createdBy field");
    const userObjectId = new mongoose.Types.ObjectId(userId);
    console.log("Created ObjectId:", userObjectId);
    console.log("Cloudinary URL to save:", cloudinaryUrl);
    console.log("PDF URL to save:", pdfUrl);
    
    try {
      // Create the document object
      const srsDocument = {
        userId,
        createdBy: userObjectId, // Use the created ObjectId
        projectName: fields.projectName,
        purpose: fields.purpose,
        scope: fields.scope,
        definitions: fields.definitions,
        references: fields.references,
        productPerspective: fields.productPerspective,
        productFunctions: fields.productFunctions,
        userClasses: fields.userClasses,
        operatingEnvironment: fields.operatingEnvironment,
        constraints: fields.constraints,
        userDocumentation: fields.userDocumentation,
        assumptions: fields.assumptions,
        features: fields.features,
        userInterfaces: fields.userInterfaces,
        hardwareInterfaces: fields.hardwareInterfaces,
        softwareInterfaces: fields.softwareInterfaces,
        communicationInterfaces: fields.communicationInterfaces,
        performance: fields.performance,
        security: fields.security,
        reliability: fields.reliability,
        maintainability: fields.maintainability,
        usability: fields.usability,
        portability: fields.portability,
        businessRules: fields.businessRules,
        legalCompliance: fields.legalCompliance,
        standardsCompliance: fields.standardsCompliance,
        glossary: fields.glossary,
        notes: fields.notes,
        markdown: markdown,
      };
      
      // Explicitly set cloudinaryUrl if it exists
      if (cloudinaryUrl) {
        srsDocument.cloudinaryUrl = cloudinaryUrl;
        console.log("Adding cloudinaryUrl to document:", cloudinaryUrl);
      }
      
      // Explicitly set pdfUrl if it exists
      if (pdfUrl) {
        srsDocument.pdfUrl = pdfUrl;
        console.log("Adding pdfUrl to document:", pdfUrl);
      }
      
      const savedDoc = await SRSForm.create(srsDocument);
      
      console.log("MongoDB save successful. Document ID:", savedDoc._id);
      console.log("Saved with cloudinaryUrl:", savedDoc.cloudinaryUrl);
      console.log("Saved with pdfUrl:", savedDoc.pdfUrl);
      
      // Verify the document was saved with the cloudinaryUrl by fetching it again
      const verifiedDoc = await SRSForm.findById(savedDoc._id);
      console.log("Verified document from DB:", {
        id: verifiedDoc._id,
        createdBy: verifiedDoc.createdBy,
        cloudinaryUrl: verifiedDoc.cloudinaryUrl,
        pdfUrl: verifiedDoc.pdfUrl,
        hasCloudinaryUrlField: verifiedDoc.hasOwnProperty('cloudinaryUrl'),
        hasPdfUrlField: verifiedDoc.hasOwnProperty('pdfUrl'),
        hasCreatedByField: verifiedDoc.hasOwnProperty('createdBy')
      });
    } catch (dbError) {
      console.error("MongoDB save error:", dbError);
      throw dbError;
    }

    return NextResponse.json({ 
      srs: markdown, 
      cloudinaryUrl,
      pdfUrl,
      savedToDb: true,
      uploadStatus: cloudinaryUrl ? "success" : "failed",
      pdfStatus: pdfUrl ? "success" : "failed"
    });
  } catch (error) {
    console.error("SRS generation error:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
