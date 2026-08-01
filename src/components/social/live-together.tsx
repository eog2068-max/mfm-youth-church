"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Radio } from "lucide-react";
import { BackToSocial } from "./back-to-social";
import { SocialFeatureNav } from "./social-feature-nav";

interface LiveSession {
  title: string;
  status: "live" | "scheduled" | "ended";
  youtubeUrl?: string;
  viewerCount: number;
}

const serviceMoments = [
  { key: "worship", emoji: "🙌", label: "Worship" },
  { key: "prayer", emoji: "🙏", label: "Prayer" },
  { key: "love", emoji: "❤️", label: "Love" },
  { key: "fire", emoji: "🔥", label: "Fire" },
];

export function LiveTogether() {
  const [session, setSession] = useState<LiveSession | null>(null);
  const [reactions, setReactions] = useState<Record<string, number>>({});
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2)}`);

  const fetchData = async () => {
    try {
      const res = await fetch("/api/social/live");
      if (res.ok) setSession(await res.json());
    } catch { /* silent */ }
  };

  useEffect(() => {
    fetchData();
    const interval = setInterval(fetchData, 15000);
    return () => clearInterval(interval);
  }, []);

  const handleReact = async (type: string) => {
    try {
      const res = await fetch("/api/social/live", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-id": sessionId },
        body: JSON.stringify({ type }),
      });
      if (res.ok) setReactions(await res.json());
    } catch { /* silent */ }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <div className="max-w-4xl mx-auto px-4 pt-28 pb-24">
        <BackToSocial />

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🔴</span>
            <h1 className="text-2xl md:text-3xl font-bold text-[#4A148C]">Live Together</h1>
          </div>
          <p className="text-gray-500">Worship together during live services.</p>
        </motion.div>

        {session?.status === "live" ? (
          <>
            {/* Live Badge */}
            <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="flex items-center gap-3 mb-4">
              <span className="inline-flex items-center gap-2 bg-red-100 text-red-700 px-3 py-1 rounded-full text-sm font-semibold">
                <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
                LIVE NOW
              </span>
              <span className="text-sm text-gray-500">
                {session.viewerCount} people worshipping together
              </span>
            </motion.div>

            {/* Player */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="rounded-2xl overflow-hidden shadow-lg mb-6 bg-black aspect-video">
              <div className="w-full h-full flex items-center justify-center text-white">
                <div className="text-center">
                  <Radio className="size-12 mx-auto mb-3 text-red-500 animate-pulse" />
                  <p className="text-xl font-bold">{session.title}</p>
                  <p className="text-sm text-gray-400 mt-1">Live stream will appear here when connected</p>
                </div>
              </div>
            </motion.div>

            {/* Reactions */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <p className="text-sm font-semibold text-gray-800 mb-4">React with us</p>
              <div className="flex flex-wrap gap-3">
                {serviceMoments.map((moment) => (
                  <motion.button
                    key={moment.key}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => handleReact(moment.key)}
                    className="inline-flex items-center gap-2 bg-gray-50 hover:bg-gray-100 px-4 py-2.5 rounded-xl text-sm font-medium transition-colors"
                  >
                    <span className="text-lg">{moment.emoji}</span>
                    <span>{moment.label}</span>
                    {reactions[moment.key] ? (
                      <span className="bg-gray-200 px-2 py-0.5 rounded-md text-xs font-bold">
                        {reactions[moment.key]}
                      </span>
                    ) : null}
                  </motion.button>
                ))}
              </div>
            </motion.div>
          </>
        ) : (
          /* Not Live */
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8 text-center">
            <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-6">
              <Radio className="size-10 text-gray-400" />
            </div>
            <h2 className="text-xl font-bold text-[#4A148C] mb-2">Not Live Right Now</h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Join us during our next live service to worship together! We go live every Sunday at 7:00 AM, Tuesday at 5:30 PM, and Thursday at 5:30 PM.
            </p>
            <div className="mt-6 flex flex-col sm:flex-row gap-3 justify-center">
              <div className="bg-purple-50 rounded-xl px-4 py-3">
                <p className="text-sm font-bold text-[#4A148C]">Sunday</p>
                <p className="text-xs text-gray-500">7:00 AM</p>
              </div>
              <div className="bg-green-50 rounded-xl px-4 py-3">
                <p className="text-sm font-bold text-[#2E7D32]">Tuesday</p>
                <p className="text-xs text-gray-500">5:30 PM</p>
              </div>
              <div className="bg-red-50 rounded-xl px-4 py-3">
                <p className="text-sm font-bold text-[#D32F2F]">Thursday</p>
                <p className="text-xs text-gray-500">5:30 PM</p>
              </div>
            </div>
          </motion.div>
        )}
      </div>

      <SocialFeatureNav currentFeatureId="live-together" />
    </div>
  );
}
