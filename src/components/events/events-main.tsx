"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  SlidersHorizontal,
  Calendar as CalendarIcon,
  ChevronLeft,
  ChevronRight,
  X,
  ListFilter,
  Grid3X3,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { SectionWrapper, SectionTitle } from "@/components/home/section-wrapper";
import { EventCard } from "./event-card";
import { mockEvents, eventCategories, type ChurchEvent } from "./events-data";

type ViewMode = "grid" | "list";

export function EventsMain() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"" | "Recurring" | (typeof eventCategories)[number]>("");
  const [viewMode, setViewMode] = useState<ViewMode>("grid");
  const [showFilters, setShowFilters] = useState(false);

  // Calendar state
  const [calYear, setCalYear] = useState(2025);
  const [calMonth, setCalMonth] = useState(6); // July (0-indexed)

  const filteredEvents = useMemo(() => {
    return mockEvents.filter((e) => {
      const matchSearch =
        e.title.toLowerCase().includes(search.toLowerCase()) ||
        e.description.toLowerCase().includes(search.toLowerCase()) ||
        e.venue.toLowerCase().includes(search.toLowerCase());
      const matchCat = !category ||
        category === e.category ||
        (category === "Recurring" && e.isRecurring);
      return matchSearch && matchCat;
    }).sort((a, b) => a.date.localeCompare(b.date));
  }, [search, category]);

  const featuredEvents = mockEvents.filter((e) => e.featured);
  const upcomingEvents = filteredEvents.filter((e) => e.date >= new Date().toISOString().split("T")[0]);
  const pastEvents = filteredEvents.filter((e) => e.date < new Date().toISOString().split("T")[0]);

  // Calendar helpers
  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const daysInMonth = new Date(calYear, calMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(calYear, calMonth, 1).getDay();

  const eventDates = useMemo(() => {
    const dates: Record<number, ChurchEvent[]> = {};
    mockEvents.forEach((e) => {
      const d = new Date(e.date + "T00:00:00");
      if (d.getFullYear() === calYear && d.getMonth() === calMonth) {
        const day = d.getDate();
        if (!dates[day]) dates[day] = [];
        dates[day].push(e);
      }
    });
    return dates;
  }, [calYear, calMonth]);

  const calPrev = () => {
    if (calMonth === 0) {
      setCalMonth(11);
      setCalYear(calYear - 1);
    } else {
      setCalMonth(calMonth - 1);
    }
  };

  const calNext = () => {
    if (calMonth === 11) {
      setCalMonth(0);
      setCalYear(calYear + 1);
    } else {
      setCalMonth(calMonth + 1);
    }
  };

  const clearAll = () => {
    setSearch("");
    setCategory("");
  };

  const hasActiveFilters = search || category;

  const allFilterOptions = ["", "Recurring", ...eventCategories] as const;

  return (
    <section className="py-12 md:py-16 bg-[#F8FAFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionWrapper>
          <SectionTitle
            title="Church Events"
            subtitle="Stay informed about upcoming services, programmes, conferences, and community events. Register, plan, and participate."
          />
        </SectionWrapper>

        {/* Featured Events */}
        <SectionWrapper>
          <div className="space-y-5">
            {featuredEvents.map((event, i) => (
              <EventCard key={event.id} event={event} index={i} variant="featured" />
            ))}
          </div>
        </SectionWrapper>

        {/* Search + Filters */}
        <SectionWrapper>
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search events..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10 rounded-xl border-gray-200 bg-white h-10 focus:border-[#4A148C]/30"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="size-3.5" />
                </button>
              )}
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")}
                className="p-2.5 rounded-xl border border-gray-200 bg-white text-gray-500 hover:border-gray-300 transition-colors"
                title={viewMode === "grid" ? "List view" : "Grid view"}
              >
                {viewMode === "grid" ? <ListFilter className="size-4" /> : <Grid3X3 className="size-4" />}
              </button>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-2">
            {allFilterOptions.map((cat) => (
              <button
                key={cat || "all"}
                onClick={() => setCategory(cat)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                  category === cat
                    ? "bg-[#4A148C] text-white"
                    : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                }`}
              >
                {cat || "All Events"}
              </button>
            ))}
          </div>

          {hasActiveFilters && (
            <button onClick={clearAll} className="text-xs text-[#D32F2F] hover:text-[#B71C1C] mt-2">
              Clear all filters
            </button>
          )}
        </SectionWrapper>

        {/* Main layout: Events + Calendar sidebar */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Events column */}
          <div className="lg:col-span-2 space-y-6">
            {/* Upcoming */}
            {upcomingEvents.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-[#4A148C] mb-4">
                  Upcoming Events
                  <span className="text-sm font-normal text-gray-400 ml-2">({upcomingEvents.length})</span>
                </h3>
                {viewMode === "grid" ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {upcomingEvents.map((event, i) => (
                      <EventCard key={event.id} event={event} index={i} />
                    ))}
                  </div>
                ) : (
                  <div className="bg-white rounded-xl border border-gray-100 divide-y divide-gray-50 overflow-hidden">
                    {upcomingEvents.map((event, i) => (
                      <EventCard key={event.id} event={event} index={i} variant="compact" />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* Past */}
            {pastEvents.length > 0 && (
              <div>
                <h3 className="text-base font-bold text-gray-400 mb-4">
                  Past Events
                  <span className="text-sm font-normal text-gray-300 ml-2">({pastEvents.length})</span>
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {pastEvents.map((event, i) => (
                    <EventCard key={event.id} event={event} index={i} />
                  ))}
                </div>
              </div>
            )}

            {filteredEvents.length === 0 && (
              <div className="text-center py-16">
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <CalendarIcon className="size-7 text-gray-300" />
                </div>
                <h3 className="text-base font-semibold text-gray-700">No events found</h3>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filter.</p>
              </div>
            )}
          </div>

          {/* Calendar sidebar */}
          <div className="space-y-6">
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-sm font-bold text-[#4A148C]">
                  {monthNames[calMonth]} {calYear}
                </h3>
                <div className="flex items-center gap-1">
                  <button onClick={calPrev} className="p-1.5 text-gray-400 hover:text-[#4A148C] hover:bg-gray-100 rounded-lg transition-colors">
                    <ChevronLeft className="size-4" />
                  </button>
                  <button onClick={calNext} className="p-1.5 text-gray-400 hover:text-[#4A148C] hover:bg-gray-100 rounded-lg transition-colors">
                    <ChevronRight className="size-4" />
                  </button>
                </div>
              </div>

              {/* Day headers */}
              <div className="grid grid-cols-7 gap-1 mb-1">
                {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((d) => (
                  <div key={d} className="text-center text-[10px] font-semibold text-gray-400 uppercase py-1">
                    {d}
                  </div>
                ))}
              </div>

              {/* Calendar grid */}
              <div className="grid grid-cols-7 gap-1">
                {Array.from({ length: firstDayOfMonth }).map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                  const day = i + 1;
                  const hasEvents = eventDates[day];
                  const isToday = day === new Date().getDate() && calMonth === new Date().getMonth() && calYear === new Date().getFullYear();

                  return (
                    <div
                      key={day}
                      className={`aspect-square rounded-lg flex flex-col items-center justify-center text-xs relative cursor-default transition-colors ${
                        isToday
                          ? "bg-[#4A148C] text-white font-bold"
                          : hasEvents
                            ? "bg-[#F3E5F5] text-[#4A148C] font-semibold hover:bg-[#E3EAFF]"
                            : "text-gray-500 hover:bg-gray-50"
                      }`}
                    >
                      {day}
                      {hasEvents && !isToday && (
                        <div className="flex gap-0.5 mt-0.5">
                          {hasEvents.slice(0, 3).map((e, j) => (
                            <div
                              key={j}
                              className={`w-1 h-1 rounded-full ${
                                e.category === "Service" ? "bg-purple-400" :
                                e.category === "Conference" ? "bg-purple-400" :
                                e.category === "Youth" ? "bg-amber-400" :
                                e.category === "Community" ? "bg-green-400" :
                                e.category === "Special Programme" ? "bg-red-400" :
                                "bg-teal-400"
                              }`}
                            />
                          ))}
                        </div>
                      )}
                      {hasEvents && isToday && (
                        <div className="flex gap-0.5 mt-0.5">
                          {hasEvents.slice(0, 3).map((_, j) => (
                            <div key={j} className="w-1 h-1 rounded-full bg-white/70" />
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>

              {/* Legend */}
              <div className="flex flex-wrap gap-2 mt-4 pt-3 border-t border-gray-50">
                {eventCategories.slice(0, 4).map((cat) => (
                  <div key={cat} className="flex items-center gap-1.5 text-[10px] text-gray-400">
                    <div className={`w-2 h-2 rounded-full ${
                      cat === "Service" ? "bg-purple-400" :
                      cat === "Conference" ? "bg-purple-400" :
                      cat === "Community" ? "bg-green-400" :
                      "bg-red-400"
                    }`} />
                    {cat}
                  </div>
                ))}
              </div>
            </div>

            {/* Quick stats */}
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <p className="text-2xl font-bold text-[#4A148C]">{mockEvents.length}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Total Events</p>
              </div>
              <div className="bg-white rounded-xl border border-gray-100 p-4 text-center">
                <p className="text-2xl font-bold text-[#D32F2F]">{upcomingEvents.length}</p>
                <p className="text-[11px] text-gray-400 mt-0.5">Upcoming</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}