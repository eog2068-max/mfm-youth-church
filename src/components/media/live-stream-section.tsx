"use client";

import { motion } from "framer-motion";
import { Radio, Share2, Calendar, Clock, MessageSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

export function LiveStreamSection() {
  const isLive = false; // Will connect to Supabase for live status

  return (
    <div className="space-y-6">
      {/* Live Video Player Placeholder */}
      <div className="relative w-full aspect-video bg-[#1A0033] rounded-2xl overflow-hidden shadow-xl">
        {/* Placeholder content */}
        <div className="absolute inset-0 flex flex-col items-center justify-center text-white/80">
          <div className="w-24 h-24 rounded-full bg-white/10 flex items-center justify-center mb-6">
            <Radio className="size-12 text-white/40" />
          </div>
          <h3 className="text-2xl md:text-3xl font-bold text-white mb-2">
            {isLive ? "Service is Live Now" : "Next Live Service"}
          </h3>
          <p className="text-purple-200/70 text-base md:text-lg mb-1">
            Sunday Worship Service
          </p>
          <div className="flex items-center gap-4 mt-2 text-sm text-purple-200/60">
            <span className="flex items-center gap-1.5">
              <Calendar className="size-4" />
              Every Sunday
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="size-4" />
              7:00 AM
            </span>
          </div>

          {/* Live indicator when active */}
          {isLive && (
            <div className="absolute top-4 left-4 flex items-center gap-2">
              <Badge className="bg-[#D32F2F] text-white border-0 px-3 py-1 text-xs font-bold uppercase tracking-wider">
                <span className="w-2 h-2 rounded-full bg-white animate-pulse mr-1.5" />
                Live
              </Badge>
              <span className="text-sm text-white/70 bg-black/30 backdrop-blur-sm px-3 py-1 rounded-lg">
                142 watching
              </span>
            </div>
          )}
        </div>

        {/* Bottom gradient */}
        <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-black/30 to-transparent" />
      </div>

      {/* Service Schedule Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {[
          {
            title: "Sunday Worship Service",
            time: "7:00 AM",
            day: "Every Sunday",
            desc: "Praise, worship, Word, and fellowship in God's presence",
            active: false,
          },
          {
            title: "Tuesday Digging Deep (Bible Study)",
            time: "5:30 PM",
            day: "Every Tuesday",
            desc: "In-depth study of the Word for spiritual growth and revelation",
            active: false,
          },
          {
            title: "Thursday Faith Clinic",
            time: "5:30 PM",
            day: "Every Thursday",
            desc: "Faith-building teachings, prayers, and declarations for healing and breakthroughs",
            active: false,
          },

        ].map((service, i) => (
          <motion.div
            key={service.title}
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: i * 0.1 }}
            className="bg-white rounded-xl p-5 border border-gray-100 shadow-sm hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-3">
              <h4 className="text-sm font-bold text-[#4A148C]">{service.title}</h4>
              {service.active && (
                <Badge className="bg-green-100 text-green-700 text-[10px] px-2 py-0.5">
                  Live Now
                </Badge>
              )}
            </div>
            <p className="text-xs text-gray-500 leading-relaxed mb-3">{service.desc}</p>
            <div className="flex items-center gap-3 text-xs text-gray-400">
              <span className="flex items-center gap-1">
                <Calendar className="size-3" />
                {service.day}
              </span>
              <span className="flex items-center gap-1">
                <Clock className="size-3" />
                {service.time}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Info bar */}
      <div className="flex flex-wrap gap-3 items-center justify-center text-sm text-gray-500">
        <span className="flex items-center gap-1.5 bg-[#F3E5F5] px-4 py-2 rounded-xl">
          <MessageSquare className="size-4 text-[#4A148C]/60" />
          Live chat available during services
        </span>
        <span className="flex items-center gap-1.5 bg-[#F3E5F5] px-4 py-2 rounded-xl">
          <Share2 className="size-4 text-[#4A148C]/60" />
          Share the stream with family &amp; friends
        </span>
      </div>
    </div>
  );
}