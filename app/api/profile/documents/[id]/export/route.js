import { NextResponse } from "next/server";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import { Document, Packer, Paragraph, HeadingLevel, TextRun } from "docx";
import PptxGenJS from "pptxgenjs";
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

const buildPptx = async ({ projectName, markdown, createdAt }) => {
  const pptx = new PptxGenJS();
  pptx.layout = "LAYOUT_WIDE";
  pptx.author = "SpecForge";
  pptx.subject = "SRS Summary";
  pptx.company = "SpecForge";
  pptx.title = `${projectName} - SRS Summary`;

  const lines = parseLines(markdown).filter(Boolean);
  const headings = lines.filter((line) => /^#{1,3}\s+/.test(line)).slice(0, 6);
  const bullets = lines.filter((line) => /^[-*]\s+/.test(line)).slice(0, 8);

  const titleSlide = pptx.addSlide();
  titleSlide.background = { color: "0B1731" };
  titleSlide.addText("SpecForge", { x: 0.5, y: 0.3, w: 3, h: 0.4, color: "22D3EE", bold: true, fontSize: 14 });
  titleSlide.addText(projectName || "SRS Document", { x: 0.6, y: 1.2, w: 12, h: 0.8, color: "F8FAFC", bold: true, fontSize: 34 });
  titleSlide.addText("Software Requirements Specification", {
    x: 0.6,
    y: 2.1,
    w: 10,
    h: 0.4,
    color: "CBD5E1",
    fontSize: 16,
  });
  titleSlide.addText(`Generated on ${new Date(createdAt || Date.now()).toLocaleDateString()}`, {
    x: 0.6,
    y: 3,
    w: 7,
    h: 0.3,
    color: "94A3B8",
    fontSize: 11,
  });

  const agendaSlide = pptx.addSlide();
  agendaSlide.background = { color: "111827" };
  agendaSlide.addText("Executive Sections", { x: 0.6, y: 0.5, w: 6, h: 0.5, color: "E2E8F0", bold: true, fontSize: 24 });
  agendaSlide.addText(
    headings.length
      ? headings.map((h) => `• ${h.replace(/^#{1,3}\s+/, "")}`).join("\n")
      : "• Introduction\n• Overall Description\n• Features\n• Interfaces\n• Non-Functional Requirements",
    {
      x: 0.9,
      y: 1.4,
      w: 11.5,
      h: 4.5,
      color: "CBD5E1",
      fontSize: 16,
      breakLine: true,
      valign: "top",
    }
  );

  const summarySlide = pptx.addSlide();
  summarySlide.background = { color: "0F172A" };
  summarySlide.addText("Key Requirement Highlights", { x: 0.6, y: 0.5, w: 8, h: 0.5, color: "E2E8F0", bold: true, fontSize: 24 });
  summarySlide.addText(
    bullets.length
      ? bullets.map((b) => `• ${b.replace(/^[-*]\s+/, "")}`).join("\n")
      : "• Core business workflows documented\n• Security and reliability requirements covered\n• Functional scope and constraints defined",
    {
      x: 0.9,
      y: 1.4,
      w: 11.5,
      h: 4.8,
      color: "CBD5E1",
      fontSize: 14,
      breakLine: true,
      valign: "top",
    }
  );

  const closeSlide = pptx.addSlide();
  closeSlide.background = { color: "082F49" };
  closeSlide.addText("Next Steps", { x: 0.6, y: 0.8, w: 5, h: 0.5, color: "F8FAFC", bold: true, fontSize: 26 });
  closeSlide.addText("• Review with stakeholders\n• Finalize approvals\n• Freeze baseline version", {
    x: 0.9,
    y: 1.8,
    w: 8,
    h: 2,
    color: "CFFAFE",
    fontSize: 17,
    breakLine: true,
  });

  return pptx.write({ outputType: "nodebuffer" });
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

    if (!["docx", "pptx"].includes(format)) {
      return NextResponse.json({ error: "Invalid format. Use docx or pptx." }, { status: 400 });
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

    if (format === "docx") {
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
    }

    const pptBuffer = await buildPptx({
      projectName: document.projectName || "SRS Document",
      markdown,
      createdAt: document.createdAt,
    });

    return new Response(pptBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/vnd.openxmlformats-officedocument.presentationml.presentation",
        "Content-Disposition": `attachment; filename="${baseName}_summary.pptx"`,
      },
    });
  } catch (error) {
    console.error("Export generation failed:", error);
    return NextResponse.json({ error: error.message || "Export generation failed" }, { status: 500 });
  }
}
