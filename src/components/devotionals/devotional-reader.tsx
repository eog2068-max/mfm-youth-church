"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ChevronLeft,
  ChevronRight,
  Share2,
  Bookmark,
  BookmarkCheck,
  BookOpen,
  Calendar,
  User,
  HelpCircle,
  MessageCircle,
  Check,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { type Devotional, categoryConfig } from "./devotionals-data";
import { useToast } from "@/hooks/use-toast";

interface DevotionalReaderProps {
  devotional: Devotional;
  onNavigate: (direction: "prev" | "next") => void;
  canGoPrev: boolean;
  canGoNext: boolean;
}

export function DevotionalReader({
  devotional,
  onNavigate,
  canGoPrev,
  canGoNext,
}: DevotionalReaderProps) {
  const [isBookmarked, setIsBookmarked] = useState(false);
  const [reflectionsOpen, setReflectionsOpen] = useState(false);
  const [copied, setCopied] = useState(false);
  const { toast } = useToast();

  const cat = categoryConfig[devotional.category];
  const dateObj = new Date(devotional.date + "T00:00:00");
  const formattedDate = dateObj.toLocaleDateString("en-NG", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });

  const paragraphs = devotional.body.split("\n").filter((p) => p.trim());

  const handleShare = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      toast({
        title: "Link copied!",
        description: "Devotional link copied to clipboard.",
      });
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast({
        title: "Could not copy",
        description: "Please copy the URL from your browser.",
        variant: "destructive",
      });
    }
  };

  const handleBookmark = () => {
    setIsBookmarked((prev) => !prev);
    toast({
      title: isBookmarked ? "Bookmark removed" : "Devotional bookmarked!",
      description: isBookmarked
        ? "Removed from your bookmarks."
        : "You can find this in your bookmarks later.",
    });
  };

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={devotional.id}
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -12 }}
        transition={{ duration: 0.35 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="space-y-4">
          <div className="flex flex-wrap items-center gap-2">
            <Badge
              className={`${cat.bg} ${cat.text} border-0 text-xs font-semibold uppercase tracking-wider`}
            >
              {cat.label}
            </Badge>
            <span className="text-sm text-gray-400 flex items-center gap-1.5">
              <Calendar className="size-3.5" />
              {formattedDate}
            </span>
            <span className="text-sm text-gray-400 flex items-center gap-1.5">
              <User className="size-3.5" />
              {devotional.author}
            </span>
          </div>

          <h1 className="text-2xl md:text-3xl font-bold text-[#4A148C] leading-tight">
            {devotional.title}
          </h1>

          {/* Action buttons */}
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg h-9 px-3 text-xs font-medium gap-1.5"
              onClick={handleShare}
            >
              {copied ? (
                <Check className="size-3.5 text-green-600" />
              ) : (
                <Share2 className="size-3.5" />
              )}
              {copied ? "Copied" : "Share"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="border-gray-200 text-gray-600 hover:bg-gray-50 rounded-lg h-9 px-3 text-xs font-medium gap-1.5"
              onClick={handleBookmark}
            >
              {isBookmarked ? (
                <BookmarkCheck className="size-3.5 text-[#4A148C]" />
              ) : (
                <Bookmark className="size-3.5" />
              )}
              {isBookmarked ? "Bookmarked" : "Bookmark"}
            </Button>
          </div>
        </div>

        {/* Bible Verse Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative rounded-2xl overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-[#4A148C] via-[#6A1B9A] to-[#7B1FA2]" />
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-4 right-4 w-32 h-32 bg-white rounded-full blur-[64px]" />
            <div className="absolute bottom-4 left-4 w-24 h-24 bg-[#D32F2F] rounded-full blur-[48px]" />
          </div>
          <div className="relative z-10 p-6 md:p-8">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="size-4 text-purple-200/80" />
              <span className="text-sm font-semibold text-purple-200/80 uppercase tracking-wider">
                Scripture Reading
              </span>
            </div>
            <div className="relative">
              <span className="absolute -top-2 -left-1 text-6xl md:text-8xl font-serif text-white/10 leading-none select-none">
                &ldquo;
              </span>
              <blockquote className="pl-6 md:pl-10">
                <p className="text-lg md:text-xl text-white/90 font-medium leading-relaxed italic">
                  {devotional.bibleText}
                </p>
                <footer className="mt-4 text-sm font-semibold text-purple-200/70">
                  — {devotional.bibleVerse}
                </footer>
              </blockquote>
            </div>
          </div>
        </motion.div>

        {/* Body */}
        <div className="space-y-4">
          {paragraphs.map((para, i) => (
            <motion.p
              key={i}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.15 + i * 0.06 }}
              className="text-base md:text-lg text-gray-700 leading-relaxed"
            >
              {para}
            </motion.p>
          ))}
        </div>

        {/* Reflection Questions */}
        <Collapsible open={reflectionsOpen} onOpenChange={setReflectionsOpen}>
          <div className="rounded-xl border border-gray-100 bg-[#F8FAFF] overflow-hidden">
            <CollapsibleTrigger className="w-full flex items-center justify-between p-5 hover:bg-[#F3E5F5] transition-colors cursor-pointer">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-lg bg-[#F3E5F5] flex items-center justify-center">
                  <HelpCircle className="size-4.5 text-[#4A148C]" />
                </div>
                <div className="text-left">
                  <h3 className="text-sm font-bold text-gray-800">
                    Reflection Questions
                  </h3>
                  <p className="text-xs text-gray-400 mt-0.5">
                    {devotional.reflectionQuestions.length} questions for
                    personal study
                  </p>
                </div>
              </div>
              <ChevronRight
                className={`size-4 text-gray-400 transition-transform duration-200 ${
                  reflectionsOpen ? "rotate-90" : ""
                }`}
              />
            </CollapsibleTrigger>
            <CollapsibleContent>
              <div className="px-5 pb-5 space-y-3">
                {devotional.reflectionQuestions.map((q, i) => (
                  <div
                    key={i}
                    className="flex gap-3 p-3 bg-white rounded-lg border border-gray-50"
                  >
                    <span className="shrink-0 w-6 h-6 rounded-full bg-[#F3E5F5] flex items-center justify-center text-xs font-bold text-[#4A148C]">
                      {i + 1}
                    </span>
                    <p className="text-sm text-gray-600 leading-relaxed pt-0.5">
                      {q}
                    </p>
                  </div>
                ))}
              </div>
            </CollapsibleContent>
          </div>
        </Collapsible>

        {/* Prayer Section */}
        <div className="relative rounded-xl overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-[#F3E5F5] to-[#EBF0FA]" />
          <div className="relative z-10 p-6 border border-purple-100/50 rounded-xl">
            <div className="flex items-center gap-2 mb-3">
              <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shadow-sm">
                <MessageCircle className="size-4 text-[#D32F2F]" />
              </div>
              <h3 className="text-sm font-bold text-[#4A148C] uppercase tracking-wider">
                Prayer
              </h3>
            </div>
            <p className="text-base text-gray-700 leading-relaxed italic">
              {devotional.prayer}
            </p>
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap items-center gap-2">
          {devotional.tags.map((tag) => (
            <span
              key={tag}
              className="text-xs text-gray-500 bg-gray-100 px-2.5 py-1 rounded-full"
            >
              #{tag}
            </span>
          ))}
        </div>

        {/* Navigation */}
        <div className="flex items-center justify-between pt-4 border-t border-gray-100">
          <Button
            variant="outline"
            className={`border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl h-11 px-5 text-sm font-medium gap-1.5 ${
              !canGoPrev ? "opacity-40 pointer-events-none" : ""
            }`}
            onClick={() => onNavigate("prev")}
          >
            <ChevronLeft className="size-4" />
            Previous Day
          </Button>
          <Button
            variant="outline"
            className={`border-gray-200 text-gray-600 hover:bg-gray-50 rounded-xl h-11 px-5 text-sm font-medium gap-1.5 ${
              !canGoNext ? "opacity-40 pointer-events-none" : ""
            }`}
            onClick={() => onNavigate("next")}
          >
            Next Day
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </motion.div>
    </AnimatePresence>
  );
}