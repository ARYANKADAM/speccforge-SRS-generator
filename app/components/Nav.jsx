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
    <header className="sticky top-0 z-50  w-full flex justify-center py-3 sm:py-6">
      <nav className="bg-gray-50 flex flex-col sm:flex-row items-center justify-between border px-4 sm:px-8 py-3 sm:py-4 rounded-xl w-full max-w-[340px] sm:max-w-[800px]">
        {/* Logo + Mobile Menu */}
        <div className="w-full sm:w-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Link href="/">
              <Image
                src="/images/lore.png"
                alt="Logo"
                width={80}
                height={48}
                className="w-[45px] h-auto sm:w-[70px] sm:h-[48px] object-contain"
                priority
              />
            </Link>
          </div>
          <div className="text-black font-bold text-lg sm:text-xl">
            SpecForge
          </div>

          {/* Mobile Menu Button */}
          <button
            className="sm:hidden text-gray-700 focus:outline-none"
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
          } sm:flex flex-col sm:flex-row gap-4 sm:gap-8 text-gray-700 font-medium w-full sm:w-auto items-center mt-4 sm:mt-0`}
        >
          <Link
            href="/form"
            className="hover:text-black text-sm py-2 sm:py-0 border-b border-gray-200 sm:border-0 w-full sm:w-auto text-center"
          >
            Form
          </Link>
          <Link
            href="/chat"
            className="hover:text-black text-sm py-2 sm:py-0 border-b border-gray-200 sm:border-0 w-full sm:w-auto text-center"
          >
            Chat
          </Link>
          <Link
            href="/profile"
            className="hover:text-black text-sm py-2 sm:py-0 w-full sm:w-auto text-center"
          >
            Profile
          </Link>

          {/* Dynamic Login/Logout */}
          {isLoggedIn ? (
            <button
              onClick={handleLogout}
              className="text-sm bg-red-600 hover:bg-red-500 text-white px-4 py-2 rounded-lg transition duration-300 w-full sm:w-auto text-center mt-2 sm:mt-0"
            >
              Logout
            </button>
          ) : (
            <Link
              onClick={handleLogout}
              href="/login"
              className="text-sm bg-gray-900 hover:bg-gray-800 text-white px-4 py-2 rounded-lg transition duration-300 w-full sm:w-auto text-center mt-2 sm:mt-0"
            >
              Login
            </Link>
          )}
        </div>
      </nav>
    </header>
  );
}
