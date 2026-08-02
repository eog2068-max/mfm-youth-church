"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Send } from "lucide-react";
import { BackToSocial } from "./back-to-social";
import { SocialFeatureNav } from "./social-feature-nav";

interface Question {
  id: string;
  question: string;
  totalResponses: number;
}

interface Response {
  id: string;
  response: string;
  displayName: string;
  reactions: { love: number; praying: number; amen: number; fire: number };
  createdAt: string;
}

export function TodaysQuestion() {
  const [question, setQuestion] = useState<Question | null>(null);
  const [responses, setResponses] = useState<Response[]>([]);
  const [newResponse, setNewResponse] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    fetch("/api/social/question")
      .then((r) => r.json())
      .then((data) => setQuestion(data))
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (question) {
      fetch(`/api/social/question/responses?questionId=${question.id}`)
        .then((r) => r.json())
        .then((data) => setResponses(data))
        .catch(() => {});
    }
  }, [question]);

  const handleSubmit = async () => {
    if (!newResponse.trim() || !question) return;
    setSubmitting(true);
    try {
      const res = await fetch("/api/social/question/responses", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-id": sessionId },
        body: JSON.stringify({ questionId: question.id, response: newResponse.trim() }),
      });
      if (res.ok) {
        const resp = await res.json();
        setResponses((prev) => [resp, ...prev]);
        setNewResponse("");
      }
    } catch { /* silent */ }
    setSubmitting(false);
  };

  const handleReact = async (responseId: string, type: "love" | "praying" | "amen" | "fire") => {
    try {
      const res = await fetch(`/api/social/question/${responseId}/react`, {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-id": sessionId },
        body: JSON.stringify({ type }),
      });
      if (res.ok) {
        const updated = await res.json();
        setResponses((prev) =>
          prev.map((r) => (r.id === responseId ? updated : r))
        );
      }
    } catch { /* silent */ }
  };

  const reactionBtns: { key: "love" | "praying" | "amen" | "fire"; emoji: string; label: string }[] = [
    { key: "love", emoji: "❤️", label: "Love" },
    { key: "praying", emoji: "🙏", label: "Praying" },
    { key: "amen", emoji: "🙌", label: "Amen" },
    { key: "fire", emoji: "🔥", label: "Powerful" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-24">
        <BackToSocial />

        {/* Question Card */}
        {question && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-br from-[#2E7D32] to-[#388E3C] rounded-2xl p-6 md:p-8 mb-8 shadow-lg"
          >
            <p className="text-green-100/70 text-sm font-medium mb-2">TODAY&apos;S QUESTION</p>
            <h1 className="text-2xl md:text-3xl font-bold text-white leading-snug">
              &ldquo;{question.question}&rdquo;
            </h1>
            <p className="text-green-100/60 text-sm mt-3">
              {question.totalResponses} responses
            </p>
          </motion.div>
        )}

        {/* Submit Response */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 mb-8"
        >
          <textarea
            value={newResponse}
            onChange={(e) => setNewResponse(e.target.value.slice(0, 200))}
            placeholder="Share your response..."
            rows={3}
            className="w-full rounded-xl border border-gray-200 p-4 text-sm text-gray-800 placeholder:text-gray-400 focus:outline-none focus:border-[#2E7D32]/30 focus:ring-2 focus:ring-[#2E7D32]/10 resize-none"
          />
          <div className="flex items-center justify-between mt-3">
            <p className="text-xs text-gray-400">{newResponse.length}/200</p>
            <button
              onClick={handleSubmit}
              disabled={!newResponse.trim() || submitting}
              className="inline-flex items-center gap-2 bg-[#2E7D32] hover:bg-[#1B5E20] text-white px-5 py-2.5 rounded-xl text-sm font-semibold transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
            >
              <Send className="size-4" />
              {submitting ? "Sending..." : "Share"}
            </button>
          </div>
        </motion.div>

        {/* Responses */}
        <div className="space-y-4">
          {responses.map((resp, i) => (
            <motion.div
              key={resp.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 + i * 0.05 }}
              className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5"
            >
              <p className="text-gray-800 text-sm leading-relaxed mb-3">{resp.response}</p>
              <div className="flex items-center gap-1.5 flex-wrap">
                {reactionBtns.map((btn) => (
                  <button
                    key={btn.key}
                    onClick={() => handleReact(resp.id, btn.key)}
                    className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors text-xs text-gray-600"
                  >
                    <span>{btn.emoji}</span>
                    <span>{resp.reactions[btn.key]}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          ))}
          {responses.length === 0 && (
            <p className="text-center text-gray-400 text-sm py-8">No responses yet. Be the first!</p>
          )}
        </div>
      </div>

      <SocialFeatureNav currentFeatureId="todays-question" />
    </div>
  );
}
