// "use client";
// import { useState, useEffect } from "react";
// import Link from "next/link";
// import { useRouter } from "next/navigation";

// export default function Navbar() {
//   const router = useRouter();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [menuOpen, setMenuOpen] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsAuthenticated(!!token);
//   }, []);

//   const handleLogout = () => {
//     localStorage.removeItem("token");
//     setIsAuthenticated(false);
//     router.push("/");
//   };

//   return (
//     <nav className="bg-gray-900 shadow-lg">
//       <div className="container mx-auto px-4">
//         <div className="flex justify-between items-center py-4">
//           <Link href="/" className="text-xl font-bold text-white">
//             Smart Elicitation Bot
//           </Link>

//           {/* Desktop menu */}
//           <div className="hidden md:flex items-center space-x-6">
//             <Link href="/" className="text-white hover:text-blue-300 transition">
//               Home
//             </Link>
//             {isAuthenticated ? (
//               <>
//                 <Link href="/chat" className="text-white hover:text-blue-300 transition">
//                   Chat Mode
//                 </Link>
//                 <Link href="/form" className="text-white hover:text-blue-300 transition">
//                   Form Mode
//                 </Link>
//                 <Link href="/profile" className="text-white hover:text-blue-300 transition">
//                   Profile
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link href="/login" className="text-white hover:text-blue-300 transition">
//                   Login
//                 </Link>
//                 <Link
//                   href="/signup"
//                   className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
//                 >
//                   Sign Up
//                 </Link>
//               </>
//             )}
//           </div>

//           {/* Mobile menu button */}
//           <div className="md:hidden">
//             <button onClick={() => setMenuOpen(!menuOpen)} className="text-white">
//               {menuOpen ? (
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
//                 </svg>
//               ) : (
//                 <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
//                   <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
//                 </svg>
//               )}
//             </button>
//           </div>
//         </div>

//         {/* Mobile menu */}
//         {menuOpen && (
//           <div className="md:hidden py-4 space-y-4">
//             <Link href="/" className="block text-white hover:text-blue-300 transition">
//               Home
//             </Link>
//             {isAuthenticated ? (
//               <>
//                 <Link href="/chat" className="block text-white hover:text-blue-300 transition">
//                   Chat Mode
//                 </Link>
//                 <Link href="/form" className="block text-white hover:text-blue-300 transition">
//                   Form Mode
//                 </Link>
//                 <Link href="/profile" className="block text-white hover:text-blue-300 transition">
//                   Profile
//                 </Link>
//                 <button
//                   onClick={handleLogout}
//                   className="block w-full text-left bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition"
//                 >
//                   Logout
//                 </button>
//               </>
//             ) : (
//               <>
//                 <Link href="/login" className="block text-white hover:text-blue-300 transition">
//                   Login
//                 </Link>
//                 <Link
//                   href="/signup"
//                   className="block bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition"
//                 >
//                   Sign Up
//                 </Link>
//               </>
//             )}
//           </div>
//         )}
//       </div>
//     </nav>
//   );
// }