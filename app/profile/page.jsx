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

  if (loading) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-gray-100 dark:from-slate-950 dark:via-blue-950 dark:to-gray-900">
        {/* Navbar */}
        <Nav />
        
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-sky-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-blue-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>
          <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-slate-300 dark:bg-slate-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000"></div>
        </div>

        {/* Clouds */}
        <div className="absolute inset-0 z-0 pointer-events-none overflow-hidden hidden sm:block">
          <div className="absolute top-[10%] left-[-5%] animate-float-slow opacity-30">
            <Image src="/images/cloud.png" alt="Cloud" width={400} height={200} className="drop-shadow-lg" />
          </div>
        </div>

        <div className="flex justify-center items-center min-h-screen pt-24">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg p-12 rounded-3xl shadow-2xl border-2 border-white/50 dark:border-slate-700/50 flex flex-col items-center">
            <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-blue-600 dark:border-blue-400 mb-4"></div>
            <p className="text-gray-700 dark:text-gray-300 font-semibold text-lg">
              Loading your profile...
            </p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-gray-100 dark:from-slate-950 dark:via-blue-950 dark:to-gray-900">
        {/* Navbar */}
        <Nav />
        
        {/* Enhanced Animated Background */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-20 left-10 w-96 h-96 bg-sky-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob"></div>
          <div className="absolute top-40 right-10 w-96 h-96 bg-blue-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>
        </div>

        <div className="container mx-auto px-4 pt-32 pb-12 relative z-10">
          <div className="max-w-2xl mx-auto bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-white/50 dark:border-slate-700/50 p-8">
            <div className="bg-red-50 dark:bg-red-900/30 border-2 border-red-300 dark:border-red-800 text-red-700 dark:text-red-400 px-6 py-4 rounded-xl flex items-start gap-3">
              <svg className="w-6 h-6 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div>
                <strong className="font-bold">Error: </strong>
                <span className="block sm:inline">{error}</span>
              </div>
            </div>
            <div className="mt-6 text-center">
              <Link href="/" className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold">
                Return to Home →
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-gray-100 dark:from-slate-950 dark:via-blue-950 dark:to-gray-900">
      {/* Navbar */}
      <Nav />
      
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-20 left-10 w-96 h-96 bg-sky-300 dark:bg-blue-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob"></div>
        <div className="absolute top-40 right-10 w-96 h-96 bg-blue-300 dark:bg-purple-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 w-96 h-96 bg-slate-300 dark:bg-slate-600 rounded-full mix-blend-multiply dark:mix-blend-screen filter blur-3xl opacity-20 dark:opacity-10 animate-blob animation-delay-4000"></div>
        
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
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
                  <div className="w-32 h-32 bg-gradient-to-br from-sky-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="h-16 w-16 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl font-bold bg-gradient-to-r from-sky-600 to-blue-600 dark:from-blue-400 dark:to-purple-400 bg-clip-text text-transparent mb-3">
                    No Documents Yet
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto mb-8">
                    You haven't created any SRS documents yet. Start by creating your first document using Form Mode!
                  </p>
                  <Link
                    href="/form"
                    className="group relative inline-flex items-center px-8 py-4 bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 dark:from-blue-600 dark:via-purple-600 dark:to-purple-700 text-white font-bold rounded-xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 dark:hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-600 via-blue-700 to-blue-800 dark:from-blue-700 dark:via-purple-700 dark:to-purple-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
                    <svg className="relative z-10 h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                    </svg>
                    <span className="relative z-10">Create Your First Document</span>
                  </Link>
                </div>
              ) : (
                <>
                  {/* Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 pb-6 border-b-2 border-gray-100 dark:border-slate-700">
                    <div>
                      <h2 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-sky-600 via-blue-600 to-slate-700 dark:from-blue-400 dark:via-purple-400 dark:to-slate-300 bg-clip-text text-transparent mb-2 flex items-center gap-2">
                        <svg className="h-7 w-7 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                        </svg>
                        Your Documents
                      </h2>
                      <p className="text-gray-600 dark:text-gray-400 mt-1">
                        You have {documents.length} document{documents.length !== 1 ? "s" : ""}
                      </p>
                    </div>
                    <Link
                      href="/form"
                      className="group relative mt-4 sm:mt-0 inline-flex items-center px-6 py-3 bg-gradient-to-r from-sky-500 to-blue-600 dark:from-blue-600 dark:to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/50 dark:hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300"
                    >
                      <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-700 dark:from-blue-700 dark:to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-xl"></div>
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
                        className="group bg-white dark:bg-slate-800/80 rounded-2xl shadow-lg border-2 border-gray-100 dark:border-slate-700 p-6 hover:shadow-2xl hover:border-blue-200 dark:hover:border-purple-600 transition-all duration-300 transform hover:-translate-y-1 flex flex-col justify-between"
                      >
                        <div>
                          {/* Icon */}
                          <div className="mb-4 p-4 bg-gradient-to-br from-sky-50 to-blue-50 dark:from-blue-900/30 dark:to-purple-900/30 inline-block rounded-xl group-hover:shadow-md transition-shadow duration-300">
                            <svg className="h-8 w-8 text-blue-500 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                          </div>
                          
                          {/* Project Name */}
                          <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200 mb-3 line-clamp-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors duration-300">
                            {doc.projectName}
                          </h3>
                          
                          {/* Date */}
                          <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-2 mb-4">
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            {formatDate(doc.createdAt)}
                          </p>
                        </div>
                        
                        {/* Action Buttons */}
                        <div className="flex items-center justify-between gap-3 pt-4 border-t border-gray-100 dark:border-slate-700">
                          <Link
                            href={`/profile/${doc._id}`}
                            className="flex-1 inline-flex items-center justify-center gap-2 text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 font-semibold py-2 px-3 bg-blue-50 dark:bg-blue-900/30 hover:bg-blue-100 dark:hover:bg-blue-900/50 rounded-lg transition-colors duration-300"
                          >
                            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                            View
                          </Link>
                          {doc.cloudinaryUrl ? (
                            <a
                              href={doc.cloudinaryUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="flex-1 inline-flex items-center justify-center gap-2 text-emerald-600 dark:text-emerald-400 hover:text-emerald-700 dark:hover:text-emerald-300 font-semibold py-2 px-3 bg-emerald-50 dark:bg-emerald-900/30 hover:bg-emerald-100 dark:hover:bg-emerald-900/50 rounded-lg transition-colors duration-300"
                            >
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                              </svg>
                              Download
                            </a>
                          ) : (
                            <span className="flex-1 inline-flex items-center justify-center gap-2 text-gray-400 dark:text-gray-500 py-2 px-3 bg-gray-50 dark:bg-slate-800/50 rounded-lg cursor-not-allowed">
                              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
                              </svg>
                              N/A
                            </span>
                          )}
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
