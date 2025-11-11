"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import Nav from "../components/Nav";

export default function Signup() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    // confirmPassword: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    // if (formData.password !== formData.confirmPassword) {
    //   setError("Passwords do not match");
    //   setLoading(false);
    //   return;
    // }

    try {
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: formData.username,
          email: formData.email,
          password: formData.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      // Store token in local storage
      localStorage.setItem("token", data.token);
      router.push("/login");
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-gray-100 dark:from-slate-950 dark:via-blue-950 dark:to-gray-900">
      {/* Navbar */}
      <Nav />
      
      {/* Enhanced Animated Background */}
      <div className="absolute inset-0 -z-10">
        {/* Gradient Orbs */}
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

      <div className="flex flex-col items-center justify-center min-h-screen pt- pb-10 px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="max-w-md w-full">
          {/* Card with glassmorphism effect */}
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-white/50 dark:border-slate-700/50 p-8 sm:p-10 relative overflow-hidden">
            {/* Gradient overlay */}
            <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-blue-500/5 to-slate-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-slate-500/10 pointer-events-none"></div>
            
            <div className="relative z-10">
             

              {/* Header */}
              <div className="text-center mb-8 mt-1">
                <h2 className="text-3xl sm:text-4xl font-extrabold bg-gradient-to-r from-sky-600 via-blue-600 to-slate-700 dark:from-blue-400 dark:via-purple-400 dark:to-slate-300 bg-clip-text text-transparent mb-3">
                  Create Account
                </h2>
                <p className="text-white dark:text-white text-sm sm:text-base">
                  Join SpecForge and start creating amazing specs
                </p>
              </div>

              {error && (
                <div className="mb-6 p-4 bg-red-50 border-2 border-red-200 text-red-700 rounded-xl flex items-start gap-3">
                  <svg className="w-5 h-5 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                  <span>{error}</span>
                </div>
              )}

              <form className="space-y-5" onSubmit={handleSubmit}>
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-semibold text-white mb-2"
                  >
                    Username
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <input
                      id="username"
                      name="username"
                      type="text"
                      required
                      value={formData.username}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      placeholder="johndoe"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="email"
                    className="block text-sm font-semibold text-white mb-2"
                  >
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      name="email"
                      type="email"
                      required
                      value={formData.email}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      placeholder="you@example.com"
                    />
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="password"
                    className="block text-sm font-semibold text-white mb-2"
                  >
                    Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="password"
                      name="password"
                      type="password"
                      required
                      value={formData.password}
                      onChange={handleChange}
                      className="block w-full pl-12 pr-4 py-3 bg-white/80 border-2 border-gray-200 rounded-xl text-gray-900 placeholder-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-300"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    disabled={loading}
                    className="group relative w-full flex justify-center py-3.5 px-4 overflow-hidden bg-gradient-to-r from-sky-500 via-blue-600 to-blue-700 text-white text-base font-bold rounded-xl shadow-xl hover:shadow-2xl hover:shadow-blue-500/50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-[1.02] transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <div className="absolute inset-0 bg-gradient-to-r from-sky-600 via-blue-700 to-blue-800 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                    {loading ? (
                      <span className="relative flex items-center gap-2">
                        <svg
                          className="animate-spin h-5 w-5 text-white"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24"
                        >
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"
                          ></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                          ></path>
                        </svg>
                        Creating account...
                      </span>
                    ) : (
                      <span className="relative flex items-center gap-2">
                        Create Account
                        <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </span>
                    )}
                  </button>
                </div>
              </form>

              <div className="mt-8 text-center">
                <p className="text-sm text-white">
                  Already have an account?{" "}
                  <Link
                    href="/login"
                    className="font-bold text-blue-600 hover:text-blue-700 transition-colors duration-300"
                  >
                    Sign In →
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}