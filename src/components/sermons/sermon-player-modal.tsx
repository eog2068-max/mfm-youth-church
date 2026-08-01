"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
  ChevronLeft,
  ChevronRight,
  Headphones,
  FileText,
  Video,
  BookOpen,
  Share2,
  Download,
} from "lucide-react";
import type { Sermon, SermonSeries } from "./sermon-data";

interface SermonPlayerModalProps {
  sermons: Sermon[];
  initialSermon: Sermon;
  series?: SermonSeries;
  onClose: () => void;
}

export function SermonPlayerModal({
  sermons,
  initialSermon,
  series,
  onClose,
}: SermonPlayerModalProps) {
  const [current, setCurrent] = useState(initialSermon);
  const [isPlaying, setIsPlaying] = useState(false);
  const [showNotes, setShowNotes] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(75);
  const [isMuted, setIsMuted] = useState(false);

  const currentIndex = sermons.findIndex((s) => s.id === current.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < sermons.length - 1;

  const goPrev = useCallback(() => {
    if (hasPrev) {
      const prev = sermons[currentIndex - 1];
      setCurrent(prev);
      setProgress(0);
      setIsPlaying(false);
      setShowNotes(false);
    }
  }, [hasPrev, currentIndex, sermons]);

  const goNext = useCallback(() => {
    if (hasNext) {
      const next = sermons[currentIndex + 1];
      setCurrent(next);
      setProgress(0);
      setIsPlaying(false);
      setShowNotes(false);
    }
  }, [hasNext, currentIndex, sermons]);

  const parseDuration = (dur: string): number => {
    const parts = dur.split(":").map(Number);
    if (parts.length === 3) return parts[0] * 3600 + parts[1] * 60 + parts[2];
    if (parts.length === 2) return parts[0] * 60 + parts[1];
    return 0;
  };

  const formatTime = (seconds: number): string => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) return `${h}:${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const totalSeconds = parseDuration(current.duration);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 1;
          if (next >= totalSeconds) {
            setIsPlaying(false);
            return totalSeconds;
          }
          return next;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, totalSeconds]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft" && hasPrev) goPrev();
      if (e.key === "ArrowRight" && hasNext) goNext();
      if (e.key === " ") {
        e.preventDefault();
        setIsPlaying((p) => !p);
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose, hasPrev, hasNext, goPrev, goNext]);

  const progressPercent = totalSeconds > 0 ? (progress / totalSeconds) * 100 : 0;

  const handleProgressClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const pct = x / rect.width;
    setProgress(Math.floor(pct * totalSeconds));
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm flex items-end md:items-center justify-center"
      onClick={onClose}
    >
      <motion.div
        initial={{ y: 60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 60, opacity: 0 }}
        transition={{ type: "spring", damping: 28, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full md:max-w-4xl md:rounded-2xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col"
      >
        {/* Header */}
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <div className="w-9 h-9 rounded-lg bg-[#F3E5F5] flex items-center justify-center shrink-0">
              <Headphones className="size-4.5 text-[#4A148C]" />
            </div>
            <div className="min-w-0">
              <p className="text-xs text-gray-400 font-medium">Now Playing</p>
              <p className="text-sm font-bold text-[#4A148C] truncate">{current.title}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="size-5" />
          </button>
        </div>

        {/* Body (scrollable) */}
        <div className="flex-1 overflow-y-auto">
          {/* Sermon info section */}
          <div className="p-5 md:p-8">
            {/* Series badge */}
            {series && (
              <span className="inline-flex items-center text-[11px] font-semibold uppercase tracking-wider text-[#D32F2F] bg-red-50 px-2.5 py-0.5 rounded-full mb-3">
                {series.name}
              </span>
            )}

            <h2 className="text-xl md:text-2xl font-bold text-gray-900 mb-2">
              {current.title}
            </h2>

            <div className="flex flex-wrap items-center gap-x-4 gap-y-1.5 text-sm text-gray-500 mb-4">
              <span>{current.speaker}</span>
              <span className="text-gray-300">|</span>
              <span>
                {new Date(current.date).toLocaleDateString("en-NG", {
                  weekday: "short",
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </span>
              <span className="text-gray-300">|</span>
              <span>{current.duration}</span>
            </div>

            <p className="text-sm md:text-base text-gray-600 leading-relaxed mb-5">
              {current.description}
            </p>

            {/* Scripture references */}
            {current.scriptures.length > 0 && (
              <div className="flex flex-wrap gap-2 mb-5">
                {current.scriptures.map((scripture) => (
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

            {/* Format badges */}
            <div className="flex flex-wrap gap-2 mb-2">
              {current.hasAudio && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4A148C] bg-[#F3E5F5] px-3 py-1.5 rounded-lg">
                  <Headphones className="size-3.5" />
                  Audio Available
                </span>
              )}
              {current.hasVideo && (
                <span className="inline-flex items-center gap-1.5 text-xs font-medium text-[#D32F2F] bg-red-50 px-3 py-1.5 rounded-lg">
                  <Video className="size-3.5" />
                  Video Available
                </span>
              )}
              {current.hasNotes && (
                <button
                  onClick={() => setShowNotes(!showNotes)}
                  className={`inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg transition-colors ${
                    showNotes
                      ? "bg-[#2E7D32] text-white"
                      : "bg-green-50 text-[#2E7D32] hover:bg-green-100"
                  }`}
                >
                  <FileText className="size-3.5" />
                  {showNotes ? "Hide Notes" : "View Notes"}
                </button>
              )}
            </div>

            {/* Tags */}
            {current.tags.length > 0 && (
              <div className="flex flex-wrap gap-1.5 mt-3">
                {current.tags.map((tag) => (
                  <span
                    key={tag}
                    className="text-[10px] font-medium text-gray-400 bg-gray-50 px-2 py-0.5 rounded-md"
                  >
                    #{tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Sermon Notes */}
          <AnimatePresence>
            {showNotes && current.notes && (
              <motion.div
                initial={{ height: 0, opacity: 0 }}
                animate={{ height: "auto", opacity: 1 }}
                exit={{ height: 0, opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="overflow-hidden"
              >
                <div className="px-5 md:px-8 pb-6">
                  <div className="bg-[#F8FAFF] border border-[#4A148C]/8 rounded-xl p-5 md:p-6">
                    <div className="flex items-center gap-2 mb-4">
                      <FileText className="size-4 text-[#4A148C]" />
                      <h3 className="text-sm font-bold text-[#4A148C]">Sermon Notes</h3>
                    </div>
                    <div className="text-sm text-gray-700 leading-relaxed whitespace-pre-line">
                      {current.notes}
                    </div>
                    <div className="flex items-center gap-2 mt-4 pt-4 border-t border-[#4A148C]/8">
                      <button className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4A148C] hover:text-[#1A0033] transition-colors">
                        <Download className="size-3.5" />
                        Download Notes
                      </button>
                      <span className="text-gray-200">|</span>
                      <button className="inline-flex items-center gap-1.5 text-xs font-medium text-[#4A148C] hover:text-[#1A0033] transition-colors">
                        <Share2 className="size-3.5" />
                        Share
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Playlist / Up Next */}
          {sermons.length > 1 && (
            <div className="px-5 md:px-8 pb-6">
              <h3 className="text-sm font-bold text-gray-700 mb-3">
                {series ? "More in this Series" : "Up Next"}
              </h3>
              <div className="space-y-1.5">
                {sermons.map((sermon, i) => {
                  const isCurrent = sermon.id === current.id;
                  return (
                    <button
                      key={sermon.id}
                      onClick={() => {
                        setCurrent(sermon);
                        setProgress(0);
                        setIsPlaying(false);
                        setShowNotes(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-colors ${
                        isCurrent
                          ? "bg-[#F3E5F5] border border-[#4A148C]/10"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      <span className={`text-xs font-bold w-5 text-center shrink-0 ${
                        isCurrent ? "text-[#4A148C]" : "text-gray-400"
                      }`}>
                        {i + 1}
                      </span>
                      <div className="flex-1 min-w-0">
                        <p className={`text-sm font-semibold truncate ${
                          isCurrent ? "text-[#4A148C]" : "text-gray-700"
                        }`}>
                          {sermon.title}
                        </p>
                        <p className="text-xs text-gray-400 truncate">
                          {sermon.speaker} &middot; {sermon.duration}
                        </p>
                      </div>
                      {isCurrent && (
                        <span className="text-[10px] font-semibold text-[#4A148C] bg-[#4A148C]/10 px-2 py-0.5 rounded shrink-0">
                          PLAYING
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Player Controls (fixed at bottom of modal) */}
        <div className="shrink-0 border-t border-gray-100 bg-white px-5 md:px-8 py-4">
          {/* Progress bar */}
          <div
            className="relative w-full h-1.5 bg-gray-100 rounded-full mb-4 cursor-pointer group"
            onClick={handleProgressClick}
          >
            <div
              className="absolute left-0 top-0 h-full bg-[#4A148C] rounded-full transition-all duration-300"
              style={{ width: `${progressPercent}%` }}
            />
            <div
              className="absolute top-1/2 -translate-y-1/2 size-3.5 bg-[#4A148C] rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
              style={{ left: `calc(${progressPercent}% - 7px)` }}
            />
          </div>

          {/* Time indicators */}
          <div className="flex items-center justify-between text-xs text-gray-400 mb-3">
            <span>{formatTime(progress)}</span>
            <span>{current.duration}</span>
          </div>

          {/* Controls row */}
          <div className="flex items-center justify-between">
            {/* Left: info */}
            <div className="flex items-center gap-3 min-w-0 flex-1">
              <p className="text-sm font-semibold text-gray-700 truncate hidden sm:block">
                {currentIndex + 1} / {sermons.length}
              </p>
            </div>

            {/* Center: playback */}
            <div className="flex items-center gap-2">
              <button
                onClick={goPrev}
                disabled={!hasPrev}
                className="p-2 text-gray-400 hover:text-[#4A148C] disabled:text-gray-200 disabled:cursor-not-allowed transition-colors"
              >
                <SkipBack className="size-5" />
              </button>
              <button
                onClick={() => setIsPlaying(!isPlaying)}
                className="w-12 h-12 rounded-full bg-[#4A148C] text-white flex items-center justify-center hover:bg-[#1A0033] transition-colors shadow-lg shadow-[#4A148C]/20"
              >
                {isPlaying ? (
                  <Pause className="size-5" />
                ) : (
                  <Play className="size-5 ml-0.5" />
                )}
              </button>
              <button
                onClick={goNext}
                disabled={!hasNext}
                className="p-2 text-gray-400 hover:text-[#4A148C] disabled:text-gray-200 disabled:cursor-not-allowed transition-colors"
              >
                <SkipForward className="size-5" />
              </button>
            </div>

            {/* Right: volume */}
            <div className="flex items-center gap-2 flex-1 justify-end">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-1.5 text-gray-400 hover:text-[#4A148C] transition-colors hidden sm:block"
              >
                {isMuted ? (
                  <VolumeX className="size-4" />
                ) : (
                  <Volume2 className="size-4" />
                )}
              </button>
              <div className="hidden sm:flex items-center w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#4A148C] rounded-full transition-all"
                  style={{ width: `${isMuted ? 0 : volume}%` }}
                />
              </div>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}