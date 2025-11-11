"use client";
import { useTheme } from "../context/ThemeContext";

export default function ThemeToggle() {
  const { theme, toggleTheme, mounted } = useTheme();

  // Don't render anything on the server or before mounting to prevent hydration mismatch
  if (!mounted) {
    return (
      <div className="w-12 h-12 rounded-xl bg-transparent border-2 border-transparent"></div>
    );
  }

  return (
    <button
      onClick={toggleTheme}
      className="group relative p-2.5 rounded-xl bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm border-2 border-gray-200 dark:border-slate-700 hover:border-gray-300 dark:hover:border-slate-600 transition-all duration-300 shadow-lg hover:shadow-xl"
      aria-label="Toggle theme"
    >
      <div className="relative w-6 h-6">
        {/* Sun Icon */}
        <svg
          className={`absolute inset-0 w-6 h-6 text-yellow-500 transition-all duration-300 ${
            theme === "light" ? "opacity-100 rotate-0 scale-100" : "opacity-0 rotate-90 scale-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        
        {/* Moon Icon */}
        <svg
          className={`absolute inset-0 w-6 h-6 text-blue-400 transition-all duration-300 ${
            theme === "dark" ? "opacity-100 rotate-0 scale-100" : "opacity-0 -rotate-90 scale-0"
          }`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </div>
    </button>
  );
}
