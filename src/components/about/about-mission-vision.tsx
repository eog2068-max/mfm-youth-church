"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/home/section-wrapper";
import { Target, Eye, ArrowRight } from "lucide-react";

export function AboutMissionVision() {
  return (
    <SectionWrapper className="py-16 md:py-24 bg-[#F5F7FF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-white rounded-3xl p-8 md:p-10 shadow-lg shadow-[#1A237E]/5 border border-[#1A237E]/5 overflow-hidden group"
          >
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#D32F2F]/5 to-transparent rounded-bl-[80px]" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-[#1A237E] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="size-7 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#1A237E] mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                To make heaven and to take as many people with us as possible. We are committed to
                preaching the Gospel of our Lord Jesus Christ to every creature, teaching the
                undiluted Word of God, and demonstrating the love and power of God through acts of
                service, compassion, and community impact. We exist to raise a generation of
                believers who are rooted in the Word, led by the Spirit, and relevant to their world.
              </p>
              <ul className="space-y-3">
                {[
                  "Preach the Gospel to all nations",
                  "Raise spiritually mature believers",
                  "Demonstrate God's love through service",
                  "Impact our community for Christ",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-gray-600">
                    <ArrowRight className="size-4 text-[#D32F2F] shrink-0 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>

          {/* Vision Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.15 }}
            className="relative bg-gradient-to-br from-[#1A237E] to-[#0D1557] rounded-3xl p-8 md:p-10 shadow-xl overflow-hidden group"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-bl-[100px]" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D32F2F]/10 rounded-tr-[80px]" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Eye className="size-7 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-blue-200/80 leading-relaxed mb-6">
                To be a leading parish of The Redeemed Christian Church of God, renowned for
                spiritual depth, genuine love, and transformative community impact. We envision a
                church where every member discovers their purpose, develops their gifts, and
                deploys them for the advancement of God&apos;s Kingdom. Rehoboth Assembly shall be
                a place where the presence of God is tangible, miracles are commonplace, and
                destinies are fulfilled.
              </p>
              <ul className="space-y-3">
                {[
                  "A church of spiritual depth and power",
                  "A community of genuine love and fellowship",
                  "A launching pad for destinies",
                  "A global impact centre for the Gospel",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-blue-100/80">
                    <ArrowRight className="size-4 text-[#D32F2F] shrink-0 mt-1" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}