"use client";

import { motion } from "framer-motion";
import { Play, Headphones, FileText, Calendar, User, Clock, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Sermon } from "./sermon-data";

interface FeaturedSermonProps {
  sermon: Sermon;
  onPlay: (sermon: Sermon) => void;
}

export function FeaturedSermon({ sermon, onPlay }: FeaturedSermonProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6 }}
      className="bg-white rounded-2xl shadow-lg shadow-black/5 overflow-hidden border border-gray-100"
    >
      <div className="flex flex-col lg:flex-row">
        {/* Left: Visual / Player area */}
        <div className="relative lg:w-[420px] shrink-0">
          <div className="aspect-video lg:aspect-auto lg:h-full bg-gradient-to-br from-[#4A148C] via-[#6A1B9A] to-[#7B1FA2] flex items-center justify-center">
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-10 left-10 w-40 h-40 bg-white rounded-full blur-[60px]" />
              <div className="absolute bottom-10 right-10 w-32 h-32 bg-[#D32F2F] rounded-full blur-[60px]" />
            </div>
            <div className="relative z-10 text-center px-6">
              <div className="w-20 h-20 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center mx-auto mb-4 cursor-pointer hover:bg-white/25 transition-colors group">
                <Play className="size-9 text-white fill-white ml-1 group-hover:scale-110 transition-transform" />
              </div>
              <span className="inline-flex items-center gap-1.5 bg-white/15 backdrop-blur-sm text-white text-xs font-medium px-3 py-1.5 rounded-full">
                <span className="w-2 h-2 rounded-full bg-red-400 animate-pulse" />
                Latest Sermon
              </span>
            </div>
          </div>
        </div>

        {/* Right: Content */}
        <div className="p-6 md:p-8 lg:p-10 flex flex-col justify-center flex-1">
          {/* Series badge */}
          {sermon.seriesId && (
            <span className="inline-flex items-center self-start text-[11px] font-semibold uppercase tracking-wider text-[#D32F2F] bg-red-50 px-3 py-1 rounded-full mb-3">
              <BookOpen className="size-3 mr-1.5" />
              {sermon.tags[0]}
            </span>
          )}

          <h2 className="text-2xl md:text-3xl font-bold text-[#4A148C] mb-3 leading-tight">
            {sermon.title}
          </h2>

          {/* Meta */}
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-500 mb-4">
            <span className="flex items-center gap-1.5">
              <User className="size-3.5" />
              {sermon.speaker}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              {new Date(sermon.date).toLocaleDateString("en-NG", {
                weekday: "short",
                year: "numeric",
                month: "short",
                day: "numeric",
              })}
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-3.5" />
              {sermon.duration}
            </span>
          </div>

          {/* Description */}
          <p className="text-gray-600 text-sm md:text-base leading-relaxed mb-5 line-clamp-3">
            {sermon.description}
          </p>

          {/* Scripture references */}
          {sermon.scriptures.length > 0 && (
            <div className="flex flex-wrap gap-2 mb-6">
              {sermon.scriptures.map((scripture) => (
                <span
                  key={scripture}
                  className="inline-flex items-center text-xs font-medium text-[#4A148C] bg-[#F3E5F5] px-2.5 py-1 rounded-lg"
                >
                  <BookOpen className="size-3 mr-1.5 text-[#4A148C]/60" />
                  {scripture}
                </span>
              ))}
            </div>
          )}

          {/* Action buttons */}
          <div className="flex flex-wrap gap-3">
            {sermon.hasVideo && (
              <Button
                onClick={() => onPlay(sermon)}
                className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-xl h-11 px-6 font-semibold shadow-md"
              >
                <Play className="size-4 fill-white" />
                Watch Video
              </Button>
            )}
            {sermon.hasAudio && (
              <Button
                onClick={() => onPlay(sermon)}
                variant="outline"
                className="border-[#4A148C]/20 text-[#4A148C] hover:bg-[#F3E5F5] hover:text-[#4A148C] rounded-xl h-11 px-6 font-semibold"
              >
                <Headphones className="size-4" />
                Listen Audio
              </Button>
            )}
            {sermon.hasNotes && (
              <Button
                onClick={() => onPlay(sermon)}
                variant="outline"
                className="border-gray-200 text-gray-600 hover:bg-gray-50 hover:text-gray-800 rounded-xl h-11 px-6 font-semibold"
              >
                <FileText className="size-4" />
                Read Notes
              </Button>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}