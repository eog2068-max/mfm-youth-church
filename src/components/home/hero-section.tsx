"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Radio } from "lucide-react";
import Link from "next/link";

export function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden pt-24 md:pt-28">
      {/* Background gradient placeholder */}
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
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="mb-4"
        >
          <div className="relative h-32 w-32 md:h-40 md:w-40 lg:h-48 lg:w-48 mx-auto rounded-full bg-white p-2 shadow-2xl shadow-black/30">
            <Image
              src="/rccg-logo.png"
              alt="The Redeemed Christian Church of God Logo"
              fill
              sizes="192px"
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
          className="h-1 bg-[#D32F2F] mx-auto rounded-full mt-5"
        />

        {/* Tagline — shortened to complement new social positioning */}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
          className="mt-6 max-w-2xl mx-auto text-base md:text-lg text-blue-100/80 leading-relaxed font-light"
        >
          Experience God&rsquo;s presence in our live services, and stay connected to your church family all week long through RehobothSocial.
        </motion.p>

        {/* CTA Buttons — Watch Live + RehobothSocial */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="mt-6 flex flex-col gap-3 max-w-xl mx-auto"
        >
          {/* Watch Live — Red, unchanged */}
          <a
            href="/live"
            className="flex items-center justify-center gap-2 bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-xl h-12 text-base font-semibold transition-colors"
          >
            <Radio className="size-4 shrink-0" />
            <span>Watch Live</span>
          </a>

          {/* RehobothSocial — Same red, taller, two-level messaging */}
          <Link
            href="/social"
            className="flex flex-col items-center justify-center gap-1.5 bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-xl py-4 px-8 transition-colors"
          >
            <span className="text-lg md:text-xl font-bold tracking-wide">
              RehobothSocial
            </span>
            <span className="text-xs md:text-sm text-white/90 font-medium leading-snug max-w-xs text-center">
              I Remain Connected To My Church Family Throughout The Week.
            </span>
          </Link>
        </motion.div>
      </div>
    </section>
  );
}
