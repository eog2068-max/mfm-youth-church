"use client";

import { motion } from "framer-motion";
import { Play, Clock, Eye } from "lucide-react";
import type { Video, Series } from "./video-data";

interface VideoCardProps {
  video: Video;
  index: number;
  series?: Series;
  onPlay: (video: Video) => void;
}

export function VideoCard({ video, index, series, onPlay }: VideoCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      onClick={() => onPlay(video)}
      className="group cursor-pointer bg-white rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border border-gray-100"
    >
      {/* Thumbnail */}
      <div className="relative aspect-video bg-gradient-to-br from-[#1A0033] to-[#6A1B9A] overflow-hidden">
        <div className="absolute inset-0 flex items-center justify-center">
          <Play className="size-10 text-white/25 group-hover:text-white/50 transition-colors" />
        </div>

        {/* Duration badge */}
        <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[11px] px-2 py-0.5 rounded-md font-medium">
          {video.duration}
        </span>

        {/* Series tag */}
        {series && (
          <span className="absolute top-2 left-2 bg-white/90 text-[#4A148C] text-[10px] px-2 py-0.5 rounded-md font-semibold">
            {series.name}
          </span>
        )}

        {/* Category tag (if no series) */}
        {!series && (
          <span className="absolute top-2 left-2 bg-white/90 text-[#4A148C] text-[10px] px-2 py-0.5 rounded-md font-medium">
            {video.category}
          </span>
        )}

        {/* Hover overlay */}
        <div className="absolute inset-0 bg-white/0 group-hover:bg-white/10 transition-colors duration-300" />
      </div>

      {/* Info */}
      <div className="p-4">
        <h3 className="text-sm font-bold text-[#4A148C] leading-tight line-clamp-2 mb-1.5 group-hover:text-[#1A0033] transition-colors">
          {video.title}
        </h3>
        <p className="text-xs text-gray-500 mb-2">{video.speaker}</p>
        <div className="flex items-center gap-3 text-[11px] text-gray-400">
          <span className="flex items-center gap-1">
            <Eye className="size-3" />
            {video.views}
          </span>
          <span>
            {new Date(video.date).toLocaleDateString("en-NG", { month: "short", day: "numeric" })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {video.duration}
          </span>
        </div>
      </div>
    </motion.div>
  );
}

interface SeriesCardProps {
  series: Series;
  index: number;
  onClick: (series: Series) => void;
  isActive: boolean;
}

export function SeriesCard({ series, index, onClick, isActive }: SeriesCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.06 }}
      onClick={() => onClick(series)}
      className={`cursor-pointer rounded-2xl overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 border-2 ${
        isActive ? "border-[#4A148C] shadow-md" : "border-transparent"
      }`}
    >
      <div className={`relative h-36 bg-gradient-to-br ${series.coverGradient} p-5 flex flex-col justify-between`}>
        <h3 className="text-white font-bold text-lg leading-tight">{series.name}</h3>
        <div className="flex items-center justify-between">
          <p className="text-white/70 text-xs line-clamp-1 max-w-[70%]">{series.description}</p>
          <span className="bg-white/20 text-white text-[11px] px-2.5 py-1 rounded-lg font-semibold backdrop-blur-sm shrink-0 ml-3">
            {series.videoCount} videos
          </span>
        </div>
      </div>
    </motion.div>
  );
}