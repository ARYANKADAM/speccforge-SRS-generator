import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import Chat from "@/models/Chat";
import dbConnect from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET;

export async function POST(request) {
  await dbConnect();

  // Verify token
  const authHeader = request.headers.get("authorization");
  if (!authHeader?.startsWith("Bearer ")) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const token = authHeader.split(" ")[1];

  let userId;
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    userId = decoded.id;
  } catch {
    return NextResponse.json({ error: "Invalid token" }, { status: 401 });
  }

  const { message } = await request.json();

  // Prompt for Gemma2B — no follow-up questions, only summary/structured output
  const prompt = `
Do NOT ask any follow-up questions. Only respond with the structured summary.

User input:
${message}
`;

  try {
    const response = await fetch("http://localhost:11434/api/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "gemma:2b",
        prompt: prompt,
        stream: false,
      }),
    });

    if (!response.ok) throw new Error("Failed to get response from Gemma2B");

    const data = await response.json();

    // Save user message
    await Chat.findOneAndUpdate(
      { userId },
      {
        $push: { messages: { role: "user", content: message } },
        model: "Gemma2B",
      },
      { upsert: true, new: true }
    );

    // Save bot reply
    await Chat.findOneAndUpdate(
      { userId },
      { $push: { messages: { role: "bot", content: data.response } } }
    );

    return NextResponse.json({ reply: data.response });
  } catch (error) {
    console.error("Error:", error);
    return NextResponse.json(
      {
        reply:
          "Sorry, I'm having trouble connecting to the AI model.",
      },
      { status: 500 }
    );
  }
}
