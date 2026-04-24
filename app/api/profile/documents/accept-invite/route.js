import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import SRSForm from "@/models/SRSForm";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET;
const COLLAB_TOKEN_SECRET = `${process.env.JWT_SECRET}:collab`;

export async function POST(req) {
  await dbConnect();

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const authToken = authHeader.split(" ")[1];

  try {
    const decodedAuth = jwt.verify(authToken, JWT_SECRET);
    const currentUserId = decodedAuth.id;
    const currentUser = await User.findById(currentUserId).select("name email");

    if (!currentUser) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const body = await req.json();
    const { inviteToken } = body;

    if (!inviteToken) {
      return NextResponse.json({ error: "Missing invite token" }, { status: 400 });
    }

    const decodedInvite = jwt.verify(inviteToken, COLLAB_TOKEN_SECRET);

    if (decodedInvite.kind !== "document-collab") {
      return NextResponse.json({ error: "Invalid invite" }, { status: 400 });
    }

    const documentId = decodedInvite.documentId;
    const ownerId = decodedInvite.ownerId;
    const invitedEmail = decodedInvite.invitedEmail;

    if (invitedEmail) {
      const normalizedCurrentEmail = (currentUser.email || "").trim().toLowerCase();
      if (normalizedCurrentEmail !== String(invitedEmail).trim().toLowerCase()) {
        return NextResponse.json(
          { error: "This invite was sent to a different email address." },
          { status: 403 }
        );
      }
    }

    if (!mongoose.Types.ObjectId.isValid(documentId)) {
      return NextResponse.json({ error: "Invalid invite document" }, { status: 400 });
    }

    const document = await SRSForm.findById(documentId);
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (!document.createdBy || document.createdBy.toString() !== String(ownerId)) {
      return NextResponse.json({ error: "Invite no longer valid" }, { status: 400 });
    }

    if (document.createdBy.toString() === currentUserId) {
      return NextResponse.json({ success: true, message: "You are already the owner", documentId: document._id });
    }

    const alreadyCollaborator = (document.collaborators || []).some(
      (c) => c.userId?.toString() === currentUserId
    );

    if (alreadyCollaborator) {
      return NextResponse.json({ success: true, message: "Already a collaborator", documentId: document._id });
    }

    const maxEditors = document?.collaboration?.maxEditors || 4;
    const acceptedCollaboratorCount = Array.isArray(document.collaborators)
      ? document.collaborators.length
      : 0;

    if (acceptedCollaboratorCount + 1 >= maxEditors) {
      return NextResponse.json(
        {
          error: `Collaboration limit reached. Max ${maxEditors} total editors allowed (including owner).`,
        },
        { status: 400 }
      );
    }

    document.collaborators.push({
      userId: new mongoose.Types.ObjectId(currentUserId),
      name: currentUser?.name || "Collaborator",
      email: currentUser?.email || "",
      invitedBy: document.createdBy,
      acceptedAt: new Date(),
    });

    await document.save();

    return NextResponse.json({
      success: true,
      message: "Invite accepted. You can now edit this document.",
      documentId: document._id,
    });
  } catch (error) {
    console.error("Accept invite failed:", error);
    return NextResponse.json({ error: error.message || "Invalid or expired invite" }, { status: 400 });
  }
}
