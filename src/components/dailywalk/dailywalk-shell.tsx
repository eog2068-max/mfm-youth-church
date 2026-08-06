"use client";

import { useEffect, useState, useCallback } from "react";
import { Plus, Footprints, Flame, CheckCircle2, TrendingUp } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { PageBanner } from "@/components/layout/page-banner";
import { DailyWalkSkeleton } from "./dailywalk-skeleton";
import { DailyWalkEmptyState } from "./dailywalk-empty-state";
import { CompletionRing } from "./completion-ring";
import { HabitCard, type HabitCardData } from "./habit-card";
import type { CheckInMood } from "@/lib/gaf/dailywalk";

// ---- Types ----

interface DailyWalkStats {
  totalActiveHabits: number;
  dueTodayCount: number;
  checkedTodayCount: number;
  completionRate: number;
  totalCheckInsAllTime: number;
  bestStreakAcrossAllHabits: number;
}

interface DailyWalkSummary {
  habits: HabitCardData[];
  stats: DailyWalkStats;
  date: string;
}

interface DailyWalkShellProps {
  memberName: string;
}

// ---- Component ----

export function DailyWalkShell({ memberName }: DailyWalkShellProps) {
  const [data, setData] = useState<DailyWalkSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchSummary = useCallback(async () => {
    try {
      const res = await fetch("/api/dailywalk/summary");
      if (!res.ok) {
        if (res.status === 401) {
          window.location.href = "/go-a-fishing/login";
          return;
        }
        throw new Error(`Failed to load: ${res.status}`);
      }
      const json = await res.json();
      setData(json);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load DailyWalk");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchSummary();
  }, [fetchSummary]);

  // ---- Optimistic check-in ----

  const handleCheckIn = useCallback(
    async (habitId: string, _mood?: CheckInMood, _note?: string) => {
      // Optimistic update
      setData((prev) => {
        if (!prev) return prev;
        const habits = prev.habits.map((h) =>
          h.id === habitId
            ? { ...h, isCheckedInToday: true, currentStreak: h.currentStreak + 1 }
            : h
        );
        const newChecked = habits.filter((h) => h.isCheckedInToday && h.isDue).length;
        const newDue = prev.stats.dueTodayCount;
        return {
          ...prev,
          habits,
          stats: {
            ...prev.stats,
            checkedTodayCount: newChecked,
            completionRate:
              newDue > 0 ? Math.round((newChecked / newDue) * 100) : 100,
            totalCheckInsAllTime: prev.stats.totalCheckInsAllTime + 1,
          },
        };
      });

      // Fire API call (don't block UI)
      fetch("/api/dailywalk/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId }),
      }).catch(() => {
        // Revert on failure
        fetchSummary();
      });
    },
    [fetchSummary]
  );

  // ---- Optimistic undo ----

  const handleUndo = useCallback(
    async (habitId: string) => {
      setData((prev) => {
        if (!prev) return prev;
        const habits = prev.habits.map((h) =>
          h.id === habitId
            ? {
                ...h,
                isCheckedInToday: false,
                currentStreak: Math.max(0, h.currentStreak - 1),
                todayMood: null,
              }
            : h
        );
        const newChecked = habits.filter((h) => h.isCheckedInToday && h.isDue).length;
        const newDue = prev.stats.dueTodayCount;
        return {
          ...prev,
          habits,
          stats: {
            ...prev.stats,
            checkedTodayCount: newChecked,
            completionRate:
              newDue > 0 ? Math.round((newChecked / newDue) * 100) : 100,
            totalCheckInsAllTime: Math.max(
              0,
              prev.stats.totalCheckInsAllTime - 1
            ),
          },
        };
      });

      fetch("/api/dailywalk/checkin", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ habitId, action: "undo" }),
      }).catch(() => {
        fetchSummary();
      });
    },
    [fetchSummary]
  );

  const hasHabits = data && data.habits.length > 0;
  const allDone =
    hasHabits &&
    data.stats.dueTodayCount > 0 &&
    data.stats.checkedTodayCount >= data.stats.dueTodayCount;

  return (
    <>
      <PageBanner
        title="DailyWalk"
        subtitle={`${memberName}, track your spiritual habits today`}
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "DailyWalk" },
        ]}
      />

      <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 -mt-8 pb-24">
        {/* Loading */}
        {loading && <DailyWalkSkeleton />}

        {/* Error */}
        {error && !loading && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 border border-red-200 rounded-xl p-6 text-center"
          >
            <p className="text-red-700 font-medium">{error}</p>
            <Button
              variant="outline"
              className="mt-3"
              onClick={fetchSummary}
            >
              Try Again
            </Button>
          </motion.div>
        )}

        {/* Empty state */}
        {!loading && !error && !hasHabits && <DailyWalkEmptyState />}

        {/* Main content */}
        {!loading && !error && hasHabits && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="space-y-6"
          >
            {/* Hero: completion ring + stats */}
            <div className="bg-white rounded-2xl border border-gray-200 shadow-sm p-5 sm:p-6">
              <div className="flex flex-col sm:flex-row items-center gap-6">
                {/* Completion ring */}
                <CompletionRing
                  checked={data.stats.checkedTodayCount}
                  due={data.stats.dueTodayCount}
                  size={110}
                  strokeWidth={9}
                />

                {/* Stats grid */}
                <div className="flex-1 grid grid-cols-2 gap-3 w-full">
                  <MiniStat
                    icon={<CheckCircle2 className="size-4" />}
                    label="Checked"
                    value={`${data.stats.checkedTodayCount}/${data.stats.dueTodayCount}`}
                    accent={allDone ? "text-[#2E7D32]" : "text-[#4A148C]"}
                  />
                  <MiniStat
                    icon={<Flame className="size-4" />}
                    label="Best Streak"
                    value={`${data.stats.bestStreakAcrossAllHabits}d`}
                    accent="text-[#D32F2F]"
                  />
                  <MiniStat
                    icon={<TrendingUp className="size-4" />}
                    label="Rate"
                    value={`${data.stats.completionRate}%`}
                    accent="text-[#7B1FA2]"
                  />
                  <MiniStat
                    icon={<Footprints className="size-4" />}
                    label="All Time"
                    value={String(data.stats.totalCheckInsAllTime)}
                    accent="text-[#1A0033]"
                  />
                </div>
              </div>
            </div>

            {/* Habit list header */}
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-[#1A0033]">
                {allDone
                  ? "All done for today!"
                  : `${data.stats.dueTodayCount - data.stats.checkedTodayCount} remaining`}
              </h2>
              <span className="text-sm text-gray-400">
                {data.habits.length} habit{data.habits.length !== 1 ? "s" : ""}
              </span>
            </div>

            {/* Habit cards */}
            <div className="space-y-2.5">
              <AnimatePresence>
                {data.habits.map((habit) => (
                  <HabitCard
                    key={habit.id}
                    habit={habit}
                    onCheckIn={handleCheckIn}
                    onUndo={handleUndo}
                  />
                ))}
              </AnimatePresence>
            </div>

            {/* Add habit FAB — Stage 7 wires this */}
            <div className="fixed bottom-6 right-6 z-40">
              <Button
                size="lg"
                className="rounded-full w-14 h-14 shadow-lg shadow-[#4A148C]/25 bg-[#4A148C] hover:bg-[#1A0033]"
              >
                <Plus className="size-6" />
              </Button>
            </div>
          </motion.div>
        )}
      </section>
    </>
  );
}

// ---- Mini Stat ----

function MiniStat({
  icon,
  label,
  value,
  accent,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
  accent: string;
}) {
  return (
    <div className="flex items-center gap-2.5">
      <span className={accent}>{icon}</span>
      <div>
        <p className={"text-sm font-bold leading-tight " + accent}>{value}</p>
        <p className="text-[10px] text-gray-400 uppercase tracking-wide font-medium">
          {label}
        </p>
      </div>
    </div>
  );
}
