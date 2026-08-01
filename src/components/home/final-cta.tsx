"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Radio } from "lucide-react";

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.12,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
};

export function FinalCta() {
  return (
    <section className="relative bg-gradient-to-br from-[#1A0033] via-[#4A148C] to-[#7B1FA2] py-20 md:py-28 overflow-hidden">
      {/* Decorative pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 1px, transparent 1px),
                             radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
            backgroundSize: "60px 60px",
          }}
        />
      </div>

      {/* Ambient glow effects */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-purple-400/5 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-0 w-64 h-64 bg-purple-400/10 rounded-full blur-3xl" />
      <div className="absolute top-0 left-0 w-64 h-64 bg-red-400/5 rounded-full blur-3xl" />

      <motion.div
        variants={container}
        initial="hidden"
        whileInView="show"
        viewport={{ once: true, margin: "-80px" }}
        className="relative z-10 max-w-4xl mx-auto px-6 text-center"
      >
        {/* Headline lines */}
        <motion.h2
          variants={item}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight"
        >
          YOUR CHURCH.
        </motion.h2>
        <motion.h2
          variants={item}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight"
        >
          YOUR FAMILY.
        </motion.h2>
        <motion.h2
          variants={item}
          className="text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight mb-6"
        >
          YOUR DIGITAL HOME.
        </motion.h2>

        {/* Red divider */}
        <motion.div
          variants={item}
          className="w-16 h-1 bg-[#D32F2F] mx-auto rounded-full mb-6"
        />

        {/* Tagline */}
        <motion.p
          variants={item}
          className="text-lg md:text-xl tracking-widest font-bold text-white/80 mb-4"
        >
          CONNECT. ORGANIZE. REACH.
        </motion.p>

        {/* Supporting text */}
        <motion.p
          variants={item}
          className="text-purple-100/60 text-base md:text-lg max-w-2xl mx-auto mb-10 leading-relaxed"
        >
          Experience God&apos;s presence, stay connected to your church family,
          and reach beyond the walls &mdash; all from one place.
        </motion.p>

        {/* CTA Buttons */}
        <motion.div
          variants={item}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-8"
        >
          <Link
            href="/social"
            className="inline-flex items-center justify-center gap-2 bg-[#C62828] hover:bg-[#B71C1C] text-white px-8 py-3.5 rounded-xl font-semibold transition-colors shadow-lg text-sm"
          >
            ENTER YOUTHCONNECT
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/announcements"
            className="inline-flex items-center justify-center gap-2 bg-white text-[#4A148C] hover:bg-gray-100 px-8 py-3.5 rounded-xl font-semibold transition-colors shadow-lg text-sm"
          >
            EXPLORE CMS
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/go-a-fishing"
            className="inline-flex items-center justify-center gap-2 bg-[#7B1FA2] hover:bg-[#4A148C] text-white px-8 py-3.5 rounded-xl font-semibold transition-colors shadow-lg text-sm"
          >
            GO-A-FISHING
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>

        {/* Watch Live link */}
        <motion.div variants={item}>
          <Link
            href="/live"
            className="inline-flex items-center gap-2 text-white/50 text-sm hover:text-white transition-colors"
          >
            <Radio className="w-4 h-4" />
            Watch Live
          </Link>
        </motion.div>
      </motion.div>
    </section>
  );
}
