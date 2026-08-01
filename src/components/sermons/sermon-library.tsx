"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  ArrowRight,
  ArrowLeft,
  SlidersHorizontal,
  BookOpen,
  SortAsc,
  ListFilter,
  ChevronDown,
  X,
  Headphones,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { SectionWrapper, SectionTitle } from "@/components/home/section-wrapper";
import { FeaturedSermon } from "./featured-sermon";
import { SermonSeriesGrid } from "./sermon-series-grid";
import { SermonCard } from "./sermon-card";
import { SermonPlayerModal } from "./sermon-player-modal";
import {
  mockSermons,
  mockSermonSeries,
  sermonCategories,
  sortOptions,
  allSpeakers,
} from "./sermon-data";
import type { Sermon, SermonSeries } from "./sermon-data";

type ViewMode = "home" | "series" | "all";

export function SermonLibrary() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("All");
  const [sortBy, setSortBy] = useState("newest");
  const [speakerFilter, setSpeakerFilter] = useState("All");
  const [viewMode, setViewMode] = useState<ViewMode>("home");
  const [selectedSeries, setSelectedSeries] = useState<SermonSeries | null>(null);
  const [activeSermon, setActiveSermon] = useState<Sermon | null>(null);
  const [showFilters, setShowFilters] = useState(false);

  const featuredSermon = mockSermons.find((s) => s.isFeatured) || mockSermons[0];

  // Filtered sermons
  const filteredSermons = useMemo(() => {
    let result = mockSermons.filter((s) => {
      const matchSearch =
        s.title.toLowerCase().includes(search.toLowerCase()) ||
        s.speaker.toLowerCase().includes(search.toLowerCase()) ||
        s.description.toLowerCase().includes(search.toLowerCase()) ||
        s.scriptures.some((sc) => sc.toLowerCase().includes(search.toLowerCase())) ||
        s.tags.some((t) => t.toLowerCase().includes(search.toLowerCase()));
      const matchCat = category === "All" || s.category === category;
      const matchSpeaker = speakerFilter === "All" || s.speaker === speakerFilter;
      const matchSeries = !selectedSeries || s.seriesId === selectedSeries.id;
      return matchSearch && matchCat && matchSpeaker && matchSeries;
    });

    // Sort
    switch (sortBy) {
      case "newest":
        result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
        break;
      case "oldest":
        result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());
        break;
      case "title-az":
        result.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case "title-za":
        result.sort((a, b) => b.title.localeCompare(a.title));
        break;
    }

    return result;
  }, [search, category, sortBy, speakerFilter, selectedSeries]);

  // Build playlist for the modal
  const playlistSermons = useMemo(() => {
    if (selectedSeries) {
      return mockSermons.filter((s) => s.seriesId === selectedSeries.id);
    }
    return filteredSermons;
  }, [selectedSeries, filteredSermons]);

  const openSermon = (sermon: Sermon) => {
    setActiveSermon(sermon);
  };

  const selectSeries = (series: SermonSeries) => {
    setSelectedSeries(series);
    setViewMode("series");
    setSearch("");
    setCategory("All");
    setSpeakerFilter("All");
  };

  const clearSeries = () => {
    setSelectedSeries(null);
    setViewMode("home");
  };

  const showAllView = () => {
    setViewMode("all");
    setSelectedSeries(null);
  };

  const backToHome = () => {
    setViewMode("home");
    setSelectedSeries(null);
    setSearch("");
    setCategory("All");
    setSpeakerFilter("All");
    setSortBy("newest");
  };

  const activeFiltersCount = [
    category !== "All",
    speakerFilter !== "All",
    sortBy !== "newest",
  ].filter(Boolean).length;

  const clearAllFilters = () => {
    setCategory("All");
    setSpeakerFilter("All");
    setSortBy("newest");
    setSearch("");
  };

  return (
    <section className="py-12 md:py-16 bg-[#F8FAFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionWrapper>
          <SectionTitle
            title="Sermon Library"
            subtitle="Explore our archive of anointed messages, Bible studies, and spiritual teachings. Be transformed by the Word of God."
          />
        </SectionWrapper>

        {/* HOME VIEW: Featured + Series */}
        {viewMode === "home" && (
          <>
            <SectionWrapper>
              <FeaturedSermon sermon={featuredSermon} onPlay={openSermon} />
            </SectionWrapper>

            <SectionWrapper>
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl md:text-2xl font-bold text-[#4A148C]">Sermon Series</h2>
                <button
                  onClick={showAllView}
                  className="text-sm text-[#4A148C] hover:text-[#1A0033] font-medium flex items-center gap-1 transition-colors"
                >
                  View All Sermons
                  <ArrowRight className="size-4" />
                </button>
              </div>
              <SermonSeriesGrid series={mockSermonSeries} onSelect={selectSeries} />
            </SectionWrapper>

            {/* Quick stats */}
            <SectionWrapper>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-8">
                {[
                  { label: "Total Sermons", value: mockSermons.length.toString(), icon: BookOpen },
                  { label: "Series", value: mockSermonSeries.length.toString(), icon: ListFilter },
                  { label: "Speakers", value: allSpeakers.length.toString(), icon: Headphones },
                  { label: "With Notes", value: mockSermons.filter((s) => s.hasNotes).length.toString(), icon: BookOpen },
                ].map((stat) => (
                  <div
                    key={stat.label}
                    className="bg-white rounded-xl border border-gray-100 p-4 text-center"
                  >
                    <stat.icon className="size-5 text-[#4A148C]/40 mx-auto mb-2" />
                    <p className="text-2xl font-bold text-[#4A148C]">{stat.value}</p>
                    <p className="text-xs text-gray-500 mt-0.5">{stat.label}</p>
                  </div>
                ))}
              </div>
            </SectionWrapper>
          </>
        )}

        {/* SERIES VIEW */}
        {viewMode === "series" && selectedSeries && (
          <div className="mb-6">
            <button
              onClick={clearSeries}
              className="text-sm text-[#4A148C] hover:text-[#1A0033] font-medium flex items-center gap-1.5 transition-colors mb-3"
            >
              <ArrowLeft className="size-4 rotate-180" />
              Back to Series
            </button>
            <div className="bg-white rounded-xl border border-gray-100 p-5 mb-2">
              <div className={`w-full h-3 bg-gradient-to-r ${selectedSeries.coverGradient} rounded-lg mb-4`} />
              <h2 className="text-2xl md:text-3xl font-bold text-[#4A148C] mb-1">
                {selectedSeries.name}
              </h2>
              <p className="text-sm text-gray-500 mb-2">{selectedSeries.description}</p>
              <p className="text-xs text-gray-400">
                {selectedSeries.sermonCount} sermons &middot;{" "}
                {new Date(selectedSeries.startDate).toLocaleDateString("en-NG", { month: "short", year: "numeric" })}
                {selectedSeries.endDate ? ` — ${new Date(selectedSeries.endDate).toLocaleDateString("en-NG", { month: "short", year: "numeric" })}` : ""}
              </p>
            </div>
          </div>
        )}

        {/* ALL SERMONS VIEW */}
        {viewMode === "all" && (
          <div className="mb-6">
            <button
              onClick={backToHome}
              className="text-sm text-[#4A148C] hover:text-[#1A0033] font-medium flex items-center gap-1.5 transition-colors mb-2"
            >
              <ArrowLeft className="size-4 rotate-180" />
              Back to Library Home
            </button>
          </div>
        )}

        {/* SEARCH + FILTERS (shown in series and all views) */}
        {(viewMode === "series" || viewMode === "all") && (
          <SectionWrapper>
            {/* Search bar */}
            <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-4">
              <div className="relative flex-1 max-w-md">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
                <Input
                  placeholder="Search by title, speaker, scripture, or topic..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="pl-10 rounded-xl border-gray-200 bg-white h-10 focus:border-[#4A148C]/30"
                />
                {search && (
                  <button
                    onClick={() => setSearch("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    <X className="size-3.5" />
                  </button>
                )}
              </div>

              <button
                onClick={() => setShowFilters(!showFilters)}
                className={`inline-flex items-center gap-2 px-4 py-2.5 rounded-xl text-sm font-medium border transition-colors h-10 ${
                  showFilters || activeFiltersCount > 0
                    ? "bg-[#4A148C] text-white border-[#4A148C]"
                    : "bg-white text-gray-600 border-gray-200 hover:border-gray-300"
                }`}
              >
                <SlidersHorizontal className="size-4" />
                Filters
                {activeFiltersCount > 0 && (
                  <span className="w-5 h-5 rounded-full bg-[#D32F2F] text-white text-[10px] font-bold flex items-center justify-center">
                    {activeFiltersCount}
                  </span>
                )}
              </button>
            </div>

            {/* Category pills (always visible) */}
            <div className="flex flex-wrap gap-2 mb-4">
              {sermonCategories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => setCategory(cat)}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    category === cat
                      ? "bg-[#4A148C] text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Expandable filters panel */}
            <AnimatePresence>
              {showFilters && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.25 }}
                  className="overflow-hidden"
                >
                  <div className="bg-white rounded-xl border border-gray-100 p-5 mb-4">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Sort */}
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <SortAsc className="size-3" />
                          Sort By
                        </label>
                        <div className="relative">
                          <select
                            value={sortBy}
                            onChange={(e) => setSortBy(e.target.value)}
                            className="w-full h-10 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 appearance-none focus:outline-none focus:border-[#4A148C]/30"
                          >
                            {sortOptions.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>

                      {/* Speaker filter */}
                      <div>
                        <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                          <Headphones className="size-3" />
                          Speaker
                        </label>
                        <div className="relative">
                          <select
                            value={speakerFilter}
                            onChange={(e) => setSpeakerFilter(e.target.value)}
                            className="w-full h-10 pl-3 pr-8 rounded-lg border border-gray-200 bg-white text-sm text-gray-700 appearance-none focus:outline-none focus:border-[#4A148C]/30"
                          >
                            <option value="All">All Speakers</option>
                            {allSpeakers.map((sp) => (
                              <option key={sp} value={sp}>
                                {sp}
                              </option>
                            ))}
                          </select>
                          <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 size-4 text-gray-400 pointer-events-none" />
                        </div>
                      </div>
                    </div>

                    {activeFiltersCount > 0 && (
                      <div className="mt-4 pt-3 border-t border-gray-100">
                        <button
                          onClick={clearAllFilters}
                          className="text-xs font-medium text-[#D32F2F] hover:text-[#B71C1C] transition-colors"
                        >
                          Clear All Filters
                        </button>
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Results count */}
            <div className="flex items-center justify-between mb-5">
              <p className="text-sm text-gray-500">
                <span className="font-semibold text-[#4A148C]">{filteredSermons.length}</span>{" "}
                sermon{filteredSermons.length !== 1 ? "s" : ""}
                {selectedSeries && (
                  <span> in <span className="font-medium text-gray-700">{selectedSeries.name}</span></span>
                )}
              </p>
              {search && (
                <p className="text-xs text-gray-400">
                  Results for &ldquo;{search}&rdquo;
                </p>
              )}
            </div>
          </SectionWrapper>
        )}

        {/* SERMON LIST (series view or all view) */}
        {(viewMode === "series" || viewMode === "all") && (
          <>
            {filteredSermons.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4 md:gap-5">
                {filteredSermons.map((sermon, i) => (
                  <SermonCard
                    key={sermon.id}
                    sermon={sermon}
                    index={i}
                    series={selectedSeries || mockSermonSeries.find((s) => s.id === sermon.seriesId)}
                    onOpen={openSermon}
                    activeId={activeSermon?.id}
                  />
                ))}
              </div>
            ) : (
              <div className="text-center py-20">
                <div className="w-20 h-20 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-4">
                  <BookOpen className="size-8 text-gray-300" />
                </div>
                <h3 className="text-lg font-semibold text-gray-700">No sermons found</h3>
                <p className="text-sm text-gray-500 mt-1">Try adjusting your search or filters.</p>
                <button
                  onClick={clearAllFilters}
                  className="mt-4 text-sm font-medium text-[#4A148C] hover:text-[#1A0033] transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            )}
          </>
        )}
      </div>

      {/* Sermon Player Modal */}
      <AnimatePresence>
        {activeSermon && (
          <SermonPlayerModal
            sermons={playlistSermons}
            initialSermon={activeSermon}
            series={selectedSeries || mockSermonSeries.find((s) => s.id === activeSermon.seriesId)}
            onClose={() => setActiveSermon(null)}
          />
        )}
      </AnimatePresence>
    </section>
  );
}