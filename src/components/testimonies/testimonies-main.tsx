"use client";

import { useState, useMemo, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  X,
  ArrowUpDown,
  Heart,
  BookOpen,
  Sparkles,
  TrendingUp,
  Plus,
} from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  SectionWrapper,
  SectionTitle,
} from "@/components/home/section-wrapper";
import { TestimonyCard } from "./testimony-card";
import { TestimonyForm } from "./testimony-form";
import {
  testimonies,
  categoryLabels,
  categoryIcons,
  type TestimonyCategory,
} from "./testimonies-data";

type SortOption = "newest" | "most_liked" | "oldest";

const allCategories: TestimonyCategory[] = [
  "healing",
  "provision",
  "family",
  "career",
  "salvation",
  "miracle",
  "guidance",
  "protection",
  "academic",
  "other",
];

export function TestimoniesMain() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState<"" | TestimonyCategory>("");
  const [sort, setSort] = useState<SortOption>("newest");
  const [showForm, setShowForm] = useState(false);
  const formRef = useRef<HTMLDivElement>(null);

  const featuredTestimony = testimonies.reduce((prev, curr) =>
    curr.likes > prev.likes ? curr : prev
  );

  const filteredTestimonies = useMemo(() => {
    let result = testimonies.filter((t) => {
      const matchSearch =
        !search ||
        t.title.toLowerCase().includes(search.toLowerCase()) ||
        t.body.toLowerCase().includes(search.toLowerCase()) ||
        t.name.toLowerCase().includes(search.toLowerCase());
      const matchCat = !category || t.category === category;
      return matchSearch && matchCat;
    });

    if (sort === "newest") {
      result.sort(
        (a, b) =>
          new Date(b.date).getTime() - new Date(a.date).getTime()
      );
    } else if (sort === "most_liked") {
      result.sort((a, b) => b.likes - a.likes);
    } else {
      result.sort(
        (a, b) =>
          new Date(a.date).getTime() - new Date(b.date).getTime()
      );
    }

    return result;
  }, [search, category, sort]);

  const stats = useMemo(() => {
    const now = new Date();
    const thisMonth = now.getMonth();
    const thisYear = now.getFullYear();
    const thisMonthCount = testimonies.filter((t) => {
      const d = new Date(t.date);
      return d.getMonth() === thisMonth && d.getFullYear() === thisYear;
    }).length;

    const catBreakdown: Record<string, number> = {};
    testimonies.forEach((t) => {
      catBreakdown[t.category] = (catBreakdown[t.category] || 0) + 1;
    });

    return {
      total: testimonies.length,
      thisMonth: thisMonthCount,
      categories: Object.entries(catBreakdown).sort(
        (a, b) => b[1] - a[1]
      ),
    };
  }, []);

  const clearAll = () => {
    setSearch("");
    setCategory("");
  };

  const hasActiveFilters = search || category;

  const scrollToForm = () => {
    setShowForm(true);
    setTimeout(() => {
      formRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 100);
  };

  return (
    <section className="py-12 md:py-16 bg-[#F8FAFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Featured Testimony */}
        <SectionWrapper>
          <div className="mb-2">
            <SectionTitle
              title="Testimonies of God's Faithfulness"
              subtitle="Real stories from real people in our church family. Be encouraged by what God has done."
            />
          </div>
        </SectionWrapper>

        <SectionWrapper>
          <div className="mb-10">
            <TestimonyCard
              testimony={featuredTestimony}
              index={0}
              variant="featured"
            />
          </div>
        </SectionWrapper>

        {/* Stats Section */}
        <SectionWrapper>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-10">
            <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-[#F3E5F5] flex items-center justify-center mx-auto mb-3">
                <Heart className="size-5 text-[#4A148C]" />
              </div>
              <p className="text-2xl font-bold text-[#4A148C]">
                {stats.total}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Total Testimonies
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-red-50 flex items-center justify-center mx-auto mb-3">
                <TrendingUp className="size-5 text-[#D32F2F]" />
              </div>
              <p className="text-2xl font-bold text-[#D32F2F]">
                {stats.thisMonth}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">This Month</p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-green-50 flex items-center justify-center mx-auto mb-3">
                <Sparkles className="size-5 text-[#2E7D32]" />
              </div>
              <p className="text-2xl font-bold text-[#2E7D32]">
                {stats.categories[0]?.[1] || 0}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">
                Top Category: {stats.categories[0] ? categoryLabels[stats.categories[0][0] as TestimonyCategory] : "—"}
              </p>
            </div>
            <div className="bg-white rounded-xl border border-gray-100 p-5 text-center">
              <div className="w-10 h-10 rounded-xl bg-amber-50 flex items-center justify-center mx-auto mb-3">
                <Plus className="size-5 text-amber-600" />
              </div>
              <p className="text-2xl font-bold text-amber-600">
                {testimonies.reduce((acc, t) => acc + t.likes, 0)}
              </p>
              <p className="text-xs text-gray-400 mt-0.5">Total Praises</p>
            </div>
          </div>
        </SectionWrapper>

        {/* Browse Testimonies Section */}
        <SectionWrapper>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-bold text-[#4A148C]">
              Browse Testimonies
            </h3>
            <Button
              onClick={scrollToForm}
              className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-xl h-9 px-4 text-sm font-semibold"
            >
              <Plus className="size-4 mr-1.5" />
              Share Yours
            </Button>
          </div>

          {/* Search + Sort */}
          <div className="flex flex-col sm:flex-row gap-3 items-stretch sm:items-center mb-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-gray-400" />
              <Input
                placeholder="Search testimonies..."
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

            <div className="flex items-center gap-2">
              <ArrowUpDown className="size-4 text-gray-400" />
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortOption)}
                className="h-10 rounded-xl border border-gray-200 bg-white px-3 text-sm text-gray-600 focus:outline-none focus:border-[#4A148C]/30 cursor-pointer"
              >
                <option value="newest">Newest First</option>
                <option value="most_liked">Most Liked</option>
                <option value="oldest">Oldest First</option>
              </select>
            </div>
          </div>

          {/* Category pills */}
          <div className="flex flex-wrap gap-2 mb-2">
            <button
              onClick={() => setCategory("")}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                category === ""
                  ? "bg-[#4A148C] text-white"
                  : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
              }`}
            >
              All
            </button>
            {allCategories.map((cat) => {
              const IconComp = categoryIcons[cat];
              return (
                <button
                  key={cat}
                  onClick={() => setCategory(category === cat ? "" : cat)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium transition-colors ${
                    category === cat
                      ? "bg-[#4A148C] text-white"
                      : "bg-white text-gray-600 border border-gray-200 hover:border-gray-300 hover:bg-gray-50"
                  }`}
                >
                  <IconComp className="size-3" />
                  {categoryLabels[cat]}
                </button>
              );
            })}
          </div>

          {hasActiveFilters && (
            <button
              onClick={clearAll}
              className="text-xs text-[#D32F2F] hover:text-[#B71C1C] mt-2 mb-2"
            >
              Clear all filters
            </button>
          )}
        </SectionWrapper>

        {/* Testimony Grid */}
        <SectionWrapper>
          <AnimatePresence mode="wait">
            {filteredTestimonies.length > 0 ? (
              <motion.div
                key={`${category}-${sort}-${search}`}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5"
              >
                {filteredTestimonies.map((testimony, i) => (
                  <TestimonyCard
                    key={testimony.id}
                    testimony={testimony}
                    index={i}
                  />
                ))}
              </motion.div>
            ) : (
              <motion.div
                key="empty"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="text-center py-16"
              >
                <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mx-auto mb-3">
                  <Search className="size-7 text-gray-300" />
                </div>
                <h3 className="text-base font-semibold text-gray-700">
                  No testimonies found
                </h3>
                <p className="text-sm text-gray-500 mt-1">
                  Try adjusting your search or filter.
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </SectionWrapper>

        {/* Scripture Encouragement Section */}
        <SectionWrapper>
          <div className="bg-gradient-to-br from-[#EBF0FA] to-[#F3E5F5] rounded-2xl p-8 md:p-12 text-center my-12">
            <div className="w-14 h-14 rounded-2xl bg-white shadow-sm flex items-center justify-center mx-auto mb-5">
              <BookOpen className="size-7 text-[#4A148C]" />
            </div>
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-lg md:text-xl font-semibold text-[#4A148C] leading-relaxed mb-3 italic max-w-2xl mx-auto">
                &ldquo;Oh, give thanks to the Lord, for He is good! For His
                mercy endures forever. Let the redeemed of the Lord say
                so.&rdquo;
              </p>
              <p className="text-sm text-gray-500 font-medium">
                — Psalm 107:1-2 (NKJV)
              </p>
              <p className="text-sm text-gray-500 mt-4 max-w-lg mx-auto leading-relaxed">
                Every testimony shared is a seed of faith planted in the heart
                of someone who needs encouragement today. Your story matters
                more than you know.
              </p>
            </motion.div>
          </div>
        </SectionWrapper>

        {/* Share Your Testimony Section */}
        <div ref={formRef} data-testimony-form>
          <SectionWrapper>
            <SectionTitle
              title="Share Your Testimony"
              subtitle="What has God done in your life? Your story could be the breakthrough someone else has been waiting for."
            />
          </SectionWrapper>

          <SectionWrapper>
            <div className="max-w-3xl mx-auto">
              <TestimonyForm />
            </div>
          </SectionWrapper>
        </div>
      </div>
    </section>
  );
}