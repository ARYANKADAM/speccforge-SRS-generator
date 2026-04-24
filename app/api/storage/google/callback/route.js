import { NextResponse } from "next/server";
import { google } from "googleapis";
import dbConnect from "@/lib/mongodb";
import StorageConnection from "@/models/StorageConnection";
import { getAppBaseUrl, parseStateToken, getGoogleOAuthConfig } from "@/lib/storageAuth";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(`${getAppBaseUrl(req)}/profile?storage=error`);
  }

  try {
    const parsedState = parseStateToken(state);
    if (parsedState.provider !== "google") {
      throw new Error("Invalid provider state");
    }

    const baseUrl = getAppBaseUrl(req);
    const googleOAuth = getGoogleOAuthConfig(baseUrl);
    if (!googleOAuth.clientId || !googleOAuth.clientSecret) {
      throw new Error("Google OAuth is not configured");
    }

    const oauth2Client = new google.auth.OAuth2(
      googleOAuth.clientId,
      googleOAuth.clientSecret,
      googleOAuth.redirectUri
    );

    const { tokens } = await oauth2Client.getToken(code);
    oauth2Client.setCredentials(tokens);

    let accountEmail = "";
    try {
      const oauth2 = google.oauth2({ version: "v2", auth: oauth2Client });
      const me = await oauth2.userinfo.get();
      accountEmail = me?.data?.email || "";
    } catch {
      accountEmail = "";
    }

    await dbConnect();
    await StorageConnection.findOneAndUpdate(
      { userId: parsedState.userId, provider: "google" },
      {
        $set: {
          userId: parsedState.userId,
          provider: "google",
          accessToken: tokens.access_token,
          refreshToken: tokens.refresh_token,
          expiresAt: tokens.expiry_date ? new Date(tokens.expiry_date) : undefined,
          accountEmail,
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.redirect(`${baseUrl}${parsedState.redirectPath || "/profile"}?storage=google_connected`);
  } catch (error) {
    console.error("Google callback failed:", error);
    return NextResponse.redirect(`${getAppBaseUrl(req)}/profile?storage=error`);
  }
}
