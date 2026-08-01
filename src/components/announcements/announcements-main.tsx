"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  Megaphone,
  AlertTriangle,
  CalendarCheck,
  ChevronDown,
  Pin,
  ListFilter,
  Grid3X3,
  ArrowUpDown,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { SectionWrapper, SectionTitle } from "@/components/home/section-wrapper";
import { AnnouncementCard } from "./announcement-card";
import {
  getActiveAnnouncements,
  getPinnedAnnouncements,
  announcementCategories,
  categoryLabels,
  type Announcement,
  type AnnouncementCategory,
  type AnnouncementPriority,
} from "./announcements-data";

type ViewMode = "grid" | "list";
type SortOption = "newest" | "oldest" | "priority";

const priorityOrder: Record<AnnouncementPriority, number> = {
  urgent: 0,
  high: 1,
  normal: 2,
  low: 3,
};

const priorityFilterOptions: ("all" | AnnouncementPriority)[] = [
  "all",
  "urgent",
  "high",
  "normal",
];

const ITEMS_PER_PAGE = 6;

export function AnnouncementsMain() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<AnnouncementCategory | "all">("all");
  const [priorityFilter, setPriorityFilter] = useState<
    "all" | AnnouncementPriority
  >("all");
  const [sort, setSort] = useState<SortOption>("newest");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [visibleCount, setVisibleCount] = useState(ITEMS_PER_PAGE);

  const pinnedAnnouncements = useMemo(() => getPinnedAnnouncements(), []);

  const filteredAnnouncements = useMemo(() => {
    const active = getActiveAnnouncements();
    return active.filter((a) => {
      const matchSearch =
        a.title.toLowerCase().includes(search.toLowerCase()) ||
        a.body.toLowerCase().includes(search.toLowerCase()) ||
        a.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchCat = category === "all" || a.category === category;
      const matchPri =
        priorityFilter === "all" || a.priority === priorityFilter;
      return matchSearch && matchCat && matchPri;
    });
  }, [search, category, priorityFilter]);

  const sortedAnnouncements = useMemo(() => {
    const arr = [...filteredAnnouncements];
    if (sort === "newest") {
      arr.sort((a, b) => b.date.localeCompare(a.date));
    } else if (sort === "oldest") {
      arr.sort((a, b) => a.date.localeCompare(b.date));
    } else if (sort === "priority") {
      arr.sort(
        (a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]
      );
    }
    return arr;
  }, [filteredAnnouncements, sort]);

  const visibleAnnouncements = sortedAnnouncements.slice(0, visibleCount);
  const hasMore = visibleCount < sortedAnnouncements.length;

  const urgentCount = getActiveAnnouncements().filter(
    (a) => a.priority === "urgent"
  ).length;

  const now = new Date();
  const weekStart = new Date(now);
  weekStart.setDate(now.getDate() - now.getDay());
  const weekEnd = new Date(weekStart);
  weekEnd.setDate(weekStart.getDate() + 6);
  const thisWeekCount = getActiveAnnouncements().filter((a) => {
    const d = new Date(a.date + "T00:00:00");
    return d >= weekStart && d <= weekEnd;
  }).length;

  const clearAll = () => {
    setSearch("");
    setCategory("all");
    setPriorityFilter("all");
  };

  const hasActiveFilters = search || category !== "all" || priorityFilter !== "all";

  return (
    <section className="py-12 md:py-16 bg-[#F8FAFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionWrapper>
          <SectionTitle
            title="Latest Announcements"
            subtitle="Stay informed about everything happening at Youth Church, Utako, Abuja."
          />
        </SectionWrapper>

        {/* Pinned Announcements */}
        {pinnedAnnouncements.length > 0 && (
          <SectionWrapper>
            <div className="mb-8">
              <div className="flex items-center gap-2 mb-4">
                <Pin className="size-4 text-[#D32F2F]" />
                <h3 className="text-base font-bold text-[#4A148C]">
                  Pinned Announcements
                </h3>
                <span className="text-xs text-gray-400 bg-gray-100 px-2 py-0.5 rounded-full">
                  {pinnedAnnouncements.length}
                </span>
              </div>
              <div className="bg-gradient-to-br from-[#F3E5F5] to-[#EBF0FA] rounded-2xl p-1">
                <div className="space-y-4">
                  {pinnedAnnouncements.map((ann, i) => (
                    <AnnouncementCard
                      key={ann.id}
                      announcement={ann}
                      index={i}
                      variant="featured"
                    />
                  ))}
                </div>
              </div>
            </div>
          </SectionWrapper>
        )}

        {/* Search + Filters + Sort */}
        <SectionWrapper>
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 md:p-6 mb-6">
            {/* Search row */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  placeholder="Search announcements..."
                  value={search}
                  onChange={(e) => {
                    setSearch(e.target.value);
                    setVisibleCount(ITEMS_PER_PAGE);
                  }}
                  className="pl-10 rounded-xl border-gray-200 bg-[#F8FAFF] h-10 focus:border-[#4A148C]/30"
                />
                {search && (
                  <button
                    onClick={() => {
                      setSearch("");
                      setVisibleCount(ITEMS_PER_PAGE);
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              <div className="flex items-center gap-2">
                {/* Sort dropdown */}
                <div className="relative">
                  <button
                    onClick={() => {
                      const next =
                        sort === "newest"
                          ? "oldest"
                          : sort === "oldest"
                            ? "priority"
                            : "newest";
                      setSort(next);
                    }}
                    className="flex items-center gap-1.5 px-3 py-2 rounded-xl border border-gray-200 bg-[#F8FAFF] text-xs font-medium text-gray-600 hover:border-gray-300 transition-colors"
                  >
                    <ArrowUpDown className="size-3.5" />
                    {sort === "newest"
                      ? "Newest First"
                      : sort === "oldest"
                        ? "Oldest First"
                        : "Priority"}
                  </button>
                </div>

                {/* View toggle */}
                <button
                  onClick={() =>
                    setViewMode(viewMode === "grid" ? "list" : "grid")
                  }
                  className="p-2.5 rounded-xl border border-gray-200 bg-[#F8FAFF] text-gray-500 hover:border-gray-300 transition-colors"
                  title={viewMode === "grid" ? "List view" : "Grid view"}
                >
                  {viewMode === "grid" ? (
                    <ListFilter className="size-4" />
                  ) : (
                    <Grid3X3 className="size-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Category pills */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Category
              </p>
              <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                <button
                  onClick={() => {
                    setCategory("all");
                    setVisibleCount(ITEMS_PER_PAGE);
                  }}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                    category === "all"
                      ? "bg-[#4A148C] text-white"
                      : "bg-[#F8FAFF] text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  All
                </button>
                {announcementCategories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      setCategory(cat);
                      setVisibleCount(ITEMS_PER_PAGE);
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap shrink-0 ${
                      category === cat
                        ? "bg-[#4A148C] text-white"
                        : "bg-[#F8FAFF] text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {categoryLabels[cat]}
                  </button>
                ))}
              </div>
            </div>

            {/* Priority pills */}
            <div className="mb-3">
              <p className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2">
                Priority
              </p>
              <div className="flex gap-2 flex-wrap">
                {priorityFilterOptions.map((p) => (
                  <button
                    key={p}
                    onClick={() => {
                      setPriorityFilter(p);
                      setVisibleCount(ITEMS_PER_PAGE);
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors whitespace-nowrap ${
                      priorityFilter === p
                        ? "bg-[#4A148C] text-white"
                        : "bg-[#F8FAFF] text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                    }`}
                  >
                    {p === "all" ? "All Priorities" : p.charAt(0).toUpperCase() + p.slice(1)}
                    {p === "urgent" && (
                      <AlertTriangle className="size-3 inline-block ml-1" />
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Active filters + results count */}
            <div className="flex items-center justify-between pt-3 border-t border-gray-50">
              <div className="flex items-center gap-3">
                <span className="text-sm text-gray-500">
                  <span className="font-semibold text-[#4A148C]">
                    {sortedAnnouncements.length}
                  </span>{" "}
                  announcement{sortedAnnouncements.length !== 1 ? "s" : ""}
                </span>
                {hasActiveFilters && (
                  <button
                    onClick={clearAll}
                    className="text-xs text-[#D32F2F] hover:text-[#B71C1C] font-medium"
                  >
                    Clear all filters
                  </button>
                )}
              </div>
            </div>
          </div>
        </SectionWrapper>

        {/* Main layout: Announcements grid + Stats sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Announcements column */}
          <div className="lg:col-span-3">
            <AnimatePresence mode="wait">
              {sortedAnnouncements.length === 0 ? (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -12 }}
                  className="text-center py-16"
                >
                  <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                    <Megaphone className="size-7 text-gray-300" />
                  </div>
                  <h3 className="text-base font-semibold text-gray-700">
                    No announcements found
                  </h3>
                  <p className="text-sm text-gray-500 mt-1">
                    Try adjusting your search or filter.
                  </p>
                  {hasActiveFilters && (
                    <button
                      onClick={clearAll}
                      className="mt-4 text-sm text-[#4A148C] font-medium hover:underline"
                    >
                      Reset filters
                    </button>
                  )}
                </motion.div>
              ) : viewMode === "grid" ? (
                <motion.div
                  key="grid"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4"
                >
                  {visibleAnnouncements.map((ann, i) => (
                    <AnnouncementCard
                      key={ann.id}
                      announcement={ann}
                      index={i}
                    />
                  ))}
                </motion.div>
              ) : (
                <motion.div
                  key="list"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50 overflow-hidden"
                >
                  {visibleAnnouncements.map((ann, i) => (
                    <AnnouncementCard
                      key={ann.id}
                      announcement={ann}
                      index={i}
                      variant="compact"
                    />
                  ))}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Load More */}
            {hasMore && (
              <div className="mt-8 text-center">
                <button
                  onClick={() =>
                    setVisibleCount((prev) => prev + ITEMS_PER_PAGE)
                  }
                  className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:border-[#4A148C]/30 hover:text-[#4A148C] transition-colors shadow-sm"
                >
                  <ChevronDown className="size-4" />
                  Load More ({sortedAnnouncements.length - visibleCount}{" "}
                  remaining)
                </button>
              </div>
            )}
          </div>

          {/* Stats sidebar — desktop only */}
          <div className="hidden lg:block">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  Quick Stats
                </h4>

                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-[#F3E5F5] flex items-center justify-center shrink-0">
                      <Megaphone className="size-5 text-[#4A148C]" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-[#4A148C]">
                        {getActiveAnnouncements().length}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Active Announcements
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center shrink-0">
                      <AlertTriangle className="size-5 text-[#D32F2F]" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-[#D32F2F]">
                        {urgentCount}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        Urgent Announcements
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center shrink-0">
                      <CalendarCheck className="size-5 text-[#2E7D32]" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-[#2E7D32]">
                        {thisWeekCount}
                      </p>
                      <p className="text-[11px] text-gray-400">
                        This Week
                      </p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Pinned count card */}
              <div className="bg-gradient-to-br from-[#F3E5F5] to-[#EBF0FA] rounded-2xl border border-purple-100 p-5">
                <div className="flex items-center gap-2 mb-2">
                  <Pin className="size-4 text-[#D32F2F]" />
                  <h4 className="text-xs font-semibold text-[#4A148C] uppercase tracking-wider">
                    Pinned
                  </h4>
                </div>
                <p className="text-3xl font-bold text-[#4A148C]">
                  {pinnedAnnouncements.length}
                </p>
                <p className="text-[11px] text-gray-500 mt-1">
                  Important announcements you should not miss
                </p>
              </div>

              {/* Categories breakdown */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-4">
                  By Category
                </h4>
                <div className="space-y-2.5">
                  {announcementCategories.map((cat) => {
                    const count = getActiveAnnouncements().filter(
                      (a) => a.category === cat
                    ).length;
                    if (count === 0) return null;
                    const colors: Record<string, string> = {
                      general: "bg-purple-500",
                      service: "bg-purple-500",
                      event: "bg-amber-500",
                      ministry: "bg-teal-500",
                      youth: "bg-red-500",
                      children: "bg-pink-500",
                      community: "bg-green-500",
                      admin: "bg-gray-500",
                    };
                    return (
                      <div
                        key={cat}
                        className="flex items-center justify-between"
                      >
                        <div className="flex items-center gap-2">
                          <div
                            className={`w-2.5 h-2.5 rounded-full ${colors[cat]}`}
                          />
                          <span className="text-xs text-gray-600">
                            {categoryLabels[cat]}
                          </span>
                        </div>
                        <span className="text-xs font-semibold text-gray-400">
                          {count}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
