"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

export default function AcceptCollabInvitePage() {
  const router = useRouter();
  const [status, setStatus] = useState("idle");
  const [message, setMessage] = useState("Preparing invite...");

  useEffect(() => {
    const acceptInvite = async () => {
      const token = localStorage.getItem("token");
      if (!token) {
        router.push("/login");
        return;
      }

      const inviteToken = new URLSearchParams(window.location.search).get("token");
      if (!inviteToken) {
        setStatus("error");
        setMessage("Invalid invite link.");
        return;
      }

      setStatus("loading");
      setMessage("Accepting invite...");

      try {
        const response = await fetch("/api/profile/documents/accept-invite", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ inviteToken }),
        });

        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.error || "Failed to accept invite");
        }

        setStatus("success");
        setMessage(data.message || "Invite accepted.");

        setTimeout(() => {
          router.push(`/profile/${data.documentId}/edit`);
        }, 1000);
      } catch (error) {
        setStatus("error");
        setMessage(error.message || "Could not accept invite.");
      }
    };

    acceptInvite();
  }, [router]);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
      <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900/70 p-6 shadow-2xl">
        <h1 className="text-xl font-bold mb-3">Collaboration Invite</h1>
        <p className="text-sm text-slate-300">{message}</p>

        {status === "loading" && (
          <div className="mt-4 h-1.5 w-full overflow-hidden rounded bg-slate-700">
            <div className="h-full w-1/2 animate-pulse bg-cyan-400"></div>
          </div>
        )}

        {status === "error" && (
          <button
            onClick={() => router.push("/profile")}
            className="mt-5 rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700"
          >
            Go To Profile
          </button>
        )}
      </div>
    </div>
  );
}
