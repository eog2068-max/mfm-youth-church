"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import {
  MessageCircle,
  HandHeart,
  HelpCircle,
  Sparkles,
  MonitorPlay,
  ArrowRight,
} from "lucide-react";
import { SectionWrapper, SectionTitle } from "@/components/home/section-wrapper";

const features = [
  {
    name: "FamilyChat",
    description: "Moderated Christian fellowship and conversation",
    href: "/social/family-chat",
    icon: MessageCircle,
  },
  {
    name: "Prayer Circle",
    description: "Prayer, support and spiritual encouragement",
    href: "/social/prayer-circle",
    icon: HandHeart,
  },
  {
    name: "Today's Question",
    description: "Faith-based questions for meaningful interaction",
    href: "/social/todays-question",
    icon: HelpCircle,
  },
  {
    name: "Amen Wall",
    description: "Testimonies, gratitude and expressions of faith",
    href: "/social/amen-wall",
    icon: Sparkles,
  },
  {
    name: "Live Together",
    description: "Shared livestream and digital worship experiences",
    href: "/social/live-together",
    icon: MonitorPlay,
  },
];

const container = {
  hidden: {},
  show: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" } },
};

export function SocialShowcase() {
  return (
    <SectionWrapper className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionTitle
          title="YouthConnect"
          subtitle="I REMAIN CONNECTED TO MY CHURCH FAMILY THROUGHOUT THE WEEK."
        />

        <motion.div
          variants={container}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 md:gap-6"
        >
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <motion.div key={feature.name} variants={item}>
                <Link
                  href={feature.href}
                  className="block bg-white rounded-xl border border-gray-100 p-5 hover:shadow-md hover:border-red-100 transition-all group h-full"
                >
                  <div className="w-12 h-12 rounded-xl bg-red-50 flex items-center justify-center mb-4">
                    <Icon className="w-6 h-6 text-[#C62828]" />
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">
                    {feature.name}
                  </h3>
                  <p className="text-xs text-gray-500 leading-relaxed mb-4">
                    {feature.description}
                  </p>
                  <div className="inline-flex items-center gap-1 text-[#C62828] text-sm font-medium">
                    Explore
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </div>
                </Link>
              </motion.div>
            );
          })}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-50px" }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center"
        >
          <Link
            href="/social"
            className="mt-10 inline-flex items-center gap-2 bg-[#C62828] hover:bg-[#B71C1C] text-white px-8 py-3.5 rounded-xl font-semibold transition-colors"
          >
            ENTER YOUTHCONNECT
            <ArrowRight className="w-4 h-4" />
          </Link>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
