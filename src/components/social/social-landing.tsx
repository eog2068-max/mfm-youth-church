"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  Heart,
  Flame,
  Radio,
  ArrowRight,
  Shield,
  Zap,
  Globe,
  Sparkles,
  ChevronRight,
  Users,
} from "lucide-react";
import { socialFeatures, ChatBubbleIcon } from "./social-data";

// ⛔ Do NOT replace ChatBubbleIcon with emoji or lucide MessageCircle.
//   Emoji rendering is device-dependent and causes visual bugs.
//   The canonical definition lives in social-data.tsx.

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const iconMap: Record<string, React.ElementType> = {
  "family-chat": ChatBubbleIcon,
  "prayer-circle": Heart,
  "todays-question": ChatBubbleIcon,
  "amen-wall": Heart,
  "live-together": Radio,
};

export function SocialLandingPage() {
  const [presenceCount, setPresenceCount] = useState(0);

  useEffect(() => {
    fetch("/api/social/presence")
      .then((r) => r.json())
      .then((d) => setPresenceCount(d.count))
      .catch(() => {});
  }, []);

  return (
    <div className="min-h-screen bg-[#EDF1FA]">
      {/* ===== HERO — Modernized with animated mesh + glow ===== */}
      <section className="relative overflow-hidden bg-[#0B0F3A] min-h-screen flex flex-col justify-center">
        {/* Animated mesh gradient background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-30 animate-pulse"
            style={{
              backgroundImage: `
                radial-gradient(ellipse 80% 60% at 20% 40%, rgba(59, 91, 246, 0.4) 0%, transparent 70%),
                radial-gradient(ellipse 60% 50% at 80% 20%, rgba(168, 85, 247, 0.25) 0%, transparent 70%),
                radial-gradient(ellipse 70% 40% at 50% 80%, rgba(211, 47, 47, 0.15) 0%, transparent 70%)
              `,
            }}
          />
          {/* Moving light beams */}
          <div className="absolute top-[-20%] left-[-10%] w-[60%] h-[60%] bg-purple-500/8 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-purple-500/8 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
          <div className="absolute top-[30%] right-[20%] w-[30%] h-[30%] bg-pink-500/5 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "2s" }} />
        </div>

        {/* Subtle grid pattern overlay */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px),
                               linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)`,
              backgroundSize: "60px 60px",
            }}
          />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-4 text-center pt-8">
          {/* Hero icon — original ChatBubbleIcon with tail */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative flex justify-center mb-8"
          >
            <div className="absolute inset-0 bg-purple-400/25 rounded-full blur-3xl scale-[2]" />
            <ChatBubbleIcon className="w-36 h-36 sm:w-44 sm:h-44 md:w-48 md:h-48 text-white drop-shadow-2xl relative" />
          </motion.div>

          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="inline-flex items-center gap-2 bg-white/[0.07] backdrop-blur-sm border border-white/[0.12] rounded-full px-4 py-1.5 mb-8"
          >
            <Users className="size-3.5 text-purple-300" />
            <span className="text-xs font-medium text-purple-200/80">
              Your Digital Church Family Hub
            </span>
          </motion.div>

          {/* Title with gradient text effect */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
          >
            <span className="bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent">
              YouthConnect
            </span>
          </motion.h1>

          {/* Dominant slogan */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="mb-5"
          >
            <p className="text-lg sm:text-xl md:text-2xl font-semibold text-white/95 leading-snug">
              I Remain Connected To My Church Family
              <br className="hidden sm:block" /> Throughout The Week.
            </p>
          </motion.div>

          {/* Secondary promise */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-sm md:text-base text-purple-200/50 mb-8 max-w-lg mx-auto leading-relaxed"
          >
            You Don&rsquo;t Have To Wait Until The Next Church Service To Feel
            Connected To Your Church Family.
          </motion.p>

          {/* Presence indicator */}
          {presenceCount > 0 && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="inline-flex items-center gap-2.5 bg-white/[0.08] backdrop-blur-md border border-white/[0.15] rounded-full px-5 py-2.5"
            >
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-green-400" />
              </span>
              <span className="text-sm text-purple-100/80">
                <span className="font-bold text-white">{presenceCount}</span>{" "}
                people connected right now
              </span>
            </motion.div>
          )}

          {/* Scroll-down indicator — directly below presence badge */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-3"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-1 cursor-pointer"
              onClick={() => {
                document
                  .getElementById("features-section")
                  ?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="text-[10px] font-medium text-white/40 uppercase tracking-widest">
                Scroll
              </span>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                className="text-white/40"
              >
                <path
                  d="M10 4v12M10 16l-4-4M10 16l4-4"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </section>
      {/* ===== ALL 5 FEATURES GRID ===== */}
      <section id="features-section" className="max-w-5xl mx-auto px-4 py-14 md:py-18 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          {/* Decorative dash */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#4A148C]/30" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4A148C]/60">
              Explore
            </span>
            <div className="h-px w-8 bg-[#4A148C]/30" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A0033] mb-3">
            Five Ways to Connect
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
            From heartfelt prayers to real-time worship, find the space that draws
            your heart closer to the family — every single day of the week.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {socialFeatures.map((feature) => {
            const IconComp = iconMap[feature.id] || Sparkles;
            return (
              <motion.div key={feature.id} variants={itemVariants}>
                <Link href={feature.href} className="block group h-full">
                  <div className="bg-white rounded-2xl border border-gray-300/70 shadow-md overflow-hidden hover:shadow-xl hover:border-gray-400/60 transition-all duration-300 h-full hover:-translate-y-1.5">
                    <div
                      className={`bg-gradient-to-r ${feature.color} p-5 relative overflow-hidden`}
                    >
                      <div className="absolute top-0 right-0 w-28 h-28 bg-white/[0.08] rounded-full blur-xl -translate-y-10 translate-x-10" />
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/[0.05] rounded-full blur-lg translate-y-8 -translate-x-6" />
                      <div className="relative flex items-center justify-between">
                        <span className="text-3xl drop-shadow-sm">
                          {feature.emoji}
                        </span>
                        <IconComp className="size-6 text-white/30 group-hover:text-white/60 group-hover:scale-110 transition-all duration-300" />
                      </div>
                      <h3 className="relative text-base font-bold text-white mt-3 drop-shadow-sm">
                        {feature.title}
                      </h3>
                    </div>
                    <div className="p-4">
                      <p className="text-xs text-gray-500 leading-relaxed mb-3.5">
                        {feature.description}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-[#4A148C] font-semibold group-hover:gap-2.5 transition-all duration-300">
                        {feature.featured ? (
                          <>
                            <span>Enter</span>
                            <ChevronRight className="size-3.5" />
                          </>
                        ) : (
                          <>
                            <span>Open</span>
                            <ChevronRight className="size-3.5" />
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ===== HOW THE ECOSYSTEM WORKS ===== */}
      <section className="bg-white/80 backdrop-blur-sm border-y border-gray-300/50 py-14">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[#4A148C] mb-3">
              How It Works Together
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              One family, five ways to connect
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {[
              {
                step: "Discover",
                emoji: "🔍",
                desc: "Browse FamilyChat channels, today's question, and the Amen Wall.",
              },
              {
                step: "Participate",
                emoji: <ChatBubbleIcon className="size-5" />,
                desc: "Send a message, share a prayer request, or answer the question.",
              },
              {
                step: "Connect",
                emoji: "❤️",
                desc: "React, reply, encourage, and build relationships.",
              },
              {
                step: "Return",
                emoji: "🔄",
                desc: "Come back daily. Fellowship doesn't end after Sunday.",
              },
            ].map((item, i) => (
              <motion.div
                key={item.step}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.1 }}
                className="text-center"
              >
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-[#4A148C] to-[#6A1B9A] flex items-center justify-center mx-auto mb-3 text-xl">
                  {item.emoji}
                </div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">
                  {item.step}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== TRUST & SAFETY ===== */}
      <section className="py-12">
        <div className="max-w-4xl mx-auto px-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {[
              {
                icon: Shield,
                title: "Safe & Moderated",
                desc: "All content is reviewed. Our pastoral team ensures a healthy, Christ-honouring environment.",
              },
              {
                icon: Zap,
                title: "Instant Access",
                desc: "No registration, no login, no waiting. Join the conversation immediately.",
              },
              {
                icon: Globe,
                title: "Open to All",
                desc: "Members, visitors, and newcomers are all welcome. Everyone belongs here.",
              },
            ].map((item) => (
              <div key={item.title} className="text-center">
                <div className="w-12 h-12 rounded-xl bg-[#E8ECF8] flex items-center justify-center mx-auto mb-3">
                  <item.icon className="size-6 text-[#4A148C]" />
                </div>
                <h3 className="text-sm font-bold text-gray-800 mb-1">
                  {item.title}
                </h3>
                <p className="text-xs text-gray-500 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="bg-gradient-to-r from-[#0B0F3A] to-[#4A148C] py-14">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-4xl mb-4 block">👋</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Ready to Connect?
            </h2>
            <p className="text-purple-200/70 mb-2 text-sm max-w-md mx-auto leading-relaxed">
              I Remain Connected To My Church Family Throughout The Week.
            </p>
            <p className="text-purple-200/50 mb-8 text-xs max-w-md mx-auto">
              You don&rsquo;t have to wait until the next church service.
            </p>
            <Link
              href="/social/family-chat"
              className="inline-flex items-center gap-2 bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-lg shadow-red-900/30 text-sm"
            >
              <ChatBubbleIcon className="size-4" />
              Enter FamilyChat
              <ArrowRight className="size-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
