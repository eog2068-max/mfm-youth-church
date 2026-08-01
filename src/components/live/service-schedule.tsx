"use client";

import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Calendar, Clock, Radio, BookOpen, Heart, Bell, BellRing } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { serviceSchedules, getNextService, type ServiceSchedule } from "./live-data";

function CountdownTimer({ targetTime, targetDay }: { targetTime: string; targetDay: string }) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    function calculate() {
      const now = new Date();
      const dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
      const targetDayIndex = dayNames.indexOf(targetDay);

      let target = new Date(now);
      const currentDayIndex = now.getDay();
      let daysUntil = targetDayIndex - currentDayIndex;
      if (daysUntil <= 0) daysUntil += 7;

      target.setDate(now.getDate() + daysUntil);
      const [hours, minutes] = targetTime.split(":").map(Number);
      target.setHours(hours, minutes, 0, 0);

      const diff = target.getTime() - now.getTime();
      if (diff <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
        return;
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
        minutes: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
        seconds: Math.floor((diff % (1000 * 60)) / 1000),
      });
    }

    calculate();
    const interval = setInterval(calculate, 1000);
    return () => clearInterval(interval);
  }, [targetTime, targetDay]);

  const units = [
    { label: "Days", value: timeLeft.days },
    { label: "Hours", value: timeLeft.hours },
    { label: "Min", value: timeLeft.minutes },
    { label: "Sec", value: timeLeft.seconds },
  ];

  return (
    <div className="flex items-center gap-2">
      {units.map((unit) => (
        <div key={unit.label} className="text-center">
          <div className="bg-[#1A0033] text-white text-xl md:text-2xl font-bold w-14 md:w-16 h-14 md:h-16 rounded-xl flex items-center justify-center tabular-nums">
            {String(unit.value).padStart(2, "0")}
          </div>
          <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-wider">{unit.label}</p>
        </div>
      ))}
    </div>
  );
}

const iconMap: Record<string, typeof Radio> = {
  Radio,
  BookOpen,
  Heart,
};

export function ServiceScheduleSection() {
  const [nextService, setNextService] = useState<ServiceSchedule | null>(null);
  const [reminders, setReminders] = useState<Set<string>>(new Set());

  useEffect(() => {
    setNextService(getNextService());
  }, []);

  const toggleReminder = (id: string) => {
    setReminders((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  };

  return (
    <div className="space-y-8">
      {/* Next service countdown */}
      {nextService && (
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8"
        >
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <Badge className="bg-[#F3E5F5] text-[#4A148C] border-0 text-xs font-semibold uppercase tracking-wider mb-3">
                Next Live Stream
              </Badge>
              <h3 className="text-xl md:text-2xl font-bold text-[#4A148C] mb-1">
                {nextService.title}
              </h3>
              <p className="text-sm text-gray-500 max-w-md">
                {nextService.description}
              </p>
              <div className="flex items-center gap-4 mt-3 text-sm text-gray-400">
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  {nextService.day}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="size-3.5" />
                  {nextService.time} — {nextService.endTime}
                </span>
              </div>
            </div>
            <div className="shrink-0">
              <CountdownTimer targetTime={nextService.time} targetDay={nextService.day} />
            </div>
          </div>
        </motion.div>
      )}

      {/* Full schedule */}
      <div>
        <h3 className="text-lg font-bold text-[#4A148C] mb-4">Weekly Service Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {serviceSchedules.map((service, i) => {
            const IconComp = iconMap[service.icon] || Radio;
            const isNext = nextService?.id === service.id;
            const hasReminder = reminders.has(service.id);

            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: i * 0.08 }}
                className={`bg-white rounded-xl border shadow-sm overflow-hidden transition-all ${
                  isNext ? "border-[#4A148C]/20 shadow-md ring-1 ring-[#4A148C]/5" : "border-gray-100"
                }`}
              >
                <div className="p-5">
                  <div className="flex items-start gap-4">
                    <div className={`w-11 h-11 rounded-xl flex items-center justify-center shrink-0 ${
                      isNext ? "bg-[#4A148C]" : "bg-[#F3E5F5]"
                    }`}>
                      <IconComp className={`size-5 ${isNext ? "text-white" : "text-[#4A148C]"}`} />
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h4 className="text-sm font-bold text-[#4A148C]">{service.title}</h4>
                        {isNext && (
                          <span className="text-[10px] font-bold text-[#D32F2F] bg-red-50 px-2 py-0.5 rounded-md uppercase tracking-wider">
                            Up Next
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 leading-relaxed mb-3 line-clamp-2">
                        {service.description}
                      </p>
                      <div className="flex items-center gap-3 text-xs text-gray-400">
                        <span className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          {service.day}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="size-3" />
                          {service.time} — {service.endTime}
                        </span>
                        <span className="flex items-center gap-1">
                          {service.streamType === "video" ? (
                            <span className="text-[10px] font-medium text-[#2E7D32] bg-green-50 px-1.5 py-0.5 rounded">
                              Video
                            </span>
                          ) : (
                            <span className="text-[10px] font-medium text-gray-500 bg-gray-100 px-1.5 py-0.5 rounded">
                              Audio
                            </span>
                          )}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="px-5 py-3 bg-gray-50/50 border-t border-gray-50 flex items-center justify-end">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleReminder(service.id)}
                    className={`text-xs font-medium rounded-lg h-8 px-3 ${
                      hasReminder
                        ? "text-[#D32F2F] hover:text-[#B71C1C] hover:bg-red-50"
                        : "text-gray-500 hover:text-[#4A148C] hover:bg-[#F3E5F5]"
                    }`}
                  >
                    {hasReminder ? (
                      <>
                        <BellRing className="size-3.5 mr-1.5" />
                        Reminder Set
                      </>
                    ) : (
                      <>
                        <Bell className="size-3.5 mr-1.5" />
                        Set Reminder
                      </>
                    )}
                  </Button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}