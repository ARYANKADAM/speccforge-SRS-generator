import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { google } from "googleapis";
import { Readable } from "stream";
import dbConnect from "@/lib/mongodb";
import SRSForm from "@/models/SRSForm";
import StorageConnection from "@/models/StorageConnection";
import { getGoogleOAuthConfig } from "@/lib/storageAuth";

const JWT_SECRET = process.env.JWT_SECRET;

const isOwner = (document, userId) =>
  document.createdBy && document.createdBy.toString() === userId;

const isAcceptedCollaborator = (document, userId) =>
  Array.isArray(document.collaborators) &&
  document.collaborators.some((collab) => collab.userId?.toString() === userId);

const canAccessDocument = (document, userId) =>
  isOwner(document, userId) || isAcceptedCollaborator(document, userId);

const normalizeProvider = (value) => String(value || "").toLowerCase();

const getGoogleClient = async (connection) => {
  const googleOAuth = getGoogleOAuthConfig("");
  if (!googleOAuth.clientId || !googleOAuth.clientSecret) {
    throw new Error("Google OAuth is not configured");
  }

  const oauth2Client = new google.auth.OAuth2(
    googleOAuth.clientId,
    googleOAuth.clientSecret,
    googleOAuth.redirectUri
  );

  oauth2Client.setCredentials({
    access_token: connection.accessToken,
    refresh_token: connection.refreshToken,
    expiry_date: connection.expiresAt ? new Date(connection.expiresAt).getTime() : undefined,
  });

  const expired = connection.expiresAt && new Date(connection.expiresAt).getTime() <= Date.now() + 10000;
  if (expired && connection.refreshToken) {
    const { credentials } = await oauth2Client.refreshAccessToken();
    if (credentials.access_token) {
      connection.accessToken = credentials.access_token;
    }
    if (credentials.expiry_date) {
      connection.expiresAt = new Date(credentials.expiry_date);
    }
    await connection.save();
  }

  return oauth2Client;
};

const refreshOneDriveToken = async (connection) => {
  if (!connection.refreshToken) return;

  const tenant = process.env.ONEDRIVE_TENANT_ID || "common";
  const tokenResponse = await fetch(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams({
      client_id: process.env.ONEDRIVE_CLIENT_ID,
      client_secret: process.env.ONEDRIVE_CLIENT_SECRET,
      refresh_token: connection.refreshToken,
      grant_type: "refresh_token",
      scope: "offline_access User.Read Files.ReadWrite",
    }),
  });

  const tokenData = await tokenResponse.json();
  if (!tokenResponse.ok) {
    throw new Error(tokenData.error_description || "Failed to refresh OneDrive token");
  }

  connection.accessToken = tokenData.access_token;
  if (tokenData.refresh_token) {
    connection.refreshToken = tokenData.refresh_token;
  }
  if (tokenData.expires_in) {
    connection.expiresAt = new Date(Date.now() + tokenData.expires_in * 1000);
  }
  await connection.save();
};

export async function POST(req) {
  await dbConnect();

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    const body = await req.json();
    const docId = body?.docId;
    const provider = normalizeProvider(body?.provider);
    const fileType = String(body?.fileType || "markdown").toLowerCase();

    if (!mongoose.Types.ObjectId.isValid(docId)) {
      return NextResponse.json({ error: "Invalid document ID" }, { status: 400 });
    }

    if (!["google", "onedrive"].includes(provider)) {
      return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }

    const document = await SRSForm.findById(docId);
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (!canAccessDocument(document, userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const connection = await StorageConnection.findOne({ userId, provider });
    if (!connection) {
      return NextResponse.json({ error: `Connect ${provider} first` }, { status: 400 });
    }

    const safeName = (document.projectName || "srs-document").replace(/\s+/g, "_");

    let fileName = `${safeName}.md`;
    let mimeType = "text/markdown";
    let fileBuffer = Buffer.from(document.markdown || "", "utf-8");

    if (fileType === "pdf") {
      if (!document.pdfUrl) {
        return NextResponse.json({ error: "PDF not available yet. Generate PDF first." }, { status: 400 });
      }

      const pdfResponse = await fetch(document.pdfUrl);
      if (!pdfResponse.ok) {
        return NextResponse.json({ error: "Failed to fetch PDF file" }, { status: 500 });
      }

      const arrBuffer = await pdfResponse.arrayBuffer();
      fileBuffer = Buffer.from(arrBuffer);
      fileName = `${safeName}.pdf`;
      mimeType = "application/pdf";
    }

    if (provider === "google") {
      const authClient = await getGoogleClient(connection);
      const drive = google.drive({ version: "v3", auth: authClient });

      const result = await drive.files.create({
        requestBody: {
          name: fileName,
          mimeType,
        },
        media: {
          mimeType,
          body: Readable.from(fileBuffer),
        },
        fields: "id,webViewLink",
      });

      return NextResponse.json({
        success: true,
        provider,
        fileId: result.data.id,
        link: result.data.webViewLink,
      });
    }

    if (connection.expiresAt && new Date(connection.expiresAt).getTime() <= Date.now() + 10000) {
      await refreshOneDriveToken(connection);
    }

    const uploadRes = await fetch(
      `https://graph.microsoft.com/v1.0/me/drive/root:/SpecForge/${encodeURIComponent(fileName)}:/content`,
      {
        method: "PUT",
        headers: {
          Authorization: `Bearer ${connection.accessToken}`,
          "Content-Type": mimeType,
        },
        body: fileBuffer,
      }
    );

    if (!uploadRes.ok) {
      const errData = await uploadRes.json().catch(() => ({}));
      throw new Error(errData?.error?.message || "OneDrive upload failed");
    }

    const oneDriveFile = await uploadRes.json();

    return NextResponse.json({
      success: true,
      provider,
      fileId: oneDriveFile.id,
      link: oneDriveFile.webUrl,
    });
  } catch (error) {
    console.error("Storage upload failed:", error);
    return NextResponse.json({ error: error.message || "Storage upload failed" }, { status: 500 });
  }
}
