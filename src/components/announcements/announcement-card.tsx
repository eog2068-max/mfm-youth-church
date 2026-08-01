"use client";

import { motion } from "framer-motion";
import {
  Pin,
  Paperclip,
  Calendar,
  User,
  Tag,
  AlertTriangle,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
  categoryColors,
  categoryLabels,
  priorityConfig,
  type Announcement,
} from "./announcements-data";

interface AnnouncementCardProps {
  announcement: Announcement;
  index: number;
  variant?: "default" | "featured" | "compact";
}

function formatDate(dateStr: string): string {
  const d = new Date(dateStr + "T00:00:00");
  return d.toLocaleDateString("en-NG", {
    day: "numeric",
    month: "short",
    year: "numeric",
  });
}

export function AnnouncementCard({
  announcement,
  index,
  variant = "default",
}: AnnouncementCardProps) {
  const a = announcement;
  const cat = categoryColors[a.category];
  const pri = priorityConfig[a.priority];

  if (variant === "featured") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 overflow-hidden"
      >
        <div className="h-1.5 bg-gradient-to-r from-[#4A148C] via-[#7B1FA2] to-[#9C27B0]" />
        <div className="flex flex-col md:flex-row">
          <div className="flex-1 p-6 md:p-8">
            <div className="flex flex-wrap items-center gap-2 mb-3">
              {a.isPinned && (
                <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#D32F2F] bg-red-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                  <Pin className="size-3" />
                  Pinned
                </span>
              )}
              <Badge
                className={`${cat.bg} ${cat.text} border-0 text-[10px] font-semibold uppercase tracking-wider`}
              >
                {categoryLabels[a.category]}
              </Badge>
              <Badge
                className={`${pri.bg} ${pri.text} border-0 text-[10px] font-semibold`}
              >
                {a.priority === "urgent" && (
                  <AlertTriangle className="size-3 mr-0.5" />
                )}
                {pri.label}
              </Badge>
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-[#4A148C] mb-3 leading-snug">
              {a.title}
            </h3>
            <p className="text-sm text-gray-600 leading-relaxed mb-4 line-clamp-4">
              {a.body}
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-400 mb-4">
              <span className="flex items-center gap-1.5">
                <Calendar className="size-3.5" />
                {formatDate(a.date)}
              </span>
              <span className="flex items-center gap-1.5">
                <User className="size-3.5" />
                {a.author}
              </span>
              {a.attachments.length > 0 && (
                <span className="flex items-center gap-1.5">
                  <Paperclip className="size-3.5" />
                  {a.attachments.length} attachment
                  {a.attachments.length > 1 ? "s" : ""}
                </span>
              )}
            </div>

            {a.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5">
                {a.tags.map((tag) => (
                  <span
                    key={tag}
                    className="inline-flex items-center gap-1 text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md"
                  >
                    <Tag className="size-2.5" />
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>
      </motion.div>
    );
  }

  if (variant === "compact") {
    return (
      <motion.div
        initial={{ opacity: 0, x: -8 }}
        whileInView={{ opacity: 1, x: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.3, delay: index * 0.04 }}
        className="flex items-start gap-4 p-4 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group border-b border-gray-50 last:border-0"
      >
        <div
          className={`w-1 h-full min-h-[3rem] rounded-full shrink-0 ${pri.dot}`}
        />
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            {a.isPinned && <Pin className="size-3 text-[#D32F2F] shrink-0" />}
            <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-[#4A148C] transition-colors">
              {a.title}
            </p>
          </div>
          <div className="flex items-center gap-3 text-xs text-gray-400">
            <span>{formatDate(a.date)}</span>
            <span>{a.author}</span>
            {a.attachments.length > 0 && (
              <span className="inline-flex items-center gap-0.5">
                <Paperclip className="size-3" />
                {a.attachments.length}
              </span>
            )}
          </div>
        </div>
        <Badge
          className={`${cat.bg} ${cat.text} border-0 text-[9px] px-2 py-0.5 shrink-0`}
        >
          {categoryLabels[a.category]}
        </Badge>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className={`bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-gray-200 transition-all group border-l-4 ${pri.border}`}
    >
      <div className="p-5">
        <div className="flex flex-wrap items-center gap-2 mb-3">
          {a.isPinned && (
            <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-[#D32F2F] bg-red-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
              <Pin className="size-3" />
              Pinned
            </span>
          )}
          <Badge
            className={`${cat.bg} ${cat.text} border-0 text-[10px] font-semibold uppercase tracking-wider`}
          >
            {categoryLabels[a.category]}
          </Badge>
          <Badge
            className={`${pri.bg} ${pri.text} border-0 text-[10px] font-semibold`}
          >
            {a.priority === "urgent" && (
              <AlertTriangle className="size-3 mr-0.5" />
            )}
            {pri.label}
          </Badge>
        </div>

        <h3 className="text-base font-bold text-gray-800 mb-2 group-hover:text-[#4A148C] transition-colors leading-snug">
          {a.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-3 mb-4">
          {a.body}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400 mb-3">
          <span className="flex items-center gap-1.5 font-medium text-gray-500">
            <Calendar className="size-3.5 text-[#D32F2F]" />
            {formatDate(a.date)}
          </span>
          <span className="flex items-center gap-1.5">
            <User className="size-3.5" />
            {a.author}
          </span>
          {a.attachments.length > 0 && (
            <span className="flex items-center gap-1.5">
              <Paperclip className="size-3.5" />
              {a.attachments.length} attachment
              {a.attachments.length > 1 ? "s" : ""}
            </span>
          )}
        </div>

        {a.tags.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-3 border-t border-gray-50">
            {a.tags.slice(0, 3).map((tag) => (
              <span
                key={tag}
                className="inline-flex items-center gap-1 text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md"
              >
                <Tag className="size-2.5" />
                {tag}
              </span>
            ))}
            {a.tags.length > 3 && (
              <span className="text-[10px] text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md">
                +{a.tags.length - 3} more
              </span>
            )}
          </div>
        )}
      </div>
    </motion.div>
  );
}
