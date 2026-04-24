import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dbConnect from "../../../lib/mongodb";
import Comment from "../../../models/Comment";
import User from "../../../models/User";

const JWT_SECRET = process.env.JWT_SECRET;

const getUserIdFromAuthHeader = (req) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) return null;

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded?.id ? String(decoded.id) : null;
};

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const sectionId = searchParams.get("sectionId");
  const documentId = searchParams.get("documentId");

  if (!documentId) {
    return NextResponse.json({ error: "Missing documentId" }, { status: 400 });
  }

  const mode = searchParams.get("mode");

  if (mode === "counts") {
    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return NextResponse.json({ error: "Invalid documentId" }, { status: 400 });
    }

    const counts = await Comment.aggregate([
      { $match: { documentId: new mongoose.Types.ObjectId(documentId) } },
      { $group: { _id: "$sectionId", count: { $sum: 1 } } },
    ]);

    const sectionCounts = counts.reduce((acc, item) => {
      acc[item._id] = item.count;
      return acc;
    }, {});

    return NextResponse.json({ sectionCounts });
  }

  if (!sectionId) {
    return NextResponse.json({ error: "Missing sectionId" }, { status: 400 });
  }

  const comments = await Comment.find({ sectionId, documentId })
    .sort({ createdAt: 1 })
    .select("sectionId documentId user text createdAt updatedAt")
    .lean();

  return NextResponse.json({ comments });
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const { sectionId, documentId, text, user } = body;
  if (!sectionId || !documentId || !text) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  let safeUser = user;
  const authHeader = req.headers.get("authorization");

  if (authHeader?.startsWith("Bearer ")) {
    try {
      const token = authHeader.split(" ")[1];
      const decoded = jwt.verify(token, JWT_SECRET);
      const dbUser = await User.findById(decoded.id).select("name email");

      if (dbUser) {
        safeUser = {
          _id: dbUser._id,
          name: dbUser.name,
          email: dbUser.email,
        };
      }
    } catch (error) {
      return NextResponse.json({ error: "Invalid token" }, { status: 401 });
    }
  }

  if (!safeUser || !safeUser.name) {
    safeUser = { name: "Anonymous" };
  }

  const comment = await Comment.create({
    sectionId,
    documentId,
    text: text.trim(),
    user: safeUser,
  });

  return NextResponse.json({ comment });
}

export async function PUT(req) {
  await dbConnect();

  let userId;
  try {
    userId = getUserIdFromAuthHeader(req);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { commentId, text } = body;

  if (!commentId || !text?.trim()) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  if (!comment.user?._id || String(comment.user._id) !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  comment.text = text.trim();
  await comment.save();

  return NextResponse.json({ comment });
}

export async function DELETE(req) {
  await dbConnect();

  let userId;
  try {
    userId = getUserIdFromAuthHeader(req);
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  if (!userId) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json();
  const { commentId } = body;

  if (!commentId) {
    return NextResponse.json({ error: "Missing commentId" }, { status: 400 });
  }

  const comment = await Comment.findById(commentId);
  if (!comment) {
    return NextResponse.json({ error: "Comment not found" }, { status: 404 });
  }

  if (!comment.user?._id || String(comment.user._id) !== userId) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await Comment.findByIdAndDelete(commentId);

  return NextResponse.json({ success: true });
}
