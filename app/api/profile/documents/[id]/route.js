import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import SRSForm from "@/models/SRSForm";

const JWT_SECRET = process.env.JWT_SECRET;

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

    // Permission check with .toString()
    const isOwner =
      (document.userId && document.userId.toString() === userId) ||
      (document.createdBy && document.createdBy.toString() === userId);

    if (!isOwner) {
      return NextResponse.json(
        { error: "You don't have permission to view this document" },
        { status: 403 }
      );
    }

    return NextResponse.json({ document });
  } catch (error) {
    console.error("Error fetching document:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
