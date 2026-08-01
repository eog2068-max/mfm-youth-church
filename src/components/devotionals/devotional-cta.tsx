"use client";

import { motion } from "framer-motion";
import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function DevotionalCTA() {
  const stats = [
    { value: "14", label: "Daily Devotionals" },
    { value: "4", label: "Weekly Studies" },
    { value: "4", label: "Reading Plans" },
  ];

  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A0033] via-[#4A148C] to-[#6A1B9A]" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D32F2F] rounded-full blur-[128px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-purple-400/20 rounded-full blur-[128px] translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
            <BookOpen className="size-8 text-white/80" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Start Your Day with God&apos;s Word
          </h2>
          <p className="mt-4 text-lg text-purple-200/80 max-w-xl mx-auto leading-relaxed">
            Make daily devotionals a part of your spiritual routine. Let the Word of God transform your thinking, strengthen your faith, and guide your steps every single day.
          </p>

          {/* Stats */}
          <div className="mt-10 grid grid-cols-3 gap-4 max-w-md mx-auto">
            {stats.map((stat) => (
              <div key={stat.label} className="text-center">
                <div className="text-3xl md:text-4xl font-bold text-white">
                  {stat.value}
                </div>
                <div className="text-xs text-purple-200/60 mt-1 font-medium">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>

          <div className="mt-10 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-xl h-12 px-8 font-semibold shadow-lg"
            >
              <a href="#top">
                <BookOpen className="size-4" />
                Read Today&apos;s Devotional
              </a>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white rounded-xl h-12 px-8 font-semibold"
            >
              <Link href="/prayer">
                <ArrowRight className="size-4" />
                Submit a Prayer Request
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}