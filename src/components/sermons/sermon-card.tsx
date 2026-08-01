"use client";

import { motion } from "framer-motion";
import { Play, Headphones, FileText, Clock, Calendar, User, BookOpen, CheckCircle2 } from "lucide-react";
import type { Sermon, SermonSeries } from "./sermon-data";

interface SermonCardProps {
  sermon: Sermon;
  index: number;
  series?: SermonSeries;
  onOpen: (sermon: Sermon) => void;
  activeId?: string;
}

export function SermonCard({ sermon, index, series, onOpen, activeId }: SermonCardProps) {
  const isActive = activeId === sermon.id;

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.04 }}
      onClick={() => onOpen(sermon)}
      className={`group bg-white rounded-xl border shadow-sm overflow-hidden cursor-pointer transition-all duration-200 hover:shadow-md ${
        isActive
          ? "border-[#4A148C]/30 shadow-md ring-1 ring-[#4A148C]/10"
          : "border-gray-100 hover:border-gray-200"
      }`}
    >
      <div className="p-4 md:p-5">
        {/* Top row: category + format badges */}
        <div className="flex items-center gap-2 mb-3">
          <span className="inline-flex text-[10px] font-semibold uppercase tracking-wider text-[#4A148C] bg-[#F3E5F5] px-2 py-0.5 rounded-md">
            {sermon.category}
          </span>
          <div className="flex items-center gap-1.5">
            {sermon.hasAudio && (
              <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">
                <Headphones className="size-2.5" />
                Audio
              </span>
            )}
            {sermon.hasVideo && (
              <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">
                <Play className="size-2.5" />
                Video
              </span>
            )}
            {sermon.hasNotes && (
              <span className="inline-flex items-center gap-1 text-[10px] text-gray-500 bg-gray-50 px-1.5 py-0.5 rounded">
                <FileText className="size-2.5" />
                Notes
              </span>
            )}
          </div>
        </div>

        {/* Title */}
        <h3 className={`text-base font-bold mb-2 leading-snug transition-colors ${
          isActive ? "text-[#4A148C]" : "text-gray-800 group-hover:text-[#4A148C]"
        }`}>
          {sermon.title}
        </h3>

        {/* Meta row */}
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-xs text-gray-500 mb-3">
          <span className="flex items-center gap-1">
            <User className="size-3" />
            {sermon.speaker}
          </span>
          <span className="flex items-center gap-1">
            <Calendar className="size-3" />
            {new Date(sermon.date).toLocaleDateString("en-NG", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="size-3" />
            {sermon.duration}
          </span>
        </div>

        {/* Description */}
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">
          {sermon.description}
        </p>

        {/* Scriptures */}
        {sermon.scriptures.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-3">
            {sermon.scriptures.slice(0, 3).map((scripture) => (
              <span
                key={scripture}
                className="inline-flex items-center text-[10px] font-medium text-[#4A148C]/70 bg-[#F8FAFF] px-2 py-0.5 rounded-md border border-[#4A148C]/5"
              >
                <BookOpen className="size-2.5 mr-1" />
                {scripture}
              </span>
            ))}
            {sermon.scriptures.length > 3 && (
              <span className="text-[10px] text-gray-400 px-1 py-0.5">
                +{sermon.scriptures.length - 3} more
              </span>
            )}
          </div>
        )}

        {/* Bottom: Series tag + action */}
        <div className="flex items-center justify-between pt-2 border-t border-gray-50">
          {series && (
            <span className="text-[11px] text-gray-400 font-medium truncate mr-2">
              {series.name}
            </span>
          )}
          {!series && <span />}
          <div className="flex items-center gap-2 shrink-0">
            {sermon.hasNotes && (
              <span className="inline-flex items-center gap-1 text-[11px] font-medium text-[#2E7D32]">
                <CheckCircle2 className="size-3" />
                Notes
              </span>
            )}
            {sermon.hasAudio && (
              <div className="w-8 h-8 rounded-full bg-[#4A148C]/8 flex items-center justify-center group-hover:bg-[#4A148C] transition-colors">
                <Headphones className="size-3.5 text-[#4A148C] group-hover:text-white transition-colors" />
              </div>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}