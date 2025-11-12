import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import { GoogleGenerativeAI } from "@google/generative-ai";
import Chat from "@/models/Chat";
import dbConnect from "@/lib/mongodb";

const JWT_SECRET = process.env.JWT_SECRET;
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

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

  if (!message || message.trim() === "") {
    return NextResponse.json({ error: "Message is required" }, { status: 400 });
  }

  // System prompt for chat assistant
  const systemPrompt = `You are a helpful AI assistant for SpecForge, an SRS (Software Requirements Specification) document generator.
Help users with questions about software requirements, project planning, and documentation.
Provide clear, concise, and structured responses.
Do not ask follow-up questions unless absolutely necessary.`;

  try {
    // Use the same Gemini model as SRS generation (gemini-2.0-flash)
    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.0-flash",
      generationConfig: {
        temperature: 0.7,
        maxOutputTokens: 2048,
      },
    });
    
    // Generate response
    const prompt = `${systemPrompt}\n\nUser: ${message}\n\nAssistant:`;
    const result = await model.generateContent(prompt);
    
    if (!result || !result.response) {
      throw new Error("No response from Gemini API");
    }
    
    const response = result.response;
    const botReply = response.text();

    if (!botReply) {
      throw new Error("Empty response from Gemini API");
    }

    // Save user message
    await Chat.findOneAndUpdate(
      { userId },
      {
        $push: { messages: { role: "user", content: message } },
        model: "Gemini-2.0-Flash",
      },
      { upsert: true, new: true }
    );

    // Save bot reply
    await Chat.findOneAndUpdate(
      { userId },
      { $push: { messages: { role: "bot", content: botReply } } }
    );

    return NextResponse.json({ reply: botReply });
  } catch (error) {
    console.error("Chat API Error:", error);
    console.error("Error details:", error.message);
    console.error("Error stack:", error.stack);
    
    // Provide more specific error messages
    let errorMessage = "Sorry, I'm having trouble connecting to the AI model.";
    
    if (error.message?.includes("API key")) {
      errorMessage = "API key error. Please check your Gemini API configuration.";
    } else if (error.message?.includes("quota") || error.message?.includes("rate limit")) {
      errorMessage = "API rate limit reached. Please try again in a moment.";
    } else if (error.message?.includes("SAFETY")) {
      errorMessage = "Sorry, I cannot respond to that message due to safety filters.";
    }
    
    return NextResponse.json(
      { 
        error: errorMessage,
        reply: errorMessage 
      },
      { status: 500 }
    );
  }
}
