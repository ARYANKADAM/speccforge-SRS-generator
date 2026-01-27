import { useState, useEffect } from "react";

export default function SectionComments({ sectionId, documentId, user, buttonClass }) {
  const [comments, setComments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBox, setShowBox] = useState(false);
  const [newComment, setNewComment] = useState("");
  const [posting, setPosting] = useState(false);

  useEffect(() => {
    if (showBox) fetchComments();
    // eslint-disable-next-line
  }, [showBox]);

  const fetchComments = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/comments?sectionId=${sectionId}&documentId=${documentId}`);
      const data = await res.json();
      setComments(data.comments || []);
    } catch (err) {
      setComments([]);
    }
    setLoading(false);
  };

  const postComment = async () => {
    if (!newComment.trim()) return;
    setPosting(true);
    try {
      await fetch("/api/comments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ sectionId, documentId, text: newComment, user })
      });
      setNewComment("");
      fetchComments();
    } catch (err) {}
    setPosting(false);
  };

  return (
    <div className="mt-2">
      <button
        className={buttonClass || "flex items-center gap-2 text-base px-4 py-2 bg-blue-700 text-white rounded-lg shadow hover:bg-blue-800 transition font-bold"}
        onClick={() => setShowBox((v) => !v)}
        style={{ minWidth: '140px' }}
      >
        <svg className="h-5 w-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 15a4 4 0 004 4h10a4 4 0 004-4V7a4 4 0 00-4-4H7a4 4 0 00-4 4v8z" />
        </svg>
        {showBox ? "Hide Comments" : "Comments"}
      </button>
      {showBox && (
        <div className="mt-2 p-3 bg-gray-50 dark:bg-slate-800/40 rounded-xl border border-gray-200 dark:border-slate-700">
          <div className="mb-2 font-bold text-sm text-blue-700 dark:text-blue-300">Comments</div>
          {loading ? (
            <div className="text-xs text-gray-400">Loading...</div>
          ) : comments.length === 0 ? (
            <div className="text-xs text-gray-400">No comments yet.</div>
          ) : (
            <ul className="mb-2 space-y-2">
              {comments.map((c) => (
                <li key={c._id} className="text-xs text-gray-700 dark:text-gray-200">
                  <span className="font-semibold text-blue-600 dark:text-blue-400">{c.user?.name || "User"}</span>: {c.text}
                  <span className="ml-2 text-gray-400">{new Date(c.createdAt).toLocaleString()}</span>
                </li>
              ))}
            </ul>
          )}
          <div className="flex gap-2 mt-2">
            <input
              type="text"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              className="flex-1 px-2 py-1 rounded border border-gray-300 dark:border-slate-700 text-xs"
              placeholder="Add a comment..."
              disabled={posting}
            />
            <button
              onClick={postComment}
              disabled={posting || !newComment.trim()}
              className="px-3 py-1 text-xs bg-blue-600 text-white rounded hover:bg-blue-700 font-semibold"
            >
              Post
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
