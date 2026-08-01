"use client";

import { motion } from "framer-motion";
import { Sparkles, ArrowRight, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";

export function TestimoniesCTA() {
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
            <Sparkles className="size-8 text-white/80" />
          </div>

          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4">
            Your Testimony is Powerful
          </h2>

          <div className="bg-white/5 backdrop-blur-sm rounded-2xl p-6 md:p-8 max-w-xl mx-auto mb-8 border border-white/10">
            <BookOpen className="size-6 text-white/40 mx-auto mb-3" />
            <p className="text-lg md:text-xl font-semibold text-white leading-relaxed mb-2 italic">
              &ldquo;And they overcame him by the blood of the Lamb and by the
              word of their testimony.&rdquo;
            </p>
            <p className="text-sm text-purple-200/70 font-medium">
              — Revelation 12:11 (NKJV)
            </p>
          </div>

          <p className="text-base md:text-lg text-purple-200/80 max-w-2xl mx-auto leading-relaxed mb-8">
            Your story of God&apos;s goodness is a weapon of warfare. When you
            share what God has done, you encourage the faith of others and
            glorify His name. Do not keep your testimony to yourself — someone
            needs to hear it today.
          </p>

          <Button
            onClick={() => {
              const formSection = document.querySelector(
                "[data-testimony-form]"
              );
              formSection?.scrollIntoView({ behavior: "smooth" });
            }}
            size="lg"
            className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-xl h-12 px-8 font-semibold shadow-lg"
          >
            Share Your Testimony
            <ArrowRight className="size-4 ml-2" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}