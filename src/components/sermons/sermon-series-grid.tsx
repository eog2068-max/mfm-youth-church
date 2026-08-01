"use client";

import { motion } from "framer-motion";
import { BookOpen, ChevronRight } from "lucide-react";
import type { SermonSeries } from "./sermon-data";

interface SermonSeriesGridProps {
  series: SermonSeries[];
  onSelect: (series: SermonSeries) => void;
}

export function SermonSeriesGrid({ series, onSelect }: SermonSeriesGridProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-5">
      {series.map((s, i) => (
        <motion.div
          key={s.id}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4, delay: i * 0.08 }}
          onClick={() => onSelect(s)}
          className="group cursor-pointer"
        >
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden hover:shadow-md hover:border-gray-200 transition-all duration-300">
            {/* Series cover */}
            <div className={`relative h-36 bg-gradient-to-br ${s.coverGradient} flex items-end p-5`}>
              <div className="absolute inset-0 opacity-10">
                <div className="absolute top-4 right-4 w-24 h-24 bg-white rounded-full blur-[40px]" />
              </div>
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                  <BookOpen className="size-4 text-white/70" />
                  <span className="text-white/70 text-xs font-medium">
                    {s.sermonCount} Sermons
                  </span>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="p-5">
              <h3 className="text-base font-bold text-[#4A148C] mb-1.5 group-hover:text-[#1A0033] transition-colors leading-snug">
                {s.name}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed line-clamp-2 mb-3">
                {s.description}
              </p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  {s.startDate && new Date(s.startDate).toLocaleDateString("en-NG", { month: "short", year: "numeric" })}
                  {s.endDate ? ` — ${new Date(s.endDate).toLocaleDateString("en-NG", { month: "short", year: "numeric" })}` : " — Present"}
                </span>
                <ChevronRight className="size-4 text-gray-300 group-hover:text-[#4A148C] group-hover:translate-x-0.5 transition-all" />
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}