"use client";

import { useState, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  BookOpen,
  CalendarDays,
  Flame,
  List,
  Heart,
  FlameKindling,
  Home,
  Star,
  X,
  SlidersHorizontal,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DevotionalCard } from "./devotional-card";
import { DevotionalReader } from "./devotional-reader";
import { DevotionalCalendar } from "./devotional-calendar";
import {
  devotionals,
  readingPlans,
  categoryConfig,
  getAllCategories,
  type Devotional,
  type DevotionalCategory,
} from "./devotionals-data";

const iconMap: Record<string, React.ReactNode> = {
  heart: <Heart className="size-5 text-[#D32F2F]" />,
  flame: <Flame className="size-5 text-red-500" />,
  home: <Home className="size-5 text-[#2E7D32]" />,
  star: <Star className="size-5 text-amber-500" />,
};

export function DevotionalMain() {
  const [view, setView] = useState<"today" | "all">("today");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<DevotionalCategory | "all">("all");
  const [selectedDevotional, setSelectedDevotional] = useState<Devotional | null>(null);

  const sortedDevotionals = useMemo(() => {
    return [...devotionals].sort(
      (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
    );
  }, []);

  const todayIndex = useMemo(() => {
    const today = new Date().toISOString().split("T")[0];
    return sortedDevotionals.findIndex((d) => d.date <= today);
  }, [sortedDevotionals]);

  const currentDevotional = selectedDevotional || sortedDevotionals[todayIndex] || sortedDevotionals[0];

  const currentIndex = sortedDevotionals.findIndex(
    (d) => d.id === currentDevotional.id
  );

  const handleNavigate = useCallback(
    (direction: "prev" | "next") => {
      let newIndex: number;
      if (direction === "prev") {
        newIndex = Math.max(0, currentIndex + 1);
      } else {
        newIndex = Math.min(sortedDevotionals.length - 1, currentIndex - 1);
      }
      setSelectedDevotional(sortedDevotionals[newIndex]);
    },
    [currentIndex, sortedDevotionals]
  );

  const filteredDevotionals = useMemo(() => {
    let results = sortedDevotionals;

    if (activeCategory !== "all") {
      results = results.filter((d) => d.category === activeCategory);
    }

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      results = results.filter(
        (d) =>
          d.title.toLowerCase().includes(q) ||
          d.bibleVerse.toLowerCase().includes(q) ||
          d.body.toLowerCase().includes(q) ||
          d.tags.some((t) => t.toLowerCase().includes(q)) ||
          d.author.toLowerCase().includes(q)
      );
    }

    return results;
  }, [sortedDevotionals, activeCategory, searchQuery]);

  const categories = getAllCategories();

  const dailyCount = devotionals.filter((d) => d.category === "daily").length;
  const weeklyCount = devotionals.filter((d) => d.category === "weekly").length;

  const handleSelectDate = (dateStr: string) => {
    const found = devotionals.find((d) => d.date === dateStr);
    if (found) {
      setSelectedDevotional(found);
      setView("today");
    }
  };

  const handleCardClick = (devotional: Devotional) => {
    setSelectedDevotional(devotional);
    setView("today");
  };

  const totalThisMonth = devotionals.filter((d) => {
    const date = new Date(d.date);
    const now = new Date();
    return date.getMonth() === now.getMonth() && date.getFullYear() === now.getFullYear();
  }).length;

  return (
    <section className="py-12 md:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* View Toggle */}
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
          <div className="flex items-center bg-gray-100 rounded-xl p-1">
            <button
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                view === "today"
                  ? "bg-white text-[#4A148C] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setView("today")}
            >
              <span className="flex items-center gap-1.5">
                <BookOpen className="size-4" />
                Today&apos;s Devotional
              </span>
            </button>
            <button
              className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${
                view === "all"
                  ? "bg-white text-[#4A148C] shadow-sm"
                  : "text-gray-500 hover:text-gray-700"
              }`}
              onClick={() => setView("all")}
            >
              <span className="flex items-center gap-1.5">
                <List className="size-4" />
                All Devotionals
              </span>
            </button>
          </div>

          {view === "all" && (
            <div className="relative w-full sm:w-72">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search devotionals..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 h-10 rounded-xl border-gray-200 bg-white text-sm"
              />
              {searchQuery && (
                <button
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                  onClick={() => setSearchQuery("")}
                >
                  <X className="size-3.5 text-gray-400" />
                </button>
              )}
            </div>
          )}
        </div>

        <AnimatePresence mode="wait">
          {view === "today" ? (
            <motion.div
              key="today-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
              className="grid grid-cols-1 lg:grid-cols-3 gap-8"
            >
              {/* Reader */}
              <div className="lg:col-span-2">
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 md:p-8 lg:p-10">
                  <DevotionalReader
                    devotional={currentDevotional}
                    onNavigate={handleNavigate}
                    canGoPrev={currentIndex < sortedDevotionals.length - 1}
                    canGoNext={currentIndex > 0}
                  />
                </div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Calendar */}
                <DevotionalCalendar
                  onSelectDate={handleSelectDate}
                  selectedDate={currentDevotional.date}
                />

                {/* Quick Stats */}
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <SlidersHorizontal className="size-4 text-[#4A148C]" />
                    Quick Stats
                  </h3>
                  <div className="grid grid-cols-3 gap-3">
                    <div className="text-center p-3 rounded-lg bg-[#F3E5F5]">
                      <div className="text-xl font-bold text-[#4A148C]">
                        {devotionals.length}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5 font-medium">
                        Total
                      </div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-[#F0FFF4]">
                      <div className="text-xl font-bold text-[#2E7D32]">
                        {totalThisMonth}
                      </div>
                      <div className="text-[10px] text-gray-500 mt-0.5 font-medium">
                        This Month
                      </div>
                    </div>
                    <div className="text-center p-3 rounded-lg bg-red-50">
                      <div className="text-xl font-bold text-[#D32F2F]">7</div>
                      <div className="text-[10px] text-gray-500 mt-0.5 font-medium">
                        Day Streak
                      </div>
                    </div>
                  </div>
                </div>

                {/* Reading Plans */}
                <div className="bg-white rounded-xl border border-gray-100 p-5">
                  <h3 className="text-sm font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <FlameKindling className="size-4 text-[#D32F2F]" />
                    Reading Plans
                  </h3>
                  <div className="space-y-3 max-h-72 overflow-y-auto">
                    {readingPlans.map((plan) => (
                      <div
                        key={plan.id}
                        className="flex items-start gap-3 p-3 rounded-lg bg-[#F8FAFF] hover:bg-[#F3E5F5] transition-colors cursor-pointer group"
                      >
                        <div className="w-9 h-9 rounded-lg bg-white shadow-sm flex items-center justify-center shrink-0 mt-0.5">
                          {iconMap[plan.icon]}
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-800 group-hover:text-[#4A148C] transition-colors leading-snug">
                            {plan.title}
                          </p>
                          <p className="text-xs text-gray-400 mt-0.5 flex items-center gap-2">
                            <span className="flex items-center gap-0.5">
                              <CalendarDays className="size-3" />
                              {plan.duration}
                            </span>
                            <span>&middot;</span>
                            <span>{plan.devotionalCount} entries</span>
                          </p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </motion.div>
          ) : (
            <motion.div
              key="all-view"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Category Pills */}
              <div className="flex flex-wrap items-center gap-2 mb-8">
                <button
                  className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all ${
                    activeCategory === "all"
                      ? "bg-[#4A148C] text-white"
                      : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                  }`}
                  onClick={() => setActiveCategory("all")}
                >
                  All
                </button>
                {categories.map((cat) => {
                  const config = categoryConfig[cat];
                  const count = devotionals.filter((d) => d.category === cat).length;
                  return (
                    <button
                      key={cat}
                      className={`px-3.5 py-1.5 rounded-full text-xs font-semibold transition-all flex items-center gap-1.5 ${
                        activeCategory === cat
                          ? `${config.bg} ${config.text} ring-1 ring-current/20`
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                      }`}
                      onClick={() => setActiveCategory(cat)}
                    >
                      {config.label}
                      <span className="opacity-60">{count}</span>
                    </button>
                  );
                })}
              </div>

              {/* Results Count */}
              <p className="text-sm text-gray-400 mb-6">
                Showing{" "}
                <span className="font-semibold text-gray-600">
                  {filteredDevotionals.length}
                </span>{" "}
                {filteredDevotionals.length === 1 ? "devotional" : "devotionals"}
                {activeCategory !== "all" && (
                  <span>
                    {" "}
                    in{" "}
                    <Badge
                      className={`${categoryConfig[activeCategory].bg} ${categoryConfig[activeCategory].text} border-0 text-[10px] align-middle ml-1`}
                    >
                      {categoryConfig[activeCategory].label}
                    </Badge>
                  </span>
                )}
                {searchQuery && (
                  <span>
                    {" "}
                    for &ldquo;
                    <span className="text-gray-600 font-medium">
                      {searchQuery}
                    </span>
                    &rdquo;
                  </span>
                )}
              </p>

              {/* Grid */}
              {filteredDevotionals.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                  {filteredDevotionals.map((devotional, i) => (
                    <DevotionalCard
                      key={devotional.id}
                      devotional={devotional}
                      index={i}
                      onClick={handleCardClick}
                    />
                  ))}
                </div>
              ) : (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-4">
                    <Search className="size-7 text-gray-300" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-1">
                    No devotionals found
                  </h3>
                  <p className="text-sm text-gray-400 max-w-sm mx-auto">
                    Try adjusting your search or filter to find what you are
                    looking for.
                  </p>
                  <Button
                    variant="outline"
                    className="mt-4 border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl h-10 px-6 text-sm font-medium"
                    onClick={() => {
                      setSearchQuery("");
                      setActiveCategory("all");
                    }}
                  >
                    Clear Filters
                  </Button>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}