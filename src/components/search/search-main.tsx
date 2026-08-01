"use client";

import { useState, useEffect, useRef, useMemo, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  BookOpen,
  Calendar,
  Megaphone,
  Heart,
  Star,
  FileText,
  Users,
  Image,
  Clock,
  TrendingUp,
  Sparkles,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { searchAll, getPopularSearches, getSuggestedResults, typeConfig, type SearchCategory } from "./search-data";
import type { SearchResult } from "./search-data";
import { SearchResultCard } from "./search-result-card";

const categoryFilters: { value: SearchCategory; label: string }[] = [
  { value: "all", label: "All" },
  { value: "sermons", label: "Sermons" },
  { value: "events", label: "Events" },
  { value: "announcements", label: "Announcements" },
  { value: "devotionals", label: "Devotionals" },
  { value: "testimonies", label: "Testimonies" },
  { value: "pages", label: "Pages" },
  { value: "people", label: "People" },
  { value: "ministries", label: "Ministries" },
  { value: "media", label: "Media" },
];

const quickLinks = [
  { label: "Browse Sermons", href: "/sermons", icon: BookOpen },
  { label: "View Events", href: "/events", icon: Calendar },
  { label: "Read Devotionals", href: "/devotionals", icon: Heart },
  { label: "Watch Live", href: "/live", icon: Sparkles },
];

const iconMap: Record<string, React.ElementType> = {
  BookOpen,
  Calendar,
  Megaphone,
  Heart,
  Star,
  FileText,
  Users,
  Image,
  HandsPraying: Heart,
};

export function SearchMain() {
  const [query, setQuery] = useState("");
  const [activeCategory, setActiveCategory] = useState<SearchCategory>("all");
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);
  const debounceRef = useRef<NodeJS.Timeout | null>(null);
  const [debouncedQuery, setDebouncedQuery] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);

  // Auto-focus input on mount
  useEffect(() => {
    const timer = setTimeout(() => {
      inputRef.current?.focus();
    }, 300);
    return () => clearTimeout(timer);
  }, []);

  // Debounce the query
  useEffect(() => {
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }
    debounceRef.current = setTimeout(() => {
      setDebouncedQuery(query);
    }, 200);
    return () => {
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, [query]);

  // Add to recent searches when query changes (and there's a query)
  const addToRecent = useCallback(
    (term: string) => {
      if (!term.trim()) return;
      setRecentSearches((prev) => {
        const filtered = prev.filter((s) => s.toLowerCase() !== term.toLowerCase());
        return [term, ...filtered].slice(0, 5);
      });
    },
    []
  );

  // Compute search results
  const results = useMemo(() => {
    return searchAll(debouncedQuery, activeCategory);
  }, [debouncedQuery, activeCategory]);

  // Group results by type
  const groupedResults = useMemo(() => {
    const groups: Record<string, SearchResult[]> = {};
    for (const result of results) {
      if (!groups[result.type]) {
        groups[result.type] = [];
      }
      groups[result.type].push(result);
    }
    return groups;
  }, [results]);

  const popularSearches = useMemo(() => getPopularSearches(), []);
  const suggestedResults = useMemo(() => getSuggestedResults(), []);

  const hasQuery = debouncedQuery.trim().length > 0;

  const handleQuickSearch = (term: string) => {
    setQuery(term);
    addToRecent(term);
    inputRef.current?.focus();
  };

  const handleClear = () => {
    setQuery("");
    setDebouncedQuery("");
    setActiveCategory("all");
    inputRef.current?.focus();
  };

  const handleRecentClick = (term: string) => {
    setQuery(term);
    setRecentSearches((prev) => prev.filter((s) => s !== term));
    inputRef.current?.focus();
  };

  // Scroll category pills into view on mobile
  useEffect(() => {
    if (scrollRef.current) {
      const activeEl = scrollRef.current.querySelector('[data-active="true"]');
      if (activeEl) {
        activeEl.scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "center",
        });
      }
    }
  }, [activeCategory]);

  return (
    <section className="py-8 md:py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        {/* Search Input */}
        <div className="relative mb-8">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 size-5 text-gray-400" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && query.trim()) {
                  addToRecent(query.trim());
                }
              }}
              placeholder="Search sermons, events, people, and more..."
              className="w-full h-14 md:h-16 pl-12 pr-12 text-base md:text-lg rounded-2xl border border-gray-200 bg-white shadow-lg shadow-gray-200/50 focus:outline-none focus:ring-2 focus:ring-[#4A148C]/20 focus:border-[#4A148C]/40 placeholder:text-gray-400 transition-all"
            />
            {query && (
              <button
                onClick={handleClear}
                className="absolute right-4 top-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center transition-colors"
              >
                <X className="size-4 text-gray-500" />
              </button>
            )}
          </div>

          {/* Keyboard shortcut hint */}
          <div className="hidden md:flex items-center justify-center mt-2 gap-1.5 text-xs text-gray-400">
            <kbd className="px-1.5 py-0.5 rounded bg-gray-100 border border-gray-200 text-[10px] font-mono">
              Esc
            </kbd>
            <span>to clear</span>
          </div>
        </div>

        <AnimatePresence mode="wait">
          {!hasQuery ? (
            /* Default State */
            <motion.div
              key="default"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Recent Searches */}
              {recentSearches.length > 0 && (
                <div className="mb-8">
                  <div className="flex items-center gap-2 mb-3">
                    <Clock className="size-4 text-gray-400" />
                    <h3 className="text-sm font-medium text-gray-500">
                      Recent Searches
                    </h3>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {recentSearches.map((term) => (
                      <button
                        key={term}
                        onClick={() => handleRecentClick(term)}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-white border border-gray-200 text-sm text-gray-600 hover:bg-gray-50 hover:border-gray-300 transition-colors"
                      >
                        <Clock className="size-3 text-gray-400" />
                        {term}
                        <X className="size-3 text-gray-300 ml-1" />
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* Popular Searches */}
              <div className="mb-10">
                <div className="flex items-center gap-2 mb-3">
                  <TrendingUp className="size-4 text-[#D32F2F]" />
                  <h3 className="text-sm font-medium text-gray-700">
                    Popular Searches
                  </h3>
                </div>
                <div className="flex flex-wrap gap-2">
                  {popularSearches.map((term) => (
                    <button
                      key={term}
                      onClick={() => handleQuickSearch(term)}
                      className="px-3.5 py-1.5 rounded-full bg-[#EBF0FA] border border-[#c5d3f0] text-sm font-medium text-[#4A148C] hover:bg-[#dce4f8] transition-colors capitalize"
                    >
                      {term}
                    </button>
                  ))}
                </div>
              </div>

              {/* Quick Links */}
              <div className="mb-10">
                <h3 className="text-sm font-medium text-gray-700 mb-3">
                  Quick Links
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {quickLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className="group flex items-center gap-3 p-4 rounded-xl bg-white border border-gray-200/80 hover:border-[#4A148C]/20 hover:shadow-md transition-all"
                    >
                      <div className="w-10 h-10 rounded-lg bg-[#F3E5F5] flex items-center justify-center group-hover:bg-[#4A148C] transition-colors">
                        <link.icon className="size-5 text-[#4A148C] group-hover:text-white transition-colors" />
                      </div>
                      <span className="text-sm font-medium text-gray-700 group-hover:text-[#4A148C] transition-colors">
                        {link.label}
                      </span>
                    </Link>
                  ))}
                </div>
              </div>

              {/* Suggested / Trending Content */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <Sparkles className="size-4 text-amber-500" />
                  <h3 className="text-sm font-medium text-gray-700">
                    Suggested For You
                  </h3>
                </div>
                <div className="space-y-3">
                  {suggestedResults.map((result, index) => (
                    <SearchResultCard
                      key={result.id}
                      result={result}
                      index={index}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          ) : (
            /* Results State */
            <motion.div
              key="results"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              transition={{ duration: 0.3 }}
            >
              {/* Category filter pills */}
              <div
                ref={scrollRef}
                className="mb-6 -mx-4 px-4 overflow-x-auto scrollbar-none"
              >
                <div className="flex gap-2 pb-2 min-w-max md:min-w-0 md:flex-wrap">
                  {categoryFilters.map((cat) => {
                    const isActive = activeCategory === cat.value;
                    const count =
                      cat.value === "all"
                        ? results.length
                        : results.filter((r) => {
                            const typeMap: Record<string, string[]> = {
                              sermons: ["sermon"],
                              events: ["event"],
                              announcements: ["announcement"],
                              devotionals: ["devotional"],
                              testimonies: ["testimony"],
                              pages: ["page"],
                              people: ["leader"],
                              ministries: ["ministry"],
                              media: ["gallery"],
                            };
                            return typeMap[cat.value]?.includes(r.type);
                          }).length;

                    return (
                      <button
                        key={cat.value}
                        data-active={isActive}
                        onClick={() => setActiveCategory(cat.value)}
                        className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                          isActive
                            ? "bg-[#4A148C] text-white shadow-md shadow-[#4A148C]/20"
                            : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 hover:border-gray-300"
                        }`}
                      >
                        {cat.label}
                        {count > 0 && (
                          <span
                            className={`text-[11px] px-1.5 py-0.5 rounded-full ${
                              isActive
                                ? "bg-white/20 text-white"
                                : "bg-gray-100 text-gray-500"
                            }`}
                          >
                            {count}
                          </span>
                        )}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Results count */}
              <div className="mb-4 text-sm text-gray-500">
                {results.length} result{results.length !== 1 ? "s" : ""} found
                for &ldquo;
                <span className="font-semibold text-gray-700">
                  {debouncedQuery}
                </span>
                &rdquo;
              </div>

              {/* Results grouped by type */}
              {results.length > 0 ? (
                <div className="space-y-8">
                  {Object.entries(groupedResults).map(
                    ([type, typeResults]) => {
                      const config = typeConfig[type];
                      const IconComp = iconMap[config.icon] || FileText;

                      return (
                        <div key={type}>
                          {/* Type group header */}
                          <div className="flex items-center gap-2.5 mb-3">
                            <div
                              className={`w-7 h-7 rounded-md flex items-center justify-center ${config.bgColor} border ${config.borderColor}`}
                            >
                              <IconComp
                                className={`size-3.5 ${config.textColor}`}
                              />
                            </div>
                            <h3 className="text-sm font-semibold text-gray-700">
                              {config.label}s
                            </h3>
                            <span className="text-xs text-gray-400">
                              ({typeResults.length})
                            </span>
                            <div className="flex-1 h-px bg-gray-200" />
                          </div>

                          {/* Results list */}
                          <div className="space-y-3">
                            {typeResults.map((result, idx) => (
                              <SearchResultCard
                                key={result.id}
                                result={result}
                                index={idx}
                              />
                            ))}
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              ) : (
                /* No results state */
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-20 h-20 rounded-2xl bg-gray-100 flex items-center justify-center mx-auto mb-5">
                    <Search className="size-8 text-gray-300" />
                  </div>
                  <h3 className="text-xl font-semibold text-gray-800 mb-2">
                    No results found
                  </h3>
                  <p className="text-gray-500 text-sm max-w-md mx-auto mb-6">
                    We couldn&apos;t find anything matching &ldquo;
                    <span className="font-medium">{debouncedQuery}</span>&rdquo;.
                    Try a different search term or browse our popular topics.
                  </p>
                  <div className="flex flex-wrap gap-2 justify-center">
                    {popularSearches.slice(0, 5).map((term) => (
                      <button
                        key={term}
                        onClick={() => handleQuickSearch(term)}
                        className="px-3.5 py-1.5 rounded-full bg-[#EBF0FA] border border-[#c5d3f0] text-sm font-medium text-[#4A148C] hover:bg-[#dce4f8] transition-colors capitalize"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}