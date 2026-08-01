"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { AdminSidebar } from "./admin-sidebar";
import { AdminTopbar } from "./admin-topbar";
import { StatsCards } from "./stats-cards";
import { AttendanceChart } from "./attendance-chart";
import { PendingItems } from "./pending-items";
import { RecentActivity } from "./recent-activity";
import { QuickActions } from "./quick-actions";

export function AdminDashboard() {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const today = new Date().toLocaleDateString("en-US", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="fixed inset-0 z-50 flex bg-[#F3E5F5]">
      {/* Sidebar */}
      <AdminSidebar
        activeItem="Dashboard"
        isOpen={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      {/* Main Content Area */}
      <div className="flex flex-1 flex-col pl-0 lg:pl-64">
        {/* Top Bar */}
        <AdminTopbar
          pageTitle="Dashboard"
          onMenuClick={() => setSidebarOpen(true)}
        />

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mb-6"
            >
              <h2 className="text-xl font-bold text-[#4A148C] sm:text-2xl">
                Welcome back, Admin
              </h2>
              <p className="mt-1 text-sm text-[#4A148C]/50">{today}</p>
            </motion.div>

            {/* Stats Cards */}
            <div className="mb-6">
              <StatsCards />
            </div>

            {/* Chart + Pending Items */}
            <div className="mb-6 grid gap-6 lg:grid-cols-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-3"
              >
                <AttendanceChart />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="lg:col-span-2"
              >
                <PendingItems />
              </motion.div>
            </div>

            {/* Recent Activity + Quick Actions */}
            <div className="grid gap-6 lg:grid-cols-5">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.35 }}
                className="lg:col-span-3"
              >
                <RecentActivity />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="lg:col-span-2"
              >
                <QuickActions />
              </motion.div>
            </div>

            {/* Bottom spacing */}
            <div className="h-8" />
          </div>
        </div>
      </div>
    </div>
  );
}