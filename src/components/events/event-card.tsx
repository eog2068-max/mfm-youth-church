"use client";

import { motion } from "framer-motion";
import { Calendar, Clock, MapPin, Users, ArrowRight, Repeat } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { categoryColors, type ChurchEvent } from "./events-data";

interface EventCardProps {
  event: ChurchEvent;
  index: number;
  onOpen?: (event: ChurchEvent) => void;
  variant?: "default" | "featured" | "compact";
}

export function EventCard({ event, index, onOpen, variant = "default" }: EventCardProps) {
  const colors = categoryColors[event.category];
  const eventDate = new Date(event.date + "T00:00:00");
  const dayName = eventDate.toLocaleDateString("en-NG", { weekday: "short" });
  const dayNum = eventDate.getDate();
  const monthName = eventDate.toLocaleDateString("en-NG", { month: "short" });

  const formatTime = (t: string) => {
    const [h, m] = t.split(":").map(Number);
    const ampm = h >= 12 ? "PM" : "AM";
    const hour = h > 12 ? h - 12 : h === 0 ? 12 : h;
    return `${hour}:${String(m).padStart(2, "0")} ${ampm}`;
  };

  if (variant === "featured") {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, delay: index * 0.1 }}
        className="bg-white rounded-2xl border border-gray-100 shadow-lg shadow-black/5 overflow-hidden"
      >
        {/* Top color bar */}
        <div className={`h-2 ${event.category === "Conference" ? "bg-gradient-to-r from-purple-500 to-purple-600" : event.category === "Youth" ? "bg-gradient-to-r from-amber-400 to-amber-500" : "bg-gradient-to-r from-[#4A148C] to-[#7B1FA2]"}`} />

        <div className="flex flex-col md:flex-row">
          {/* Date block */}
          <div className="flex items-center gap-4 p-6 md:p-8 md:pr-0 md:w-48 shrink-0">
            <div className="text-center">
              <div className="text-xs font-semibold text-[#D32F2F] uppercase tracking-wider mb-1">
                {dayName}
              </div>
              <div className="text-5xl font-bold text-[#4A148C] leading-none">{dayNum}</div>
              <div className="text-sm font-semibold text-gray-400 mt-1">{monthName}</div>
              {event.endDate && (
                <div className="text-xs text-gray-400 mt-1">
                  — {new Date(event.endDate + "T00:00:00").toLocaleDateString("en-NG", { day: "numeric", month: "short" })}
                </div>
              )}
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 p-6 md:py-8 md:pl-6 md:pr-8">
            <div className="flex items-center gap-2 mb-2">
              <Badge className={`${colors.bg} ${colors.text} border-0 text-[10px] font-semibold uppercase tracking-wider`}>
                {event.category}
              </Badge>
              {event.isRecurring && (
                <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
                  <Repeat className="size-3" />
                  {event.recurringDay}
                </span>
              )}
            </div>

            <h3 className="text-xl md:text-2xl font-bold text-[#4A148C] mb-2">{event.title}</h3>
            <p className="text-sm text-gray-500 leading-relaxed mb-4 line-clamp-2">
              {event.description}
            </p>

            <div className="flex flex-wrap items-center gap-x-5 gap-y-2 text-xs text-gray-400 mb-5">
              <span className="flex items-center gap-1.5">
                <Clock className="size-3.5" />
                {formatTime(event.time)}
                {event.endTime ? ` — ${formatTime(event.endTime)}` : ""}
              </span>
              <span className="flex items-center gap-1.5">
                <MapPin className="size-3.5" />
                {event.venue}
              </span>
              {event.capacity && (
                <span className="flex items-center gap-1.5">
                  <Users className="size-3.5" />
                  {event.registeredCount || 0}/{event.capacity} registered
                </span>
              )}
            </div>

            <div className="flex items-center gap-3">
              {event.registrationRequired ? (
                <Button
                  asChild
                  className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-xl h-10 px-6 text-sm font-semibold"
                >
                  <Link href="/events/register">
                    Register Now
                    <ArrowRight className="size-4 ml-1" />
                  </Link>
                </Button>
              ) : (
                <Button
                  asChild
                  variant="outline"
                  className="border-[#4A148C]/20 text-[#4A148C] hover:bg-[#F3E5F5] rounded-xl h-10 px-6 text-sm font-semibold"
                >
                  <Link href="/events">
                    <Calendar className="size-4 mr-1.5" />
                    View Details
                  </Link>
                </Button>
              )}
            </div>
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
        className="flex items-center gap-4 p-3 rounded-xl hover:bg-gray-50 transition-colors cursor-pointer group"
        onClick={() => onOpen?.(event)}
      >
        <div className="w-12 h-12 rounded-xl bg-[#F3E5F5] flex flex-col items-center justify-center shrink-0">
          <span className="text-[10px] font-bold text-[#D32F2F] uppercase leading-none">{dayName.slice(0, 3)}</span>
          <span className="text-lg font-bold text-[#4A148C] leading-none">{dayNum}</span>
          <span className="text-[9px] text-gray-400 leading-none">{monthName}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-[#4A148C] transition-colors">{event.title}</p>
          <p className="text-xs text-gray-400 truncate">
            {formatTime(event.time)} &middot; {event.venue}
          </p>
        </div>
        <Badge className={`${colors.bg} ${colors.text} border-0 text-[9px] px-2 py-0.5 shrink-0`}>
          {event.category}
        </Badge>
      </motion.div>
    );
  }

  // Default card
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.35, delay: index * 0.06 }}
      className="bg-white rounded-xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-gray-200 transition-all group"
    >
      {/* Color bar */}
      <div className={`h-1.5 ${event.category === "Conference" ? "bg-gradient-to-r from-purple-500 to-purple-600" : event.category === "Youth" ? "bg-gradient-to-r from-amber-400 to-amber-500" : event.category === "Community" ? "bg-gradient-to-r from-green-500 to-green-600" : event.category === "Special Programme" ? "bg-gradient-to-r from-[#D32F2F] to-[#E53935]" : "bg-gradient-to-r from-[#4A148C] to-[#7B1FA2]"}`} />

      <div className="p-5">
        <div className="flex items-center gap-2 mb-3">
          <Badge className={`${colors.bg} ${colors.text} border-0 text-[10px] font-semibold uppercase tracking-wider`}>
            {event.category}
          </Badge>
          {event.isRecurring && (
            <span className="inline-flex items-center gap-1 text-[10px] text-gray-400">
              <Repeat className="size-3" />
              {event.recurringDay}
            </span>
          )}
          {event.registrationRequired && (
            <span className="text-[10px] font-semibold text-[#D32F2F] bg-red-50 px-2 py-0.5 rounded">Registration</span>
          )}
        </div>

        <h3 className="text-base font-bold text-gray-800 mb-2 group-hover:text-[#4A148C] transition-colors leading-snug">
          {event.title}
        </h3>
        <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-4">
          {event.description}
        </p>

        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-gray-400 mb-4">
          <span className="flex items-center gap-1.5 font-medium text-gray-600">
            <Calendar className="size-3.5 text-[#D32F2F]" />
            {eventDate.toLocaleDateString("en-NG", { weekday: "short", month: "short", day: "numeric", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="size-3.5" />
            {formatTime(event.time)}
            {event.endTime ? ` — ${formatTime(event.endTime)}` : ""}
          </span>
          <span className="flex items-center gap-1.5">
            <MapPin className="size-3.5" />
            {event.venue}
          </span>
        </div>

        {event.capacity && (
          <div className="mb-4">
            <div className="flex items-center justify-between text-xs text-gray-400 mb-1">
              <span className="flex items-center gap-1"><Users className="size-3" /> Registered</span>
              <span className="font-medium text-gray-600">{event.registeredCount || 0} / {event.capacity}</span>
            </div>
            <div className="w-full h-1.5 bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-[#4A148C] rounded-full"
                style={{ width: `${Math.min(((event.registeredCount || 0) / event.capacity) * 100, 100)}%` }}
              />
            </div>
          </div>
        )}

        <div className="flex items-center gap-2 pt-3 border-t border-gray-50">
          {event.registrationRequired ? (
            <Button
              asChild
              size="sm"
              className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-lg h-9 px-4 text-xs font-semibold"
            >
              <Link href="/events/register">
                Register
                <ArrowRight className="size-3.5 ml-1" />
              </Link>
            </Button>
          ) : (
            <Button
              asChild
              variant="outline"
              size="sm"
              className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg h-9 px-4 text-xs font-semibold"
            >
              <Link href="/events">
                <Calendar className="size-3.5 mr-1" />
                View Details
              </Link>
            </Button>
          )}
        </div>
      </div>
    </motion.div>
  );
}