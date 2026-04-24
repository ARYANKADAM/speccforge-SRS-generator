"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Nav from "../components/Nav";

export default function Profile() {
  const router = useRouter();
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }
    fetchUserDocuments(token);
  }, [router]);

  const fetchUserDocuments = async (token) => {
    try {
      setLoading(true);
      const response = await fetch("/api/profile/documents", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      if (!response.ok) throw new Error("Failed to fetch documents");
      const data = await response.json();
      setDocuments(data.documents);
      setUser(data.user);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching documents:", err);
      setError(err.message);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    router.push("/login");
  };

  const formatDate = (dateString) => {
    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const handleDelete = async (docId, projectName) => {
    if (!confirm(`Are you sure you want to delete "${projectName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/profile/documents/${docId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete document");
      }

      // Remove document from UI
      setDocuments(documents.filter((doc) => doc._id !== docId));
      
      // Show success message (optional - you can add a toast notification here)
      alert("Document deleted successfully!");
    } catch (err) {
      console.error("Error deleting document:", err);
      alert("Failed to delete document: " + err.message);
    }
  };

  const handleGenerateInvite = async (docId) => {
    try {
      const token = localStorage.getItem("token");
      const response = await fetch(`/api/profile/documents/${docId}/invite`, {
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
      console.error("Error generating invite link:", err);
      alert(err.message || "Failed to generate invite link");
    }
  };

  const handleDownloadPdf = async (doc) => {
    try {
      if (doc.pdfUrl) {
        window.open(doc.pdfUrl, "_blank", "noopener,noreferrer");
        return;
      }

      const token = localStorage.getItem("token");
      const res = await fetch("/api/md-to-pdf", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          docId: doc._id,
          title: doc.projectName,
          subtitle: "Software Requirements Specification (SRS)",
          author: user?.name || "",
          date: new Date(doc.createdAt).toLocaleDateString(),
        }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Failed to generate PDF");
      }

      const blob = await res.blob();
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${(doc.projectName || "document").replace(/\s+/g, "_")}_SpecForge.pdf`;
      document.body.appendChild(a);
      a.click();
      a.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      alert("PDF generation failed: " + err.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(1200px_420px_at_15%_0%,rgba(56,189,248,0.16),transparent_62%),radial-gradient(900px_420px_at_85%_10%,rgba(99,102,241,0.16),transparent_58%),linear-gradient(135deg,#020617,#0b1731_50%,#0f172a)]">
        {/* Navbar */}
        <Nav />
        
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-sky-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        {/* Clouds */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden sm:block">
          <div className="absolute top-[10%] left-[-5%] animate-float-slow opacity-30">
            <Image src="/images/cloud.png" alt="Cloud" width={400} height={200} className="drop-shadow-lg" />
          </div>
        </div>

        <div className="flex justify-center items-center min-h-screen pt-24">
          <div className="bg-slate-900/80 backdrop-blur-lg p-12 rounded-3xl shadow-2xl border border-slate-700/70 flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 dark:border-blue-400 mb-4"></div>
            <p className="text-slate-200 font-semibold text-lg">
              Loading your profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(1200px_420px_at_15%_0%,rgba(56,189,248,0.16),transparent_62%),radial-gradient(900px_420px_at_85%_10%,rgba(99,102,241,0.16),transparent_58%),linear-gradient(135deg,#020617,#0b1731_50%,#0f172a)]">
        {/* Navbar */}
        <Nav />
        
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-sky-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 pt-32 pb-12 relative z-10">
          <div className="max-w-2xl mx-auto bg-slate-900/80 backdrop-blur-lg rounded-3xl shadow-2xl border border-slate-700/60 p-8">
            <div className="bg-red-900/30 border border-red-700/80 text-red-200 px-6 py-4 rounded-xl flex items-start gap-3">
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link href="/" className="text-cyan-300 hover:text-cyan-200 font-semibold">
                Return to Home →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-[radial-gradient(1200px_420px_at_15%_0%,rgba(56,189,248,0.16),transparent_62%),radial-gradient(900px_420px_at_85%_10%,rgba(99,102,241,0.16),transparent_58%),linear-gradient(135deg,#020617,#0b1731_50%,#0f172a)] text-slate-100">
      {/* Navbar */}
      <Nav />
      
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-sky-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-indigo-500 rounded-full mix-blend-screen filter blur-3xl opacity-15 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-blue-500 rounded-full mix-blend-screen filter blur-3xl opacity-10 animate-blob animation-delay-4000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
      </div>

      {/* 🌥️ Clouds Layer - Hidden on smaller screens */}
      <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden sm:block">
        <div className="absolute top-[10%] left-[-5%] animate-float-slow opacity-30">
          <Image src="/images/cloud.png" alt="Cloud" width={400} height={200} className="drop-shadow-lg" />
        </div>
        <div className="absolute bottom-[15%] right-[-8%] animate-float-slower opacity-25">
          <Image src="/images/cloud.png" alt="Cloud" width={500} height={250} className="drop-shadow-lg" />
        </div>
      </div>

      <div className="container mx-auto px-4 pt-28 pb-12 relative z-10">
        {/* Documents Section */}
        <div className="max-w-7xl mx-auto">
              {documents.length === 0 ? (
                <div className="text-center py-16">
                  <div className="w-32 h-32 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 border border-slate-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="h-16 w-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-cyan-300 to-indigo-300 bg-clip-text text-transparent mb-3">
                    No Documents Yet
                  </h3>
                  <p className="text-slate-300 max-w-md mx-auto mb-8">
                    You haven't created any SRS documents yet. Start by creating your first document using Form Mode!
                  </p>
                  <Link
                    href="/form"
                    className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-cyan-500 via-sky-500 to-blue-600 text-slate-950 font-bold rounded-xl shadow-xl hover:shadow-2xl hover:shadow-cyan-500/30 transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 via-sky-400 to-blue-500 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    <svg className="relative z-10 h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="relative z-10">Create Your First Document</span>
                  </Link>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b border-slate-700/80">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-cyan-300 via-sky-300 to-indigo-300 bg-clip-text text-transparent mb-2 flex items-center gap-2">
                        <svg className="h-7 w-7 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Your Documents
                      </h2>
                      <p className="text-slate-300 mt-1">
                        You have {documents.length} document{documents.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <Link
                      href="/form"
                      className="group relative mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-cyan-500 to-blue-500 text-slate-950 font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-cyan-500/30 transform hover:scale-105 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-cyan-400 to-blue-400 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                      <svg className="relative z-10 h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                      </svg>
                      <span className="relative z-10">New Document</span>
                    </Link>
                  </div>

                  {/* Document Cards Grid */}
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                    {documents.map((doc) => (
                      <div
                        key={doc._id}
                        className="group bg-slate-900/75 rounded-2xl shadow-lg border border-slate-700/80 p-6 hover:shadow-2xl hover:border-cyan-500/60 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between relative backdrop-blur"
                      >
                        {/* Delete Button - Top Right Corner */}
                        {!doc.sharedWithMe && (
                          <button
                            onClick={() => handleDelete(doc._id, doc.projectName)}
                            className="absolute top-4 right-4 p-2 bg-red-900/30 hover:bg-red-900/50 text-red-300 hover:text-red-200 rounded-lg transition-all duration-300 hover:scale-110 group/delete"
                            title="Delete document"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                          </button>
                        )}

                        <div>
                          {/* Icon */}
                          <div className="mb-4 p-4 bg-gradient-to-br from-cyan-500/20 to-indigo-500/20 inline-block rounded-xl group-hover:shadow-md transition-shadow duration-300 border border-slate-700">
                            <svg className="h-8 w-8 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          
                          {/* Project Name */}
                          <h3 className="text-lg font-bold text-slate-100 mb-3 line-clamp-2 group-hover:text-cyan-300 transition-colors duration-300">
                            {doc.projectName}
                          </h3>
                          {doc.sharedWithMe && (
                            <span className="inline-flex mb-3 rounded-full border border-violet-400/40 bg-violet-500/10 px-2.5 py-1 text-[11px] font-semibold text-violet-200">
                              Shared With You
                            </span>
                          )}
                          
                          {/* Date */}
                          <p className="text-sm text-slate-300 flex items-center gap-2 mb-4">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(doc.createdAt)}
                          </p>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex flex-col gap-3 pt-4 border-t border-slate-700">
                          {/* View Button - Full Width */}
                          <Link
                            href={`/profile/${doc._id}`}
                            className="w-full inline-flex items-center justify-center gap-2 text-cyan-200 hover:text-cyan-100 font-semibold py-2 px-3 bg-cyan-500/15 hover:bg-cyan-500/25 rounded-lg transition-colors duration-300 border border-cyan-400/30"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </Link>

                          <div className="flex items-center gap-3">
                            <Link
                              href={`/profile/${doc._id}/edit`}
                              className="flex-1 inline-flex items-center justify-center gap-2 text-sky-200 hover:text-sky-100 font-semibold py-2 px-3 bg-sky-500/15 hover:bg-sky-500/25 rounded-lg transition-colors duration-300 border border-sky-400/30"
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                              </svg>
                              Edit
                            </Link>
                            {!doc.sharedWithMe && (
                              <button
                                onClick={() => handleGenerateInvite(doc._id)}
                                className="flex-1 inline-flex items-center justify-center gap-2 text-violet-200 hover:text-violet-100 font-semibold py-2 px-3 bg-violet-500/15 hover:bg-violet-500/25 rounded-lg transition-colors duration-300 border border-violet-400/30"
                                title="Generate editable invite link"
                              >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.828 10.172a4 4 0 010 5.656l-3 3a4 4 0 01-5.656-5.656l1.5-1.5m5.656-1.156a4 4 0 010-5.656l3-3a4 4 0 115.656 5.656l-1.5 1.5" />
                                </svg>
                                Invite
                              </button>
                            )}
                          </div>
                          
                          {/* Download Buttons Row */}
                          <div className="flex items-center gap-3">
                            {/* Download Professional PDF Button - Blue */}
                            <button
                              onClick={() => handleDownloadPdf(doc)}
                              className="flex-1 inline-flex items-center justify-center gap-2 text-cyan-200 hover:text-cyan-100 font-semibold py-2 px-3 bg-cyan-500/15 hover:bg-cyan-500/25 rounded-lg transition-colors duration-300 border border-cyan-400/30"
                              title="Download professional PDF"
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                              </svg>
                              PDF
                            </button>
                            
                            {/* Download Markdown Button - Green */}
                            {doc.cloudinaryUrl ? (
                              <a
                                href={doc.cloudinaryUrl}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex-1 inline-flex items-center justify-center gap-2 text-emerald-200 hover:text-emerald-100 font-semibold py-2 px-3 bg-emerald-500/15 hover:bg-emerald-500/25 rounded-lg transition-colors duration-300 border border-emerald-400/30"
                              >
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                </svg>
                                MD
                              </a>
                            ) : (
                              <span className="flex-1 inline-flex items-center justify-center gap-2 text-slate-400 py-2 px-3 bg-slate-800/70 rounded-lg cursor-not-allowed text-sm border border-slate-700">
                                <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                                </svg>
                                No MD
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
        </div>
      </div>
    </div>
  );
}
