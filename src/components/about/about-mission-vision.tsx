"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/home/section-wrapper";
import { Target, Eye, ArrowRight } from "lucide-react";

export function AboutMissionVision() {
  return (
    <SectionWrapper className="py-16 md:py-24 bg-[#F3E5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid md:grid-cols-2 gap-8 lg:gap-12">
          {/* Mission Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="relative bg-white rounded-3xl p-8 md:p-10 shadow-lg shadow-[#4A148C]/5 border border-[#4A148C]/5 overflow-hidden group"
          >
            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#D32F2F]/5 to-transparent rounded-bl-[80px]" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-[#4A148C] flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Target className="size-7 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-[#4A148C] mb-4">Our Mission</h3>
              <p className="text-gray-600 leading-relaxed mb-6">
                To preach the Word of God with power, to demonstrate the Holy Spirit&apos;s
                presence through signs, wonders, and miracles, and to raise an army of
                spiritually militant young believers who will enforce the victory of
                Calvary, destroy the works of the devil, and take the Gospel to the
                ends of the earth. We exist to equip every youth to live a life of
                holiness, prayer, and purpose.
              </p>
              <ul className="space-y-3">
                {[
                  "Preach the undiluted Word with power and fire",
                  "Raise spiritually militant young believers",
                  "Demonstrate God&apos;s power through prayer and miracles",
                  "Impact our generation for Christ",
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
            className="relative bg-gradient-to-br from-[#4A148C] to-[#1A0033] rounded-3xl p-8 md:p-10 shadow-xl overflow-hidden group"
          >
            {/* Decorative elements */}
            <div className="absolute top-0 right-0 w-40 h-40 bg-white/5 rounded-bl-[100px]" />
            <div className="absolute bottom-0 left-0 w-32 h-32 bg-[#D32F2F]/10 rounded-tr-[80px]" />
            <div className="relative">
              <div className="w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <Eye className="size-7 text-white" />
              </div>
              <h3 className="text-2xl md:text-3xl font-bold text-white mb-4">Our Vision</h3>
              <p className="text-purple-200/80 leading-relaxed mb-6">
                To be a leading youth arm of the Mountain of Fire and Miracles Ministries,
                renowned for spiritual depth, prayer fire, holiness, and transformative
                community impact. We envision a youth church where every young person
                discovers their purpose, develops their spiritual gifts, and deploys them
                for the advancement of God&apos;s Kingdom. MFM Youth Church shall be a
                place where the fire of God burns intensely, miracles are commonplace,
                and destinies are fulfilled.
              </p>
              <ul className="space-y-3">
                {[
                  "A youth church of spiritual depth and power",
                  "A community of holy living and fervent prayer",
                  "A launching pad for young destinies",
                  "A global impact centre for the Gospel",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-3 text-purple-100/80">
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
