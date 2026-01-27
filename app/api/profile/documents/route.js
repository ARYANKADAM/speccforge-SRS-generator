import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import dbConnect from "@/lib/mongodb";
import SRSForm from "@/models/SRSForm";
import User from "@/models/User";

const JWT_SECRET = process.env.JWT_SECRET;

export async function GET(req) {

  await dbConnect();

  // Get token from Authorization header
  const authHeader = req.headers.get("authorization");
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.split("Bearer ")[1];

  try {
    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET);
    const userId = decoded.id;

    // Get user documents
    const documents = await SRSForm.find({ 
      $or: [
        { userId: userId },
        { createdBy: userId }
      ]
    }).sort({ createdAt: -1 });  // Sort by most recent first

    // Get user information
    const user = await User.findById(userId).select("-password");
    
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ 
      user,
      documents
    });
  } catch (error) {
    console.error("Error fetching user documents:", error);
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
