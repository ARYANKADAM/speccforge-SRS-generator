import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import StorageConnection from "@/models/StorageConnection";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {
  await dbConnect();

  const authHeader = req.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);

    const connections = await StorageConnection.find({ userId: decoded.id })
      .select("provider accountEmail updatedAt")
      .lean();

    return NextResponse.json({ connections });
  } catch (error) {
    return NextResponse.json({ error: error.message || "Failed to fetch connections" }, { status: 500 });
  }
}
