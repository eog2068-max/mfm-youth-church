"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { BackToSocial } from "./back-to-social";
import { SocialFeatureNav } from "./social-feature-nav";

interface AmenPost {
  id: string;
  message: string;
  displayName: string;
  reactions: { praying: number; love: number; amen: number; fire: number };
  createdAt: string;
}

const reactionBtns: { key: "praying" | "love" | "amen" | "fire"; emoji: string }[] = [
  { key: "praying", emoji: "🙏" },
  { key: "love", emoji: "❤️" },
  { key: "amen", emoji: "🙌" },
  { key: "fire", emoji: "🔥" },
];

export function AmenWall() {
  const [posts, setPosts] = useState<AmenPost[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    fetch("/api/social/amen")
      .then((r) => r.json())
      .then(setPosts)
      .catch(() => {});
  }, []);

  const handleSubmit = async () => {
    if (!newMessage.trim()) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/social/amen", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-id": sessionId },
        body: JSON.stringify({ message: newMessage.trim() }),
      });
      if (res.ok) {
        const post = await res.json();
        setPosts((prev) => [post, ...prev]);
        setNewMessage("");
      }
    } catch { /* silent */ }
    setSubmitting(false);
  };

  const handleReact = async (postId: string, type: "praying" | "love" | "amen" | "fire") => {
    try {
      const res = await fetch(`/api/social/amen/${postId}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-id": sessionId },
        body: JSON.stringify({ type }),
      });
      if (res.ok) {
        const updated = await res.json();
        setPosts((prev) => prev.map((p) => (p.id === postId ? updated : p)));
      }
    } catch { /* silent */ }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-24">
        <BackToSocial />

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">❤️</span>
            <h1 className="text-2xl md:text-3xl font-bold text-[#4A148C]">Amen Wall</h1>
          </div>
          <p className="text-gray-500">Share your faith declarations and encourage the community.</p>
        </motion.div>

        {/* Submit */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8">
          <textarea
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value.slice(0, 200))}
            placeholder='Share a praise, declaration, or word of encouragement... e.g. "God has been faithful!"'
            rows={3}
            className="w-full rounded-xl border border-gray-200 p-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#C62828]/30 focus:ring-2 focus:ring-[#C62828]/10 resize-none"
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-400">{newMessage.length}/200</p>
            <button onClick={handleSubmit} disabled={!newMessage.trim() || submitting} className="inline-flex items-center gap-2 bg-[#C62828] hover:bg-[#B71C1C] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40">
              <Send className="size-4" />
              {submitting ? "Posting..." : "Post"}
            </button>
          </div>
        </motion.div>

        {/* Posts */}
        <div className="space-y-4">
          {posts.map((post, i) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 + i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <p className="text-gray-800 text-sm leading-relaxed mb-3">&ldquo;{post.message}&rdquo;</p>
              <div className="flex items-center justify-between">
                <p className="text-xs text-gray-400">{post.displayName}</p>
                <div className="flex items-center gap-1.5">
                  {reactionBtns.map((btn) => (
                    <button
                      key={btn.key}
                      onClick={() => handleReact(post.id, btn.key)}
                      className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-xs text-gray-600"
                    >
                      <span>{btn.emoji}</span>
                      <span>{post.reactions[btn.key]}</span>
                    </button>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
          {posts.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">No messages yet. Be the first to declare!</p>
          )}
        </div>
      </div>

      <SocialFeatureNav currentFeatureId="amen-wall" />
    </div>
  );
}
