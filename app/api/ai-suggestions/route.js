import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { GoogleGenerativeAI } from "@google/generative-ai";

const JWT_SECRET = process.env.JWT_SECRET;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Retry function with exponential backoff for rate limits
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 2000) {
  for (let i = 0; i < maxRetries; i++) {
    try {
      return await fn();
    } catch (error) {
      const isLastRetry = i === maxRetries - 1;
      
      // Check if it's a retryable error (429 = rate limit, 503 = overloaded)
      const statusCode = error?.status || error?.response?.status;
      const errorMessage = error?.message || '';
      const isRetryableError = 
        statusCode === 503 || 
        statusCode === 429 || 
        errorMessage.includes("429") ||
        errorMessage.includes("Too Many Requests") ||
        errorMessage.includes("Resource exhausted") ||
        errorMessage.includes("RESOURCE_EXHAUSTED");
      
      if (isLastRetry || !isRetryableError) {
        throw error;
      }
      
      // Calculate delay with exponential backoff: baseDelay * 2^i + random jitter
      const delay = baseDelay * Math.pow(2, i) + Math.random() * 1000;
      console.log(`Rate limit hit. Retry attempt ${i + 1}/${maxRetries} after ${Math.round(delay)}ms...`);
      
      await new Promise(resolve => setTimeout(resolve, delay));
    }
  }
}

export async function POST(req) {
  // Get token from Authorization header
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.split("Bearer ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const { projectName, purpose, scope } = await req.json();

    if (!projectName || !purpose || !scope) {
      return NextResponse.json(
        { error: "Project Name, Purpose, and Scope are required" },
        { status: 400 }
      );
    }

    console.log("Generating AI suggestions for:", projectName);

    // Build AI prompt for suggestions
    const prompt = `You are an expert software requirements analyst. Based on the following project information, generate detailed and professional content for an SRS (Software Requirements Specification) document.

**Project Name:** ${projectName}
**Purpose:** ${purpose}
**Scope:** ${scope}

Generate comprehensive suggestions for the following sections. Return ONLY a valid JSON object with these exact field names. Each field value must be a STRING (not an object or array). Use line breaks (\\n) for lists:

{
  "definitions": "List 3-5 key technical terms, acronyms, and their definitions. Format: Term1: Definition\\nTerm2: Definition",
  "productPerspective": "Describe how this product fits into the larger system context, its dependencies, and interfaces",
  "productFunctions": "List 5-7 major functions/capabilities. Format: 1. Function name - Description\\n2. Function name - Description",
  "userClasses": "Identify 2-4 user types/roles. Format: 1. User Type: Characteristics\\n2. User Type: Characteristics",
  "operatingEnvironment": "Describe the technical environment (OS, browsers, devices, platforms supported)",
  "constraints": "List 3-5 design and implementation constraints. Format: - Constraint 1\\n- Constraint 2",
  "assumptions": "State 3-5 key assumptions. Format: - Assumption 1\\n- Assumption 2",
  "userInterfaces": "Describe the user interface requirements (web, mobile, desktop specifics)",
  "hardwareInterfaces": "Specify hardware interface requirements if applicable, or write 'Not applicable' if none",
  "softwareInterfaces": "List software systems this product will integrate with. Format: - System 1: Description\\n- System 2: Description",
  "communicationInterfaces": "Describe network protocols, APIs, data formats. Format: - Protocol/API 1\\n- Protocol/API 2",
  "performance": "Define performance requirements. Format: - Response time: X seconds\\n- Throughput: Y requests/second\\n- Concurrent users: Z",
  "security": "Specify security requirements. Format: - Authentication: Method\\n- Authorization: Approach\\n- Data encryption: Details",
  "reliability": "Define reliability requirements. Format: - Uptime: X%\\n- MTBF: Y hours\\n- Recovery time: Z minutes",
  "maintainability": "Describe maintainability requirements (modularity, documentation standards)",
  "usability": "Define usability requirements (ease of use, learning curve, accessibility)",
  "portability": "Specify portability requirements (cross-platform, browser compatibility)",
  "businessRules": "List 3-5 key business rules. Format: - Rule 1\\n- Rule 2",
  "glossary": "List 5-10 key terms and definitions. Format: Term1: Definition\\nTerm2: Definition\\nTerm3: Definition"
}

IMPORTANT: 
- ALL values must be plain text strings, NOT objects or arrays
- Use \\n for line breaks within strings
- Use bullet points (-) or numbers (1. 2. 3.) for lists
- Be specific and detailed based on the project
- Do not use nested JSON objects`;

    // Use Gemini to generate suggestions with retry logic
    const result = await retryWithBackoff(async () => {
      const model = genAI.getGenerativeModel({ 
        model: "gemini-2.0-flash",
        generationConfig: {
          temperature: 0.7,
          maxOutputTokens: 3000,
        },
      });
      return await model.generateContent(prompt);
    });
    
    const response = result.response;
    let aiResponse = response.text();

    console.log("Raw AI Response:", aiResponse);

    // Extract JSON from response (handle markdown code blocks)
    aiResponse = aiResponse.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
    
    // Parse JSON response
    let suggestions;
    try {
      suggestions = JSON.parse(aiResponse);
      
      // Ensure all values are strings, not objects
      Object.keys(suggestions).forEach(key => {
        if (typeof suggestions[key] === 'object' && suggestions[key] !== null) {
          // Convert objects/arrays to formatted strings
          if (Array.isArray(suggestions[key])) {
            suggestions[key] = suggestions[key].join('\n');
          } else {
            suggestions[key] = JSON.stringify(suggestions[key], null, 2);
          }
        } else if (typeof suggestions[key] !== 'string') {
          suggestions[key] = String(suggestions[key]);
        }
      });
      
    } catch (parseError) {
      console.error("JSON parse error:", parseError);
      console.error("Response was:", aiResponse);
      
      // Fallback: Try to extract JSON if wrapped in other text
      const jsonMatch = aiResponse.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        suggestions = JSON.parse(jsonMatch[0]);
        
        // Ensure all values are strings
        Object.keys(suggestions).forEach(key => {
          if (typeof suggestions[key] === 'object' && suggestions[key] !== null) {
            if (Array.isArray(suggestions[key])) {
              suggestions[key] = suggestions[key].join('\n');
            } else {
              suggestions[key] = JSON.stringify(suggestions[key], null, 2);
            }
          } else if (typeof suggestions[key] !== 'string') {
            suggestions[key] = String(suggestions[key]);
          }
        });
      } else {
        throw new Error("Failed to parse AI response as JSON");
      }
    }

    console.log("Generated suggestions successfully");

    return NextResponse.json({
      success: true,
      suggestions,
    });
  } catch (error) {
    console.error("Error generating AI suggestions:", error);
    
    // Provide user-friendly error messages
    let errorMessage = "Failed to generate suggestions";
    
    if (error.message?.includes("429") || error.message?.includes("Too Many Requests") || error.message?.includes("Resource exhausted")) {
      errorMessage = "API rate limit reached. Please wait a moment and try again. (Tip: Wait 60 seconds between requests)";
    } else if (error.message?.includes("API key")) {
      errorMessage = "API configuration error. Please contact support.";
    } else if (error.message?.includes("quota")) {
      errorMessage = "API quota exceeded. Please try again later.";
    }
    
    return NextResponse.json(
      { error: errorMessage },
      { status: error.message?.includes("429") ? 429 : 500 }
    );
  }
}
