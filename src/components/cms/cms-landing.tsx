"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import {
  Megaphone,
  CalendarDays,
  BookOpen,
  Mic,
  HandHeart,
  Music,
  Building2,
  Film,
  Camera,
  Users,
  Gift,
  Star,
  Mail,
  ArrowRight,
  ChevronRight,
  Settings,
  Shield,
  Clock,
  BarChart3,
} from "lucide-react";

const cmsFeatures = [
  {
    name: "Announcements",
    description: "Stay up to date with everything happening at Youth Assembly",
    href: "/announcements",
    icon: Megaphone,
    emoji: "📢",
    gradient: "from-[#4A148C] to-[#7B1FA2]",
  },
  {
    name: "Events & Registration",
    description: "Browse upcoming services, conferences, programmes, and register",
    href: "/events",
    icon: CalendarDays,
    emoji: "📅",
    gradient: "from-[#6A1B9A] to-[#9C27B0]",
  },
  {
    name: "Devotionals",
    description: "Daily spiritual nourishment to strengthen your walk with God",
    href: "/devotionals",
    icon: BookOpen,
    emoji: "📖",
    gradient: "from-[#1A0033] to-[#4A148C]",
  },
  {
    name: "Sermons",
    description: "Access powerful messages and teachings from our pastors",
    href: "/sermons",
    icon: Mic,
    emoji: "🎤",
    gradient: "from-[#303F9F] to-[#7986CB]",
  },
  {
    name: "Prayer Requests",
    description: "Submit prayer needs and stand in faith with the community",
    href: "/prayer",
    icon: HandHeart,
    emoji: "🙏",
    gradient: "from-[#D32F2F] to-[#EF5350]",
  },
  {
    name: "Ministries",
    description: "Discover and join a ministry that fits your calling and gifts",
    href: "/join-ministry",
    icon: Music,
    emoji: "🎵",
    gradient: "from-[#4A148C] to-[#6A1B9A]",
  },
  {
    name: "Departments",
    description: "Explore the departments driving the vision of our church",
    href: "/departments",
    icon: Building2,
    emoji: "🏛️",
    gradient: "from-[#7B1FA2] to-[#9C27B0]",
  },
  {
    name: "Church Media",
    description: "Watch videos, highlights, and visual content from services",
    href: "/media",
    icon: Film,
    emoji: "🎬",
    gradient: "from-[#1A0033] to-[#303F9F]",
  },
  {
    name: "Photo Gallery",
    description: "Relive memorable moments from services, events, and activities",
    href: "/gallery",
    icon: Camera,
    emoji: "📸",
    gradient: "from-[#6A1B9A] to-[#7B1FA2]",
  },
  {
    name: "Member Gallery",
    description: "Meet and connect with members of the Youth family",
    href: "/members",
    icon: Users,
    emoji: "👥",
    gradient: "from-[#4A148C] to-[#9C27B0]",
  },
  {
    name: "Giving",
    description: "Give tithes, offerings, and sow seeds through secure channels",
    href: "/giving",
    icon: Gift,
    emoji: "💝",
    gradient: "from-[#D32F2F] to-[#E57373]",
  },
  {
    name: "Testimonies",
    description: "Read and share what God has done in the lives of our members",
    href: "/testimonies",
    icon: Star,
    emoji: "⭐",
    gradient: "from-[#F9A825] to-[#FDD835]",
  },
  {
    name: "Contact",
    description: "Reach out for inquiries, prayer, counselling, or a visit",
    href: "/contact",
    icon: Mail,
    emoji: "✉️",
    gradient: "from-[#7B1FA2] to-[#7986CB]",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.06 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.4 } },
};

const highlights = [
  { icon: Clock, title: "Always Current", desc: "Real-time updates on events, announcements, and church activities so you never miss a thing." },
  { icon: BarChart3, title: "Well Organized", desc: "Every aspect of church administration — structured, accessible, and easy to navigate." },
  { icon: Shield, title: "Secure & Private", desc: "Your data is protected. Member information, giving records, and prayer requests stay confidential." },
];

export function CmsLanding() {
  return (
    <div className="min-h-screen bg-[#F3E5F5]">
      {/* ===== HERO — Rich gradient background with glow ===== */}
      <section className="relative overflow-hidden bg-[#1A0033] pb-20">
        {/* Animated glow background */}
        <div className="absolute inset-0">
          <div
            className="absolute inset-0 opacity-30 animate-pulse"
            style={{
              backgroundImage: `
                radial-gradient(ellipse 70% 50% at 20% 40%, rgba(26, 35, 126, 0.5) 0%, transparent 70%),
                radial-gradient(ellipse 60% 40% at 80% 20%, rgba(57, 73, 171, 0.35) 0%, transparent 70%),
                radial-gradient(ellipse 50% 30% at 50% 80%, rgba(211, 47, 47, 0.1) 0%, transparent 70%)
              `,
            }}
          />
          <div className="absolute top-[-15%] left-[-10%] w-[50%] h-[50%] bg-purple-500/10 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-[-15%] right-[-10%] w-[40%] h-[40%] bg-purple-500/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: "1s" }} />
        </div>

        {/* Subtle grid pattern */}
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
          {/* Large emoji icon */}
          <motion.div
            initial={{ scale: 0, rotate: -10 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ type: "spring", stiffness: 200, damping: 15 }}
            className="relative block mb-8"
          >
            <div className="absolute inset-0 bg-purple-400/25 rounded-full blur-3xl scale-[2]" />
            <div className="relative text-[6rem] sm:text-[7rem] md:text-[9rem] leading-none">⚙️</div>
          </motion.div>

          {/* Pill badge */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.05 }}
            className="inline-flex items-center gap-2 bg-white/[0.07] backdrop-blur-sm border border-white/[0.12] rounded-full px-4 py-1.5 mb-8"
          >
            <Settings className="size-3.5 text-purple-300" />
            <span className="text-xs font-medium text-purple-200/80">
              Everything in One Place
            </span>
          </motion.div>

          {/* Title with gradient text */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.15 }}
            className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6"
          >
            <span className="bg-gradient-to-r from-white via-purple-100 to-purple-200 bg-clip-text text-transparent">
              Church Management
            </span>
            <br />
            <span className="bg-gradient-to-r from-purple-200 via-white to-purple-100 bg-clip-text text-transparent">
              System
            </span>
          </motion.h1>

          {/* Tagline */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.25 }}
            className="text-lg sm:text-xl md:text-2xl font-semibold text-white/90 leading-snug mb-4"
          >
            We&rsquo;re Well Organized.
          </motion.p>

          {/* Secondary description */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35 }}
            className="text-sm md:text-base text-purple-200/50 mb-10 max-w-lg mx-auto leading-relaxed"
          >
            Announcements, events, devotionals, sermons, giving, and more — all the tools your church needs to stay connected and run smoothly, right here.
          </motion.p>

          {/* Scroll indicator */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.2 }}
            className="mt-4"
          >
            <motion.div
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 1.8, repeat: Infinity, ease: "easeInOut" }}
              className="flex flex-col items-center gap-1 cursor-pointer"
              onClick={() => {
                document.getElementById("cms-features")?.scrollIntoView({ behavior: "smooth" });
              }}
            >
              <span className="text-[10px] font-medium text-white/40 uppercase tracking-widest">
                Explore
              </span>
              <svg width="20" height="20" viewBox="0 0 20 20" fill="none" className="text-white/40">
                <path d="M10 4v12M10 16l-4-4M10 16l4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* ===== FEATURE CARDS GRID ===== */}
      <section id="cms-features" className="max-w-6xl mx-auto px-4 py-14 md:py-20 relative z-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          {/* Decorative dash */}
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="h-px w-8 bg-[#4A148C]/30" />
            <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4A148C]/60">
              13 Features
            </span>
            <div className="h-px w-8 bg-[#4A148C]/30" />
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold text-[#1A0033] mb-3">
            All Your Church Needs, One Tap Away
          </h2>
          <p className="text-gray-500 max-w-md mx-auto text-sm leading-relaxed">
            From Sunday announcements to mid-week devotionals, every tool is organized and ready for you.
          </p>
        </motion.div>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5"
        >
          {cmsFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.name} variants={itemVariants}>
                <Link href={feature.href} className="block group h-full">
                  <div className="bg-white rounded-2xl border border-gray-200 shadow-md overflow-hidden hover:shadow-xl hover:border-gray-300 transition-all duration-300 h-full hover:-translate-y-1.5">
                    {/* Colored header */}
                    <div className={`bg-gradient-to-r ${feature.gradient} p-5 relative overflow-hidden`}>
                      <div className="absolute top-0 right-0 w-28 h-28 bg-white/[0.08] rounded-full blur-xl -translate-y-10 translate-x-10" />
                      <div className="absolute bottom-0 left-0 w-16 h-16 bg-white/[0.05] rounded-full blur-lg translate-y-8 -translate-x-6" />
                      <div className="relative flex items-center justify-between">
                        <span className="text-3xl drop-shadow-sm">{feature.emoji}</span>
                        <Icon className="size-6 text-white/30 group-hover:text-white/60 group-hover:scale-110 transition-all duration-300" />
                      </div>
                      <h3 className="relative text-base font-bold text-white mt-3 drop-shadow-sm">
                        {feature.name}
                      </h3>
                    </div>
                    {/* Body */}
                    <div className="p-4">
                      <p className="text-xs text-gray-500 leading-relaxed mb-3.5">
                        {feature.description}
                      </p>
                      <div className="flex items-center gap-1.5 text-xs text-[#4A148C] font-semibold group-hover:gap-2.5 transition-all duration-300">
                        <span>Open</span>
                        <ChevronRight className="size-3.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </section>

      {/* ===== HIGHLIGHTS SECTION ===== */}
      <section className="bg-white/80 backdrop-blur-sm border-y border-gray-200 py-14">
        <div className="max-w-4xl mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-12"
          >
            <h2 className="text-2xl md:text-3xl font-bold text-[#4A148C] mb-3">
              Why CMS?
            </h2>
            <p className="text-gray-500 max-w-md mx-auto">
              Built for the modern church, designed for every member
            </p>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {highlights.map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="text-center"
                >
                  <div className="w-14 h-14 rounded-xl bg-gradient-to-br from-[#4A148C] to-[#7B1FA2] flex items-center justify-center mx-auto mb-4 shadow-lg shadow-purple-900/20">
                    <Icon className="size-7 text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-gray-800 mb-1.5">
                    {item.title}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    {item.desc}
                  </p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ===== BOTTOM CTA ===== */}
      <section className="bg-gradient-to-r from-[#1A0033] via-[#4A148C] to-[#6A1B9A] py-16">
        <div className="max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-4xl mb-4 block">🏠</span>
            <h2 className="text-2xl md:text-3xl font-bold text-white mb-3">
              Your Church, Organized
            </h2>
            <p className="text-purple-200/70 mb-2 text-sm max-w-md mx-auto leading-relaxed">
              Everything that matters, in one place. No more searching, no more missing out.
            </p>
            <p className="text-purple-200/50 mb-8 text-xs max-w-md mx-auto">
              We&rsquo;re Well Organized — so you can focus on what truly matters.
            </p>
            <Link
              href="/announcements"
              className="inline-flex items-center gap-2 bg-[#D32F2F] hover:bg-[#B71C1C] text-white px-8 py-3.5 rounded-xl font-bold transition-colors shadow-lg shadow-red-900/30 text-sm"
            >
              <Megaphone className="size-4" />
              View Announcements
              <ArrowRight className="size-4" />
            </Link>
          </motion.div>
        </div>
      </section>
    </div>
  );
}
