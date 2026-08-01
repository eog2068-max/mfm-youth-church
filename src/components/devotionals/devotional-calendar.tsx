"use client";

import { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, CalendarDays } from "lucide-react";
import { Button } from "@/components/ui/button";
import { devotionals } from "./devotionals-data";

interface DevotionalCalendarProps {
  onSelectDate: (dateStr: string) => void;
  selectedDate?: string;
}

export function DevotionalCalendar({
  onSelectDate,
  selectedDate,
}: DevotionalCalendarProps) {
  const [viewDate, setViewDate] = useState(() => new Date());

  const devotionalDates = useMemo(() => {
    return new Set(devotionals.map((d) => d.date));
  }, []);

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();

  const monthName = viewDate.toLocaleDateString("en-NG", {
    month: "long",
    year: "numeric",
  });

  const daysInMonth = new Date(year, month + 1, 0).getDate();
  const firstDayOfWeek = new Date(year, month, 1).getDay();

  const dayNames = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

  const prevMonth = () => {
    setViewDate(new Date(year, month - 1, 1));
  };

  const nextMonth = () => {
    setViewDate(new Date(year, month + 1, 1));
  };

  const goToToday = () => {
    const today = new Date();
    setViewDate(today);
    const dateStr = today.toISOString().split("T")[0];
    if (devotionalDates.has(dateStr)) {
      onSelectDate(dateStr);
    }
  };

  const cells: (number | null)[] = [];
  for (let i = 0; i < firstDayOfWeek; i++) {
    cells.push(null);
  }
  for (let d = 1; d <= daysInMonth; d++) {
    cells.push(d);
  }

  return (
    <div className="rounded-xl border border-gray-100 bg-white overflow-hidden">
      <div className="flex items-center justify-between p-4 border-b border-gray-50">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg hover:bg-gray-100"
          onClick={prevMonth}
        >
          <ChevronLeft className="size-4 text-gray-500" />
        </Button>
        <h3 className="text-sm font-bold text-gray-800">{monthName}</h3>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 rounded-lg hover:bg-gray-100"
          onClick={nextMonth}
        >
          <ChevronRight className="size-4 text-gray-500" />
        </Button>
      </div>

      <div className="grid grid-cols-7 px-3 pt-3">
        {dayNames.map((name) => (
          <div
            key={name}
            className="text-center text-[10px] font-semibold text-gray-400 uppercase tracking-wider pb-2"
          >
            {name}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 px-3 pb-3 gap-y-1">
        {cells.map((day, i) => {
          if (day === null) {
            return <div key={`empty-${i}`} />;
          }

          const dateStr = `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
          const hasDevotional = devotionalDates.has(dateStr);
          const isSelected = selectedDate === dateStr;

          const today = new Date();
          const isToday =
            today.getFullYear() === year &&
            today.getMonth() === month &&
            today.getDate() === day;

          return (
            <motion.button
              key={dateStr}
              whileTap={hasDevotional ? { scale: 0.9 } : undefined}
              className={`relative size-9 rounded-lg flex flex-col items-center justify-center text-sm transition-colors ${
                isSelected
                  ? "bg-[#4A148C] text-white"
                  : hasDevotional
                  ? "bg-[#F3E5F5] text-[#4A148C] font-semibold cursor-pointer hover:bg-[#E8EDFF]"
                  : "text-gray-600 cursor-default"
              }`}
              onClick={() => {
                if (hasDevotional) {
                  onSelectDate(dateStr);
                }
              }}
            >
              <span>{day}</span>
              {hasDevotional && !isSelected && (
                <span className="absolute bottom-1 left-1/2 -translate-x-1/2 w-1 h-1 rounded-full bg-[#4A148C]" />
              )}
              {isToday && (
                <span
                  className={`absolute -bottom-0.5 left-1/2 -translate-x-1/2 w-4 h-0.5 rounded-full ${
                    isSelected ? "bg-white/60" : "bg-[#D32F2F]"
                  }`}
                />
              )}
            </motion.button>
          );
        })}
      </div>

      <div className="px-4 pb-4">
        <Button
          variant="outline"
          size="sm"
          className="w-full border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg h-9 text-xs font-medium gap-1.5"
          onClick={goToToday}
        >
          <CalendarDays className="size-3.5" />
          Jump to Today
        </Button>
      </div>
    </div>
  );
}