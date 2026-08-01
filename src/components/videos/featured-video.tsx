"use client";

import { motion } from "framer-motion";
import { Play, Clock, Eye, Calendar } from "lucide-react";
import type { Video } from "./video-data";

interface FeaturedVideoProps {
  video: Video;
  onPlay: (video: Video) => void;
}

export function FeaturedVideo({ video, onPlay }: FeaturedVideoProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="relative w-full aspect-video md:aspect-[21/9] rounded-2xl overflow-hidden shadow-xl cursor-pointer group"
      onClick={() => onPlay(video)}
    >
      {/* Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A0033] via-[#4A148C] to-[#6A1B9A]" />

      {/* Decorative elements */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-[#D32F2F]/10 rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
      <div className="absolute bottom-0 left-0 w-80 h-80 bg-purple-400/10 rounded-full blur-[80px] translate-y-1/2 -translate-x-1/3" />

      {/* Content overlay */}
      <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-10 bg-gradient-to-t from-black/70 via-black/20 to-transparent">
        {/* Featured badge */}
        <div className="mb-3">
          <span className="inline-flex items-center px-3 py-1 rounded-lg bg-[#D32F2F] text-white text-xs font-bold uppercase tracking-wider">
            Featured
          </span>
        </div>

        {/* Title */}
        <h2 className="text-2xl md:text-4xl font-bold text-white leading-tight max-w-2xl">
          {video.title}
        </h2>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 mt-3 text-sm text-white/70">
          <span>{video.speaker}</span>
          <span className="flex items-center gap-1">
            <Calendar className="size-3.5" />
            {new Date(video.date).toLocaleDateString("en-NG", { month: "long", day: "numeric", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3.5" />
            {video.duration}
          </span>
          <span className="flex items-center gap-1">
            <Eye className="size-3.5" />
            {video.views} views
          </span>
        </div>

        {/* Play button */}
        <div className="mt-4">
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="inline-flex items-center gap-2 px-6 py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-xl text-white font-semibold text-sm transition-colors"
          >
            <Play className="size-5 fill-white" />
            Watch Now
          </motion.div>
        </div>
      </div>

      {/* Central play icon */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
        <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/20 transition-colors">
          <Play className="size-8 md:size-10 text-white ml-1" />
        </div>
      </div>
    </motion.div>
  );
}