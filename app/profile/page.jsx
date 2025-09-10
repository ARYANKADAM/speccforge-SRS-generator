"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

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
      <div className="min-h-screen bg-gray-50 relative overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/images/rays.png')]">
        {/* Background Rays */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.9),transparent_70%)]"></div>
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.9),transparent_70%)]"></div>
        </div>

        {/* Clouds */}
        <div className="absolute inset-0 z-0 hidden sm:block">
          <Image
            src="/images/cloud.png"
            alt="Cloud"
            width={500}
            height={300}
            className="absolute top-[8%] left-[-10%] opacity-30"
          />
        </div>

        <div className="flex justify-center items-center h-screen">
          <div className="p-8 rounded-xl shadow-xl flex flex-col items-center">
            {/* <Image
              src="/images/Logo2.png"
              alt="Logo"
              width={80}
              height={60}
              className="object-contain mb-6"
              priority
            /> */}
            <div className="animate-spin rounded-full h-14 w-14 border-t-4 border-blue-600 border-b-4"></div>
            <p className="mt-4 text-gray-600 font-medium">
              Loading your profile...
            </p>
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

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto bg-white rounded-xl shadow-xl p-8 mt-16">
            <div className="bg-red-100 border border-red-400 text-red-700 px-6 py-4 rounded-lg">
              <strong className="font-bold">Error: </strong>
              <span className="block sm:inline">{error}</span>
            </div>
            <div className="mt-6 text-center">
              <Link href="/" className="text-blue-600 hover:underline">
                Return to Home
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gray-50 min-h-screen  relative overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/images/rays.png')]">
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

      {/* Top Navbar */}
      {/* <div className="flex justify-between items-center px-6 py-4 bg-white/80 backdrop-blur-md shadow-lg sticky top-0 z-20">
        <div className="flex items-center space-x-3">
          <Image
            src="/images/Logo2.png"
            alt="Logo"
            width={40}
            height={30}
            className="object-contain"
          />
          <h1 className="text-2xl font-bold text-gray-800">Your Profile</h1>
        </div>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition flex items-center gap-2"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
            <path fillRule="evenodd" d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7z" clipRule="evenodd" />
            <path d="M4 8a1 1 0 011-1h5a1 1 0 110 2H5a1 1 0 01-1-1z" />
          </svg>
          Logout
        </button>
      </div> */}

      <div className="container mx-auto px-4 py-10 relative z-10">
        {user && (
          <div className=" rounded-xl p-8 mb-10   transform transition ">
            <div className="flex gap-5 flex-col md:flex-row md:items-center md:justify-between">
              <div>
                <h2 className="text-2xl font-bold mb-4 text-gray-800 flex items-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-6 w-6 mr-2 text-blue-500"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                    />
                  </svg>
                  Account Information
                </h2>
                <div className="space-y-2">
                  <p className="text-gray-700 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-medium mr-2">Email:</span>{" "}
                    {user.email}
                  </p>
                  <p className="text-gray-700 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2 text-gray-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span className="font-medium mr-2">Since:</span>{" "}
                    {formatDate(user.createdAt)}
                  </p>
                </div>
              </div>
              {/* <div className="mt-6 md:mt-0">
                <div className="w-24 h-24 hover:shadow-2xl bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-4xl font-bold border-4 border-blue-200">
                  {user.email.charAt(0).toUpperCase()}
                </div>
              </div> */}
              <button
                onClick={handleLogout}
                className="bg-red-500 text-white px-4 py-2 rounded-lg shadow-md hover:bg-red-600 transition flex items-center"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M3 3a1 1 0 00-1 1v12a1 1 0 001 1h12a1 1 0 001-1V4a1 1 0 00-1-1H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7z"
                    clipRule="evenodd"
                  />
                  <path d="M4 8a1 1 0 011-1h5a1 1 0 110 2H5a1 1 0 01-1-1z" />
                </svg>
                Logout
              </button>
            </div>
          </div>
        )}

        <div className=" rounded-xl  p-8 ">
          {documents.length === 0 ? (
            <div className="text-center py-12 text-gray-600">
              <div className="w-40 h-40 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-20 w-20 text-blue-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-800 mb-2">
                No Documents Found
              </h3>
              <p className="text-gray-600 max-w-md mx-auto mb-8">
                You haven't created any SRS documents yet. Start by creating
                your first document using Form Mode!
              </p>
              <Link
                href="/form"
                className="inline-flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg shadow-lg hover:bg-blue-700 transition transform hover:-translate-y-1"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 mr-2"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4v16m8-8H4"
                  />
                </svg>
                Create Your First Document
              </Link>
            </div>
          ) : (
            <>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-8 border-b border-gray-100 pb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-6 w-6 mr-2 text-blue-500"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                      />
                    </svg>
                    Your Documents
                  </h2>
                  <p className="text-gray-500 mt-1">
                    You have {documents.length} document
                    {documents.length !== 1 ? "s" : ""}
                  </p>
                </div>
                <Link
                  href="/form"
                  className="mt-4 sm:mt-0 inline-flex items-center px-5 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shadow-md"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4v16m8-8H4"
                    />
                  </svg>
                  New Document
                </Link>
              </div>

              {/* Card Layout for Documents */}
              <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
                {documents.map((doc) => (
                  <div
                    key={doc._id}
                    className="bg-white rounded-xl shadow-md p-6 border border-gray-100 hover:shadow-xl transition transform hover:-translate-y-1 flex flex-col justify-between"
                  >
                    <div>
                      <div className="mb-4 p-3 bg-blue-50 inline-block rounded-lg">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-6 w-6 text-blue-500"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                          />
                        </svg>
                      </div>
                      <h3 className="text-lg font-bold text-gray-800 mb-2">
                        {doc.projectName}
                      </h3>
                      <p className="text-sm text-gray-500 flex items-center">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-1"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                          />
                        </svg>
                        {formatDate(doc.createdAt)}
                      </p>
                    </div>
                    <div className="mt-6 flex items-center justify-between">
                      <Link
                        href={`/profile/${doc._id}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium"
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
                            d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                          />
                        </svg>
                        View
                      </Link>
                      {doc.cloudinaryUrl ? (
                        <a
                          href={doc.cloudinaryUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center text-green-600 hover:text-green-800 font-medium"
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
                              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                            />
                          </svg>
                          Download
                        </a>
                      ) : (
                        <span className="inline-flex items-center text-gray-400">
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
                              d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636"
                            />
                          </svg>
                          No Download
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
