import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import dbConnect from "@/lib/mongodb";
import SRSForm from "@/models/SRSForm";
import User from "@/models/User";
import { sendCollaborationInviteEmail } from "@/lib/mailer";

const JWT_SECRET = process.env.JWT_SECRET;
const COLLAB_TOKEN_SECRET = `${process.env.JWT_SECRET}:collab`;
const MAX_EMAILS_PER_REQUEST = 10;

const normalizeEmail = (value) => value.trim().toLowerCase();

const parseEmails = (rawEmails) => {
  if (!Array.isArray(rawEmails)) return [];

  const unique = new Set();
  for (const email of rawEmails) {
    if (typeof email !== "string") continue;
    const normalized = normalizeEmail(email);
    if (!normalized) continue;
    unique.add(normalized);
  }

  return Array.from(unique);
};

const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const getAppBaseUrl = (req) => {
  if (process.env.NEXT_PUBLIC_APP_URL) {
    return process.env.NEXT_PUBLIC_APP_URL.replace(/\/$/, "");
  }

  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL.replace(/\/$/, "")}`;
  }

  const origin = req.headers.get("origin");
  if (origin) {
    return origin.replace(/\/$/, "");
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

    const body = await req.json();
    const emails = parseEmails(body.emails);

    if (emails.length === 0) {
      return NextResponse.json({ error: "At least one email is required" }, { status: 400 });
    }

    if (emails.length > MAX_EMAILS_PER_REQUEST) {
      return NextResponse.json(
        { error: `You can send at most ${MAX_EMAILS_PER_REQUEST} invites at once.` },
        { status: 400 }
      );
    }

    const invalidEmails = emails.filter((email) => !isValidEmail(email));
    if (invalidEmails.length > 0) {
      return NextResponse.json({ error: `Invalid emails: ${invalidEmails.join(", ")}` }, { status: 400 });
    }

    const document = await SRSForm.findById(id);
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (!document.createdBy || document.createdBy.toString() !== userId) {
      return NextResponse.json({ error: "Only document owner can send invites" }, { status: 403 });
    }

    const owner = await User.findById(userId).select("name email");
    const ownerEmail = normalizeEmail(owner?.email || "");

    const selfInviteAttempt = emails.some((email) => email === ownerEmail);
    if (selfInviteAttempt) {
      return NextResponse.json({ error: "Owner cannot invite themself." }, { status: 400 });
    }

    const existingCollaboratorEmails = new Set(
      (document.collaborators || [])
        .map((c) => normalizeEmail(c.email || ""))
        .filter(Boolean)
    );

    const freshEmails = emails.filter((email) => !existingCollaboratorEmails.has(email));

    if (freshEmails.length === 0) {
      return NextResponse.json({ error: "All selected users are already collaborators." }, { status: 400 });
    }

    const maxEditors = document?.collaboration?.maxEditors || 4;
    const acceptedCollaboratorCount = Array.isArray(document.collaborators)
      ? document.collaborators.length
      : 0;

    const remainingCollaboratorSlots = Math.max(maxEditors - 1 - acceptedCollaboratorCount, 0);

    if (remainingCollaboratorSlots <= 0) {
      return NextResponse.json(
        {
          error: `Collaboration limit reached. Max ${maxEditors} total editors allowed (including owner).`,
        },
        { status: 400 }
      );
    }

    if (freshEmails.length > remainingCollaboratorSlots) {
      return NextResponse.json(
        {
          error: `Only ${remainingCollaboratorSlots} collaborator slot(s) remaining.`,
        },
        { status: 400 }
      );
    }

    const appBaseUrl = getAppBaseUrl(req);

    const sendResults = [];
    for (const email of freshEmails) {
      const inviteToken = jwt.sign(
        {
          documentId: document._id,
          ownerId: document.createdBy,
          invitedEmail: email,
          kind: "document-collab",
        },
        COLLAB_TOKEN_SECRET,
        { expiresIn: "7d" }
      );

      const inviteUrl = `${appBaseUrl}/collab/accept?token=${encodeURIComponent(inviteToken)}`;

      await sendCollaborationInviteEmail({
        to: email,
        ownerName: owner?.name || "Document owner",
        projectName: document.projectName || "Untitled Document",
        inviteUrl,
      });

      sendResults.push({ email, status: "sent" });
    }

    return NextResponse.json({
      success: true,
      sent: sendResults,
      remainingCollaboratorSlots: remainingCollaboratorSlots - freshEmails.length,
      message: "Invite emails sent successfully.",
    });
  } catch (error) {
    console.error("Invite email sending failed:", error);
    return NextResponse.json({ error: error.message || "Failed to send invites" }, { status: 500 });
  }
}
