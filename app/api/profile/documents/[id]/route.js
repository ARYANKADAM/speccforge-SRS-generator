import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import SRSForm from "@/models/SRSForm";

const JWT_SECRET = process.env.JWT_SECRET;

const isOwner = (document, userId) =>
  document.createdBy && document.createdBy.toString() === userId;

const isAcceptedCollaborator = (document, userId) =>
  Array.isArray(document.collaborators) &&
  document.collaborators.some((collab) => collab.userId?.toString() === userId);

const canEditDocument = (document, userId) =>
  isOwner(document, userId) || isAcceptedCollaborator(document, userId);

export async function GET(req, { params }) {
  await dbConnect();

  // ✅ Must await params in App Router
  const { id } = await params;

  // ✅ Token extraction
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.split(" ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid document ID" }, { status: 400 });
    }

    // Find document
    const document = await SRSForm.findById(id);
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    const owner = isOwner(document, userId);
    const collaborator = isAcceptedCollaborator(document, userId);

    if (!owner && !collaborator) {
      return NextResponse.json(
        { error: "You don't have permission to view this document" },
        { status: 403 }
      );
    }

    return NextResponse.json({
      document,
      permissions: {
        isOwner: owner,
        isCollaborator: collaborator,
        canEdit: owner || collaborator,
      },
    });
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PUT(req, { params }) {
  await dbConnect();

  const { id } = await params;

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const token = authHeader.split(" ")[1];

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid document ID" }, { status: 400 });
    }

    const document = await SRSForm.findById(id);
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (!canEditDocument(document, userId)) {
      return NextResponse.json({ error: "Unauthorized to edit this document" }, { status: 403 });
    }

    const body = await req.json();

    // Restrict editable fields to avoid unauthorized owner/collab data mutation.
    const editableFields = [
      "projectName",
      "purpose",
      "scope",
      "definitions",
      "references",
      "productPerspective",
      "productFunctions",
      "userClasses",
      "operatingEnvironment",
      "constraints",
      "userDocumentation",
      "assumptions",
      "features",
      "userInterfaces",
      "hardwareInterfaces",
      "softwareInterfaces",
      "communicationInterfaces",
      "performance",
      "security",
      "reliability",
      "maintainability",
      "usability",
      "portability",
      "businessRules",
      "legalCompliance",
      "standardsCompliance",
      "glossary",
      "notes",
      "markdown",
      "cloudinaryUrl",
      "pdfUrl",
    ];

    editableFields.forEach((field) => {
      if (Object.prototype.hasOwnProperty.call(body, field)) {
        document[field] = body[field];
      }
    });

    await document.save();

    return NextResponse.json({ success: true, document });
  } catch (error) {
    console.error("Error updating document:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(req, { params }) {
  await dbConnect();

  // ✅ Must await params in App Router
  const { id } = await params;

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

    // Validate MongoDB ObjectId
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return NextResponse.json({ error: "Invalid document ID" }, { status: 400 });
    }

    // Find the document
    const document = await SRSForm.findById(id);

    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (!isOwner(document, userId)) {
      return NextResponse.json({ error: "Unauthorized to delete this document" }, { status: 403 });
    }

    // Delete the document
    await SRSForm.findByIdAndDelete(id);

    return NextResponse.json({ 
      success: true,
      message: "Document deleted successfully" 
    });
  } catch (error) {
    console.error("Error deleting document:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
