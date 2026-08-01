"use client";

import { motion, type Variants } from "framer-motion";
import {
  Megaphone,
  CalendarDays,
  BookOpen,
  HandHeart,
  Music,
  Radio,
  Film,
  Users,
  Mail,
} from "lucide-react";
import Link from "next/link";
import { SectionWrapper, SectionTitle } from "@/components/home/section-wrapper";

const services = [
  { label: "Announcements", href: "/announcements", icon: Megaphone, color: "#4A148C", bgClass: "bg-purple-50", textClass: "text-purple-700" },
  { label: "Events", href: "/events", icon: CalendarDays, color: "#4A148C", bgClass: "bg-purple-50", textClass: "text-purple-700" },
  { label: "Devotionals", href: "/devotionals", icon: BookOpen, color: "#4A148C", bgClass: "bg-purple-50", textClass: "text-purple-700" },
  { label: "Prayer Request", href: "/prayer", icon: HandHeart, color: "#4A148C", bgClass: "bg-purple-50", textClass: "text-purple-700" },
  { label: "Ministries", href: "/join-ministry", icon: Music, color: "#4A148C", bgClass: "bg-purple-50", textClass: "text-purple-700" },
  { label: "Livestream", href: "/live", icon: Radio, color: "#D32F2F", bgClass: "bg-red-50", textClass: "text-[#D32F2F]" },
  { label: "Church Media", href: "/media", icon: Film, color: "#4A148C", bgClass: "bg-purple-50", textClass: "text-purple-700" },
  { label: "Member Gallery", href: "/members", icon: Users, color: "#4A148C", bgClass: "bg-purple-50", textClass: "text-purple-700" },
  { label: "Contact", href: "/contact", icon: Mail, color: "#4A148C", bgClass: "bg-purple-50", textClass: "text-purple-700" },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: "easeOut",
    },
  },
};

export function QuickAccess() {
  return (
    <SectionWrapper className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionTitle
          title="Quick Access"
          subtitle="Everything you need in one place"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-9 gap-3 md:gap-4"
        >
          {services.map((service) => {
            const Icon = service.icon;
            return (
              <motion.div key={service.label} variants={itemVariants}>
                <Link
                  href={service.href}
                  className="flex flex-col items-center bg-white rounded-xl border border-gray-100 p-4 text-center hover:shadow-md hover:-translate-y-0.5 transition-all"
                >
                  <div
                    className={`w-10 h-10 rounded-full ${service.bgClass} flex items-center justify-center ${service.textClass}`}
                  >
                    <Icon className="w-5 h-5" />
                  </div>
                  <span className="text-xs font-medium text-gray-700 mt-2">
                    {service.label}
                  </span>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
