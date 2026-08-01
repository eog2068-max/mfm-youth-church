"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Clock,
  Eye,
  Calendar,
  List,
  Share2,
  ThumbsUp,
  Volume2,
} from "lucide-react";
import type { Video } from "./video-data";

interface VideoPlayerModalProps {
  videos: Video[];
  initialVideo: Video;
  onClose: () => void;
}

export function VideoPlayerModal({ videos, initialVideo, onClose }: VideoPlayerModalProps) {
  const [currentVideo, setCurrentVideo] = useState<Video>(initialVideo);
  const [showPlaylist, setShowPlaylist] = useState(true);
  const [liked, setLiked] = useState(false);

  const currentIndex = videos.findIndex((v) => v.id === currentVideo.id);

  const goNext = useCallback(() => {
    if (currentIndex < videos.length - 1) {
      setCurrentVideo(videos[currentIndex + 1]);
    }
  }, [currentIndex, videos]);

  const goPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentVideo(videos[currentIndex - 1]);
    }
  }, [currentIndex, videos]);

  // Keyboard nav
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "Escape") onClose();
      else if (e.key === "p") setShowPlaylist((s) => !s);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, onClose]);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] flex items-center justify-center p-3 md:p-6"
      >
        {/* Backdrop */}
        <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose} />

        {/* Modal container */}
        <motion.div
          initial={{ scale: 0.95, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.95, opacity: 0 }}
          className="relative z-10 w-full max-w-6xl bg-[#0A0A1A] rounded-2xl overflow-hidden shadow-2xl flex flex-col max-h-[95vh]"
        >
          {/* Video Player Area */}
          <div className="relative aspect-video bg-[#1A0033] shrink-0">
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-20 h-20 rounded-full bg-white/10 flex items-center justify-center">
                <Play className="size-10 text-white/30 ml-1" />
              </div>
              <span className="absolute bottom-6 text-white/30 text-sm">Video player will be embedded here</span>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-2 rounded-full bg-black/40 text-white hover:bg-black/60 transition-colors z-10"
            >
              <X className="size-5" />
            </button>

            {/* Nav arrows */}
            {currentIndex > 0 && (
              <button
                onClick={goPrev}
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
              >
                <ChevronLeft className="size-5" />
              </button>
            )}
            {currentIndex < videos.length - 1 && (
              <button
                onClick={goNext}
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-black/30 text-white hover:bg-black/50 transition-colors"
              >
                <ChevronRight className="size-5" />
              </button>
            )}
          </div>

          {/* Info + Playlist area */}
          <div className="flex flex-col md:flex-row flex-1 min-h-0">
            {/* Video Info */}
            <div className="flex-1 p-5 overflow-y-auto">
              <h2 className="text-lg font-bold text-white leading-tight">{currentVideo.title}</h2>

              {/* Meta row */}
              <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-gray-400">
                <span>{currentVideo.speaker}</span>
                <span className="flex items-center gap-1">
                  <Calendar className="size-3.5" />
                  {new Date(currentVideo.date).toLocaleDateString("en-NG", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
                <span className="flex items-center gap-1">
                  <Eye className="size-3.5" />
                  {currentVideo.views} views
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="size-3.5" />
                  {currentVideo.duration}
                </span>
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 mt-4">
                <button
                  onClick={() => setLiked((l) => !l)}
                  className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                    liked
                      ? "bg-[#D32F2F] text-white"
                      : "bg-white/10 text-gray-300 hover:bg-white/15"
                  }`}
                >
                  <ThumbsUp className="size-4" />
                  {liked ? "Liked" : "Like"}
                </button>
                <button className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/15 text-sm font-medium transition-colors">
                  <Share2 className="size-4" />
                  Share
                </button>
                <button
                  onClick={() => setShowPlaylist((s) => !s)}
                  className="md:hidden inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-white/10 text-gray-300 hover:bg-white/15 text-sm font-medium transition-colors"
                >
                  <List className="size-4" />
                  Playlist
                </button>
              </div>

              {/* Description */}
              <div className="mt-4 pt-4 border-t border-white/10">
                <p className="text-sm text-gray-300 leading-relaxed">{currentVideo.description}</p>
              </div>
            </div>

            {/* Playlist sidebar */}
            <AnimatePresence>
              {showPlaylist && (
                <motion.div
                  initial={{ width: 0, opacity: 0 }}
                  animate={{ width: 320, opacity: 1 }}
                  exit={{ width: 0, opacity: 0 }}
                  className="hidden md:block border-l border-white/10 overflow-hidden shrink-0"
                >
                  <div className="w-80 h-full flex flex-col">
                    {/* Playlist header */}
                    <div className="px-4 py-3 border-b border-white/10 flex items-center justify-between">
                      <span className="text-sm font-semibold text-white">
                        Up Next &middot; {videos.length} videos
                      </span>
                      <button
                        onClick={() => setShowPlaylist(false)}
                        className="p-1 rounded hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                      >
                        <X className="size-4" />
                      </button>
                    </div>

                    {/* Playlist items */}
                    <div className="flex-1 overflow-y-auto divide-y divide-white/5">
                      {videos.map((v, i) => (
                        <button
                          key={v.id}
                          onClick={() => setCurrentVideo(v)}
                          className={`w-full flex gap-3 px-4 py-3 text-left transition-colors hover:bg-white/5 ${
                            v.id === currentVideo.id ? "bg-white/10" : ""
                          }`}
                        >
                          {/* Thumbnail */}
                          <div className="relative w-28 h-16 rounded-lg bg-gradient-to-br from-[#4A148C] to-[#6A1B9A] shrink-0 flex items-center justify-center">
                            <Play className="size-4 text-white/30" />
                            <span className="absolute bottom-1 right-1 bg-black/70 text-white text-[9px] px-1 py-0.5 rounded font-medium">
                              {v.duration}
                            </span>
                          </div>

                          {/* Info */}
                          <div className="min-w-0 flex-1">
                            <p className={`text-xs font-semibold leading-tight line-clamp-2 ${
                              v.id === currentVideo.id ? "text-white" : "text-gray-300"
                            }`}>
                              {v.title}
                            </p>
                            <p className="text-[11px] text-gray-500 mt-1">{v.speaker}</p>
                          </div>

                          {/* Now playing indicator */}
                          {v.id === currentVideo.id && (
                            <div className="flex items-end gap-0.5 shrink-0">
                              <span className="w-0.5 h-3 bg-[#D32F2F] rounded-full animate-pulse" />
                              <span className="w-0.5 h-4 bg-[#D32F2F] rounded-full animate-pulse" style={{ animationDelay: "0.1s" }} />
                              <span className="w-0.5 h-2 bg-[#D32F2F] rounded-full animate-pulse" style={{ animationDelay: "0.2s" }} />
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}