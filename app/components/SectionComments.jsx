import { useState, useEffect } from "react";

const COMMENT_CACHE_TTL_MS = 30000;
const commentCache = new Map();

const getCacheKey = (documentId, sectionId) => `${documentId}:${sectionId}`;

const readFromCache = (documentId, sectionId) => {
  const key = getCacheKey(documentId, sectionId);
  const entry = commentCache.get(key);

  if (!entry) return null;
  if (Date.now() - entry.timestamp > COMMENT_CACHE_TTL_MS) {
    commentCache.delete(key);
    return null;
  }

  return entry.comments;
};

const saveToCache = (documentId, sectionId, comments) => {
  const key = getCacheKey(documentId, sectionId);
  commentCache.set(key, { comments, timestamp: Date.now() });
};

const getTokenPayload = () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) return null;
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(atob(parts[1]));
    return payload;
  } catch {
    return null;
  }
};

export default function SectionComments({ sectionId, documentId, user, buttonClass, initialCount = 0 }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showBox, setShowBox] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);
  const [error, setError] = useState("");
  const [commentCount, setCommentCount] = useState(initialCount);
  const [editingId, setEditingId] = useState("");
  const [editingText, setEditingText] = useState("");
  const [savingEdit, setSavingEdit] = useState(false);
  const [deletingId, setDeletingId] = useState("");
  const [currentUserId, setCurrentUserId] = useState("");

  useEffect(() => {
    setCommentCount(initialCount || 0);
  }, [initialCount]);

  useEffect(() => {
    const payload = getTokenPayload();
    if (payload?.id) {
      setCurrentUserId(String(payload.id));
    }
  }, []);

  useEffect(() => {
    setComments([]);
    setShowBox(false);
    setError("");
    // eslint-disable-next-line
  }, [sectionId, documentId]);

  useEffect(() => {
    if (showBox) {
      fetchComments({ useCache: true });
    }
    // eslint-disable-next-line
  }, [showBox]);

  const fetchComments = async ({ useCache = false } = {}) => {
    if (useCache) {
      const cached = readFromCache(documentId, sectionId);
      if (cached) {
        setComments(cached);
        setCommentCount(cached.length);
        return;
      }
    }

    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/comments?sectionId=${sectionId}&documentId=${documentId}`);
      if (!res.ok) {
        throw new Error("Failed to load comments");
      }
      const data = await res.json();
      const nextComments = data.comments || [];
      setComments(nextComments);
      setCommentCount(nextComments.length);
      saveToCache(documentId, sectionId, nextComments);
    } catch (err) {
      setComments([]);
      setError("Unable to load comments.");
    }
    setLoading(false);
  };

  const postComment = async () => {
    if (!newComment.trim()) return;
    setPosting(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/comments", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ sectionId, documentId, text: newComment, user })
      });

      if (!res.ok) {
        throw new Error("Failed to post comment");
      }

      setNewComment("");
      await fetchComments({ useCache: false });
    } catch (err) {
      setError("Unable to post comment.");
    }
    setPosting(false);
  };

  const startEdit = (comment) => {
    setEditingId(comment._id);
    setEditingText(comment.text || "");
  };

  const cancelEdit = () => {
    setEditingId("");
    setEditingText("");
  };

  const saveEdit = async () => {
    if (!editingId || !editingText.trim()) return;
    setSavingEdit(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/comments", {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ commentId: editingId, text: editingText.trim() }),
      });

      if (!res.ok) {
        throw new Error("Failed to edit comment");
      }

      cancelEdit();
      await fetchComments({ useCache: false });
    } catch {
      setError("Unable to edit comment.");
    }
    setSavingEdit(false);
  };

  const deleteComment = async (commentId) => {
    if (!commentId) return;

    const shouldDelete = window.confirm("Delete this comment?");
    if (!shouldDelete) return;

    setDeletingId(commentId);
    setError("");

    try {
      const token = localStorage.getItem("token");
      const res = await fetch("/api/comments", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: JSON.stringify({ commentId }),
      });

      if (!res.ok) {
        throw new Error("Failed to delete comment");
      }

      if (editingId === commentId) {
        cancelEdit();
      }
      await fetchComments({ useCache: false });
    } catch {
      setError("Unable to delete comment.");
    }

    setDeletingId("");
  };

  const canManageComment = (comment) => {
    if (!currentUserId) return false;
    if (!comment?.user?._id) return false;
    return String(comment.user._id) === currentUserId;
  };

  return (
    <div className="relative mt-2">
      <button
        className={buttonClass || "group inline-flex items-center gap-2 rounded-full border border-sky-400/40 bg-sky-500/10 px-3 py-1.5 text-xs font-semibold text-sky-100 transition hover:border-sky-300 hover:bg-sky-500/20"}
        onClick={() => setShowBox((v) => !v)}
        onMouseEnter={() => {
          if (!showBox && commentCount > 0) {
            fetchComments({ useCache: true });
          }
        }}
        aria-expanded={showBox}
      >
        <svg className="h-4 w-4 text-sky-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h10a4 4 0 004-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4v8z" />
        </svg>
        <span>{showBox ? "Hide" : "Comments"}</span>
        <span className="inline-flex min-w-5 items-center justify-center rounded-full bg-sky-500 px-1.5 py-0.5 text-[10px] font-bold text-white">
          {commentCount}
        </span>
      </button>
      {showBox && (
        <div className="absolute right-0 z-30 mt-3 w-[min(90vw,360px)] rounded-2xl border border-slate-700 bg-slate-900/95 p-4 shadow-2xl backdrop-blur">
          <div className="mb-3 flex items-center justify-between">
            <div className="text-sm font-semibold text-slate-100">Comments</div>
            <div className="text-xs text-slate-400">{commentCount} total</div>
          </div>
          {loading ? (
            <div className="text-xs text-slate-400">Loading...</div>
          ) : comments.length === 0 ? (
            <div className="rounded-xl border border-dashed border-slate-700 bg-slate-800/60 p-3 text-xs text-slate-400">
              No comments yet. Start the discussion for this section.
            </div>
          ) : (
            <ul className="mb-3 max-h-56 space-y-2 overflow-auto pr-1">
              {comments.map((c) => (
                <li key={c._id} className="rounded-xl border border-slate-700 bg-slate-800/70 p-2.5 text-xs text-slate-200">
                  <div className="mb-1 flex items-start justify-between gap-2">
                    <div>
                      <span className="font-semibold text-sky-300">{c.user?.name || "User"}</span>
                      <div className="text-[10px] text-slate-400">{new Date(c.createdAt).toLocaleString()}</div>
                    </div>
                    {canManageComment(c) && (
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => startEdit(c)}
                          className="rounded-md p-1 text-slate-300 transition hover:bg-slate-700 hover:text-sky-300"
                          aria-label="Edit comment"
                          title="Edit comment"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M11 4h-1a2 2 0 00-2 2v12a2 2 0 002 2h12a2 2 0 002-2v-1" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M18.5 2.5a2.121 2.121 0 013 3L12 15l-4 1 1-4 9.5-9.5z" />
                          </svg>
                        </button>
                        <button
                          onClick={() => deleteComment(c._id)}
                          disabled={deletingId === c._id}
                          className="rounded-md p-1 text-slate-300 transition hover:bg-slate-700 hover:text-rose-300 disabled:opacity-50"
                          aria-label="Delete comment"
                          title="Delete comment"
                        >
                          <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 6h18" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8 6V4a1 1 0 011-1h6a1 1 0 011 1v2" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M19 6l-1 14a1 1 0 01-1 1H7a1 1 0 01-1-1L5 6" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10 11v6M14 11v6" />
                          </svg>
                        </button>
                      </div>
                    )}
                  </div>
                  {editingId === c._id ? (
                    <div className="mt-2 space-y-2">
                      <textarea
                        value={editingText}
                        onChange={(e) => setEditingText(e.target.value)}
                        rows={3}
                        className="w-full rounded-xl border border-slate-700 bg-slate-950/80 px-3 py-2 text-xs text-slate-100 outline-none ring-sky-400/40 focus:ring"
                      />
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={cancelEdit}
                          className="rounded-lg border border-slate-600 px-2.5 py-1 text-xs text-slate-300 hover:bg-slate-800"
                        >
                          Cancel
                        </button>
                        <button
                          onClick={saveEdit}
                          disabled={savingEdit || !editingText.trim()}
                          className="rounded-lg bg-sky-500 px-2.5 py-1 text-xs font-semibold text-white hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-600"
                        >
                          {savingEdit ? "Saving..." : "Save"}
                        </button>
                      </div>
                    </div>
                  ) : (
                    <p className="whitespace-pre-wrap text-[12px] leading-5 text-slate-200">{c.text}</p>
                  )}
                </li>
              ))}
            </ul>
          )}
          {!!error && <div className="mb-2 rounded-lg border border-rose-500/40 bg-rose-500/10 px-2 py-1 text-xs text-rose-200">{error}</div>}
          <div className="mt-2 flex flex-col gap-2">
            <textarea
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              className="w-full rounded-xl border border-slate-700 bg-slate-950/70 px-3 py-2 text-xs text-slate-100 outline-none ring-sky-400/40 placeholder:text-slate-500 focus:ring"
              placeholder="Add a comment..."
              disabled={posting}
            />
            <div className="flex items-center justify-end gap-2">
              <button
                onClick={() => setShowBox(false)}
                className="rounded-lg border border-slate-600 px-3 py-1.5 text-xs font-medium text-slate-300 transition hover:bg-slate-800"
              >
                Close
              </button>
              <button
                onClick={postComment}
                disabled={posting || !newComment.trim()}
                className="rounded-lg bg-sky-500 px-3 py-1.5 text-xs font-semibold text-white transition hover:bg-sky-400 disabled:cursor-not-allowed disabled:bg-slate-600"
              >
                {posting ? "Posting..." : "Post Comment"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
