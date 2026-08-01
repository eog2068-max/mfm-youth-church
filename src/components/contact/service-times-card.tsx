"use client";

import { motion } from "framer-motion";
import { Clock, BookOpen, Flame, Church, Sparkles } from "lucide-react";
import { getUpcomingService, serviceTimes } from "./contact-data";

function getDayIcon(day: string) {
  switch (day) {
    case "Sunday":
      return Church;
    case "Tuesday":
      return BookOpen;
    case "Thursday":
      return Sparkles;
    default:
      return Clock;
  }
}

function getDayColor(day: string) {
  switch (day) {
    case "Sunday":
      return "bg-[#4A148C]";
    case "Tuesday":
      return "bg-[#2E7D32]";
    case "Thursday":
      return "bg-[#D32F2F]";
    default:
      return "bg-gray-500";
  }
}

export function ServiceTimesCard() {
  const upcoming = getUpcomingService();
  const upcomingId = upcoming.service.id;

  const days = ["Sunday", "Tuesday", "Thursday"] as const;

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-[#2E7D32] to-[#388E3C] px-6 py-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center">
            <Clock className="size-5 text-white" />
          </div>
          <div>
            <h3 className="text-lg font-bold text-white">Service Times</h3>
            <p className="text-sm text-green-100/80">
              Join us for worship &amp; fellowship
            </p>
          </div>
        </div>
      </div>

      {/* Next Service Banner */}
      <div className="bg-[#F0FFF0] border-b border-green-100 px-5 py-3">
        <div className="flex items-center gap-2">
          <Sparkles className="size-4 text-[#2E7D32] shrink-0" />
          <p className="text-sm font-semibold text-[#2E7D32]">
            {upcoming.label}: {upcoming.service.name}
          </p>
        </div>
        <p className="text-xs text-green-700/60 mt-0.5 ml-6">
          {upcoming.service.day} &middot; {upcoming.service.startTime} -{" "}
          {upcoming.service.endTime}
        </p>
      </div>

      {/* Service List — 2 column layout: Sunday + Tuesday side by side, Thursday centered below */}
      <div className="px-5 py-4">
        {/* Row 1: Sunday + Tuesday side by side */}
        <div className="grid grid-cols-2 gap-4">
          {(["Sunday", "Tuesday"] as const).map((day) => {
            const dayServices = serviceTimes.filter((s) => s.day === day);
            const IconComp = getDayIcon(day);
            const iconBg = getDayColor(day);

            return (
              <div key={day}>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center`}
                  >
                    <IconComp className="size-3.5 text-white" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-800">{day}</h4>
                </div>
                <div className="space-y-2 ml-9">
                  {dayServices.map((service) => {
                    const isUpcoming = service.id === upcomingId;
                    return (
                      <motion.div
                        key={service.id}
                        initial={false}
                        animate={
                          isUpcoming ? { scale: [1, 1.02, 1] } : {}
                        }
                        transition={
                          isUpcoming
                            ? { duration: 2, repeat: Infinity, repeatDelay: 3 }
                            : {}
                        }
                        className={`flex items-center justify-between p-2.5 rounded-xl transition-colors ${
                          isUpcoming
                            ? "bg-[#EBF0FA] border border-[#4A148C]/15"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p
                              className={`text-sm font-semibold ${
                                isUpcoming
                                  ? "text-[#4A148C]"
                                  : "text-gray-700"
                              }`}
                            >
                              {service.name}
                            </p>
                            {isUpcoming && (
                              <span className="text-[10px] font-bold text-[#4A148C] bg-[#4A148C]/10 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                                Next
                              </span>
                            )}
                          </div>
                          {service.description && (
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              {service.description}
                            </p>
                          )}
                        </div>
                        <p
                          className={`text-xs font-semibold whitespace-nowrap ml-3 ${
                            isUpcoming ? "text-[#4A148C]" : "text-gray-500"
                          }`}
                        >
                          {service.startTime}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })}
        </div>

        {/* Divider */}
        <div className="border-t border-gray-100 my-4" />

        {/* Row 2: Thursday centered alone */}
        <div className="max-w-[50%] mx-auto">
          {"Thursday" && (() => {
            const day = "Thursday";
            const dayServices = serviceTimes.filter((s) => s.day === day);
            const IconComp = getDayIcon(day);
            const iconBg = getDayColor(day);

            return (
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <div
                    className={`w-7 h-7 rounded-lg ${iconBg} flex items-center justify-center`}
                  >
                    <IconComp className="size-3.5 text-white" />
                  </div>
                  <h4 className="text-sm font-bold text-gray-800">{day}</h4>
                </div>
                <div className="space-y-2 ml-9">
                  {dayServices.map((service) => {
                    const isUpcoming = service.id === upcomingId;
                    return (
                      <motion.div
                        key={service.id}
                        initial={false}
                        animate={
                          isUpcoming ? { scale: [1, 1.02, 1] } : {}
                        }
                        transition={
                          isUpcoming
                            ? { duration: 2, repeat: Infinity, repeatDelay: 3 }
                            : {}
                        }
                        className={`flex items-center justify-between p-2.5 rounded-xl transition-colors ${
                          isUpcoming
                            ? "bg-[#EBF0FA] border border-[#4A148C]/15"
                            : "hover:bg-gray-50"
                        }`}
                      >
                        <div className="min-w-0">
                          <div className="flex items-center gap-2">
                            <p
                              className={`text-sm font-semibold ${
                                isUpcoming
                                  ? "text-[#4A148C]"
                                  : "text-gray-700"
                              }`}
                            >
                              {service.name}
                            </p>
                            {isUpcoming && (
                              <span className="text-[10px] font-bold text-[#4A148C] bg-[#4A148C]/10 px-1.5 py-0.5 rounded-md uppercase tracking-wider">
                                Next
                              </span>
                            )}
                          </div>
                          {service.description && (
                            <p className="text-[11px] text-gray-400 mt-0.5">
                              {service.description}
                            </p>
                          )}
                        </div>
                        <p
                          className={`text-xs font-semibold whitespace-nowrap ml-3 ${
                            isUpcoming ? "text-[#4A148C]" : "text-gray-500"
                          }`}
                        >
                          {service.startTime}
                        </p>
                      </motion.div>
                    );
                  })}
                </div>
              </div>
            );
          })()}
        </div>
      </div>
    </div>
  );
}
