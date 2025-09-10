// // "use client";

// // import { useState, useRef, useEffect } from "react";
// // import jsPDF from "jspdf";
// // import ReactMarkdown from "react-markdown";

// // export default function Home() {
// //   const [messages, setMessages] = useState([
// //     {
// //       sender: "bot",
// //       text: "Hi! I am your Requirements Elicitation Bot powered by Mistral. How can I assist you today?",
// //     },
// //   ]);
// //   const [input, setInput] = useState("");
// //   const [isLoading, setIsLoading] = useState(false);
// //   const bottomRef = useRef(null);
// //   const hiddenRef = useRef(null);
// //   const [markdownToRender, setMarkdownToRender] = useState("");

// //   const sendMessage = async () => {
// //     if (!input.trim() || isLoading) return;

// //     const userMessage = input.trim();
// //     setMessages((prev) => [...prev, { sender: "user", text: userMessage }]);
// //     setInput("");
// //     setIsLoading(true);

// //     try {
// //       const res = await fetch("/api/chat", {
// //         method: "POST",
// //         headers: { "Content-Type": "application/json" },
// //         body: JSON.stringify({ message: userMessage }),
// //       });

// //       if (!res.ok) throw new Error("Failed to get response");

// //       const data = await res.json();
// //       setMessages((prev) => [...prev, { sender: "bot", text: data.reply }]);
// //     } catch (err) {
// //       setMessages((prev) => [
// //         ...prev,
// //         {
// //           sender: "bot",
// //           text: "Error: Please make sure Ollama is running with the gemma model.",
// //         },
// //       ]);
// //     } finally {
// //       setIsLoading(false);
// //     }
// //   };

// //   const downloadPDF = () => {
// //     const botMessages = messages.filter((msg) => msg.sender === "bot");
// //     if (botMessages.length === 0) return;

// //     const markdown = botMessages[botMessages.length - 1].text;
// //     setMarkdownToRender(markdown);

// //     // Wait for ReactMarkdown to render into hiddenRef
// //     setTimeout(() => {
// //       if (!hiddenRef.current) return;
// //       const pdf = new jsPDF("p", "mm", "a4");

// //       pdf
// //         .html(hiddenRef.current, {
// //           callback: () => pdf.save("SRS_Document.pdf"),
// //           margin: [10, 10, 10, 10],
// //           autoPaging: "text",
// //           x: 10,
// //           y: 10,
// //         })
// //         .catch((err) => console.error("PDF generation error:", err));
// //     }, 300); // increased timeout for safer render
// //   };

// //   useEffect(() => {
// //     setTimeout(() => {
// //       bottomRef.current?.scrollIntoView({ behavior: "smooth" });
// //     }, 100);
// //   }, [messages]);

// //   return (
// //     <>
// //       <main
// //         style={{
// //           maxWidth: 720,
// //           margin: "2rem auto",
// //           fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
// //           background: "#f9fafb",
// //           padding: "2.5rem",
// //           borderRadius: "20px",
// //           boxShadow: "0 8px 24px rgba(0,0,0,0.12)",
// //           display: "flex",
// //           flexDirection: "column",
// //           height: "90vh",
// //         }}
// //       >
// //         <h1
// //           style={{
// //             textAlign: "center",
// //             marginBottom: "2rem",
// //             color: "#222",
// //             fontWeight: "700",
// //             fontSize: "2rem",
// //             letterSpacing: "0.05em",
// //             userSelect: "none",
// //           }}
// //         >
// //           🤖 Requirements Elicitation Bot
// //         </h1>

// //         <div
// //           style={{
// //             flex: "1 1 auto",
// //             background: "#fff",
// //             borderRadius: "16px",
// //             boxShadow: "inset 0 4px 15px rgba(0,0,0,0.05)",
// //             padding: "1.5rem",
// //             overflowY: "auto",
// //             marginBottom: "1.5rem",
// //             display: "flex",
// //             flexDirection: "column",
// //           }}
// //         >
// //           {messages.map((msg, idx) => (
// //             <div
// //               key={idx}
// //               style={{
// //                 alignSelf: msg.sender === "user" ? "flex-end" : "flex-start",
// //                 maxWidth: "75%",
// //                 marginBottom: "1rem",
// //                 display: "flex",
// //               }}
// //             >
// //               <div
// //                 style={{
// //                   background:
// //                     msg.sender === "user"
// //                       ? "linear-gradient(135deg, #4f93f9, #1a73e8)"
// //                       : "#e2e8f0",
// //                   color: msg.sender === "user" ? "#fff" : "#1a202c",
// //                   padding: "1rem 1.5rem",
// //                   borderRadius:
// //                     msg.sender === "user"
// //                       ? "20px 20px 5px 20px"
// //                       : "20px 20px 20px 5px",
// //                   boxShadow: "0 4px 8px rgba(0,0,0,0.08)",
// //                   fontSize: "1.05rem",
// //                   lineHeight: "1.6",
// //                   whiteSpace: "pre-wrap",
// //                   wordBreak: "break-word",
// //                   maxHeight: msg.sender === "bot" ? "300px" : "none",
// //                   overflowY: msg.sender === "bot" ? "auto" : "visible",
// //                 }}
// //               >
// //                 {msg.text}
// //               </div>
// //             </div>
// //           ))}

// //           {isLoading && (
// //             <div
// //               style={{
// //                 alignSelf: "flex-start",
// //                 maxWidth: "75%",
// //                 marginBottom: "1rem",
// //                 fontStyle: "italic",
// //                 color: "#718096",
// //               }}
// //             >
// //               Thinking...
// //             </div>
// //           )}

// //           <div ref={bottomRef} />
// //         </div>

// //         <form
// //           onSubmit={(e) => {
// //             e.preventDefault();
// //             sendMessage();
// //           }}
// //           style={{ display: "flex", gap: "0.8rem" }}
// //         >
// //           <input
// //             type="text"
// //             value={input}
// //             onChange={(e) => setInput(e.target.value)}
// //             placeholder="Type your message..."
// //             disabled={isLoading}
// //             style={{
// //               flexGrow: 1,
// //               padding: "1rem 1.2rem",
// //               fontSize: "1.1rem",
// //               borderRadius: "14px",
// //               border: "1.8px solid #cbd5e1",
// //               outline: "none",
// //               color: "black",
// //               transition: "border-color 0.3s ease",
// //               boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
// //             }}
// //             onFocus={(e) => (e.target.style.borderColor = "#4f93f9")}
// //             onBlur={(e) => (e.target.style.borderColor = "#cbd5e1")}
// //           />
// //           <button
// //             type="submit"
// //             disabled={isLoading}
// //             style={{
// //               padding: "0 2rem",
// //               background: isLoading
// //                 ? "#a0aec0"
// //                 : "linear-gradient(135deg, #4f93f9, #1a73e8)",
// //               border: "none",
// //               borderRadius: "14px",
// //               color: "#fff",
// //               fontSize: "1.1rem",
// //               fontWeight: "600",
// //               cursor: isLoading ? "not-allowed" : "pointer",
// //               boxShadow: "0 5px 14px rgba(31, 124, 253, 0.5)",
// //               transition: "background 0.3s ease",
// //               userSelect: "none",
// //             }}
// //             onMouseEnter={(e) => {
// //               if (!isLoading) e.currentTarget.style.background = "#1a73e8";
// //             }}
// //             onMouseLeave={(e) => {
// //               if (!isLoading)
// //                 e.currentTarget.style.background =
// //                   "linear-gradient(135deg, #4f93f9, #1a73e8)";
// //             }}
// //           >
// //             {isLoading ? "Sending..." : "Send"}
// //           </button>
// //         </form>

// //         <button
// //           onClick={downloadPDF}
// //           style={{
// //             marginTop: "1.6rem",
// //             padding: "1rem",
// //             width: "100%",
// //             fontSize: "1.15rem",
// //             fontWeight: "700",
// //             borderRadius: "14px",
// //             background: "linear-gradient(135deg, #22c55e, #16a34a)",
// //             border: "none",
// //             color: "white",
// //             cursor: "pointer",
// //             boxShadow: "0 6px 18px rgba(16, 185, 129, 0.5)",
// //             transition: "background 0.3s ease",
// //             userSelect: "none",
// //           }}
// //           onMouseEnter={(e) => {
// //             e.currentTarget.style.background = "#16a34a";
// //           }}
// //           onMouseLeave={(e) => {
// //             e.currentTarget.style.background =
// //               "linear-gradient(135deg, #22c55e, #16a34a)";
// //           }}
// //         >
// //           📄 Download SRS PDF
// //         </button>
// //       </main>

// //       {/* Hidden container to render markdown as React elements for PDF generation */}
// //       <div
// //         ref={hiddenRef}
// //         style={{
// //           position: "absolute",
// //           top: 0,
// //           left: 0,
// //           width: "600px",
// //           opacity: 0,
// //           pointerEvents: "none",
// //           zIndex: -1,
// //           backgroundColor: "white",
// //           padding: "1rem",
// //           color: "black",
// //           fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
// //           fontSize: "14px",
// //           lineHeight: "1.5",
// //           overflowWrap: "break-word",
// //         }}
// //         aria-hidden="true"
// //       >
// //         <ReactMarkdown>{markdownToRender}</ReactMarkdown>
// //       </div>
// //     </>
// //   );
// // }
// // export default function Home() {
// //   return (
// //     <>
// //       <h1>Welcome to Smart Eli Bot</h1>
// //       <p>Your AI-powered assistant for software requirements gathering.</p>
// //     </>
// //   );
// // }
// "use client";
// import { useEffect, useState } from "react";
// import { useRouter } from "next/navigation";
// import Link from "next/link";

// export default function Home() {
//   const router = useRouter();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     const token = localStorage.getItem("token");
//     setIsAuthenticated(!!token);
//   }, []);

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-blue-900 to-gray-900 text-white">
//       <div className="container mx-auto px-4 py-12">
//         <div className="text-center mb-20">
//           <h1 className="text-4xl md:text-6xl font-bold mb-6">Smart Elicitation Bot</h1>
//           <p className="text-xl md:text-2xl text-blue-200 max-w-3xl mx-auto">
//             Streamline your software requirements gathering with AI-powered conversations and structured documentation.
//           </p>
          
//           <div className="mt-12 space-x-4">
//             {isAuthenticated ? (
//               <>
//                 <Link href="/chat" className="px-8 py-3 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 transition">
//                   Chat Mode
//                 </Link>
//                 <Link href="/form" className="px-8 py-3 bg-green-600 text-white rounded-md font-bold hover:bg-green-700 transition">
//                   Form Mode
//                 </Link>
//               </>
//             ) : (
//               <>
//                 <Link href="/login" className="px-8 py-3 bg-blue-600 text-white rounded-md font-bold hover:bg-blue-700 transition">
//                   Login
//                 </Link>
//                 <Link href="/signup" className="px-8 py-3 border border-white text-white rounded-md font-bold hover:bg-white hover:text-blue-900 transition">
//                   Sign Up
//                 </Link>
//               </>
//             )}
//           </div>
//         </div>

//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-16">
//           <div className="bg-gray-800 p-6 rounded-lg">
//             <div className="text-blue-400 text-3xl mb-4">💬</div>
//             <h3 className="text-xl font-bold mb-2">Chat-based Elicitation</h3>
//             <p className="text-gray-300">
//               Engage in natural conversations with our AI to extract and refine software requirements.
//             </p>
//           </div>
          
//           <div className="bg-gray-800 p-6 rounded-lg">
//             <div className="text-blue-400 text-3xl mb-4">📝</div>
//             <h3 className="text-xl font-bold mb-2">Structured Form Input</h3>
//             <p className="text-gray-300">
//               Use our comprehensive forms to capture detailed requirements in a structured format.
//             </p>
//           </div>
          
//           <div className="bg-gray-800 p-6 rounded-lg">
//             <div className="text-blue-400 text-3xl mb-4">📄</div>
//             <h3 className="text-xl font-bold mb-2">SRS Document Generation</h3>
//             <p className="text-gray-300">
//               Automatically generate professional SRS documents based on your inputs.
//             </p>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useState } from "react";

export default function HomePage() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);
  }, []);

  return (
    <main className="bg-gray-50 relative min-h-screen flex flex-col items-center justify-start text-center overflow-hidden bg-cover bg-center bg-no-repeat bg-[url('/images/rays.png')]">
      {/* Background Rays */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.9),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.9),transparent_70%)]"></div>
      </div>

      {/* 🌥️ Clouds Layer - Hidden on smaller screens */}
      <div className="absolute inset-0 z-0 hidden sm:block">
        <Image
          src="/images/cloud.png"
          alt="Cloud Center"
          width={500}
          height={600}
          className="absolute top-[4%] left-1/2 -translate-x-1/2 opacity-30"
          priority
        />
        <Image
          src="/images/cloud.png"
          alt="Cloud Left"
          width={500}
          height={300}
          className="absolute top-[8%] left-[-10%] opacity-30"
        />
        <Image
          src="/images/cloud.png"
          alt="Cloud Right"
          width={500}
          height={300}
          className="absolute top-[8%] right-[-10%] opacity-30"
        />
      </div>

      {/* Hero Section */}
      <section className="relative z-10 w-full flex flex-col items-center px-4 mt-10 md:mt-20">
        <div className="absolute inset-0 z-0 hidden sm:block">
          <Image
            src="/images/cloud.png"
            alt="Cloud Left"
            width={500}
            height={300}
            className="absolute top-1/3 -translate-y-1/2 left-[-10%] opacity-30"
          />
          <Image
            src="/images/cloud.png"
            alt="Cloud Right"
            width={500}
            height={300}
            className="absolute top-1/3 -translate-y-1/2 right-[-10%] opacity-30"
          />
        </div>

        {/* Floating Logo */}
        <div className="relative z-10 flex items-center justify-center mb-1">
          <Image
            src="/images/Logo2.png"
            alt="Logo"
            width={100}
            height={72}
            className="object-contain w-[80px] md:w-[120px]"
            priority
          />
        </div>

        {/* Heading */}
        <h1 className="relative z-10 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-md text-gray-900 max-w-4xl leading-tight px-4">
          SpecForge - Smart Requirements Elicitation Chatbot using NLP
        </h1>

        {/* Subtitle */}
        <p className="relative z-10 mt-4 text-gray-600 text-xs sm:text-sm md:text-base px-4 max-w-xl">
          Your journey to AI-powered SRS generator starts here
        </p>

        {/* CTA Buttons (Auth Logic Added) */}
        <div className="relative z-10 mt-6 justify-center flex flex-col sm:flex-row gap-4 w-full max-w-xs sm:max-w-none px-4">
          {isAuthenticated ? (
            <>
              <Link
                href="/chat"
                className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white text-sm md:text-base rounded-lg shadow-md flex items-center justify-center gap-2 transition"
              >
                Chat Mode
              </Link>
              <Link
                href="/form"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base rounded-lg shadow-md flex items-center justify-center gap-2 transition"
              >
                Form Mode
              </Link>
            </>
          ) : (
            <>
              <Link
                href="/login"
                className="px-6 py-3 bg-gray-900 hover:bg-gray-800 text-white text-sm md:text-base rounded-lg shadow-md transition"
              >
                Login
              </Link>
              <Link
                href="/signup"
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white text-sm md:text-base rounded-lg shadow-md flex items-center justify-center gap-2 transition"
              >
                Sign Up
              </Link>
            </>
          )}
        </div>

        {/* Footer Note */}
        <p className="relative z-10 mt-10  text-gray-900 text-xs md:text-sm px-4">
          Adopted by projects aiming for clarity, efficiency, and accuracy
        </p>
      </section>

      {/* (Rest of your Info, Insights, and Footer sections remain unchanged) */}
    </main>
  );
}
