import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import SRSForm from "@/models/SRSForm";
import User from "@/models/User";
import EditorPresence from "@/models/EditorPresence";

const JWT_SECRET = process.env.JWT_SECRET;
const ACTIVE_WINDOW_MS = 35000;

const isOwner = (document, userId) =>
  document.createdBy && document.createdBy.toString() === userId;

const isAcceptedCollaborator = (document, userId) =>
  Array.isArray(document.collaborators) &&
  document.collaborators.some((collab) => collab.userId?.toString() === userId);

const canEditDocument = (document, userId) =>
  isOwner(document, userId) || isAcceptedCollaborator(document, userId);

const getUserId = (req) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded.id;
};

const validateDocumentAndAccess = async (id, userId) => {
  if (!mongoose.Types.ObjectId.isValid(id)) {
    throw new Error("Invalid document ID");
  }

  const document = await SRSForm.findById(id);
  if (!document) {
    throw new Error("Document not found");
  }

  if (!canEditDocument(document, userId)) {
    throw new Error("Forbidden");
  }

  return document;
};

export async function GET(req, { params }) {
  await dbConnect();

  const { id } = await params;

  try {
    const userId = getUserId(req);
    await validateDocumentAndAccess(id, userId);

    const threshold = new Date(Date.now() - ACTIVE_WINDOW_MS);
    const activeEditors = await EditorPresence.find({
      documentId: id,
      lastSeenAt: { $gte: threshold },
    })
      .sort({ lastSeenAt: -1 })
      .select("userId userName section lastSeenAt")
      .lean();

    return NextResponse.json({ activeEditors });
  } catch (error) {
    const message = error.message || "Failed to fetch presence";
    const status =
      message === "Unauthorized"
        ? 401
        : message === "Forbidden"
          ? 403
          : message === "Invalid document ID"
            ? 400
            : message === "Document not found"
              ? 404
              : 500;

    return NextResponse.json({ error: message }, { status });
  }
}

export async function POST(req, { params }) {
  await dbConnect();

  const { id } = await params;

  try {
    const userId = getUserId(req);
    await validateDocumentAndAccess(id, userId);

    const body = await req.json();
    const section = (body?.section || "general").trim().slice(0, 80);
    const currentUser = await User.findById(userId).select("name");

    await EditorPresence.findOneAndUpdate(
      { documentId: id, userId },
      {
        $set: {
          documentId: id,
          userId,
          userName: currentUser?.name || "Editor",
          section,
          lastSeenAt: new Date(),
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error.message || "Failed to update presence";
    const status =
      message === "Unauthorized"
        ? 401
        : message === "Forbidden"
          ? 403
          : message === "Invalid document ID"
            ? 400
            : message === "Document not found"
              ? 404
              : 500;

    return NextResponse.json({ error: message }, { status });
  }
}
