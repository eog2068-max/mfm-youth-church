"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 md:pt-28">
      {/* Background gradient */}
      <div className="absolute inset-0 bg-gradient-to-br from-[#0D1557] via-[#1A237E] to-[#283593]" />

      {/* Decorative overlay pattern */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 25% 25%, rgba(255,255,255,0.15) 1px, transparent 1px),
                           radial-gradient(circle at 75% 75%, rgba(255,255,255,0.1) 1px, transparent 1px)`,
          backgroundSize: "60px 60px"
        }} />
      </div>

      {/* Light beam effects */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-red-400/5 rounded-full blur-3xl" />

      {/* Content */}
      <div className="relative z-10 text-center px-4 sm:px-6 max-w-4xl mx-auto">
        {/* Logo — slightly reduced */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-3"
        >
          <div className="relative h-28 w-28 sm:h-32 sm:w-32 md:h-36 md:w-36 lg:h-40 lg:w-40 mx-auto rounded-full bg-white p-2 shadow-2xl shadow-black/30">
            <Image
              src="/rccg-logo.png"
              alt="The Redeemed Christian Church of God Logo"
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
            The Redeemed Christian Church of God
          </h1>
          <p className="text-lg md:text-2xl text-blue-100/80 font-medium mt-2 md:mt-3">
            (Rehoboth Assembly Parish)
          </p>
        </motion.div>

        {/* Red divider */}
        <motion.div
          initial={{ width: 0 }}
          animate={{ width: 80 }}
          transition={{ duration: 0.6, delay: 0.5 }}
          className="h-1 bg-[#D32F2F] mx-auto rounded-full mt-4"
        />

        {/* Tagline — the sole narrative on the hero */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-4 max-w-2xl mx-auto text-base md:text-lg text-blue-100/90 leading-relaxed font-medium italic"
        >
          More Than A Church, It&rsquo;s A Connected Family.
        </motion.p>

        {/* ── 3-Pillar Feature Buttons ── */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-6 flex flex-col gap-3 max-w-sm mx-auto"
        >
          {/* 1. RehobothSocial — Red, compact, better font */}
          <Link
            href="/social"
            className="flex flex-col items-center justify-center bg-[#E65100] hover:bg-[#BF360C] text-white rounded-xl py-2.5 px-6 transition-all hover:shadow-lg hover:shadow-orange-500/20"
          >
            <span className="text-lg md:text-xl font-bold tracking-wide" style={{ fontFamily: "'Georgia', 'Times New Roman', serif" }}>
              RehobothSocial
            </span>
            <span className="text-xs md:text-sm text-white/90 font-medium leading-tight mt-0.5">
              I Remain Connected To My Church Family Throughout The Week
            </span>
          </Link>

          {/* 2. Go-A-Fishing — Sky blue, floating card style */}
          <Link
            href="/go-a-fishing"
            className="flex flex-col items-center justify-center bg-[#EBF3FF] hover:bg-[#D6EAFF] rounded-xl py-2.5 px-6 transition-all hover:shadow-lg hover:shadow-blue-300/30 border border-white/20 shadow-md shadow-black/10"
          >
            <span className="text-sm md:text-base font-bold text-[#1A237E] tracking-wide">
              Go-A-Fishing - (Digital Evangelism)
            </span>
            <span className="text-xs text-[#3949AB] font-medium mt-0.5">
              Engage, Be rewarded
            </span>
          </Link>

          {/* 3. Church Management System — Sky blue, identical floating style */}
          <Link
            href="/announcements"
            className="flex flex-col items-center justify-center bg-[#EBF3FF] hover:bg-[#D6EAFF] rounded-xl py-2.5 px-6 transition-all hover:shadow-lg hover:shadow-blue-300/30 border border-white/20 shadow-md shadow-black/10"
          >
            <span className="text-sm md:text-base font-bold text-[#1A237E] tracking-wide">
              Church Management System
            </span>
            <span className="text-xs text-[#3949AB] font-medium mt-0.5">
              CMS - Well organized
            </span>
          </Link>
        </motion.div>

        {/* Three Pillar Indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.2 }}
          className="mt-8 flex items-center justify-center gap-6"
        >
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#E65100]" />
            <span className="text-[10px] text-white/50 tracking-wider uppercase">Connect</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#1A237E]" />
            <span className="text-[10px] text-white/50 tracking-wider uppercase">Organize</span>
          </div>
          <div className="flex flex-col items-center gap-1.5">
            <div className="w-2.5 h-2.5 rounded-full bg-[#3949AB]" />
            <span className="text-[10px] text-white/50 tracking-wider uppercase">Reach</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
