"use client";

import { motion } from "framer-motion";
import { Fish, ArrowRight, Trophy, TrendingUp, Cross } from "lucide-react";
import Link from "next/link";
import { SectionWrapper } from "@/components/home/section-wrapper";

const stats = [
  { label: "Track Referrals", icon: TrendingUp },
  { label: "Earn Awards", icon: Trophy },
  { label: "Grow the Kingdom", icon: Cross },
];

export function GafCta() {
  return (
    <section className="relative bg-gradient-to-br from-[#4A148C] via-[#6A1B9A] to-[#7B1FA2] py-20 md:py-28 overflow-hidden">
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

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        {/* Fish icon — animated scale-in */}
        <motion.div
          initial={{ scale: 0, rotate: -20 }}
          whileInView={{ scale: 1, rotate: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="flex items-center justify-center mb-6"
        >
          <div className="w-20 h-20 rounded-2xl bg-white/10 backdrop-blur-sm border border-white/15 flex items-center justify-center">
            <Fish className="w-10 h-10 text-purple-200" />
          </div>
        </motion.div>

        {/* Title */}
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-3xl md:text-4xl font-bold text-white tracking-tight mb-4"
        >
          Go-A-Fishing: Digital Evangelism
        </motion.h2>

        {/* Subtitle */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-purple-100/70 text-base md:text-lg max-w-xl mx-auto mb-8 leading-relaxed"
        >
          Share the love of Christ with your community. Track referrals, earn
          recognition, and fulfill the Great Commission &mdash; all from your phone.
        </motion.p>

        {/* Stat pills */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-wrap justify-center gap-3 mb-10"
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <span
                key={stat.label}
                className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2 text-sm text-purple-100/80"
              >
                <Icon className="w-4 h-4" />
                {stat.label}
              </span>
            );
          })}
        </motion.div>

        {/* Conceptual Flow */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.35 }}
          className="flex flex-wrap items-center justify-center gap-2 sm:gap-3 mb-10 text-xs sm:text-sm font-semibold tracking-wider"
        >
          {["INVITE", "REACH", "CONNECT", "ENGAGE", "IMPACT"].map((step, i) => (
            <span key={step} className="flex items-center gap-2 sm:gap-3">
              <span className="bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-3 sm:px-4 py-1.5 text-white/90">
                {step}
              </span>
              {i < 4 && <ArrowRight className="w-3 h-3 text-white/30 hidden sm:block" />}
            </span>
          ))}
        </motion.div>

        {/* CTA Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.4 }}
          className="flex flex-col sm:flex-row gap-3 justify-center mb-8"
        >
          <Link
            href="/go-a-fishing"
            className="inline-flex items-center justify-center gap-2 bg-white text-[#4A148C] px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg text-sm"
          >
            GO-A-FISHING
            <ArrowRight className="w-4 h-4" />
          </Link>
          <Link
            href="/go-a-fishing"
            className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-colors text-sm"
          >
            Learn More
          </Link>
        </motion.div>

        {/* Bottom tagline */}
        <motion.p
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="text-xs text-purple-200/40 italic"
        >
          I will make you fishers of men. &mdash; Matthew 4:19
        </motion.p>
      </div>
    </section>
  );
}
