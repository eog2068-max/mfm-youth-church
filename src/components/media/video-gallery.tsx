"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Play, Clock, Eye, X, Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

interface Video {
  id: string;
  title: string;
  speaker: string;
  date: string;
  duration: string;
  views: string;
  category: string;
}

const mockVideos: Video[] = [
  {
    id: "v1",
    title: "Walking in Divine Destiny",
    speaker: "Pastor [Name]",
    date: "2025-07-13",
    duration: "48:32",
    views: "1.2K",
    category: "Sunday Service",
  },
  {
    id: "v2",
    title: "The Power of Thanksgiving",
    speaker: "Pastor [Name]",
    date: "2025-07-06",
    duration: "52:15",
    views: "980",
    category: "Sunday Service",
  },
  {
    id: "v3",
    title: "Breaking Spiritual Barriers",
    speaker: "Evangelist Guest",
    date: "2025-07-04",
    duration: "1:12:05",
    views: "2.1K",
    category: "Special Programme",
  },
  {
    id: "v4",
    title: "Understanding Grace",
    speaker: "Pastor [Name]",
    date: "2025-06-29",
    duration: "45:18",
    views: "860",
    category: "Sunday Service",
  },
  {
    id: "v5",
    title: "Prayer That Moves Mountains",
    speaker: "Pastor [Name]",
    date: "2025-06-27",
    duration: "55:40",
    views: "1.5K",
    category: "Faith Clinic",
  },
  {
    id: "v6",
    title: "The Believer's Authority",
    speaker: "Pastor [Name]",
    date: "2025-06-25",
    duration: "42:22",
    views: "740",
    category: "Bible Study",
  },
  {
    id: "v7",
    title: "Excellence in Ministry",
    speaker: "Guest Speaker",
    date: "2025-06-22",
    duration: "1:05:30",
    views: "1.8K",
    category: "Special Programme",
  },
  {
    id: "v8",
    title: "Building Strong Families",
    speaker: "Pastor [Name]",
    date: "2025-06-20",
    duration: "38:45",
    views: "650",
    category: "Faith Clinic",
  },
  {
    id: "v9",
    title: "Faith for the Impossible",
    speaker: "Pastor [Name]",
    date: "2025-06-15",
    duration: "50:10",
    views: "1.1K",
    category: "Sunday Service",
  },
];

const categories = ["All", "Sunday Service", "Bible Study", "Faith Clinic", "Special Programme"];

export function VideoGallery() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [selectedVideo, setSelectedVideo] = useState<Video | null>(null);

  const filtered = mockVideos.filter((v) => {
    const matchSearch =
      v.title.toLowerCase().includes(search.toLowerCase()) ||
      v.speaker.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "All" || v.category === category;
    return matchSearch && matchCat;
  });

  return (
    <div className="space-y-6">
      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center justify-between">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
          <Input
            placeholder="Search videos..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 rounded-xl border-gray-200 bg-white h-10 focus:border-[#4A148C]/30"
          />
        </div>

        {/* Category pills */}
        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setCategory(cat)}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                category === cat
                  ? "bg-[#4A148C] text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Video Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((video, i) => (
          <motion.div
            key={video.id}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-40px" }}
            transition={{ duration: 0.4, delay: i * 0.05 }}
            onClick={() => setSelectedVideo(video)}
            className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gradient-to-br from-[#1A0033] to-[#6A1B9A] overflow-hidden">
              <div className="absolute inset-0 flex items-center justify-center">
                <Play className="size-12 text-white/30 group-hover:text-white/60 transition-colors" />
              </div>
              {/* Duration badge */}
              <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] px-2 py-0.5 rounded-md font-medium">
                {video.duration}
              </span>
              {/* Category tag */}
              <span className="absolute top-2 left-2 bg-[#4A148C]/80 text-white text-[10px] px-2 py-0.5 rounded-md font-medium">
                {video.category}
              </span>
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
            </div>

            {/* Info */}
            <div className="p-4">
              <h3 className="text-sm font-bold text-[#4A148C] leading-tight line-clamp-2 mb-2">
                {video.title}
              </h3>
              <p className="text-xs text-gray-500 mb-2">{video.speaker}</p>
              <div className="flex items-center gap-3 text-[11px] text-gray-400">
                <span className="flex items-center gap-1">
                  <Eye className="size-3" />
                  {video.views}
                </span>
                <span>{new Date(video.date).toLocaleDateString("en-NG", { month: "short", day: "numeric", year: "numeric" })}</span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Video Player Modal */}
      <AnimatePresence>
        {selectedVideo && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center p-4"
          >
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedVideo(null)} />
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="relative bg-[#1A0033] rounded-2xl overflow-hidden w-full max-w-4xl shadow-2xl"
            >
              {/* Player area */}
              <div className="aspect-video flex items-center justify-center">
                <div className="text-center text-white/60">
                  <Play className="size-16 text-white/30 mx-auto mb-3" />
                  <p className="text-sm">Video player will be embedded here</p>
                </div>
              </div>
              {/* Info bar */}
              <div className="p-5 bg-white">
                <h3 className="text-lg font-bold text-[#4A148C]">{selectedVideo.title}</h3>
                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                  <span>{selectedVideo.speaker}</span>
                  <span className="flex items-center gap-1"><Clock className="size-3.5" />{selectedVideo.duration}</span>
                  <span className="flex items-center gap-1"><Eye className="size-3.5" />{selectedVideo.views} views</span>
                </div>
              </div>
              {/* Close */}
              <button
                onClick={() => setSelectedVideo(null)}
                className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors"
              >
                <X className="size-5" />
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
