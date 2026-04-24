import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import SRSForm from "@/models/SRSForm";

const JWT_SECRET = process.env.JWT_SECRET;
const COLLAB_TOKEN_SECRET = `${process.env.JWT_SECRET}:collab`;

const getAppBaseUrl = (req) => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  const origin = req.headers.get("origin");
  if (origin) {
    return origin.replace(/\/$/, "");
  }

  const forwardedHost = req.headers.get("x-forwarded-host");
  if (forwardedHost) {
    const forwardedProto = req.headers.get("x-forwarded-proto") || "https";
    return `${forwardedProto}://${forwardedHost.replace(/\/$/, "")}`;
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  return "http://localhost:3000";
};

export async function POST(req, { params }) {
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

    if (!document.createdBy || document.createdBy.toString() !== userId) {
      return NextResponse.json({ error: "Only document owner can generate invite links" }, { status: 403 });
    }

    const maxEditors = document?.collaboration?.maxEditors || 4;
    const acceptedCollaboratorCount = Array.isArray(document.collaborators)
      ? document.collaborators.length
      : 0;

    // Owner always counts as one editor.
    const remainingCollaboratorSlots = Math.max(maxEditors - 1 - acceptedCollaboratorCount, 0);

    if (remainingCollaboratorSlots <= 0) {
      return NextResponse.json(
        {
          error: `Collaboration limit reached. Max ${maxEditors} total editors allowed (including owner).`,
        },
        { status: 400 }
      );
    }

    const inviteToken = jwt.sign(
      {
        documentId: document._id,
        ownerId: document.createdBy,
        kind: "document-collab",
      },
      COLLAB_TOKEN_SECRET,
      { expiresIn: "7d" }
    );

    const appBaseUrl = getAppBaseUrl(req);
    const inviteUrl = `${appBaseUrl}/collab/accept?token=${encodeURIComponent(inviteToken)}`;

    return NextResponse.json({
      inviteToken,
      inviteUrl,
      remainingCollaboratorSlots,
      maxEditors,
    });
  } catch (error) {
    console.error("Invite link generation failed:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
