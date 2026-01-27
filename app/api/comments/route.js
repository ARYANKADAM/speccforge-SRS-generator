import { NextResponse } from "next/server";
import dbConnect from "../../../lib/mongodb";
import Comment from "../../../models/Comment";
import { getToken } from "next-auth/jwt";

export async function GET(req) {
  await dbConnect();
  const { searchParams } = new URL(req.url);
  const sectionId = searchParams.get("sectionId");
  const documentId = searchParams.get("documentId");
  if (!sectionId || !documentId) {
    return NextResponse.json({ error: "Missing sectionId or documentId" }, { status: 400 });
  }
  const comments = await Comment.find({ sectionId, documentId }).sort({ createdAt: 1 });
  return NextResponse.json({ comments });
}

export async function POST(req) {
  await dbConnect();
  const body = await req.json();
  const { sectionId, documentId, text, user } = body;
  if (!sectionId || !documentId || !text || !user) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }
  const comment = await Comment.create({ sectionId, documentId, text, user });
  return NextResponse.json({ comment });
}
