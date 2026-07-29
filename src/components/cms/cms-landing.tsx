"use client";

import { motion } from "framer-motion";
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
  Settings,
} from "lucide-react";
import Link from "next/link";

const cmsFeatures = [
  {
    name: "Announcements",
    description: "Stay up to date with everything happening at Rehoboth Assembly",
    href: "/announcements",
    icon: Megaphone,
  },
  {
    name: "Events & Registration",
    description: "Browse upcoming services, conferences, programmes, and community events",
    href: "/events",
    icon: CalendarDays,
  },
  {
    name: "Devotionals",
    description: "Daily spiritual nourishment to strengthen your walk with God",
    href: "/devotionals",
    icon: BookOpen,
  },
  {
    name: "Sermons",
    description: "Access powerful messages and teachings from our pastors",
    href: "/sermons",
    icon: Mic,
  },
  {
    name: "Prayer Requests",
    description: "Submit your prayer needs and stand in faith with the community",
    href: "/prayer",
    icon: HandHeart,
  },
  {
    name: "Ministries",
    description: "Discover and join a ministry that fits your calling and gifts",
    href: "/join-ministry",
    icon: Music,
  },
  {
    name: "Departments",
    description: "Explore the departments driving the vision of our church",
    href: "/departments",
    icon: Building2,
  },
  {
    name: "Church Media",
    description: "Watch videos, highlights, and visual content from our services",
    href: "/media",
    icon: Film,
  },
  {
    name: "Photo Gallery",
    description: "Relive memorable moments from services, events, and activities",
    href: "/gallery",
    icon: Camera,
  },
  {
    name: "Member Gallery",
    description: "Meet and connect with members of the Rehoboth Assembly family",
    href: "/members",
    icon: Users,
  },
  {
    name: "Giving",
    description: "Give tithes, offerings, and seed sown in faith through secure channels",
    href: "/giving",
    icon: Gift,
  },
  {
    name: "Testimonies",
    description: "Read and share what God has done in the lives of our members",
    href: "/testimonies",
    icon: Star,
  },
  {
    name: "Contact",
    description: "Reach out to us for inquiries, prayer, counselling, or visit",
    href: "/contact",
    icon: Mail,
  },
];

const container = {
  hidden: {},
  show: {
    transition: { staggerChildren: 0.06 },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function CmsLanding() {
  return (
    <section className="py-16 md:py-24 bg-white">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        {/* Intro statement */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center max-w-2xl mx-auto mb-12"
        >
          <div className="inline-flex items-center gap-2 bg-blue-50 text-[#1A237E] px-4 py-1.5 rounded-full text-sm font-semibold mb-4">
            <Settings className="size-4" />
            ORGANIZE
          </div>
          <p className="text-gray-600 leading-relaxed">
            Everything you need to manage, organize, and run your church life — all in one place. Tap any feature below to get started.
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6"
        >
          {cmsFeatures.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.name} variants={item}>
                <Link
                  href={feature.href}
                  className="block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-lg hover:border-blue-100 transition-all group h-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-blue-50 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#1A237E]" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {feature.name}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <div className="inline-flex items-center gap-1 text-[#1A237E] text-sm font-medium">
                    Explore
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
