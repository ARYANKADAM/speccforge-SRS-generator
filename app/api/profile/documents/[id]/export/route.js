import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from "docx";
import dbConnect from "@/lib/mongodb";
import SRSForm from "@/models/SRSForm";

const JWT_SECRET = process.env.JWT_SECRET;

const isOwner = (document, userId) =>
  document.createdBy && document.createdBy.toString() === userId;

const isAcceptedCollaborator = (document, userId) =>
  Array.isArray(document.collaborators) &&
  document.collaborators.some((collab) => collab.userId?.toString() === userId);

const canAccessDocument = (document, userId) =>
  isOwner(document, userId) || isAcceptedCollaborator(document, userId);

const parseLines = (markdown = "") => markdown.split("\n").map((line) => line.trim());

const markdownToDocxParagraphs = (markdown) => {
  const lines = parseLines(markdown);
  const paragraphs = [];

  lines.forEach((line) => {
    if (!line) {
      paragraphs.push(new Paragraph({ text: "" }));
      return;
    }

    if (line.startsWith("# ")) {
      paragraphs.push(new Paragraph({ text: line.slice(2), heading: HeadingLevel.HEADING_1 }));
      return;
    }

    if (line.startsWith("## ")) {
      paragraphs.push(new Paragraph({ text: line.slice(3), heading: HeadingLevel.HEADING_2 }));
      return;
    }

    if (line.startsWith("### ")) {
      paragraphs.push(new Paragraph({ text: line.slice(4), heading: HeadingLevel.HEADING_3 }));
      return;
    }

    if (/^[-*]\s+/.test(line)) {
      paragraphs.push(
        new Paragraph({
          text: line.replace(/^[-*]\s+/, ""),
          bullet: { level: 0 },
        })
      );
      return;
    }

    paragraphs.push(new Paragraph({ children: [new TextRun(line)] }));
  });

  return paragraphs;
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
    const format = String(body?.format || "").toLowerCase();

    if (format !== "docx") {
      return NextResponse.json({ error: "Invalid format. Use docx only." }, { status: 400 });
    }

    const document = await SRSForm.findById(id);
    if (!document) {
      return NextResponse.json({ error: "Document not found" }, { status: 404 });
    }

    if (!canAccessDocument(document, userId)) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const markdown = (document.markdown || "").trim() ||
      `# ${document.projectName || "SRS Document"}\n\n## Purpose\n${document.purpose || "-"}\n\n## Scope\n${document.scope || "-"}`;

    const baseName = (document.projectName || "srs-document").replace(/\s+/g, "_");

    const paragraphs = markdownToDocxParagraphs(markdown);
    const docxFile = new Document({
      sections: [
        {
          properties: {},
          children: [
            new Paragraph({ text: document.projectName || "SRS Document", heading: HeadingLevel.TITLE }),
            new Paragraph({ text: "Software Requirements Specification", spacing: { after: 300 } }),
            ...paragraphs,
          ],
        },
      ],
    });

    const buffer = await Packer.toBuffer(docxFile);

    return new Response(buffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
        "Content-Disposition": `attachment; filename="${baseName}.docx"`,
      },
    });
  } catch (error) {
    console.error("Export generation failed:", error);
    return NextResponse.json({ error: error.message || "Export generation failed" }, { status: 500 });
  }
}
