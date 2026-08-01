"use client";

import { useState, useEffect, useRef } from "react";
import { Clock, Heart, Megaphone, Fish } from "lucide-react";
import Link from "next/link";
import { SectionWrapper, SectionTitle } from "./section-wrapper";

interface TimeLeft {
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
}

interface ServiceSlot {
  day: number; // 0=Sun ... 6=Sat
  hour: number;
  minute: number;
  label: string;
}

const serviceSlots: ServiceSlot[] = [
  { day: 0, hour: 7, minute: 0, label: "Sunday Worship Service" },
  { day: 2, hour: 17, minute: 30, label: "Tuesday Digging Deep (Bible Study)" },
  { day: 4, hour: 17, minute: 30, label: "Thursday Faith Clinic" },
];

function getNextServiceTarget(): { targetDate: Date; label: string } {
  const now = new Date();
  const currentDay = now.getDay();
  const currentMinutes = now.getHours() * 60 + now.getMinutes();

  for (let offset = 0; offset <= 7; offset++) {
    const checkDay = (currentDay + offset) % 7;
    for (const slot of serviceSlots) {
      if (slot.day === checkDay) {
        const serviceMinutes = slot.hour * 60 + slot.minute;
        if (offset > 0 || serviceMinutes > currentMinutes) {
          const target = new Date(now);
          target.setDate(now.getDate() + offset);
          target.setHours(slot.hour, slot.minute, 0, 0);
          return { targetDate: target, label: slot.label };
        }
      }
    }
  }

  // Fallback: next Sunday
  const target = new Date(now);
  const daysUntilSunday = currentDay === 0 ? 7 : 7 - currentDay;
  target.setDate(now.getDate() + daysUntilSunday);
  target.setHours(7, 0, 0, 0);
  return { targetDate: target, label: "Sunday Worship Service" };
}

function calculateTimeLeft(targetDate: Date): TimeLeft {
  const now = new Date();
  const diff = targetDate.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  };
}

function useCountdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 0, hours: 0, minutes: 0, seconds: 0 });
  const [label, setLabel] = useState("Sunday Worship Service");
  const targetRef = useRef<Date | null>(null);

  useEffect(() => {
    const { targetDate, label: serviceLabel } = getNextServiceTarget();
    targetRef.current = targetDate;
    setLabel(serviceLabel);
    setTimeLeft(calculateTimeLeft(targetDate));

    const interval = setInterval(() => {
      setTimeLeft(calculateTimeLeft(targetDate));
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return { timeLeft, label };
}

function CountdownBox({ value, label }: { value: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <div className="bg-white rounded-2xl shadow-lg shadow-black/5 w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 flex items-center justify-center border border-[#4A148C]/10">
        <span className="text-2xl sm:text-3xl md:text-4xl font-bold text-[#4A148C] tabular-nums" suppressHydrationWarning>
          {String(value).padStart(2, "0")}
        </span>
      </div>
      <span className="text-[10px] sm:text-xs md:text-sm font-medium text-gray-500 mt-1.5 sm:mt-2 uppercase tracking-wider">
        {label}
      </span>
    </div>
  );
}

export function CountdownSection() {
  const { timeLeft, label } = useCountdown();
  const isZero = timeLeft.days === 0 && timeLeft.hours === 0 && timeLeft.minutes === 0 && timeLeft.seconds === 0;

  return (
    <SectionWrapper className="bg-[#F3E5F5] py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-3 sm:px-6 text-center">
        <SectionTitle title="Next Service" subtitle="Counting down to our next worship gathering" />

        {!isZero && (
          <>
            <p className="mt-6 text-sm md:text-base font-semibold text-[#4A148C]">{label}</p>
            <div className="flex items-center justify-center gap-1.5 sm:gap-2 md:gap-6 mt-6 px-1">
              <CountdownBox value={timeLeft.days} label="Days" />
              <span className="text-xl sm:text-2xl font-bold text-[#4A148C]/30 mt-[-16px] sm:mt-[-20px]">:</span>
              <CountdownBox value={timeLeft.hours} label="Hours" />
              <span className="text-xl sm:text-2xl font-bold text-[#4A148C]/30 mt-[-16px] sm:mt-[-20px]">:</span>
              <CountdownBox value={timeLeft.minutes} label="Min" />
              <span className="text-xl sm:text-2xl font-bold text-[#4A148C]/30 mt-[-16px] sm:mt-[-20px]">:</span>
              <CountdownBox value={timeLeft.seconds} label="Sec" />
            </div>
          </>
        )}

        <div className="mt-8 sm:mt-10 inline-flex flex-col sm:flex-row flex-wrap items-center justify-center gap-x-4 gap-y-1 bg-white rounded-xl px-3 sm:px-5 py-2.5 sm:py-3 shadow-md shadow-black/5 text-xs sm:text-sm md:text-base text-gray-600 max-w-[95vw] sm:max-w-full">
          <span className="font-semibold text-[#4A148C]">
            <Clock className="size-3.5 sm:size-4 inline mr-1 -mt-0.5" />
            Our Services:
          </span>
          <span>
            <strong className="text-[#4A148C]">Sun 7:00 AM</strong> — Worship Service
          </span>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <span>
            <strong className="text-[#4A148C]">Tue 5:30 PM</strong> — Digging Deep
          </span>
          <span className="text-gray-300 hidden sm:inline">|</span>
          <span>
            <strong className="text-[#4A148C]">Thu 5:30 PM</strong> — Faith Clinic
          </span>
        </div>

        {/* Quick Access — Three Pillars */}
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link href="/social" className="inline-flex items-center gap-1.5 bg-[#C62828]/10 text-[#C62828] rounded-full px-4 py-2 text-xs font-semibold hover:bg-[#C62828]/20 transition-colors">
            <Heart className="size-3.5" />
            YouthConnect
          </Link>
          <Link href="/announcements" className="inline-flex items-center gap-1.5 bg-[#4A148C]/10 text-[#4A148C] rounded-full px-4 py-2 text-xs font-semibold hover:bg-[#4A148C]/20 transition-colors">
            <Megaphone className="size-3.5" />
            Announcements
          </Link>
          <Link href="/go-a-fishing" className="inline-flex items-center gap-1.5 bg-[#7B1FA2]/10 text-[#7B1FA2] rounded-full px-4 py-2 text-xs font-semibold hover:bg-[#7B1FA2]/20 transition-colors">
            <Fish className="size-3.5" />
            Go-A-Fishing
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
}
