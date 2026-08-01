"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { dashboardChartData } from "./admin-data";

const data = dashboardChartData.weeklyAttendance;
const maxValue = Math.max(...data.map((d) => d.value));
const chartHeight = 220;
const barWidth = 32;

export function AttendanceChart() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  return (
    <Card className="border-[#EBF0FA] bg-white shadow-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-base font-semibold text-[#4A148C]">
          Last 8 Weeks Attendance
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-end gap-2 sm:gap-4" style={{ height: chartHeight }}>
          {data.map((item, index) => {
            const barHeight = (item.value / maxValue) * (chartHeight - 50);
            const isHovered = hoveredIndex === index;

            return (
              <div
                key={item.week}
                className="group relative flex flex-1 flex-col items-center justify-end"
                onMouseEnter={() => setHoveredIndex(index)}
                onMouseLeave={() => setHoveredIndex(null)}
              >
                {/* Tooltip */}
                <motion.div
                  initial={false}
                  animate={{
                    opacity: isHovered ? 1 : 0,
                    y: isHovered ? 0 : 4,
                  }}
                  transition={{ duration: 0.15 }}
                  className="pointer-events-none absolute -top-10 z-10 rounded-lg bg-[#4A148C] px-3 py-1.5 shadow-lg"
                >
                  <p className="whitespace-nowrap text-xs font-bold text-white">
                    {item.value.toLocaleString()}
                  </p>
                  <div className="absolute -bottom-1 left-1/2 size-2 -translate-x-1/2 rotate-45 bg-[#4A148C]" />
                </motion.div>

                {/* Bar */}
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: barHeight }}
                  transition={{
                    duration: 0.6,
                    delay: index * 0.08,
                    ease: "easeOut",
                  }}
                  className="w-full max-w-[barWidth] cursor-pointer rounded-t-lg transition-colors"
                  style={{
                    maxWidth: barWidth,
                    backgroundColor: isHovered ? "#4A148C" : "#4A148C33",
                  }}
                />

                {/* Label */}
                <p
                  className={`mt-2 text-center text-[10px] transition-colors sm:text-xs ${
                    isHovered
                      ? "font-semibold text-[#4A148C]"
                      : "text-[#4A148C]/45"
                  }`}
                >
                  <span className="hidden sm:inline">{item.week}</span>
                  <span className="sm:hidden">
                    {item.week.split(" ")[1]}
                  </span>
                </p>
              </div>
            );
          })}
        </div>

        {/* Summary */}
        <div className="mt-4 flex items-center justify-between border-t border-[#EBF0FA] pt-4">
          <div>
            <p className="text-xs text-[#4A148C]/50">Average Attendance</p>
            <p className="text-lg font-bold text-[#4A148C]">
              {Math.round(
                data.reduce((sum, d) => sum + d.value, 0) / data.length
              ).toLocaleString()}
            </p>
          </div>
          <div className="text-right">
            <p className="text-xs text-[#4A148C]/50">Peak This Period</p>
            <p className="text-lg font-bold text-[#2E7D32]">
              {maxValue.toLocaleString()}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}