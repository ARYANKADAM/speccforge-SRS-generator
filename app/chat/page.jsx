"use client";
import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

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
    <div className="flex flex-col h-screen bg-gray-50 relative overflow-x-hidden">
      {/* Background Rays */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_left,rgba(255,255,255,0.9),transparent_70%)]"></div>
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(255,255,255,0.9),transparent_70%)]"></div>
      </div>

      {/* 🌥️ Clouds */}
      <div className="absolute inset-0 z-0 hidden sm:block">
        <Image
          src="/images/cloud.png"
          alt="Cloud Top Left"
          width={500}
          height={300}
          className="absolute top-[5%] left-[-10%] opacity-30"
        />
        <Image
          src="/images/cloud.png"
          alt="Cloud Bottom Right"
          width={700}
          height={300}
          className="absolute bottom-[5%] right-[-20%] opacity-25"
        />
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-6 py-6 z-10 mb-[100px]">
        {messages.length === 0 ? (
          <div className="flex items-center justify-center h-full">
            <div className="text-center text-gray-600 bg-white p-8 rounded-xl shadow-lg">
              <div className="text-5xl mb-4">💬</div>
              <p className="text-xl">
                Start a conversation to gather requirements
              </p>
              <p className="mt-2">
                Try asking about your project's functional requirements
              </p>
            </div>
          </div>
        ) : (
          messages.map((msg, i) => (
            <div
              key={i}
              className={`mb-4 flex ${
                msg.role === "user" ? "justify-end" : "justify-start"
              }`}
            >
              <div
                className={`rounded-lg px-4 py-2 max-w-3xl shadow ${
                  msg.role === "user"
                    ? "bg-blue-600 text-white"
                    : "bg-white text-gray-800 border border-gray-200"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        )}
        <div ref={chatEndRef} />
      </div>

      {/* Input (sticky like ChatGPT) */}
      <div className="fixed bottom-0 left-0 right-0  z-20">
        <div className="max-w-4xl  mx-auto p-4 flex items-end space-x-2">
          <textarea
            className="flex-1 rounded-lg px-4 py-3 bg-gray-50 text-gray-800 border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Message SpecForge..."
            rows={1}
            disabled={loading}
            style={{ maxHeight: "150px" }}
          />
          <button
            className="bg-blue-600 px-5 py-3 rounded-lg text-white font-bold hover:bg-blue-700 transition shadow"
            onClick={sendMessage}
            disabled={loading}
          >
            {loading ? (
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
            ) : (
              "Send"
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
