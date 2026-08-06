"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface CompletionRingProps {
  checked: number;
  due: number;
  size?: number;
  strokeWidth?: number;
}

/**
 * SVG circular progress ring showing today's completion.
 * Animated on mount and when values change.
 */
export function CompletionRing({
  checked,
  due,
  size = 120,
  strokeWidth = 10,
}: CompletionRingProps) {
  const [progress, setProgress] = useState(0);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const pct = due > 0 ? Math.min(checked / due, 1) : 1;

  useEffect(() => {
    // Animate from 0 to target on mount/value change
    const timer = setTimeout(() => setProgress(pct), 100);
    return () => clearTimeout(timer);
  }, [pct]);

  const strokeDashoffset = circumference * (1 - progress);
  const allDone = due > 0 && checked >= due;

  // Color: purple → green when complete
  const color = allDone ? "#2E7D32" : progress > 0.5 ? "#7B1FA2" : "#4A148C";

  return (
    <div className="relative inline-flex items-center justify-center">
      <svg width={size} height={size} className="-rotate-90">
        {/* Background track */}
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke="#E5E7EB"
          strokeWidth={strokeWidth}
        />
        {/* Progress arc */}
        <motion.circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="none"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeDasharray={circumference}
          initial={{ strokeDashoffset: circumference }}
          animate={{ strokeDashoffset }}
          transition={{ duration: 0.8, ease: "easeOut" }}
        />
      </svg>

      {/* Center text */}
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <motion.span
          key={checked}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="text-2xl font-bold"
          style={{ color }}
        >
          {due > 0 ? `${Math.round(progress * 100)}%` : "--"}
        </motion.span>
        <span className="text-[10px] text-gray-400 font-medium uppercase tracking-wider">
          {allDone ? "Complete" : "Today"}
        </span>
      </div>
    </div>
  );
}
