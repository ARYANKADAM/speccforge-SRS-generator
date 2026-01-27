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
      setLoading(false);
    } catch (err) {
      console.error("Error fetching document:", err);
      setError(err.message);
      setLoading(false);
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-blue-950 to-gray-900 text-white relative overflow-hidden">
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
        <div className="flex flex-col px-6 md:px-8 max-w-4xl mx-auto items-center mb-6">
          

          <div className="w-full flex justify-between  items-center">
            <Link
              href="/profile"
              className="text-blue-600 hover:underline flex items-center"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5 mr-1"
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
              Back
            </Link>

            {document.cloudinaryUrl && (
              <a
                href={document.cloudinaryUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition shadow-md"
              >
                Download
              </a>
            )}
          </div>
        </div>

        <div className="bg-slate-900/90 dark:bg-slate-900/90 rounded-2xl shadow-2xl p-6 md:p-8 w-full max-w-4xl mx-auto border-2 border-slate-800">
          <h1 className="text-2xl md:text-3xl font-bold mb-6 text-white border-b-2 border-blue-900 pb-4">
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
                      h1: ({ children }) => (
                        <div className="relative group">
                          <h1 className="text-3xl font-bold text-white mb-6 mt-8 pb-3 border-b-2 border-blue-900">
                            {children}
                            <span className="absolute right-0 top-0">
                              <SectionComments sectionId={String(children)} documentId={document._id} user={document.user || { name: "Anonymous" }} buttonClass="ml-4 px-4 py-2 text-sm bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition font-bold" />
                            </span>
                          </h1>
                        </div>
                      ),
                      h2: ({ children }) => (
                        <div className="relative group">
                          <h2 className="text-2xl font-bold text-blue-200 mb-4 mt-6 pb-2 border-b border-blue-900">
                            {children}
                            <span className="absolute right-0 top-0">
                              <SectionComments sectionId={String(children)} documentId={document._id} user={document.user || { name: "Anonymous" }} buttonClass="ml-4 px-4 py-2 text-sm bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition font-bold" />
                            </span>
                          </h2>
                        </div>
                      ),
                      h3: ({ children }) => (
                        <div className="relative group">
                          <h3 className="text-lg font-bold text-blue-300 mb-3 mt-5">
                            {children}
                            <span className="absolute right-0 top-0">
                              <SectionComments sectionId={String(children)} documentId={document._id} user={document.user || { name: "Anonymous" }} buttonClass="ml-4 px-3 py-1 text-xs bg-blue-700 text-white rounded shadow hover:bg-blue-800 transition font-bold" />
                            </span>
                          </h3>
                        </div>
                      ),
                      h4: ({ children }) => (
                        <div>
                          <h4 className="text-lg font-semibold text-gray-700 mb-2 mt-4">
                            {children}
                          </h4>
                          <SectionComments sectionId={String(children)} documentId={document._id} user={document.user || { name: "Anonymous" }} />
                        </div>
                      ),
                      h5: ({ children }) => (
                        <div>
                          <h5 className="text-base font-semibold text-gray-700 mb-2 mt-3">
                            {children}
                          </h5>
                          <SectionComments sectionId={String(children)} documentId={document._id} user={document.user || { name: "Anonymous" }} />
                        </div>
                      ),
                      h6: ({ children }) => (
                        <div>
                          <h6 className="text-sm font-semibold text-gray-600 mb-2 mt-3">
                            {children}
                          </h6>
                          <SectionComments sectionId={String(children)} documentId={document._id} user={document.user || { name: "Anonymous" }} />
                        </div>
                      ),
                      p: ({ children }) => (
                        <p className="text-gray-700 mb-4 leading-relaxed text-base">
                          {children}
                        </p>
                      ),
                      ul: ({ children }) => (
                        <ul className="list-disc pl-6 mb-4 space-y-2 text-gray-700">
                          {children}
                        </ul>
                      ),
                      ol: ({ children }) => (
                        <ol className="list-decimal pl-6 mb-4 space-y-2 text-gray-700">
                          {children}
                        </ol>
                      ),
                      li: ({ children }) => (
                        <li className="leading-relaxed">{children}</li>
                      ),
                      blockquote: ({ children }) => (
                        <blockquote className="border-l-4 border-blue-400 bg-blue-50 pl-6 py-4 mb-4 italic text-gray-700 rounded-r-lg">
                          {children}
                        </blockquote>
                      ),
                      code: ({ inline, children }) =>
                        inline ? (
                          <code className="bg-gray-100 text-red-600 px-2 py-1 rounded text-sm font-mono">
                            {children}
                          </code>
                        ) : (
                          <code className="block bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-4 font-mono text-sm leading-relaxed">
                            {children}
                          </code>
                        ),
                      pre: ({ children }) => (
                        <pre className="bg-gray-900 text-green-400 p-4 rounded-lg overflow-x-auto mb-4 shadow-lg">
                          {children}
                        </pre>
                      ),
                      a: ({ href, children }) => (
                        <a
                          href={href}
                          className="text-blue-600 hover:text-blue-800 underline hover:no-underline transition-colors"
                          target="_blank"
                          rel="noopener noreferrer"
                        >
                          {children}
                        </a>
                      ),
                      table: ({ children }) => (
                        <div className="overflow-x-auto mb-4">
                          <table className="min-w-full bg-white border border-gray-300 rounded-lg shadow-sm">
                            {children}
                          </table>
                        </div>
                      ),
                      thead: ({ children }) => (
                        <thead className="bg-blue-50 border-b border-gray-300">
                          {children}
                        </thead>
                      ),
                      tbody: ({ children }) => (
                        <tbody className="divide-y divide-gray-200">
                          {children}
                        </tbody>
                      ),
                      th: ({ children }) => (
                        <th className="px-4 py-3 text-left font-semibold text-gray-800 border-b border-gray-300">
                          {children}
                        </th>
                      ),
                      td: ({ children }) => (
                        <td className="px-4 py-3 text-gray-700">{children}</td>
                      ),
                      hr: () => <hr className="my-8 border-t-2 border-gray-200" />,
                      strong: ({ children }) => (
                        <strong className="font-bold text-gray-900">
                          {children}
                        </strong>
                      ),
                      em: ({ children }) => (
                        <em className="italic text-gray-800">{children}</em>
                      ),
                    }}
                  >
                    {cleanMarkdown}
                  </ReactMarkdown>
                );
              })()
            ) : (
              <div className="text-center py-12">
                <div className="bg-gray-100 rounded-lg p-8 inline-block">
                  <svg
                    className="w-16 h-16 text-gray-400 mx-auto mb-4"
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
                  <p className="text-gray-500 text-lg">
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
