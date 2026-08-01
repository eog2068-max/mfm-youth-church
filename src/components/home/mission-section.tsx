"use client";

import { motion, type Variants } from "framer-motion";
import { Heart, Settings, Fish } from "lucide-react";
import { SectionWrapper, SectionTitle } from "@/components/home/section-wrapper";

const missions = [
  {
    name: "CONNECT",
    purpose: "YouthConnect",
    description: "Keep your Church family connected throughout the week.",
    icon: Heart,
    accentColor: "#C62828",
  },
  {
    name: "ORGANIZE",
    purpose: "Church Management System",
    description:
      "Help your Church communicate, coordinate and manage its activities.",
    icon: Settings,
    accentColor: "#4A148C",
  },
  {
    name: "REACH",
    purpose: "Go-A-Fishing",
    description: "Mobilize your Church family to reach beyond the walls.",
    icon: Fish,
    accentColor: "#7B1FA2",
  },
];

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const cardVariants: Variants = {
  hidden: { opacity: 0, y: 30 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut",
    },
  },
};

export function MissionSection() {
  return (
    <SectionWrapper className="py-16 md:py-24 bg-[#F8FAFF]" id="mission">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionTitle
          title="Our Mission"
          subtitle="Three ways we serve God&rsquo;s family"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8"
        >
          {missions.map((mission) => {
            const Icon = mission.icon;
            return (
              <motion.div
                key={mission.name}
                variants={cardVariants}
                className="rounded-2xl shadow-md bg-white border border-gray-100 overflow-hidden"
              >
                {/* Colored top accent bar */}
                <div
                  className="h-0.5"
                  style={{ backgroundColor: mission.accentColor }}
                />

                <div className="p-6 md:p-8">
                  {/* Icon */}
                  <div
                    className="flex items-center justify-center w-12 h-12 rounded-xl mb-4"
                    style={{ backgroundColor: `${mission.accentColor}12` }}
                  >
                    <Icon
                      className="w-6 h-6"
                      style={{ color: mission.accentColor }}
                    />
                  </div>

                  {/* Pillar name + purpose tag */}
                  <h3
                    className="text-lg font-bold mb-1"
                    style={{ color: mission.accentColor }}
                  >
                    {mission.name}
                  </h3>
                  <p className="text-sm text-gray-500 mb-3">
                    {mission.purpose}
                  </p>

                  {/* Description */}
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {mission.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}
