"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Nav from "../components/Nav";

export default function ChatPage() {
  const router = useRouter();
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    // Check for token
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    // Scroll to bottom on new messages
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, router]);

  const sendMessage = async () => {
    if (!input.trim()) return;

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ message: input }),
      });

      if (!res.ok) {
        if (res.status === 401) {
          localStorage.removeItem("token");
          router.push("/login");
          return;
        }
        throw new Error("Failed to send message");
      }

      const data = await res.json();
      setMessages((msgs) => [
        ...msgs,
        { role: "user", content: input },
        { role: "bot", content: data.reply },
      ]);
      setInput("");
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-screen relative overflow-hidden bg-gradient-to-br from-slate-50 via-blue-50 to-gray-100 dark:from-slate-950 dark:via-blue-950 dark:to-gray-900">
      {/* Navbar - Increased z-index */}
      <div className="relative z-50">
        <Nav />
      </div>
      
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

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 sm:px-6 py-6 z-10 mb-[120px] pt-24">
        <div className="max-w-4xl mx-auto">
          {messages.length === 0 ? (
            <div className="flex items-center justify-center h-full">
              <div className="text-center bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-3xl shadow-2xl border-2 border-white/50 dark:border-slate-700/50 p-8 sm:p-12 relative overflow-hidden max-w-2xl">
                <div className="absolute inset-0 bg-gradient-to-br from-sky-500/5 via-blue-500/5 to-slate-500/5 dark:from-blue-500/10 dark:via-purple-500/10 dark:to-slate-500/10 pointer-events-none"></div>
                <div className="relative z-10">
                  <div className="w-24 h-24 bg-gradient-to-br from-sky-100 to-blue-100 dark:from-blue-900/50 dark:to-purple-900/50 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                    <svg className="h-12 w-12 text-blue-600 dark:text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                    </svg>
                  </div>
                  <h3 className="text-2xl sm:text-3xl font-extrabold bg-gradient-to-r from-sky-600 via-blue-600 to-slate-700 dark:from-blue-400 dark:via-purple-400 dark:to-slate-300 bg-clip-text text-transparent mb-4">
                    Start Your Conversation
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 text-lg mb-2">
                    Chat with SpecForge AI to gather requirements
                  </p>
                  <p className="text-gray-500 dark:text-gray-500">
                    Try asking about your project's functional requirements, features, or constraints
                  </p>
                </div>
              </div>
            </div>
          ) : (
            messages.map((msg, i) => (
              <div
                key={i}
                className={`mb-6 flex ${
                  msg.role === "user" ? "justify-end" : "justify-start"
                } animate-fade-in`}
              >
                <div
                  className={`rounded-2xl px-5 py-3 max-w-3xl shadow-lg ${
                    msg.role === "user"
                      ? "bg-gradient-to-r from-sky-500 to-blue-600 dark:from-blue-600 dark:to-purple-600 text-white"
                      : "bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm text-gray-800 dark:text-gray-200 border-2 border-white/50 dark:border-slate-700/50"
                  }`}
                >
                  <p className="whitespace-pre-wrap">{msg.content}</p>
                </div>
              </div>
            ))
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      {/* Input (sticky like ChatGPT) */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-gradient-to-t from-slate-50 via-blue-50/80 to-transparent dark:from-slate-950 dark:via-blue-950/80 backdrop-blur-sm pb-4 pt-6">
        <div className="max-w-4xl mx-auto px-4 sm:px-6">
          <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-lg rounded-2xl shadow-2xl border-2 border-white/50 dark:border-slate-700/50 p-3 flex items-end space-x-3">
            <textarea
              className="flex-1 rounded-xl px-4 py-3 bg-white/60 dark:bg-slate-800/60 backdrop-blur-sm text-gray-800 dark:text-gray-200 border-2 border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-sky-500 dark:focus:ring-blue-500 focus:border-sky-500 dark:focus:border-blue-500 resize-none transition-all duration-300 hover:border-gray-300 dark:hover:border-slate-600 placeholder:text-gray-400 dark:placeholder:text-gray-500"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="prompt..."
              rows={1}
              disabled={loading}
              style={{ maxHeight: "150px" }}
            />
            <button
              className="group relative px-6 py-3 overflow-hidden bg-gradient-to-r from-sky-500 to-blue-600 dark:from-blue-600 dark:to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:shadow-blue-500/50 dark:hover:shadow-purple-500/50 transform hover:scale-105 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
              onClick={sendMessage}
              disabled={loading}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-sky-600 to-blue-700 dark:from-blue-700 dark:to-purple-700 opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
              {loading ? (
                <svg
                  className="relative z-10 animate-spin h-5 w-5 text-white"
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
              ) : (
                <span className="relative z-10 flex items-center gap-2">
                  <span>Generate</span>
                  <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                  </svg>
                </span>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
