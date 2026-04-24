"use client";
import React, { use, useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import ReactMarkdown from "react-markdown";
import SectionComments from "../../components/SectionComments";
import Image from "next/image";

export default function DocumentView({ params }) {
  const router = useRouter();
  const { id } = use(params);
  const [document, setDocument] = useState(null);
  const [permissions, setPermissions] = useState({ canEdit: false, isOwner: false });
  const [sectionCommentCounts, setSectionCommentCounts] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Check if user is authenticated
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Fetch document details
    fetchDocument(token, id);
  }, [id, router]);

  const fetchDocument = async (token, documentId) => {
    try {
      setLoading(true);

      // Fetch document from the API
      const response = await fetch(`/api/profile/documents/${documentId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch document");
      }

      const data = await response.json();
      setDocument(data.document);
      setPermissions(data.permissions || { canEdit: false, isOwner: false });
      fetchCommentCounts(data.document?._id);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching document:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const fetchCommentCounts = async (documentId) => {
    if (!documentId) return;
    try {
      const response = await fetch(`/api/comments?documentId=${documentId}&mode=counts`);
      if (!response.ok) return;
      const data = await response.json();
      setSectionCommentCounts(data.sectionCounts || {});
    } catch (err) {
      setSectionCommentCounts({});
    }
  };

  const handleGenerateInvite = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/profile/documents/${id}/invite`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to generate invite link");
      }

      const inviteUrl = data.inviteUrl || `${window.location.origin}/collab/accept?token=${encodeURIComponent(data.inviteToken)}`;

      if (navigator.share) {
        try {
          await navigator.share({
            title: "SpecForge Collaboration Invite",
            text: "Join my SpecForge document as a collaborator.",
            url: inviteUrl,
          });
        } catch {
          // If user cancels share, continue to copy fallback.
        }
      }

      if (navigator.clipboard?.writeText) {
        try {
          await navigator.clipboard.writeText(inviteUrl);
          alert(`Invite link copied. Remaining collaborator slots: ${data.remainingCollaboratorSlots}`);
          return;
        } catch {
          // Clipboard can fail when tab loses focus (e.g., share sheet opened).
        }
      }

      window.prompt("Copy and share this invite link:", inviteUrl);
    } catch (err) {
      alert(err.message || "Failed to generate invite link");
    }
  };

  const handleDownloadPdf = async () => {
    try {
      if (document?.pdfUrl) {
        window.open(document.pdfUrl, "_blank", "noopener,noreferrer");
        return;
      }

      const token = localStorage.getItem("token");
      const response = await fetch("/api/md-to-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          docId: document?._id,
          title: document?.projectName || "SpecForge SRS Document",
          subtitle: "Software Requirements Specification (SRS)",
          author: "",
          date: new Date(document?.createdAt || Date.now()).toLocaleDateString(),
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "PDF generation failed");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = `${(document?.projectName || "document").replace(/\s+/g, "_")}_SpecForge.pdf`;
      window.document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(`PDF download failed: ${err.message}`);
    }
  };

  const handleExportFile = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/profile/documents/${id}/export`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ format: "docx" }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error || "Failed to export DOCX");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const a = window.document.createElement("a");
      a.href = url;
      a.download = `${(document?.projectName || "document").replace(/\s+/g, "_")}.docx`;
      window.document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert(err.message || "Failed to export DOCX");
    }
  };

  const connectStorage = async (provider) => {
    const token = localStorage.getItem("token");
    const response = await fetch("/api/storage/connect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ provider, redirectPath: `/profile/${id}` }),
    });

    const data = await response.json();
    if (!response.ok) {
      throw new Error(data.error || `Failed to connect ${provider}`);
    }

    window.location.href = data.authUrl;
  };

  const handleUploadToStorage = async (provider, fileType = "pdf") => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch("/api/storage/upload", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ docId: id, provider, fileType }),
      });

      const data = await response.json();
      if (!response.ok) {
        if ((data.error || "").toLowerCase().includes("connect")) {
          await connectStorage(provider);
          return;
        }
        throw new Error(data.error || `Failed to upload to ${provider}`);
      }

      if (data.link) {
        window.open(data.link, "_blank", "noopener,noreferrer");
      }

      alert(`Uploaded to ${provider === "google" ? "Google Drive" : "OneDrive"} successfully.`);
    } catch (err) {
      alert(err.message || `Failed to upload to ${provider}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 relative overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/images/rays.png')]">
        {/* Background Rays */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.9),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.9),transparent_70%)]"></div>
        </div>

        {/* 🌥️ Clouds Layer - Hidden on smaller screens */}
        <div className="absolute inset-0 z-0 hidden sm:block">
          <Image
            src="/images/cloud.png"
            alt="Cloud Top Left"
            width={500}
            height={300}
            className="absolute top-[8%] left-[-10%] opacity-30"
          />
          <Image
            src="/images/cloud.png"
            alt="Cloud Bottom Right"
            width={700}
            height={300}
            className="absolute bottom-[5%] right-[-20%] opacity-25"
          />
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex flex-col items-center">
            <div className="flex justify-center items-center h-48">
              <div className="bg-white p-8 rounded-xl shadow-xl flex flex-col items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
                <p className="mt-4 text-gray-600">Loading document...</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 relative overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/images/rays.png')]">
        {/* Background Rays */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.9),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.9),transparent_70%)]"></div>
        </div>

        {/* 🌥️ Clouds Layer - Hidden on smaller screens */}
        <div className="absolute inset-0 z-0 hidden sm:block">
          <Image
            src="/images/cloud.png"
            alt="Cloud Top Left"
            width={500}
            height={300}
            className="absolute top-[8%] left-[-10%] opacity-30"
          />
          <Image
            src="/images/cloud.png"
            alt="Cloud Bottom Right"
            width={700}
            height={300}
            className="absolute bottom-[5%] right-[-20%] opacity-25"
          />
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex flex-col items-center">
            {/* Logo */}
            <div className="relative z-10 flex items-center justify-center mb-8">
              <Image
                src="/images/Logo2.png"
                alt="Logo"
                width={80}
                height={60}
                className="object-contain"
                priority
              />
            </div>

            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl">
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!document) {
    return (
      <div className="min-h-screen bg-gray-50 relative overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/images/rays.png')]">
        {/* Background Rays */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.9),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.9),transparent_70%)]"></div>
        </div>

        {/* 🌥️ Clouds Layer - Hidden on smaller screens */}
        <div className="absolute inset-0 z-0 hidden sm:block">
          <Image
            src="/images/cloud.png"
            alt="Cloud Top Left"
            width={500}
            height={300}
            className="absolute top-[8%] left-[-10%] opacity-30"
          />
          <Image
            src="/images/cloud.png"
            alt="Cloud Bottom Right"
            width={700}
            height={300}
            className="absolute bottom-[5%] right-[-20%] opacity-25"
          />
        </div>

        <div className="container mx-auto px-4 py-8 relative z-10">
          <div className="flex flex-col items-center">
            {/* Logo */}
            <div className="relative z-10 flex items-center justify-center mb-8">
              <Image
                src="/images/Logo2.png"
                alt="Logo"
                width={80}
                height={60}
                className="object-contain"
                priority
              />
            </div>

            <div className="bg-white rounded-xl shadow-xl p-6 w-full max-w-3xl">
              <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded-lg">
                <strong className="font-bold">Document not found. </strong>
                <span className="block sm:inline">
                  The document you're looking for doesn't exist or you don't
                  have permission to view it.
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const headingCounters = {};

  const getTextFromNode = (node) => {
    if (typeof node === "string" || typeof node === "number") {
      return String(node);
    }

    if (Array.isArray(node)) {
      return node.map(getTextFromNode).join(" ");
    }

    if (node?.props?.children) {
      return getTextFromNode(node.props.children);
    }

    return "";
  };

  const getStableSectionId = (children) => {
    const rawText = getTextFromNode(children)
      .replace(/\s+/g, " ")
      .trim();

    const base = (rawText || "untitled-section")
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-")
      .slice(0, 90);

    headingCounters[base] = (headingCounters[base] || 0) + 1;
    const index = headingCounters[base];

    return index === 1 ? base : `${base}-${index}`;
  };

  return (
    <div className="min-h-screen bg-[radial-gradient(1200px_400px_at_15%_0%,rgba(56,189,248,0.16),transparent_60%),radial-gradient(900px_420px_at_85%_8%,rgba(99,102,241,0.18),transparent_55%),linear-gradient(135deg,#020617,#0b1731_50%,#0f172a)] text-slate-100 relative overflow-hidden">
      <div className="absolute inset-0 -z-10">
        <div className="absolute -top-24 left-8 h-52 w-52 rounded-full bg-cyan-400/20 blur-3xl"></div>
        <div className="absolute -bottom-24 right-8 h-60 w-60 rounded-full bg-indigo-400/20 blur-3xl"></div>
      </div>

      <div className="mx-auto w-full max-w-6xl px-4 py-8 md:px-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-slate-700/80 bg-slate-900/65 px-4 py-3 shadow-xl backdrop-blur md:px-6">
          <Link
            href="/profile"
            className="inline-flex items-center gap-2 text-sm font-semibold text-slate-200 transition hover:text-cyan-300"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
            Back To Documents
          </Link>

          <div className="flex items-center gap-3">
            <span className="rounded-full border border-cyan-400/30 bg-cyan-500/10 px-3 py-1 text-xs font-medium text-cyan-200">
              Live Comments Enabled
            </span>
            {permissions.canEdit && (
              <Link
                href={`/profile/${id}/edit`}
                className="inline-flex items-center gap-2 rounded-lg border border-cyan-400/40 bg-cyan-500/10 px-4 py-2 text-sm font-semibold text-cyan-200 transition hover:bg-cyan-500/20"
              >
                Edit
              </Link>
            )}
            {permissions.isOwner && (
              <button
                onClick={handleGenerateInvite}
                className="inline-flex items-center gap-2 rounded-lg border border-violet-400/40 bg-violet-500/10 px-4 py-2 text-sm font-semibold text-violet-200 transition hover:bg-violet-500/20"
              >
                Share Invite Link
              </button>
            )}
            <button
              onClick={handleDownloadPdf}
              className="inline-flex items-center gap-2 rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 transition hover:bg-cyan-400"
            >
              Download PDF
            </button>
            <button
              onClick={handleExportFile}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
            >
              Export DOCX
            </button>
            <button
              onClick={() => handleUploadToStorage("google", "pdf")}
              className="inline-flex items-center gap-2 rounded-lg border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-sm font-semibold text-emerald-200 transition hover:bg-emerald-500/20"
            >
              Save To Drive
            </button>
            <button
              onClick={() => handleUploadToStorage("onedrive", "pdf")}
              className="inline-flex items-center gap-2 rounded-lg border border-blue-400/40 bg-blue-500/10 px-4 py-2 text-sm font-semibold text-blue-200 transition hover:bg-blue-500/20"
            >
              Save To OneDrive
            </button>
          </div>
        </div>

        <div className="rounded-3xl border border-slate-700/80 bg-slate-950/70 p-6 shadow-2xl backdrop-blur md:p-10">
          <h1 className="mb-6 border-b border-slate-700 pb-4 text-2xl font-bold text-slate-100 md:text-3xl">
            {document.projectName}
          </h1>

          <div className="markdown-content">
            {document.markdown ? (
              (() => {
                // Remove leading/trailing triple backticks and trim whitespace
                let cleanMarkdown = document.markdown.trim();
                if (cleanMarkdown.startsWith("```")) {
                  cleanMarkdown = cleanMarkdown.replace(/^```[a-zA-Z]*\n?/, "");
                }
                if (cleanMarkdown.endsWith("```")) {
                  cleanMarkdown = cleanMarkdown.replace(/```$/, "");
                }
                return (
                  <ReactMarkdown
                    components={{
                      h1: ({ children }) => {
                        const sectionId = getStableSectionId(children);
                        return (
                          <div className="mb-6 mt-10 flex flex-wrap items-start justify-between gap-3 border-b border-cyan-800/60 pb-3">
                            <h1 className="text-3xl font-bold leading-tight text-slate-100">{children}</h1>
                            <SectionComments sectionId={sectionId} initialCount={sectionCommentCounts[sectionId] || 0} documentId={document._id} user={document.user || { name: "Anonymous" }} />
                          </div>
                        );
                      },
                      h2: ({ children }) => {
                        const sectionId = getStableSectionId(children);
                        return (
                          <div className="mb-4 mt-8 flex flex-wrap items-start justify-between gap-3 border-b border-slate-700 pb-2">
                            <h2 className="text-2xl font-bold text-cyan-100">{children}</h2>
                            <SectionComments sectionId={sectionId} initialCount={sectionCommentCounts[sectionId] || 0} documentId={document._id} user={document.user || { name: "Anonymous" }} />
                          </div>
                        );
                      },
                      h3: ({ children }) => {
                        const sectionId = getStableSectionId(children);
                        return (
                          <div className="mb-3 mt-6 flex flex-wrap items-start justify-between gap-3">
                            <h3 className="text-lg font-semibold text-sky-200">{children}</h3>
                            <SectionComments sectionId={sectionId} initialCount={sectionCommentCounts[sectionId] || 0} documentId={document._id} user={document.user || { name: "Anonymous" }} />
                          </div>
                        );
                      },
                      h4: ({ children }) => {
                        const sectionId = getStableSectionId(children);
                        return (
                          <div className="mb-2 mt-5 flex flex-wrap items-start justify-between gap-3">
                            <h4 className="text-base font-semibold text-sky-100">{children}</h4>
                            <SectionComments sectionId={sectionId} initialCount={sectionCommentCounts[sectionId] || 0} documentId={document._id} user={document.user || { name: "Anonymous" }} />
                          </div>
                        );
                      },
                      h5: ({ children }) => {
                        const sectionId = getStableSectionId(children);
                        return (
                          <div className="mb-2 mt-4 flex flex-wrap items-start justify-between gap-3">
                            <h5 className="text-base font-medium text-sky-50">{children}</h5>
                            <SectionComments sectionId={sectionId} initialCount={sectionCommentCounts[sectionId] || 0} documentId={document._id} user={document.user || { name: "Anonymous" }} />
                          </div>
                        );
                      },
                      h6: ({ children }) => {
                        const sectionId = getStableSectionId(children);
                        return (
                          <div className="mb-2 mt-4 flex flex-wrap items-start justify-between gap-3">
                            <h6 className="text-sm font-semibold text-slate-200">{children}</h6>
                            <SectionComments sectionId={sectionId} initialCount={sectionCommentCounts[sectionId] || 0} documentId={document._id} user={document.user || { name: "Anonymous" }} />
                          </div>
                        );
                      },
                      p: ({ children }) => (
                        <p className="mb-4 text-base leading-relaxed text-slate-300">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="mb-4 list-disc space-y-2 pl-6 text-slate-300">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="mb-4 list-decimal space-y-2 pl-6 text-slate-300">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="leading-relaxed">{children}</li>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="mb-4 rounded-r-lg border-l-4 border-cyan-400 bg-cyan-500/10 py-4 pl-6 italic text-slate-200">
                          {children}
                        </blockquote>
                      ),
                      code: ({ inline, children }) =>
                        inline ? (
                          <code className="rounded bg-slate-800 px-2 py-1 font-mono text-sm text-cyan-200">
                            {children}
                          </code>
                        ) : (
                          <code className="mb-4 block overflow-x-auto rounded-lg bg-slate-950 p-4 font-mono text-sm leading-relaxed text-emerald-300">
                            {children}
                          </code>
                        ),
                      pre: ({ children }) => (
                        <pre className="mb-4 overflow-x-auto rounded-lg border border-slate-800 bg-slate-950 p-4 text-emerald-300 shadow-lg">
                          {children}
                        </pre>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          className="text-cyan-300 underline transition-colors hover:text-cyan-200 hover:no-underline"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                      table: ({ children }) => (
                        <div className="mb-4 overflow-x-auto rounded-lg border border-slate-700">
                          <table className="min-w-full bg-slate-900">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead className="border-b border-slate-700 bg-slate-800">
                          {children}
                        </thead>
                      ),
                      tbody: ({ children }) => (
                        <tbody className="divide-y divide-slate-800">
                          {children}
                        </tbody>
                      ),
                      th: ({ children }) => (
                        <th className="border-b border-slate-700 px-4 py-3 text-left font-semibold text-slate-100">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="px-4 py-3 text-slate-300">{children}</td>
                      ),
                      hr: () => <hr className="my-8 border-t border-slate-700" />,
                      strong: ({ children }) => (
                        <strong className="font-bold text-slate-100">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic text-slate-200">{children}</em>
                      ),
                    }}
                  >
                    {cleanMarkdown}
                  </ReactMarkdown>
                );
              })()
            ) : (
              <div className="text-center py-12">
                <div className="inline-block rounded-lg border border-slate-700 bg-slate-900 p-8">
                  <svg
                    className="mx-auto mb-4 h-16 w-16 text-slate-500"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    ></path>
                  </svg>
                  <p className="text-lg text-slate-300">
                    No content available for this document.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
