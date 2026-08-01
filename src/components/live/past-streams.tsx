"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Play, Clock, Eye, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { pastStreams } from "./live-data";

export function PastStreams() {
  return (
    <div>
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-lg font-bold text-[#4A148C]">Recent Service Replays</h3>
        <Link
          href="/videos"
          className="text-sm text-[#4A148C] hover:text-[#1A0033] font-medium transition-colors"
        >
          View All Videos
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {pastStreams.map((stream, i) => (
          <motion.div
            key={stream.id}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.3, delay: i * 0.06 }}
            className="group bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-gray-200 transition-all cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="relative aspect-video bg-gradient-to-br from-[#1A0033] to-[#4A148C] flex items-center justify-center">
              <div className="absolute inset-0 opacity-5">
                <div className="absolute top-4 right-4 w-20 h-20 bg-white rounded-full blur-[40px]" />
              </div>
              <div className="w-12 h-12 rounded-full bg-white/15 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/25 group-hover:scale-110 transition-all">
                <Play className="size-5 text-white fill-white ml-0.5" />
              </div>
              <span className="absolute bottom-2 right-2 bg-black/50 text-white text-[11px] px-2 py-0.5 rounded-md font-medium">
                {stream.duration}
              </span>
              <Badge className="absolute top-2 left-2 bg-black/30 text-white/90 border-0 text-[10px] px-2 py-0.5 backdrop-blur-sm">
                {stream.type}
              </Badge>
            </div>

            {/* Content */}
            <div className="p-4">
              <h4 className="text-sm font-bold text-gray-800 mb-2 line-clamp-2 group-hover:text-[#4A148C] transition-colors leading-snug">
                {stream.title}
              </h4>
              <div className="flex items-center gap-3 text-xs text-gray-400">
                <span className="flex items-center gap-1">
                  <Calendar className="size-3" />
                  {new Date(stream.date).toLocaleDateString("en-NG", {
                    month: "short",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="size-3" />
                  {stream.views} views
                </span>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}