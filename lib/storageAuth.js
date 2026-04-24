import jwt from "jsonwebtoken";

const STATE_SECRET = `${process.env.JWT_SECRET}:storage-state`;

export const getAppBaseUrl = (req) => {
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

export const buildStateToken = ({ userId, provider, redirectPath = "/profile" }) =>
  jwt.sign({ userId, provider, redirectPath }, STATE_SECRET, { expiresIn: "20m" });

export const parseStateToken = (token) => jwt.verify(token, STATE_SECRET);

export const getGoogleRedirectUri = (baseUrl) =>
  process.env.GOOGLE_REDIRECT_URI || `${baseUrl}/api/storage/google/callback`;

export const getOneDriveRedirectUri = (baseUrl) =>
  process.env.ONEDRIVE_REDIRECT_URI || `${baseUrl}/api/storage/onedrive/callback`;
