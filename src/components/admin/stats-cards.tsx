"use client";

import { motion } from "framer-motion";
import {
  Users,
  UserCheck,
  TrendingUp,
  Building2,
  MessageSquare,
  BookOpen,
  ArrowUpRight,
  ArrowDownRight,
} from "lucide-react";
import { dashboardStats } from "./admin-data";

interface StatCardData {
  label: string;
  value: string;
  change: string;
  changeDirection: "up" | "down";
  icon: React.ElementType;
  gradient: string;
  iconBg: string;
}

const statsData: StatCardData[] = [
  {
    label: "Total Members",
    value: dashboardStats.totalMembers.toLocaleString(),
    change: "+8.2%",
    changeDirection: "up",
    icon: Users,
    gradient: "from-[#4A148C] to-[#7B1FA2]",
    iconBg: "bg-[#4A148C]/10",
  },
  {
    label: "Weekly Attendance",
    value: dashboardStats.weeklyAttendance.toLocaleString(),
    change: "+5.1%",
    changeDirection: "up",
    icon: UserCheck,
    gradient: "from-[#2E7D32] to-[#43A047]",
    iconBg: "bg-[#2E7D32]/10",
  },
  {
    label: "Monthly Growth",
    value: `${dashboardStats.monthlyGrowth}%`,
    change: "+2.3%",
    changeDirection: "up",
    icon: TrendingUp,
    gradient: "from-[#C62828] to-[#FB8C00]",
    iconBg: "bg-[#C62828]/10",
  },
  {
    label: "Active Ministries",
    value: dashboardStats.activeMinistries.toString(),
    change: "+1",
    changeDirection: "up",
    icon: Building2,
    gradient: "from-[#6A1B9A] to-[#8E24AA]",
    iconBg: "bg-[#6A1B9A]/10",
  },
  {
    label: "Prayer Requests",
    value: dashboardStats.prayerRequests.toString(),
    change: "+15.6%",
    changeDirection: "up",
    icon: MessageSquare,
    gradient: "from-[#00695C] to-[#00897B]",
    iconBg: "bg-[#00695C]/10",
  },
  {
    label: "Published Sermons",
    value: dashboardStats.totalSermons.toLocaleString(),
    change: "-2.1%",
    changeDirection: "down",
    icon: BookOpen,
    gradient: "from-[#AD1457] to-[#D81B60]",
    iconBg: "bg-[#AD1457]/10",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: "easeOut" },
  },
};

export function StatsCards() {
  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 xl:grid-cols-6"
    >
      {statsData.map((stat) => {
        const IconComponent = stat.icon;
        return (
          <motion.div
            key={stat.label}
            variants={itemVariants}
            className="group relative overflow-hidden rounded-xl border border-[#EBF0FA] bg-white p-4 shadow-sm transition-shadow hover:shadow-md sm:p-5"
          >
            {/* Background Accent */}
            <div
              className={`absolute -right-3 -top-3 size-20 rounded-full bg-gradient-to-br ${stat.gradient} opacity-5 transition-opacity group-hover:opacity-10`}
            />

            <div className="relative flex flex-col gap-3">
              {/* Icon */}
              <div
                className={`flex size-10 items-center justify-center rounded-lg ${stat.iconBg}`}
              >
                <IconComponent className="size-5 text-[#4A148C]" />
              </div>

              {/* Value */}
              <div>
                <p className="text-2xl font-bold tracking-tight text-[#4A148C] sm:text-3xl">
                  {stat.value}
                </p>
                <p className="mt-0.5 text-xs font-medium text-[#4A148C]/50 sm:text-sm">
                  {stat.label}
                </p>
              </div>

              {/* Change Indicator */}
              <div className="flex items-center gap-1">
                {stat.changeDirection === "up" ? (
                  <ArrowUpRight className="size-3.5 text-[#2E7D32]" />
                ) : (
                  <ArrowDownRight className="size-3.5 text-[#D32F2F]" />
                )}
                <span
                  className={`text-xs font-semibold ${
                    stat.changeDirection === "up"
                      ? "text-[#2E7D32]"
                      : "text-[#D32F2F]"
                  }`}
                >
                  {stat.change}
                </span>
                <span className="text-xs text-[#4A148C]/40">vs last period</span>
              </div>
            </div>
          </motion.div>
        );
      })}
    </motion.div>
  );
}