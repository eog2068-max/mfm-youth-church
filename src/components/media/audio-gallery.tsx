"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Pause, SkipBack, SkipForward, Volume2, Search, Music } from "lucide-react";
import { Input } from "@/components/ui/input";

interface AudioTrack {
  id: string;
  title: string;
  speaker: string;
  date: string;
  duration: string;
  type: string;
}

const mockAudio: AudioTrack[] = [
  { id: "a1", title: "Walking in Divine Destiny", speaker: "Pastor [Name]", date: "2025-07-13", duration: "48:32", type: "Sermon" },
  { id: "a2", title: "The Power of Thanksgiving", speaker: "Pastor [Name]", date: "2025-07-06", duration: "52:15", type: "Sermon" },
  { id: "a3", title: "Praise & Worship Session", speaker: "Youth Choir", date: "2025-07-06", duration: "35:40", type: "Worship" },
  { id: "a4", title: "Breaking Spiritual Barriers", speaker: "Evangelist Guest", date: "2025-07-04", duration: "1:12:05", type: "Sermon" },
  { id: "a5", title: "Understanding Grace", speaker: "Pastor [Name]", date: "2025-06-29", duration: "45:18", type: "Sermon" },
  { id: "a6", title: "Prayer That Moves Mountains", speaker: "Pastor [Name]", date: "2025-06-27", duration: "55:40", type: "Prayer" },
  { id: "a7", title: "Special Thanksgiving Songs", speaker: "Youth Choir", date: "2025-06-22", duration: "28:15", type: "Worship" },
  { id: "a8", title: "The Believer's Authority", speaker: "Pastor [Name]", date: "2025-06-25", duration: "42:22", type: "Sermon" },
  { id: "a9", title: "Night of Worship Medley", speaker: "Youth Choir", date: "2025-06-20", duration: "42:00", type: "Worship" },
  { id: "a10", title: "Faith for the Impossible", speaker: "Pastor [Name]", date: "2025-06-15", duration: "50:10", type: "Sermon" },
];

const types = ["All", "Sermon", "Worship", "Prayer"];

export function AudioGallery() {
  const [search, setSearch] = useState("");
  const [type, setType] = useState("All");
  const [playing, setPlaying] = useState<string | null>(null);

  const filtered = mockAudio.filter((a) => {
    const matchSearch =
      a.title.toLowerCase().includes(search.toLowerCase()) ||
      a.speaker.toLowerCase().includes(search.toLowerCase());
    const matchType = type === "All" || a.type === type;
    return matchSearch && matchType;
  });

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search audio..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl border-gray-200 bg-white h-10 focus:border-[#4A148C]/30"
          />
        </div>

        {/* Type pills */}
        <div className="flex flex-wrap gap-2">
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setType(t)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                type === t
                  ? "bg-[#4A148C] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {t}
            </button>
          ))}
        </div>
      </div>

      {/* Track List */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        {/* Header row */}
        <div className="hidden md:grid grid-cols-[40px_1fr_140px_80px_100px_40px] gap-3 px-5 py-3 bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wider">
          <span>#</span>
          <span>Title</span>
          <span>Speaker</span>
          <span>Type</span>
          <span>Duration</span>
          <span></span>
        </div>

        {/* Tracks */}
        <div className="divide-y divide-gray-50">
          {filtered.map((track, i) => {
            const isPlaying = playing === track.id;
            return (
              <motion.div
                key={track.id}
                initial={{ opacity: 0, x: -8 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.03 }}
                onClick={() => setPlaying(isPlaying ? null : track.id)}
                className={`group grid grid-cols-[40px_1fr_40px] md:grid-cols-[40px_1fr_140px_80px_100px_40px] gap-3 items-center px-5 py-3.5 cursor-pointer transition-colors ${
                  isPlaying ? "bg-[#F3E5F5]" : "hover:bg-gray-50"
                }`}
              >
                {/* Index / Play button */}
                <div className="flex items-center justify-center">
                  {isPlaying ? (
                    <div className="w-8 h-8 rounded-full bg-[#4A148C] flex items-center justify-center">
                      <Pause className="size-3.5 text-white" />
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400 group-hover:hidden">{i + 1}</span>
                  )}
                  {!isPlaying && (
                    <div className="w-8 h-8 rounded-full bg-[#4A148C]/10 items-center justify-center hidden group-hover:flex">
                      <Play className="size-3.5 text-[#4A148C] ml-0.5" />
                    </div>
                  )}
                </div>

                {/* Title + speaker (mobile) */}
                <div className="min-w-0">
                  <p className={`text-sm font-semibold truncate ${isPlaying ? "text-[#4A148C]" : "text-gray-800"}`}>
                    {track.title}
                  </p>
                  <p className="text-xs text-gray-400 truncate md:hidden">{track.speaker}</p>
                </div>

                {/* Speaker (desktop) */}
                <p className="hidden md:block text-sm text-gray-500 truncate">{track.speaker}</p>

                {/* Type badge */}
                <span className={`hidden md:inline-flex text-[11px] font-medium px-2.5 py-0.5 rounded-md w-fit ${
                  track.type === "Sermon" ? "bg-purple-50 text-purple-700" :
                  track.type === "Worship" ? "bg-purple-50 text-purple-700" :
                  "bg-amber-50 text-amber-700"
                }`}>
                  {track.type}
                </span>

                {/* Duration */}
                <span className="hidden md:block text-sm text-gray-400">{track.duration}</span>

                {/* Placeholder for future action */}
                <div className="hidden md:block" />
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Mini Player (shows when a track is "playing") */}
      <AnimatePresence>
        {playing && (
          <motion.div
            initial={{ y: 80, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 80, opacity: 0 }}
            className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t border-gray-200 shadow-[0_-4px_20px_rgba(0,0,0,0.1)]"
          >
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-4">
              {/* Track info */}
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-10 h-10 rounded-lg bg-[#F3E5F5] flex items-center justify-center shrink-0">
                  <Music className="size-5 text-[#4A148C]" />
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-semibold text-[#4A148C] truncate">
                    {mockAudio.find((a) => a.id === playing)?.title}
                  </p>
                  <p className="text-xs text-gray-500 truncate">
                    {mockAudio.find((a) => a.id === playing)?.speaker}
                  </p>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-3">
                <button className="p-2 text-gray-400 hover:text-[#4A148C] transition-colors">
                  <SkipBack className="size-4" />
                </button>
                <button
                  onClick={() => setPlaying(null)}
                  className="w-10 h-10 rounded-full bg-[#4A148C] text-white flex items-center justify-center hover:bg-[#1A0033] transition-colors"
                >
                  <Pause className="size-5" />
                </button>
                <button className="p-2 text-gray-400 hover:text-[#4A148C] transition-colors">
                  <SkipForward className="size-4" />
                </button>
              </div>

              {/* Volume */}
              <div className="hidden sm:flex items-center gap-2">
                <Volume2 className="size-4 text-gray-400" />
                <div className="w-20 h-1.5 bg-gray-200 rounded-full overflow-hidden">
                  <div className="w-3/4 h-full bg-[#4A148C] rounded-full" />
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}