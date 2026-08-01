"use client";

import { motion } from "framer-motion";
import { Calendar, BookOpen, ArrowRight } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { type Devotional, categoryConfig } from "./devotionals-data";

interface DevotionalCardProps {
  devotional: Devotional;
  index?: number;
  onClick?: (devotional: Devotional) => void;
  variant?: "default" | "featured" | "compact";
}

export function DevotionalCard({
  devotional,
  index = 0,
  onClick,
  variant = "default",
}: DevotionalCardProps) {
  const cat = categoryConfig[devotional.category];
  const dateObj = new Date(devotional.date + "T00:00:00");
  const formattedDate = dateObj.toLocaleDateString("en-NG", {
    weekday: "short",
    month: "short",
    day: "numeric",
  });
  const bodyPreview = devotional.body.split("\n")[0];

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: index * 0.04 }}
        className="flex items-center gap-3 p-3 rounded-xl hover:bg-white/80 transition-colors cursor-pointer group"
        onClick={() => onClick?.(devotional)}
      >
        <div className="w-10 h-10 rounded-lg bg-[#F3E5F5] flex flex-col items-center justify-center shrink-0">
          <span className="text-sm font-bold text-[#4A148C] leading-none">
            {dateObj.getDate()}
          </span>
          <span className="text-[9px] text-gray-400 leading-none">
            {dateObj.toLocaleDateString("en-NG", { month: "short" })}
          </span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-[#4A148C] transition-colors">
            {devotional.title}
          </p>
          <p className="text-xs text-gray-400 truncate">
            {devotional.bibleVerse} &middot; {devotional.author}
          </p>
        </div>
        <Badge
          className={`${cat.bg} ${cat.text} border-0 text-[9px] px-2 py-0.5 shrink-0`}
        >
          {cat.label}
        </Badge>
      </motion.div>
    );
  }

  if (variant === "featured") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 overflow-hidden cursor-pointer group"
        onClick={() => onClick?.(devotional)}
      >
        <div className="h-2 bg-gradient-to-r from-[#4A148C] to-[#7B1FA2]" />
        <div className="p-6 md:p-8">
          <div className="flex items-center gap-2 mb-3">
            <Badge
              className={`${cat.bg} ${cat.text} border-0 text-[10px] font-semibold uppercase tracking-wider`}
            >
              {cat.label}
            </Badge>
            <span className="text-xs text-gray-400 flex items-center gap-1">
              <Calendar className="size-3" />
              {formattedDate}
            </span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-[#4A148C] mb-2 group-hover:text-[#6A1B9A] transition-colors">
            {devotional.title}
          </h3>

          <div className="flex items-center gap-2 mb-4 text-sm text-[#D32F2F] font-medium">
            <BookOpen className="size-4" />
            {devotional.bibleVerse}
          </div>

          <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">
            {bodyPreview}
          </p>

          <div className="flex items-center justify-between pt-4 border-t border-gray-50">
            <span className="text-sm font-medium text-gray-600">
              {devotional.author}
            </span>
            <span className="text-sm font-semibold text-[#4A148C] flex items-center gap-1 group-hover:gap-2 transition-all">
              Read More
              <ArrowRight className="size-4" />
            </span>
          </div>
        </div>
      </motion.div>
    );
  }

  // Default variant
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all cursor-pointer group"
      onClick={() => onClick?.(devotional)}
    >
      <div className="h-1.5 bg-gradient-to-r from-[#4A148C] to-[#7B1FA2]" />
      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Badge
            className={`${cat.bg} ${cat.text} border-0 text-[10px] font-semibold uppercase tracking-wider`}
          >
            {cat.label}
          </Badge>
          <span className="text-xs text-gray-400 flex items-center gap-1">
            <Calendar className="size-3" />
            {formattedDate}
          </span>
        </div>

        <h3 className="text-base font-bold text-gray-800 mb-2 group-hover:text-[#4A148C] transition-colors leading-snug">
          {devotional.title}
        </h3>

        <div className="flex items-center gap-1.5 mb-3 text-xs text-[#D32F2F] font-medium">
          <BookOpen className="size-3" />
          {devotional.bibleVerse}
        </div>

        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
          {bodyPreview}
        </p>

        <div className="flex items-center justify-between pt-3 border-t border-gray-50">
          <span className="text-xs font-medium text-gray-500">
            {devotional.author}
          </span>
          <span className="text-xs font-semibold text-[#4A148C] flex items-center gap-1 group-hover:gap-1.5 transition-all">
            Read More
            <ArrowRight className="size-3.5" />
          </span>
        </div>
      </div>
    </motion.div>
  );
}