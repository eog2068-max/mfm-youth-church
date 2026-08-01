"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BackToSocial } from "./back-to-social";

export function ImHere() {
  const [count, setCount] = useState(0);
  const [isHere, setIsHere] = useState(false);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2)}`);

  const fetchCount = useCallback(async () => {
    try {
      const res = await fetch("/api/social/presence");
      if (res.ok) {
        const data = await res.json();
        setCount(data.count);
      }
    } catch { /* silent */ }
  }, []);

  useEffect(() => {
    fetchCount();
    const interval = setInterval(fetchCount, 10000);
    return () => clearInterval(interval);
  }, [fetchCount]);

  const handleImHere = async () => {
    try {
      await fetch("/api/social/presence", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-id": sessionId },
      });
      setIsHere(true);
      fetchCount();
    } catch { /* silent */ }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A0033] via-[#4A148C] to-[#6A1B9A]" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }} />
      </div>
      <div className="absolute top-1/4 left-1/4 w-72 h-72 bg-purple-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-red-400/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-4xl mx-auto px-4 pt-28 pb-16">
        <BackToSocial />

        <div className="text-center">
          {/* Emoji */}
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200, delay: 0.2 }}
            className="text-7xl md:text-8xl mb-6"
          >
            👋
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl md:text-4xl font-bold text-white mb-3"
          >
            I&apos;m Here
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-purple-200/70 mb-10"
          >
            Let the church family know you&apos;re here right now
          </motion.p>

          {/* Counter */}
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.5, type: "spring" }}
            className="mb-10"
          >
            <div className="inline-flex items-center gap-3 bg-white/10 backdrop-blur-sm border border-white/20 rounded-2xl px-8 py-5">
              <div className="flex -space-x-2">
                {["bg-purple-400", "bg-green-400", "bg-yellow-400", "bg-pink-400", "bg-purple-400"].map((color, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: 0.6 + i * 0.1 }}
                    className={`w-8 h-8 rounded-full ${color} border-2 border-[#4A148C] flex items-center justify-center`}
                  >
                    <span className="text-[10px] font-bold text-white">
                      {["A", "B", "C", "D", "E"][i]}
                    </span>
                  </motion.div>
                ))}
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={count}
                  initial={{ y: 10, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: -10, opacity: 0 }}
                  className="text-white text-lg md:text-xl font-bold"
                >
                  <span className="text-2xl md:text-3xl">{count}</span> people are here right now
                </motion.p>
              </AnimatePresence>
            </div>
          </motion.div>

          {/* Button */}
          <motion.button
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
            onClick={handleImHere}
            disabled={isHere}
            className={`relative inline-flex items-center gap-3 px-10 py-4 rounded-2xl text-lg font-bold transition-all shadow-lg ${
              isHere
                ? "bg-green-500 text-white shadow-green-500/30"
                : "bg-white text-[#4A148C] shadow-white/20 hover:shadow-white/40"
            }`}
          >
            {isHere ? (
              <>
                <motion.span
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring" }}
                >
                  ✅
                </motion.span>
                You&apos;re here!
              </>
            ) : (
              <>
                <span className="text-2xl">👋</span>
                I&apos;M HERE
              </>
            )}
          </motion.button>

          <AnimatePresence>
            {isHere && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mt-6 text-sm text-purple-200/60"
              >
                Welcome! You are now visible to the community.
              </motion.p>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}
