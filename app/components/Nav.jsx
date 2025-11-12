"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";


export default function Nav() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
    const router = useRouter();
  

  useEffect(() => {
    // Check for token in localStorage
    const token = localStorage.getItem("token");
    setIsLoggedIn(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsLoggedIn(false);
    // optional: redirect to login page
    router.push("/")
  };

  return (
    <header className="w-full flex justify-center py-3 sm:py-2">
      <nav className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg flex flex-col sm:flex-row items-center justify-between border-2 border-white/50 dark:border-slate-700/50 shadow-xl hover:shadow-2xl px-4 sm:px-8 py-3 sm:py-4 rounded-2xl w-full max-w-[340px] sm:max-w-[800px] transition-all duration-300 relative overflow-hidden">
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-r from-sky-500/5 via-blue-500/5 to-slate-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-slate-500/10 pointer-events-none"></div>
        
        {/* Logo + Mobile Menu */}
        <div className="w-full sm:w-auto flex items-center justify-between relative z-10">
          <div className="flex items-center gap-3">
            <Link href="/" className="group">
              <Image
                src="/images/lore.png"
                alt="Logo"
                width={80}
                height={48}
                className="w-[45px] h-auto sm:w-[70px] sm:h-[48px] object-contain transform group-hover:scale-110 transition-transform duration-300"
                priority
              />
            </Link>
            <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-slate-700 dark:from-blue-400 dark:via-purple-400 dark:to-slate-300 bg-clip-text text-transparent font-extrabold text-lg sm:text-xl">
              SpecForge
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden text-gray-700 dark:text-gray-300 hover:text-blue-600 dark:hover:text-blue-400 focus:outline-none transition-colors duration-300"
            onClick={() => setMenuOpen(!menuOpen)}
          >
            {menuOpen ? (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-6 w-6"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Links */}
        <div
          className={`${
            menuOpen ? "flex" : "hidden"
          } sm:flex flex-col sm:flex-row gap-4 sm:gap-6 text-gray-700 dark:text-gray-300 font-semibold w-full sm:w-auto items-center mt-4 sm:mt-0 relative z-10`}
        >
          <Link
            href="/form"
            className="hover:text-blue-600 dark:hover:text-blue-400 text-sm py-2 sm:py-0 border-b border-gray-200 dark:border-slate-700 sm:border-0 w-full sm:w-auto text-center transition-colors duration-300 relative group"
          >
            Form
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-600 to-blue-600 dark:from-blue-400 dark:to-purple-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/chat"
            className="hover:text-blue-600 dark:hover:text-blue-400 text-sm py-2 sm:py-0 border-b border-gray-200 dark:border-slate-700 sm:border-0 w-full sm:w-auto text-center transition-colors duration-300 relative group"
          >
            Chat
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-600 to-blue-600 dark:from-blue-400 dark:to-purple-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/dashboard"
            className="hover:text-blue-600 dark:hover:text-blue-400 text-sm py-2 sm:py-0 border-b border-gray-200 dark:border-slate-700 sm:border-0 w-full sm:w-auto text-center transition-colors duration-300 relative group"
          >
            Dashboard
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-600 to-blue-600 dark:from-blue-400 dark:to-purple-400 group-hover:w-full transition-all duration-300"></span>
          </Link>
          <Link
            href="/profile"
            className="hover:text-blue-600 dark:hover:text-blue-400 text-sm py-2 sm:py-0 w-full sm:w-auto text-center transition-colors duration-300 relative group"
          >
            Profile
            <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-gradient-to-r from-sky-600 to-blue-600 dark:from-blue-400 dark:to-purple-400 group-hover:w-full transition-all duration-300"></span>
          </Link>

          {/* Dynamic Login/Logout */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-sm bg-gradient-to-r from-rose-500 to-red-600 hover:from-rose-600 hover:to-red-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 w-full sm:w-auto text-center mt-2 sm:mt-0"
            >
              Logout
            </button>
          ) : (
            <Link
              href="/login"
              className="text-sm bg-gradient-to-r from-sky-600 to-blue-600 hover:from-sky-700 hover:to-blue-700 dark:from-blue-500 dark:to-purple-600 dark:hover:from-blue-600 dark:hover:to-purple-700 text-white px-4 py-2 rounded-lg shadow-md hover:shadow-lg transform hover:scale-105 transition-all duration-300 w-full sm:w-auto text-center mt-2 sm:mt-0"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
