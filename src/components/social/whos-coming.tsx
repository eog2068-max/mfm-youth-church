"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar } from "lucide-react";
import { BackToSocial } from "./back-to-social";
import { getUpcomingEvents, type ChurchEvent } from "@/components/events/events-data";

export function WhosComing() {
  const [events] = useState<ChurchEvent[]>(getUpcomingEvents().slice(0, 5));
  const [selectedEvent, setSelectedEvent] = useState<ChurchEvent>(events[0]);
  const [counts, setCounts] = useState({ self: 0, family: 0, friend: 0, total: 0 });
  const [myChoice, setMyChoice] = useState<string | null>(null);
  const [sessionId] = useState(() => `session_${Date.now()}_${Math.random().toString(36).slice(2)}`);

  const fetchCounts = async (eventId: string) => {
    try {
      const res = await fetch(`/api/social/attendance?eventId=${eventId}`);
      if (res.ok) setCounts(await res.json());
    } catch { /* silent */ }
  };

  useEffect(() => {
    if (selectedEvent) fetchCounts(selectedEvent.id);
  }, [selectedEvent]);

  const handleAttend = async (type: "self" | "family" | "friend") => {
    if (!selectedEvent) return;
    try {
      const res = await fetch("/api/social/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-session-id": sessionId },
        body: JSON.stringify({ eventId: selectedEvent.id, type }),
      });
      if (res.ok) {
        setCounts(await res.json());
        setMyChoice(type);
      }
    } catch { /* silent */ }
  };

  const attendanceBtns = [
    { type: "self" as const, emoji: "🙋", label: "I'm Coming", color: "bg-[#00695C] hover:bg-[#004D40] text-white" },
    { type: "family" as const, emoji: "👨‍👩‍👧", label: "Coming With Family", color: "bg-[#00695C]/80 hover:bg-[#004D40] text-white" },
    { type: "friend" as const, emoji: "🤝", label: "Bringing a Friend", color: "bg-[#00695C]/60 hover:bg-[#004D40] text-white" },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      <div className="max-w-3xl mx-auto px-4 pt-28 pb-16">
        <BackToSocial />

        {/* Header */}
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
          <div className="flex items-center gap-3 mb-3">
            <span className="text-4xl">🙋</span>
            <h1 className="text-2xl md:text-3xl font-bold text-[#4A148C]">Who&apos;s Coming?</h1>
          </div>
          <p className="text-gray-500">Let us know if you&apos;re planning to attend.</p>
        </motion.div>

        {/* Event Selector */}
        {events.length > 1 && (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex gap-2 mb-6 overflow-x-auto pb-2">
            {events.map((ev) => (
              <button
                key={ev.id}
                onClick={() => { setSelectedEvent(ev); setMyChoice(null); }}
                className={`shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                  selectedEvent?.id === ev.id ? "bg-[#00695C] text-white" : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                }`}
              >
                {ev.title}
              </button>
            ))}
          </motion.div>
        )}

        {selectedEvent && (
          <>
            {/* Event Card */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 mb-6">
              <div className="flex items-start gap-3">
                <div className="w-12 h-12 rounded-xl bg-[#E0F2F1] flex items-center justify-center shrink-0">
                  <Calendar className="size-6 text-[#00695C]" />
                </div>
                <div>
                  <h2 className="text-lg font-bold text-gray-800">{selectedEvent.title}</h2>
                  <p className="text-sm text-gray-500 mt-0.5">
                    {new Date(selectedEvent.date).toLocaleDateString("en-NG", { weekday: "long", month: "long", day: "numeric" })} &middot; {selectedEvent.time}
                  </p>
                  <p className="text-sm text-gray-500 mt-0.5">{selectedEvent.venue}</p>
                </div>
              </div>
            </motion.div>

            {/* Attendance Count */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }} className="bg-gradient-to-br from-[#00695C] to-[#00897B] rounded-2xl p-6 mb-6 text-center">
              <p className="text-3xl md:text-4xl font-bold text-white mb-1">{counts.total}</p>
              <p className="text-sm text-green-100/80">people are planning to attend</p>
              <div className="flex justify-center gap-6 mt-3">
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{counts.self}</p>
                  <p className="text-xs text-green-100/60">Coming alone</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{counts.family}</p>
                  <p className="text-xs text-green-100/60">With family</p>
                </div>
                <div className="text-center">
                  <p className="text-lg font-bold text-white">{counts.friend}</p>
                  <p className="text-xs text-green-100/60">Bringing a friend</p>
                </div>
              </div>
            </motion.div>

            {/* Buttons */}
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="flex flex-col sm:flex-row gap-3">
              {attendanceBtns.map((btn) => (
                <motion.button
                  key={btn.type}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => handleAttend(btn.type)}
                  className={`flex-1 flex items-center justify-center gap-2 px-5 py-4 rounded-2xl text-sm font-bold transition-all shadow-md ${
                    myChoice === btn.type ? "ring-2 ring-offset-2 ring-[#00695C] " + btn.color : btn.color
                  }`}
                >
                  <span className="text-xl">{btn.emoji}</span>
                  {btn.label}
                </motion.button>
              ))}
            </motion.div>

            {myChoice && (
              <motion.p initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="mt-4 text-center text-sm text-[#00695C] font-medium">
                Thank you for letting us know! We look forward to seeing you.
              </motion.p>
            )}
          </>
        )}
      </div>
    </div>
  );
}
