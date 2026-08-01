"use client";

import { motion } from "framer-motion";
import { Camera, ArrowRight } from "lucide-react";
import type { Album } from "./gallery-data";

interface AlbumCardProps {
  album: Album;
  index: number;
  onClick: (album: Album) => void;
}

export function AlbumCard({ album, index, onClick }: AlbumCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.5, delay: index * 0.07, ease: "easeOut" }}
      onClick={() => onClick(album)}
      className="group cursor-pointer"
    >
      <div className="relative rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
        {/* Cover image area */}
        <div className="relative aspect-[4/3] bg-gradient-to-br from-[#E8EDFF] via-[#F3E5F5] to-[#EBF0FA] overflow-hidden">
          <div className="absolute inset-0 flex items-center justify-center">
            <Camera className="size-12 text-[#4A148C]/10" />
          </div>

          {/* Category tag */}
          <span className="absolute top-3 left-3 bg-white/90 text-[#4A148C] text-[11px] px-2.5 py-1 rounded-lg font-semibold backdrop-blur-sm">
            {album.category}
          </span>

          {/* Photo count badge */}
          <span className="absolute top-3 right-3 bg-[#4A148C]/90 text-white text-[11px] px-2.5 py-1 rounded-lg font-semibold backdrop-blur-sm">
            {album.photoCount} photos
          </span>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-end p-5">
            <span className="flex items-center gap-1.5 text-white text-sm font-semibold">
              View Album
              <ArrowRight className="size-4 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>

        {/* Info */}
        <div className="p-5">
          <h3 className="text-base font-bold text-[#4A148C] leading-tight group-hover:text-[#1A0033] transition-colors">
            {album.name}
          </h3>
          <p className="mt-1.5 text-sm text-gray-500 leading-relaxed line-clamp-2">
            {album.description}
          </p>
          <p className="mt-2.5 text-xs text-gray-400">
            {new Date(album.date).toLocaleDateString("en-NG", { month: "long", day: "numeric", year: "numeric" })}
          </p>
        </div>
      </div>
    </motion.div>
  );
}