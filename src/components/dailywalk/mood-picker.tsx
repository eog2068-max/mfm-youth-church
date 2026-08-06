"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  CHECKIN_MOOD_LABELS,
  CHECKIN_MOOD_EMOJIS,
  type CheckInMood,
} from "@/lib/gaf/dailywalk";

const MOODS: CheckInMood[] = ["great", "good", "okay", "struggling", "tough"];

interface MoodPickerProps {
  onSelect: (mood: CheckInMood) => void;
  onSkip: () => void;
}

/**
 * Post-check-in mood picker.
 * Slides up after a successful check-in.
 * User picks how they're feeling or skips.
 */
export function MoodPicker({ onSelect, onSkip }: MoodPickerProps) {
  const [selected, setSelected] = useState<CheckInMood | null>(null);

  return (
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 10 }}
        className="bg-white rounded-2xl border border-gray-200 shadow-lg p-5 mt-4"
      >
        <p className="text-sm font-semibold text-[#1A0033] text-center mb-3">
          How are you feeling?
        </p>
        <p className="text-xs text-gray-400 text-center mb-4">
          Optional — helps you track your spiritual journey
        </p>

        <div className="flex justify-center gap-2 mb-4">
          {MOODS.map((mood) => {
            const isActive = selected === mood;
            return (
              <motion.button
                key={mood}
                whileTap={{ scale: 0.9 }}
                onClick={() => setSelected(mood)}
                className={
                  "flex flex-col items-center gap-1 p-2 rounded-xl transition-all " +
                  (isActive
                    ? "bg-[#4A148C]/10 ring-2 ring-[#4A148C]/30"
                    : "hover:bg-gray-50")
                }
              >
                <span className="text-2xl">{CHECKIN_MOOD_EMOJIS[mood]}</span>
                <span className={
                  "text-[10px] font-medium leading-tight " +
                  (isActive ? "text-[#4A148C]" : "text-gray-500")
                }>
                  {CHECKIN_MOOD_LABELS[mood].split(" ")[0]}
                </span>
              </motion.button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <Button
            variant="ghost"
            className="flex-1 text-gray-500"
            onClick={onSkip}
          >
            Skip
          </Button>
          <Button
            className="flex-1 bg-[#4A148C] hover:bg-[#1A0033] text-white"
            onClick={() => {
              if (selected) onSelect(selected);
            }}
            disabled={!selected}
          >
            Save
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}
