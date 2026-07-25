"use client";

import { motion } from "framer-motion";
import { SectionWrapper, SectionTitle } from "@/components/home/section-wrapper";
import Image from "next/image";
import { Church, Users, Globe, Heart } from "lucide-react";

const stats = [
  { icon: Users, value: "500+", label: "Members" },
  { icon: Church, value: "10+", label: "Years of Service" },
  { icon: Globe, value: "5+", label: "Community Outreach Programs" },
  { icon: Heart, value: "20+", label: "Active Ministries" },
];

export function AboutStory() {
  return (
    <SectionWrapper className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          {/* Image Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="relative"
          >
            <div className="relative aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl shadow-[#1A237E]/10">
              <div className="absolute inset-0 bg-gradient-to-br from-[#1A237E]/20 to-[#D32F2F]/10 flex items-center justify-center">
                <div className="text-center p-8">
                  <div className="relative h-24 w-24 mx-auto rounded-full bg-white/90 p-1 shadow-lg mb-4">
                    <Image
                      src="/rccg-logo.png"
                      alt="RCCG Logo"
                      fill
                      sizes="96px"
                      className="object-contain"
                    />
                  </div>
                  <p className="text-[#1A237E] font-bold text-lg">Rehoboth Assembly Parish</p>
                  <p className="text-gray-500 text-sm mt-1">Est. 2015</p>
                </div>
              </div>
            </div>
            {/* Decorative element */}
            <div className="absolute -bottom-4 -right-4 w-32 h-32 bg-[#D32F2F]/10 rounded-2xl -z-10" />
            <div className="absolute -top-4 -left-4 w-24 h-24 bg-[#1A237E]/10 rounded-2xl -z-10" />
          </motion.div>

          {/* Text Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <p className="text-[#D32F2F] font-semibold text-sm uppercase tracking-wider mb-2">
              Our Story
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A237E] mb-6 leading-tight">
              A Place Where Destiny Finds
              <span className="text-[#D32F2F]"> Fulfillment</span>
            </h2>
            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                The Redeemed Christian Church of God, Rehoboth Assembly Parish, was established with a
                divine mandate to be a beacon of hope and a place of spiritual rejuvenation in the
                heart of Utako, Abuja. Founded under the leadership of The Redeemed Christian Church
                of God, our parish began as a small gathering of believers united by a common
                faith and an unwavering commitment to the Word of God.
              </p>
              <p>
                The name &ldquo;Rehoboth&rdquo; comes from Genesis 26:22, where Isaac declared,
                &ldquo;The Lord has made room for us, and we shall be fruitful in the land.&rdquo;
                This scripture has been the foundation of our journey — a testimony of God&apos;s
                faithfulness in making room for His people to grow, thrive, and fulfill their
                God-given destinies.
              </p>
              <p>
                From our humble beginnings as a house fellowship, Rehoboth Assembly has grown into a
                vibrant, multi-generational church family. We have witnessed countless lives
                transformed, families restored, and destinies fulfilled through the power of the
                Holy Spirit, dynamic worship, and the undiluted preaching of the Gospel of Jesus
                Christ.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Stats Bar */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-6"
        >
          {stats.map((stat) => (
            <div
              key={stat.label}
              className="text-center p-6 rounded-2xl bg-[#F5F7FF] border border-[#1A237E]/5"
            >
              <stat.icon className="size-8 text-[#D32F2F] mx-auto mb-3" />
              <p className="text-3xl md:text-4xl font-bold text-[#1A237E]">{stat.value}</p>
              <p className="text-sm text-gray-500 mt-1">{stat.label}</p>
            </div>
          ))}
        </motion.div>
      </div>
    </SectionWrapper>
  );
}