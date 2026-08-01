"use client";

import { useState, useEffect, useCallback } from "react";
import { motion } from "framer-motion";
import {
  Radio,
  Maximize2,
  Minimize2,
  Volume2,
  VolumeX,
  Share2,
  MessageSquare,
  ChevronDown,
  Tv,
  MonitorSmartphone,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { isCurrentlyLive, getLiveViewers, type ServiceSchedule } from "./live-data";

export function LivePlayer() {
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [viewerCount, setViewerCount] = useState(0);
  const [activeService, setActiveService] = useState<ServiceSchedule | null>(null);
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    const live = isCurrentlyLive();
    setActiveService(live);
    setViewerCount(getLiveViewers());

    const interval = setInterval(() => {
      const check = isCurrentlyLive();
      setActiveService(check);
      setViewerCount(getLiveViewers());
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  const toggleFullscreen = useCallback(() => {
    setIsFullscreen(!isFullscreen);
  }, [isFullscreen]);

  return (
    <div className={`bg-black rounded-2xl overflow-hidden shadow-2xl ${isFullscreen ? "fixed inset-0 z-[70] rounded-none" : ""}`}>
      {/* Player area */}
      <div className="relative w-full aspect-video bg-gradient-to-br from-[#1A0033] via-[#4A148C] to-[#1A0033]">
        {/* Decorative elements */}
        <div className="absolute inset-0 opacity-5">
          <div className="absolute top-20 left-20 w-60 h-60 bg-purple-400 rounded-full blur-[100px]" />
          <div className="absolute bottom-20 right-20 w-48 h-48 bg-red-400 rounded-full blur-[80px]" />
        </div>

        {/* Top bar - overlaid */}
        <div className="absolute top-0 left-0 right-0 z-10 p-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            {activeService && (
              <Badge className="bg-[#D32F2F] text-white border-0 px-3 py-1.5 text-xs font-bold uppercase tracking-wider shadow-lg">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse mr-2" />
                Live
              </Badge>
            )}
            {!activeService && (
              <Badge className="bg-gray-800/80 text-gray-300 border-0 px-3 py-1.5 text-xs font-bold uppercase tracking-wider backdrop-blur-sm">
                <span className="w-2 h-2 rounded-full bg-gray-400 mr-2" />
                Offline
              </Badge>
            )}
            <span className="text-sm text-white/70 bg-black/30 backdrop-blur-sm px-3 py-1.5 rounded-lg hidden sm:inline-flex items-center gap-1.5">
              <MessageSquare className="size-3.5" />
              {viewerCount} watching
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              className="p-2 text-white/60 hover:text-white bg-black/20 backdrop-blur-sm rounded-lg transition-colors"
              title="Share stream"
            >
              <Share2 className="size-4" />
            </button>
            <button
              onClick={toggleFullscreen}
              className="p-2 text-white/60 hover:text-white bg-black/20 backdrop-blur-sm rounded-lg transition-colors"
              title={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
            >
              {isFullscreen ? <Minimize2 className="size-4" /> : <Maximize2 className="size-4" />}
            </button>
          </div>
        </div>

        {/* Center content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
          {activeService ? (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-28 h-28 rounded-full bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6 border border-white/10"
              >
                <Radio className="size-14 text-white/70" />
              </motion.div>
              <h2 className="text-2xl md:text-4xl font-bold text-white mb-2">
                {activeService.title}
              </h2>
              <p className="text-purple-200/70 text-base md:text-lg mb-6">
                Stream is live now — join us in worship and the Word
              </p>
              <div className="flex items-center gap-4 text-sm text-purple-200/50">
                <span className="flex items-center gap-1.5">
                  <MonitorSmartphone className="size-4" />
                  {viewerCount} viewers
                </span>
              </div>
            </>
          ) : (
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="w-24 h-24 rounded-full bg-white/5 backdrop-blur-sm flex items-center justify-center mb-6 border border-white/5"
              >
                <Tv className="size-12 text-white/30" />
              </motion.div>
              <h2 className="text-2xl md:text-3xl font-bold text-white mb-2">
                Stream is Currently Offline
              </h2>
              <p className="text-purple-200/60 text-base max-w-md">
                Our next live stream will begin at the scheduled service time. See the schedule below and set a reminder.
              </p>
            </>
          )}
        </div>

        {/* Bottom gradient + controls */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/60 to-transparent p-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <button
                onClick={() => setIsMuted(!isMuted)}
                className="p-2 text-white/60 hover:text-white rounded-lg transition-colors"
              >
                {isMuted ? <VolumeX className="size-5" /> : <Volume2 className="size-5" />}
              </button>
              <div className="hidden sm:flex items-center w-24 h-1.5 bg-white/20 rounded-full overflow-hidden">
                <div className={`h-full rounded-full transition-all ${isMuted ? "w-0" : "w-3/4 bg-white"}`} />
              </div>
            </div>
            <p className="text-xs text-white/40 hidden sm:block">
              MFM Youth Church, Utako, Abuja
            </p>
          </div>
        </div>
      </div>

      {/* Below-player info strip (when not fullscreen) */}
      {!isFullscreen && (
        <div className="bg-[#1A0033] px-5 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
              <Radio className="size-5 text-white/60" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-semibold text-white truncate">
                {activeService ? activeService.title : "Live Stream Channel"}
              </p>
              <p className="text-xs text-purple-200/60">
                {activeService ? "Currently streaming live" : "Offline — check schedule for next stream"}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2 shrink-0">
            <Button
              size="sm"
              variant="outline"
              className="border-white/20 text-white/80 hover:bg-white/10 hover:text-white rounded-lg text-xs"
              onClick={() => setExpanded(!expanded)}
            >
              <ChevronDown className={`size-3.5 mr-1 transition-transform ${expanded ? "rotate-180" : ""}`} />
              {expanded ? "Hide" : "Details"}
            </Button>
            <Button
              size="sm"
              className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-lg text-xs"
              disabled={!activeService}
            >
              <Share2 className="size-3.5 mr-1" />
              Share
            </Button>
          </div>
        </div>
      )}

      {/* Expanded details panel */}
      {!isFullscreen && expanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: "auto", opacity: 1 }}
          className="bg-[#0a1040] px-5 py-5 border-t border-white/5 overflow-hidden"
        >
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm">
            <div>
              <p className="text-purple-200/40 text-xs uppercase tracking-wider mb-1">Status</p>
              <p className="text-white font-medium">
                {activeService ? "Currently Live" : "Offline"}
              </p>
            </div>
            <div>
              <p className="text-purple-200/40 text-xs uppercase tracking-wider mb-1">Viewers</p>
              <p className="text-white font-medium">{viewerCount} watching now</p>
            </div>
            <div>
              <p className="text-purple-200/40 text-xs uppercase tracking-wider mb-1">Location</p>
              <p className="text-white font-medium">Utako, Abuja, Nigeria</p>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}