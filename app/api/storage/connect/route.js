import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import {
  getAppBaseUrl,
  buildStateToken,
  getGoogleOAuthConfig,
  getGoogleRedirectUri,
  getOneDriveRedirectUri,
} from "@/lib/storageAuth";

const JWT_SECRET = process.env.JWT_SECRET;

const getUserId = (req) => {
  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    throw new Error("Unauthorized");
  }

  const token = authHeader.split(" ")[1];
  const decoded = jwt.verify(token, JWT_SECRET);
  return decoded.id;
};

export async function POST(req) {
  try {
    const userId = getUserId(req);
    const body = await req.json();
    const provider = String(body?.provider || "").toLowerCase();
    const redirectPath = typeof body?.redirectPath === "string" && body.redirectPath.startsWith("/")
      ? body.redirectPath
      : "/profile";

    if (!["google", "onedrive"].includes(provider)) {
      return NextResponse.json({ error: "Invalid provider" }, { status: 400 });
    }

    const baseUrl = getAppBaseUrl(req);
    const state = buildStateToken({ userId, provider, redirectPath });

    if (provider === "google") {
      const googleOAuth = getGoogleOAuthConfig(baseUrl);
      if (!googleOAuth.clientId || !googleOAuth.clientSecret) {
        return NextResponse.json({ error: "Google OAuth is not configured" }, { status: 500 });
      }

      const redirectUri = googleOAuth.redirectUri || getGoogleRedirectUri(baseUrl);
      const scope = encodeURIComponent("https://www.googleapis.com/auth/drive.file https://www.googleapis.com/auth/userinfo.email");
      const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${encodeURIComponent(googleOAuth.clientId)}&redirect_uri=${encodeURIComponent(redirectUri)}&response_type=code&scope=${scope}&access_type=offline&prompt=consent&state=${encodeURIComponent(state)}`;

      return NextResponse.json({ authUrl });
    }

    if (!process.env.ONEDRIVE_CLIENT_ID || !process.env.ONEDRIVE_CLIENT_SECRET) {
      return NextResponse.json({ error: "OneDrive OAuth is not configured" }, { status: 500 });
    }

    const tenant = process.env.ONEDRIVE_TENANT_ID || "common";
    const redirectUri = getOneDriveRedirectUri(baseUrl);
    const scope = encodeURIComponent("offline_access User.Read Files.ReadWrite");
    const authUrl = `https://login.microsoftonline.com/${tenant}/oauth2/v2.0/authorize?client_id=${encodeURIComponent(process.env.ONEDRIVE_CLIENT_ID)}&response_type=code&redirect_uri=${encodeURIComponent(redirectUri)}&response_mode=query&scope=${scope}&state=${encodeURIComponent(state)}`;

    return NextResponse.json({ authUrl });
  } catch (error) {
    const message = error.message || "Failed to create connection URL";
    const status = message === "Unauthorized" ? 401 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
