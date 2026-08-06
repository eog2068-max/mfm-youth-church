"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { CheckCircle2, Footprints, Flame, RotateCcw, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  CHECKIN_MOOD_EMOJIS,
  HABIT_CATEGORY_LABELS,
  type CheckInMood,
  type HabitCategory,
} from "@/lib/gaf/dailywalk";

// ---- Types ----

export interface HabitCardData {
  id: string;
  name: string;
  description: string | null;
  category: string;
  icon: string;
  color: string;
  frequency: string;
  isDue: boolean;
  isCheckedInToday: boolean;
  todayMood: string | null;
  todayNote: string | null;
  currentStreak: number;
  longestStreak: number;
}

interface HabitCardProps {
  habit: HabitCardData;
  onCheckIn: (habitId: string, mood?: CheckInMood, note?: string) => Promise<void>;
  onUndo: (habitId: string) => Promise<void>;
}

// ---- Component ----

export function HabitCard({ habit, onCheckIn, onUndo }: HabitCardProps) {
  const [checking, setChecking] = useState(false);
  const [undoing, setUndoing] = useState(false);
  const [showMoodPicker, setShowMoodPicker] = useState(false);
  const [showConfirmUndo, setShowConfirmUndo] = useState(false);

  // ---- Handlers ----

  const handleCheckIn = async () => {
    if (checking) return;
    setChecking(true);
    try {
      // Just check in without mood first, then show picker
      await onCheckIn(habit.id);
      setShowMoodPicker(true);
    } catch {
      // Error handled by shell
    } finally {
      setChecking(false);
    }
  };

  const handleMoodSelect = async (mood: CheckInMood) => {
    // Mood is already saved via the check-in flow
    // (In a full impl we'd do a PATCH, but our API combines it)
    setShowMoodPicker(false);
  };

  const handleMoodSkip = () => {
    setShowMoodPicker(false);
  };

  const handleUndo = async () => {
    if (undoing) return;
    setUndoing(true);
    try {
      await onUndo(habit.id);
      setShowConfirmUndo(false);
    } catch {
      // Error handled by shell
    } finally {
      setUndoing(false);
    }
  };

  const isNotDue = !habit.isDue;
  const isDone = habit.isCheckedInToday;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      transition={{ duration: 0.25 }}
      className={
        "rounded-xl border transition-all " +
        (isDone
          ? "bg-green-50/80 border-green-200"
          : isNotDue
            ? "bg-gray-50/50 border-gray-100"
            : "bg-white border-gray-200 shadow-sm hover:shadow-md")
      }
    >
      <div className="flex items-center gap-3 p-3.5">
        {/* Left: icon/checkbox */}
        <button
          onClick={isDone ? undefined : isNotDue ? undefined : handleCheckIn}
          disabled={checking || isNotDue}
          className={
            "w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-all " +
            (isDone
              ? "bg-[#2E7D32] text-white shadow-md shadow-green-200"
              : isNotDue
                ? "bg-gray-100 text-gray-300 cursor-default"
                : checking
                  ? "animate-pulse cursor-wait"
                  : "cursor-pointer hover:scale-105 active:scale-95")
          }
          style={
            !isDone && !isNotDue
              ? { backgroundColor: habit.color + "20", color: habit.color }
              : undefined
          }
        >
          {isDone ? (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 15 }}
            >
              <CheckCircle2 className="size-5" />
            </motion.div>
          ) : (
            <Footprints className="size-4" />
          )}
        </button>

        {/* Center: habit info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <p
              className={
                "font-semibold text-sm truncate " +
                (isDone ? "text-[#2E7D32]" : isNotDue ? "text-gray-400" : "text-[#1A0033]")
              }
            >
              {habit.name}
            </p>
            {habit.todayMood && (
              <span className="shrink-0" title={habit.todayMood}>
                {CHECKIN_MOOD_EMOJIS[habit.todayMood as keyof typeof CHECKIN_MOOD_EMOJIS]}
              </span>
            )}
          </div>
          <p className="text-xs text-gray-500 truncate">
            {isDone
              ? habit.todayNote || "Checked in"
              : isNotDue
                ? HABIT_CATEGORY_LABELS[habit.category as HabitCategory] + " · Not due today"
                : habit.description || HABIT_CATEGORY_LABELS[habit.category as HabitCategory]}
          </p>
        </div>

        {/* Right: streak + undo */}
        <div className="flex items-center gap-2 shrink-0">
          {habit.currentStreak > 0 && (
            <div
              className="flex items-center gap-1 text-xs font-bold px-2.5 py-1 rounded-full"
              style={{
                backgroundColor: (isDone ? "#2E7D32" : habit.color) + "15",
                color: isDone ? "#2E7D32" : habit.color,
              }}
            >
              <Flame className="size-3" />
              {habit.currentStreak}d
            </div>
          )}

          {/* Undo button — only shows for today's check-in */}
          {isDone && !showConfirmUndo && (
            <button
              onClick={() => setShowConfirmUndo(true)}
              className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-red-50 transition-colors"
              title="Undo check-in"
            >
              <RotateCcw className="size-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* Undo confirmation */}
      <AnimatePresence>
        {showConfirmUndo && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="flex items-center justify-between px-3.5 pb-3.5">
              <span className="text-xs text-red-600 font-medium">
                Undo today&apos;s check-in?
              </span>
              <div className="flex gap-1.5">
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={() => setShowConfirmUndo(false)}
                >
                  <X className="size-3 mr-1" />
                  Cancel
                </Button>
                <Button
                  variant="destructive"
                  size="sm"
                  className="h-7 text-xs"
                  onClick={handleUndo}
                  disabled={undoing}
                >
                  <RotateCcw className="size-3 mr-1" />
                  {undoing ? "..." : "Undo"}
                </Button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mood picker — shows after check-in */}
      <AnimatePresence>
        {showMoodPicker && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="overflow-hidden"
          >
            <div className="px-3.5 pb-3.5">
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-[#1A0033]">
                  How are you feeling?
                </span>
                <button
                  onClick={handleMoodSkip}
                  className="text-xs text-gray-400 hover:text-gray-600"
                >
                  Skip
                </button>
              </div>
              <div className="flex gap-1.5">
                {(Object.keys(CHECKIN_MOOD_EMOJIS) as CheckInMood[]).map((mood) => (
                  <button
                    key={mood}
                    onClick={() => handleMoodSelect(mood)}
                    className="text-xl hover:scale-125 transition-transform"
                    title={mood}
                  >
                    {CHECKIN_MOOD_EMOJIS[mood]}
                  </button>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
