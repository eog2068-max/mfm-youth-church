"use client";

import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronLeft,
  ChevronRight,
  ZoomIn,
  ZoomOut,
  Info,
  Camera,
  Download,
  Grid3X3,
} from "lucide-react";
import type { Photo } from "./gallery-data";

interface FullLightboxProps {
  photos: Photo[];
  initialIndex: number;
  onClose: () => void;
  onBackToAlbums: () => void;
  albumName: string;
}

export function FullLightbox({
  photos,
  initialIndex,
  onClose,
  onBackToAlbums,
  albumName,
}: FullLightboxProps) {
  const [current, setCurrent] = useState(initialIndex);
  const [showInfo, setShowInfo] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const photo = photos[current];

  const goNext = useCallback(() => {
    setCurrent((prev) => (prev < photos.length - 1 ? prev + 1 : 0));
  }, [photos.length]);

  const goPrev = useCallback(() => {
    setCurrent((prev) => (prev > 0 ? prev - 1 : photos.length - 1));
  }, [photos.length]);

  // Keyboard navigation
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") goNext();
      else if (e.key === "ArrowLeft") goPrev();
      else if (e.key === "Escape") onClose();
      else if (e.key === "i") setShowInfo((s) => !s);
      else if (e.key === "z") setZoomed((s) => !s);
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [goNext, goPrev, onClose]);

  // Touch/swipe support
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };
  const onTouchMove = (e: React.TouchEvent) => setTouchEnd(e.targetTouches[0].clientX);
  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
      diff > 0 ? goNext() : goPrev();
    }
    setTouchStart(null);
    setTouchEnd(null);
  };

  if (!photo) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="fixed inset-0 z-[100] bg-[#0A0A1A] flex flex-col"
      >
        {/* Top bar */}
        <div className="flex items-center justify-between px-4 sm:px-6 py-3 bg-black/40 backdrop-blur-sm border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3 min-w-0">
            <button
              onClick={onBackToAlbums}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white shrink-0"
            >
              <Grid3X3 className="size-5" />
            </button>
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{albumName}</p>
              <p className="text-white/50 text-xs">
                {current + 1} of {photos.length}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={() => setZoomed((z) => !z)}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
              title="Toggle zoom (Z)"
            >
              {zoomed ? <ZoomOut className="size-5" /> : <ZoomIn className="size-5" />}
            </button>
            <button
              onClick={() => setShowInfo((s) => !s)}
              className={`p-2 rounded-lg transition-colors ${showInfo ? "bg-white/20 text-white" : "hover:bg-white/10 text-white/70 hover:text-white"}`}
              title="Toggle info (I)"
            >
              <Info className="size-5" />
            </button>
            <button
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white"
              title="Download"
            >
              <Download className="size-5" />
            </button>
            <button
              onClick={onClose}
              className="p-2 rounded-lg hover:bg-white/10 transition-colors text-white/70 hover:text-white ml-1"
            >
              <X className="size-5" />
            </button>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 flex relative overflow-hidden">
          {/* Photo area */}
          <div
            className="flex-1 flex items-center justify-center relative"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={photo.id}
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.96 }}
                transition={{ duration: 0.2 }}
                className={`bg-[#E8EDFF] rounded-xl flex items-center justify-center overflow-hidden ${
                  zoomed ? "w-full h-full" : "max-w-5xl max-h-[80vh] w-[90vw] aspect-video"
                }`}
              >
                <Camera className="size-20 text-[#4A148C]/15" />
                <span className="absolute text-sm text-[#4A148C]/30 font-medium">Photo</span>
              </motion.div>
            </AnimatePresence>

            {/* Navigation arrows */}
            <button
              onClick={goPrev}
              className="absolute left-3 sm:left-6 p-3 rounded-full bg-black/30 backdrop-blur-sm text-white/80 hover:bg-black/50 hover:text-white transition-all"
            >
              <ChevronLeft className="size-6" />
            </button>
            <button
              onClick={goNext}
              className="absolute right-3 sm:right-6 p-3 rounded-full bg-black/30 backdrop-blur-sm text-white/80 hover:bg-black/50 hover:text-white transition-all"
            >
              <ChevronRight className="size-6" />
            </button>
          </div>

          {/* Info panel (slides in from right) */}
          <AnimatePresence>
            {showInfo && (
              <motion.div
                initial={{ x: 320, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                exit={{ x: 320, opacity: 0 }}
                transition={{ type: "spring", damping: 25, stiffness: 200 }}
                className="w-72 sm:w-80 bg-white/5 backdrop-blur-md border-l border-white/10 p-5 overflow-y-auto shrink-0 hidden sm:block"
              >
                <h3 className="text-white font-bold text-lg leading-tight">{photo.title}</h3>
                <p className="text-white/60 text-sm mt-2 leading-relaxed">
                  {photo.description || "No description available."}
                </p>
                <div className="mt-4 pt-4 border-t border-white/10 space-y-2.5 text-sm">
                  <div className="flex justify-between">
                    <span className="text-white/40">Date</span>
                    <span className="text-white/80">
                      {new Date(photo.date).toLocaleDateString("en-NG", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Category</span>
                    <span className="text-white/80">{photo.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-white/40">Photo</span>
                    <span className="text-white/80">{current + 1} of {photos.length}</span>
                  </div>
                </div>

                {/* Thumbnail strip */}
                <div className="mt-5">
                  <p className="text-white/40 text-xs font-semibold uppercase tracking-wider mb-3">
                    All Photos
                  </p>
                  <div className="grid grid-cols-3 gap-1.5">
                    {photos.map((p, i) => (
                      <button
                        key={p.id}
                        onClick={() => setCurrent(i)}
                        className={`aspect-square rounded-lg bg-gradient-to-br from-[#E8EDFF] to-[#F3E5F5] flex items-center justify-center transition-all ${
                          i === current
                            ? "ring-2 ring-white/50 scale-95"
                            : "opacity-60 hover:opacity-100"
                        }`}
                      >
                        {i === current && <Camera className="size-4 text-[#4A148C]/30" />}
                      </button>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

        {/* Bottom bar — photo title + counter */}
        <div className="px-4 sm:px-6 py-3 bg-black/40 backdrop-blur-sm border-t border-white/5 shrink-0">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="min-w-0">
              <p className="text-white font-semibold text-sm truncate">{photo.title}</p>
              <p className="text-white/40 text-xs truncate">
                {photo.description}
              </p>
            </div>
            {/* Progress dots */}
            <div className="hidden sm:flex items-center gap-1.5 ml-4 shrink-0">
              {photos.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrent(i)}
                  className={`rounded-full transition-all duration-200 ${
                    i === current
                      ? "w-6 h-2 bg-white"
                      : "w-2 h-2 bg-white/20 hover:bg-white/40"
                  }`}
                />
              ))}
            </div>
          </div>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}