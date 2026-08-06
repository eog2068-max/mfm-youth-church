"use client";

import { motion } from "framer-motion";
import { Footprints, Plus, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";

/**
 * Shown when a member has no habits yet.
 * Encourages them to create their first spiritual habit.
 */
export function DailyWalkEmptyState() {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.2 }}
      className="text-center py-16 px-6"
    >
      {/* Illustration circle */}
      <div className="mx-auto w-24 h-24 rounded-full bg-gradient-to-br from-[#4A148C]/10 to-[#D32F2F]/10 flex items-center justify-center mb-6">
        <Footprints className="size-12 text-[#4A148C]/60" />
      </div>

      <h2 className="text-2xl font-bold text-[#1A0033] mb-2">
        Start Your Daily Walk
      </h2>
      <p className="text-gray-500 max-w-sm mx-auto mb-2 leading-relaxed">
        Build daily spiritual habits that draw you closer to God.
        Track prayer, scripture reading, fasting, worship and more.
      </p>

      {/* Suggested quick-start habits */}
      <div className="flex flex-wrap justify-center gap-2 mt-6 mb-8">
        {[
          { label: "Morning Prayer", icon: "HandMetal" },
          { label: "Scripture Reading", icon: "BookOpen" },
          { label: "Worship", icon: "Music" },
        ].map((suggestion) => (
          <span
            key={suggestion.label}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#4A148C]/5 text-[#4A148C] text-xs font-medium border border-[#4A148C]/10"
          >
            <Sparkles className="size-3" />
            {suggestion.label}
          </span>
        ))}
      </div>

      {/* CTA — Stage 7 will wire this to the create habit form */}
      <Button
        size="lg"
        className="rounded-full px-8 bg-[#4A148C] hover:bg-[#1A0033] text-white shadow-lg"
        onClick={() => {
          // Stage 7 will open the create habit modal
          // For now, this is a placeholder
        }}
      >
        <Plus className="size-5 mr-2" />
        Create Your First Habit
      </Button>

      <p className="text-xs text-gray-400 mt-4">
        You can have up to 12 active habits at a time
      </p>
    </motion.div>
  );
}
