"use client";

import { use, useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function EditDocumentPage({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [permissions, setPermissions] = useState({ canEdit: false, isOwner: false });
  const [activeSection, setActiveSection] = useState("general");
  const [activeEditors, setActiveEditors] = useState([]);
  const [selfUserId, setSelfUserId] = useState("");
  const [form, setForm] = useState({
    projectName: "",
    purpose: "",
    scope: "",
    notes: "",
    markdown: "",
  });

  const getToken = () => localStorage.getItem("token");

  const getTokenUserId = () => {
    try {
      const token = getToken();
      if (!token) return "";
      const payload = JSON.parse(atob(token.split(".")[1]));
      return payload?.id ? String(payload.id) : "";
    } catch {
      return "";
    }
  };

  const sendPresence = async (sectionName = activeSection) => {
    const token = getToken();
    if (!token || !permissions.canEdit) return;

    try {
      await fetch(`/api/profile/documents/${id}/presence`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ section: sectionName || "general" }),
      });
    } catch {
      // Presence heartbeat failures should not block editing.
    }
  };

  const fetchPresence = async () => {
    const token = getToken();
    if (!token || !permissions.canEdit) return;

    try {
      const response = await fetch(`/api/profile/documents/${id}/presence`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) return;

      const data = await response.json();
      setActiveEditors(data.activeEditors || []);
    } catch {
      setActiveEditors([]);
    }
  };

  useEffect(() => {
    setSelfUserId(getTokenUserId());

    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    const loadDocument = async () => {
      setLoading(true);
      setError("");
      try {
        const response = await fetch(`/api/profile/documents/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.error || "Failed to load document");
        }

        setPermissions(data.permissions || { canEdit: false, isOwner: false });
        setForm({
          projectName: data.document.projectName || "",
          purpose: data.document.purpose || "",
          scope: data.document.scope || "",
          notes: data.document.notes || "",
          markdown: data.document.markdown || "",
        });
      } catch (err) {
        setError(err.message || "Failed to load document.");
      }
      setLoading(false);
    };

    loadDocument();
  }, [id, router]);

  useEffect(() => {
    if (!permissions.canEdit) return;

    sendPresence(activeSection);
    fetchPresence();

    const heartbeat = setInterval(() => {
      sendPresence(activeSection);
      fetchPresence();
    }, 10000);

    return () => clearInterval(heartbeat);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissions.canEdit, activeSection, id]);

  const updateSectionFocus = (sectionName) => {
    setActiveSection(sectionName);
    sendPresence(sectionName);
  };

  const otherEditors = activeEditors.filter((editor) => String(editor.userId) !== selfUserId);

  const saveChanges = async () => {
    const token = localStorage.getItem("token");
    if (!token) {
      router.push("/login");
      return;
    }

    setSaving(true);
    setError("");

    try {
      const response = await fetch(`/api/profile/documents/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || "Failed to save document");
      }

      router.push(`/profile/${id}`);
    } catch (err) {
      setError(err.message || "Failed to save document.");
      setSaving(false);
      return;
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center">
        <p>Loading document editor...</p>
      </div>
    );
  }

  if (!permissions.canEdit) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex items-center justify-center px-4">
        <div className="w-full max-w-md rounded-2xl border border-slate-700 bg-slate-900 p-6">
          <h1 className="text-xl font-bold">No edit access</h1>
          <p className="mt-2 text-sm text-slate-300">You can only edit if you are the owner or accepted collaborator.</p>
          <Link href="/profile" className="mt-4 inline-block rounded-lg bg-slate-800 px-4 py-2 text-sm font-semibold hover:bg-slate-700">
            Back to profile
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[linear-gradient(135deg,#020617,#0f172a_45%,#0b1731)] text-slate-100 px-4 py-8">
      <div className="mx-auto w-full max-w-5xl rounded-3xl border border-slate-700 bg-slate-900/75 p-6 shadow-2xl backdrop-blur md:p-8">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 border-b border-slate-700 pb-4">
          <h1 className="text-2xl font-bold">Edit Document</h1>
          <div className="flex items-center gap-2">
            <Link href={`/profile/${id}`} className="rounded-lg border border-slate-600 px-4 py-2 text-sm font-semibold hover:bg-slate-800">
              Cancel
            </Link>
            <button
              onClick={saveChanges}
              disabled={saving}
              className="rounded-lg bg-cyan-500 px-4 py-2 text-sm font-semibold text-slate-950 hover:bg-cyan-400 disabled:cursor-not-allowed disabled:bg-slate-600 disabled:text-slate-300"
            >
              {saving ? "Saving..." : "Save"}
            </button>
          </div>
        </div>

        {error && (
          <div className="mb-4 rounded-xl border border-rose-600/40 bg-rose-500/10 px-3 py-2 text-sm text-rose-200">{error}</div>
        )}

        <div className="mb-6 rounded-xl border border-cyan-500/30 bg-cyan-500/10 px-4 py-3">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h2 className="text-sm font-semibold text-cyan-200">Live Editing Presence</h2>
            <span className="rounded-full border border-slate-600 bg-slate-800 px-2 py-0.5 text-xs text-slate-300">
              You: {activeSection}
            </span>
          </div>

          {otherEditors.length > 0 ? (
            <ul className="space-y-1.5 text-xs text-slate-200">
              {otherEditors.map((editor) => (
                <li key={`${editor.userId}-${editor.lastSeenAt}`} className="flex items-center justify-between rounded-lg border border-slate-700 bg-slate-900/70 px-3 py-2">
                  <span className="font-medium text-cyan-200">{editor.userName}</span>
                  <span className="text-slate-300">Editing: {editor.section || "general"}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-xs text-slate-300">No other collaborators active right now.</p>
          )}
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Project Name</label>
            <input
              value={form.projectName}
              onFocus={() => updateSectionFocus("projectName")}
              onChange={(e) => setForm((prev) => ({ ...prev, projectName: e.target.value }))}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-500/50 focus:ring"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-slate-300">Purpose</label>
            <input
              value={form.purpose}
              onFocus={() => updateSectionFocus("purpose")}
              onChange={(e) => setForm((prev) => ({ ...prev, purpose: e.target.value }))}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-500/50 focus:ring"
            />
          </div>
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-slate-300">Scope</label>
          <textarea
            rows={3}
            value={form.scope}
            onFocus={() => updateSectionFocus("scope")}
            onChange={(e) => setForm((prev) => ({ ...prev, scope: e.target.value }))}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-500/50 focus:ring"
          />
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-slate-300">Notes</label>
          <textarea
            rows={3}
            value={form.notes}
            onFocus={() => updateSectionFocus("notes")}
            onChange={(e) => setForm((prev) => ({ ...prev, notes: e.target.value }))}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-sm text-slate-100 outline-none ring-cyan-500/50 focus:ring"
          />
        </div>

        <div className="mt-4">
          <label className="mb-2 block text-sm font-medium text-slate-300">Markdown Content</label>
          <textarea
            rows={16}
            value={form.markdown}
            onFocus={() => updateSectionFocus("markdown")}
            onChange={(e) => setForm((prev) => ({ ...prev, markdown: e.target.value }))}
            className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 font-mono text-sm text-slate-100 outline-none ring-cyan-500/50 focus:ring"
          />
        </div>
      </div>
    </div>
  );
}
