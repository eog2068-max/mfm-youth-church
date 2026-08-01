"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { BackToSocial } from "./back-to-social";

interface Challenge {
  id: string;
  title: string;
  description: string;
  participationCount: number;
  scheduledDate: string;
  endDate: string;
}

export function WeeklyChallenge() {
  const [challenge, setChallenge] = useState<Challenge | null>(null);
  const [joined, setJoined] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2)}`);

  useEffect(() => {
    fetch("/api/social/challenge")
      .then((r) => r.json())
      .then(setChallenge)
      .catch(() => {});
  }, []);

  const handleJoin = async () => {
    if (!challenge || joined) return;
    try {
      const res = await fetch("/api/social/challenge", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-id": sessionId },
        body: JSON.stringify({ challengeId: challenge.id }),
      });
      if (res.ok) {
        const data = await res.json();
        if (data.joined) {
          setJoined(true);
          setChallenge((prev) => prev ? { ...prev, participationCount: data.total } : null);
        }
      }
    } catch { /* silent */ }
  };

  if (!challenge) {
    return (
      <div className="min-h-screen bg-[#F8FAFF]">
        <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
          <BackToSocial />
          <div className="text-center py-20">
            <span className="text-5xl mb-4 block">🔥</span>
            <h1 className="text-2xl font-bold text-[#4A148C] mb-2">No Active Challenge</h1>
            <p className="text-gray-500">Check back soon for a new weekly challenge!</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
        <BackToSocial />

        {/* Challenge Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-[#6A1B9A] to-[#8E24AA] rounded-2xl p-6 md:p-8 mb-6 shadow-lg"
        >
          <p className="text-purple-200/70 text-sm font-medium mb-2">🔥 THIS WEEK&apos;S CHALLENGE</p>
          <h1 className="text-2xl md:text-3xl font-bold text-white leading-snug mb-4">
            {challenge.title}
          </h1>
          <p className="text-purple-100/80 text-sm leading-relaxed">
            {challenge.description}
          </p>
        </motion.div>

        {/* Participation Count */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 text-center mb-6"
        >
          <p className="text-3xl md:text-4xl font-bold text-[#6A1B9A] mb-1">
            {challenge.participationCount}
          </p>
          <p className="text-sm text-gray-500">people have accepted this challenge</p>
        </motion.div>

        {/* Join Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-center"
        >
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleJoin}
            disabled={joined}
            className={`inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-lg font-bold transition-all shadow-lg ${
              joined
                ? "bg-green-500 text-white shadow-green-500/30"
                : "bg-[#6A1B9A] hover:bg-[#4A148C] text-white shadow-purple-500/30"
            }`}
          >
            {joined ? (
              <>✅ You&apos;re in!</>
            ) : (
              <>🙌 I&apos;M IN</>
            )}
          </motion.button>

          {joined && (
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="mt-4 text-sm text-gray-500"
            >
              You&apos;ve accepted this week&apos;s challenge. Go make a difference!
            </motion.p>
          )}
        </motion.div>
      </div>
    </div>
  );
}
