"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Heart, Share2, Calendar, Quote } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  categoryColors,
  categoryLabels,
  type Testimony,
} from "./testimonies-data";

interface TestimonyCardProps {
  testimony: Testimony;
  index: number;
  variant?: "default" | "featured";
}

export function TestimonyCard({
  testimony,
  index,
  variant = "default",
}: TestimonyCardProps) {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(testimony.likes);

  const colors = categoryColors[testimony.category];

  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr + "T00:00:00");
    return d.toLocaleDateString("en-NG", {
      day: "numeric",
      month: "short",
      year: "numeric",
    });
  };

  const handleLike = () => {
    if (!liked) {
      setLiked(true);
      setLikeCount((prev) => prev + 1);
    } else {
      setLiked(false);
      setLikeCount((prev) => prev - 1);
    }
  };

  const displayName = testimony.isAnonymous
    ? "Anonymous"
    : testimony.name;

  const avatarBgColors = [
    "bg-[#4A148C]",
    "bg-[#D32F2F]",
    "bg-[#2E7D32]",
    "bg-[#C62828]",
    "bg-[#4A148C]",
    "bg-[#006064]",
    "bg-[#B71C1C]",
    "bg-[#1B5E20]",
  ];

  const avatarColor =
    avatarBgColors[
      testimony.name.charCodeAt(0) % avatarBgColors.length
    ];

  if (variant === "featured") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, delay: index * 0.1 }}
        className="relative rounded-2xl overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#1A0033] via-[#4A148C] to-[#6A1B9A]" />
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 right-0 w-72 h-72 bg-[#D32F2F] rounded-full blur-[100px] -translate-y-1/2 translate-x-1/3" />
          <div className="absolute bottom-0 left-0 w-56 h-56 bg-purple-400/30 rounded-full blur-[100px] translate-y-1/2" />
        </div>

        <div className="relative z-10 p-6 md:p-10">
          <div className="flex items-center gap-2 mb-5">
            <Badge
              className={`${colors.bg} ${colors.text} border-0 text-[10px] font-semibold uppercase tracking-wider`}
            >
              {categoryLabels[testimony.category]}
            </Badge>
            <span className="text-[11px] text-purple-200/60">
              Featured Testimony
            </span>
          </div>

          <div className="flex items-center gap-3 mb-5">
            <div
              className={`w-11 h-11 rounded-full ${avatarColor} flex items-center justify-center`}
            >
              <span className="text-sm font-bold text-white">
                {testimony.avatarInitials}
              </span>
            </div>
            <div>
              <p className="text-sm font-semibold text-white">
                {displayName}
              </p>
              <p className="text-xs text-purple-200/60 flex items-center gap-1">
                <Calendar className="size-3" />
                {formatDate(testimony.date)}
              </p>
            </div>
          </div>

          <Quote className="size-8 text-white/20 mb-2" />
          <h3 className="text-xl md:text-2xl font-bold text-white mb-3 leading-snug">
            {testimony.title}
          </h3>
          <p className="text-sm md:text-base text-purple-100/80 leading-relaxed mb-6">
            {testimony.body}
          </p>

          <div className="flex items-center gap-4 pt-5 border-t border-white/10">
            <button
              onClick={handleLike}
              className="flex items-center gap-1.5 group"
            >
              <motion.div
                whileTap={{ scale: 1.3 }}
                transition={{ type: "spring", stiffness: 400, damping: 10 }}
              >
                <Heart
                  className={`size-5 transition-colors ${
                    liked
                      ? "text-red-400 fill-red-400"
                      : "text-white/40 group-hover:text-red-300"
                  }`}
                />
              </motion.div>
              <span
                className={`text-sm font-medium ${
                  liked ? "text-red-300" : "text-white/50"
                }`}
              >
                {likeCount}
              </span>
            </button>
            <button className="flex items-center gap-1.5 group">
              <Share2 className="size-4 text-white/40 group-hover:text-white/70 transition-colors" />
              <span className="text-sm text-white/50 group-hover:text-white/70 transition-colors">
                Share
              </span>
            </button>
          </div>

          {testimony.tags.length > 0 && (
            <div className="flex flex-wrap gap-1.5 mt-5">
              {testimony.tags.map((tag) => (
                <span
                  key={tag}
                  className="text-[10px] text-purple-200/50 bg-white/5 px-2.5 py-0.5 rounded-full"
                >
                  #{tag}
                </span>
              ))}
            </div>
          )}
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.4, delay: index * 0.05 }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm hover:shadow-md hover:border-gray-200 transition-all group flex flex-col"
    >
      <div className="p-5 flex-1 flex flex-col">
        <div className="flex items-center justify-between mb-3">
          <Badge
            className={`${colors.bg} ${colors.text} border-0 text-[10px] font-semibold uppercase tracking-wider`}
          >
            {categoryLabels[testimony.category]}
          </Badge>
          <span className="text-[11px] text-gray-400 flex items-center gap-1">
            <Calendar className="size-3" />
            {formatDate(testimony.date)}
          </span>
        </div>

        <div className="flex items-center gap-2.5 mb-3">
          <div
            className={`w-8 h-8 rounded-full ${avatarColor} flex items-center justify-center shrink-0`}
          >
            <span className="text-xs font-bold text-white">
              {testimony.avatarInitials}
            </span>
          </div>
          <p className="text-sm font-semibold text-gray-700 truncate">
            {displayName}
          </p>
        </div>

        <h3 className="text-base font-bold text-gray-800 mb-2 leading-snug group-hover:text-[#4A148C] transition-colors">
          {testimony.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-4 mb-4 flex-1">
          {testimony.body}
        </p>

        {testimony.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 mb-4">
            {testimony.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full"
              >
                #{tag}
              </span>
            ))}
            {testimony.tags.length > 3 && (
              <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-full">
                +{testimony.tags.length - 3}
              </span>
            )}
          </div>
        )}

        <div className="flex items-center gap-4 pt-3 border-t border-gray-50">
          <button
            onClick={handleLike}
            className="flex items-center gap-1.5 group/btn"
          >
            <motion.div
              whileTap={{ scale: 1.3 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <Heart
                className={`size-4 transition-colors ${
                  liked
                    ? "text-red-500 fill-red-500"
                    : "text-gray-400 group-hover/btn:text-red-400"
                }`}
              />
            </motion.div>
            <span
              className={`text-xs font-medium ${
                liked ? "text-red-500" : "text-gray-400"
              }`}
            >
              {likeCount}
            </span>
          </button>
          <button className="flex items-center gap-1.5 group/btn">
            <Share2 className="size-3.5 text-gray-400 group-hover/btn:text-gray-600 transition-colors" />
            <span className="text-xs text-gray-400 group-hover/btn:text-gray-600 transition-colors">
              Share
            </span>
          </button>
        </div>
      </div>
    </motion.div>
  );
}