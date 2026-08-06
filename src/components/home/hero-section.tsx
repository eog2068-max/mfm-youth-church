"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";
import { HamburgerMenu } from "@/components/layout/hamburger-menu";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex flex-col overflow-hidden">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A0033] via-[#4A148C] to-[#6A1B9A]" />

      {/* Decorative overlay pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }} />
      </div>

      {/* Light beam effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-red-400/5 rounded-full blur-3xl" />

      {/* ── Spacer: push below fixed navbar (h-16 md:h-20) + extra breathing room ── */}
      <div className="h-16 md:h-20 shrink-0" />

      {/* ── Hamburger menu (white, top-right of hero) ── */}
      <div className="absolute top-20 md:top-[5.25rem] right-3 z-20">
        <HamburgerMenu iconColor="white" />
      </div>

      {/* ── Main hero content (centered, vertically fills remaining space) ── */}
      <div className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 sm:px-6 pt-6 pb-4">
        <div className="text-center max-w-4xl mx-auto">
          {/* Logo */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-3"
          >
            <div className="relative h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-40 lg:w-40 mx-auto rounded-full bg-white p-2 shadow-2xl shadow-black/30">
              <Image
                src="/mfm-logo.png"
                alt="Mountain of Fire and Miracles Ministries Logo"
                fill
                sizes="160px"
                className="object-contain"
                priority
              />
            </div>
          </motion.div>

          {/* Church Name */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
          >
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-white tracking-tight leading-tight">
              MFM INT&rsquo;L HQ ANNEX Youth Church, Abuja
            </h1>
          </motion.div>

          {/* Red divider */}
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 80 }}
            transition={{ duration: 0.6, delay: 0.5 }}
            className="h-1 bg-[#D32F2F] mx-auto rounded-full mt-5"
          />

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="mt-5 max-w-2xl mx-auto text-base md:text-lg text-white leading-relaxed font-normal"
          >
            A place of spiritual fire, prayer, and destiny fulfilment.
          </motion.p>

          {/* ── 3-Pillar Feature Buttons ── */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="mt-6 flex flex-col gap-2.5 max-w-sm mx-auto"
          >
            {/* 1. YouthConnect */}
            <Link
              href="/social"
              className="flex flex-col items-center justify-center bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-sm py-2 px-6 transition-all hover:shadow-lg hover:shadow-red-500/20 border border-white/20"
            >
              <span className="text-lg md:text-2xl font-bold tracking-wide">
                YouthConnect
              </span>
              <span className="text-xs md:text-sm font-medium leading-tight">
                Connecting Members 24/7 Round The Week
              </span>
              <span className="text-xs font-normal leading-tight text-white/80">
                Church Connect System - CCS
              </span>
            </Link>

            {/* 2. Go-A-Fishing */}
            <Link
              href="/go-a-fishing"
              className="flex flex-col items-center justify-center bg-[#7B1FA2] hover:bg-[#4A148C] text-white rounded-sm py-2 px-6 transition-all hover:shadow-lg hover:shadow-purple-500/20 border border-white/20 shadow-md shadow-black/10"
            >
              <span className="text-lg md:text-2xl font-bold tracking-wide">
                Go-A-Fishing
              </span>
              <span className="text-xs md:text-sm font-medium leading-tight">
                Engage & Get Rewarded
              </span>
              <span className="text-xs font-normal leading-tight text-white/80">
                Digital Evangelism System - DES
              </span>
            </Link>

            {/* 3. Church Management System */}
            <Link
              href="/cms"
              className="flex flex-col items-center justify-center bg-[#5C6BC0] hover:bg-[#3F51B5] text-white rounded-sm py-2 px-6 transition-all hover:shadow-lg hover:shadow-indigo-500/20 border border-white/20 shadow-md shadow-black/10"
            >
              <span className="text-lg md:text-2xl font-bold tracking-wide">
                Organa
              </span>
              <span className="text-xs md:text-sm font-medium leading-tight">
                We&rsquo;re Well Organized
              </span>
              <span className="text-xs font-normal leading-tight text-white/80">
                Church Management System - CMS
              </span>
            </Link>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
