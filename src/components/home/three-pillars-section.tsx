"use client";

import { motion, type Variants } from "framer-motion";
import { Heart, Settings, Fish, ArrowRight } from "lucide-react";
import Link from "next/link";
import { SectionWrapper, SectionTitle } from "@/components/home/section-wrapper";

const pillars = [
  {
    badge: "CONNECT",
    subtitle: "RehobothSocial",
    description: "Customized Social Media Platform",
    icon: Heart,
    gradient: "from-[#E65100] to-[#FF8F00]",
    accentColor: "#E65100",
    buttonBg: "bg-[#E65100] hover:bg-[#BF360C]",
    pillBg: "bg-orange-50 text-[#E65100] border border-orange-200/50",
    features: ["FamilyChat", "Prayer Circle", "Today's Question", "Amen Wall", "Live Together"],
    cta: "ENTER REHOBOTHSOCIAL",
    link: "/social",
  },
  {
    badge: "ORGANIZE",
    subtitle: "Church Management System",
    description: "Manage every aspect of church life",
    icon: Settings,
    gradient: "from-[#1A237E] to-[#3949AB]",
    accentColor: "#1A237E",
    buttonBg: "bg-[#1A237E] hover:bg-[#0D1557]",
    pillBg: "bg-blue-50 text-[#1A237E] border border-blue-200/50",
    features: ["Announcements", "Events", "Devotionals", "Sermons", "Giving", "Testimonies"],
    cta: "EXPLORE CMS",
    link: "/announcements",
  },
  {
    badge: "REACH",
    subtitle: "Go-A-Fishing",
    description: "Digital Evangelism System",
    icon: Fish,
    gradient: "from-[#3949AB] to-[#5C6BC0]",
    accentColor: "#3949AB",
    buttonBg: "bg-[#3949AB] hover:bg-[#1A237E]",
    pillBg: "bg-indigo-50 text-[#3949AB] border border-indigo-200/50",
    features: ["Referral Dashboard", "Leaderboard", "Awards", "Profile"],
    cta: "GO-A-FISHING",
    link: "/go-a-fishing",
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

export function ThreePillarsSection() {
  return (
    <SectionWrapper className="py-16 md:py-24 bg-white" id="three-pillars">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionTitle
          title="Our Three Pillars"
          subtitle="Everything you need to Connect, Organize, and Reach — all in one place"
        />

        <motion.div
          variants={containerVariants}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8"
        >
          {pillars.map((pillar) => {
            const Icon = pillar.icon;
            return (
              <motion.div
                key={pillar.badge}
                variants={cardVariants}
                className="group rounded-2xl shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1 overflow-hidden bg-white border border-gray-100"
              >
                {/* Gradient accent bar at top */}
                <div className={`h-2 bg-gradient-to-r ${pillar.gradient}`} />

                {/* Card content */}
                <div className="p-6 md:p-8">
                  {/* Icon + Badge row */}
                  <div className="flex items-start gap-4 mb-4">
                    <div
                      className="flex items-center justify-center w-12 h-12 rounded-xl shrink-0"
                      style={{ backgroundColor: `${pillar.accentColor}12` }}
                    >
                      <Icon className="w-6 h-6" style={{ color: pillar.accentColor }} />
                    </div>
                    <div>
                      <span
                        className="inline-block text-xs font-bold tracking-widest uppercase px-2.5 py-1 rounded-full"
                        style={{
                          color: pillar.accentColor,
                          backgroundColor: `${pillar.accentColor}10`,
                        }}
                      >
                        {pillar.badge}
                      </span>
                    </div>
                  </div>

                  {/* Title */}
                  <h3
                    className="text-xl font-bold mb-1"
                    style={{ color: pillar.accentColor }}
                  >
                    {pillar.subtitle}
                  </h3>

                  {/* Description */}
                  <p className="text-gray-600 text-sm mb-5 leading-relaxed">
                    {pillar.description}
                  </p>

                  {/* Feature pills */}
                  <div className="flex flex-wrap gap-2 mb-6">
                    {pillar.features.map((feature) => (
                      <span
                        key={feature}
                        className={`inline-block text-xs font-medium rounded-full px-3 py-1 ${pillar.pillBg}`}
                      >
                        {feature}
                      </span>
                    ))}
                  </div>

                  {/* CTA button */}
                  <Link
                    href={pillar.link}
                    className={`inline-flex items-center justify-center gap-2 w-full ${pillar.buttonBg} text-white rounded-xl px-6 py-3 font-semibold text-sm transition-colors`}
                  >
                    {pillar.cta}
                    <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Scripture quote */}
        <p className="text-center mt-12 text-sm italic text-gray-400 max-w-lg mx-auto">
          &ldquo;And He said to them, &lsquo;Follow Me, and I will make you fishers of
          men.&rsquo;&rdquo; &mdash; Matthew 4:19
        </p>
      </div>
    </SectionWrapper>
  );
}
