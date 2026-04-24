import { NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import StorageConnection from "@/models/StorageConnection";
import { getAppBaseUrl, parseStateToken, getOneDriveRedirectUri } from "@/lib/storageAuth";

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const code = searchParams.get("code");
  const state = searchParams.get("state");

  if (!code || !state) {
    return NextResponse.redirect(`${getAppBaseUrl(req)}/profile?storage=error`);
  }

  try {
    const parsedState = parseStateToken(state);
    if (parsedState.provider !== "onedrive") {
      throw new Error("Invalid provider state");
    }

    const baseUrl = getAppBaseUrl(req);
    const redirectUri = getOneDriveRedirectUri(baseUrl);
    const tenant = process.env.ONEDRIVE_TENANT_ID || "common";

    const tokenResponse = await fetch(`https://login.microsoftonline.com/${tenant}/oauth2/v2.0/token`, {
      method: "POST",
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        client_id: process.env.ONEDRIVE_CLIENT_ID,
        client_secret: process.env.ONEDRIVE_CLIENT_SECRET,
        code,
        redirect_uri: redirectUri,
        grant_type: "authorization_code",
      }),
    });

    const tokenData = await tokenResponse.json();
    if (!tokenResponse.ok) {
      throw new Error(tokenData.error_description || "Token exchange failed");
    }

    let accountEmail = "";
    try {
      const profileResponse = await fetch("https://graph.microsoft.com/v1.0/me", {
        headers: {
          Authorization: `Bearer ${tokenData.access_token}`,
        },
      });

      if (profileResponse.ok) {
        const profile = await profileResponse.json();
        accountEmail = profile?.mail || profile?.userPrincipalName || "";
      }
    } catch {
      accountEmail = "";
    }

    await dbConnect();
    await StorageConnection.findOneAndUpdate(
      { userId: parsedState.userId, provider: "onedrive" },
      {
        $set: {
          userId: parsedState.userId,
          provider: "onedrive",
          accessToken: tokenData.access_token,
          refreshToken: tokenData.refresh_token,
          expiresAt: tokenData.expires_in ? new Date(Date.now() + tokenData.expires_in * 1000) : undefined,
          accountEmail,
        },
      },
      { upsert: true, new: true }
    );

    return NextResponse.redirect(`${baseUrl}${parsedState.redirectPath || "/profile"}?storage=onedrive_connected`);
  } catch (error) {
    console.error("OneDrive callback failed:", error);
    return NextResponse.redirect(`${getAppBaseUrl(req)}/profile?storage=error`);
  }
}
