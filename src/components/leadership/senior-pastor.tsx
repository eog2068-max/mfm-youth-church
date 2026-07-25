"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/home/section-wrapper";
import Image from "next/image";
import { BookOpen, Heart, Quote } from "lucide-react";

export function SeniorPastor() {
  return (
    <SectionWrapper className="py-16 md:py-24 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-5 gap-10 lg:gap-16 items-center">
          {/* Photo Side */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
            className="lg:col-span-2"
          >
            <div className="relative max-w-sm mx-auto">
              {/* Photo placeholder */}
              <div className="relative aspect-[3/4] rounded-3xl overflow-hidden shadow-2xl shadow-[#1A237E]/15 bg-gradient-to-br from-[#F0F4FF] to-[#E8EDF8]">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="text-center">
                    <div className="w-28 h-28 rounded-full bg-[#1A237E]/10 flex items-center justify-center mx-auto mb-4">
                      <span className="text-4xl font-bold text-[#1A237E]">SP</span>
                    </div>
                    <p className="text-sm text-gray-400">Photo Placeholder</p>
                  </div>
                </div>
              </div>
              {/* Decorative elements */}
              <div className="absolute -bottom-3 -right-3 w-full h-full rounded-3xl border-2 border-[#D32F2F]/20 -z-10" />
              <div className="absolute -top-4 -left-4 w-20 h-20 bg-[#D32F2F]/10 rounded-2xl -z-10" />
            </div>
          </motion.div>

          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.2 }}
            className="lg:col-span-3"
          >
            <p className="text-[#D32F2F] font-semibold text-sm uppercase tracking-wider mb-2">
              Senior Pastor
            </p>
            <h2 className="text-3xl md:text-4xl font-bold text-[#1A237E] mb-2 leading-tight">
              Pastor [Name]
            </h2>
            <p className="text-gray-500 text-base mb-6">
              Senior Pastor, Rehoboth Assembly Parish
            </p>

            <div className="space-y-4 text-gray-600 leading-relaxed">
              <p>
                Pastor [Name] is the founding and Senior Pastor of The Redeemed Christian Church of God,
                Rehoboth Assembly Parish, Utako, Abuja. Called into ministry under the RCCG
                umbrella, Pastor [Name] has served the Lord faithfully for over two decades,
                demonstrating an unwavering commitment to the preaching of the Gospel and the
                transformation of lives through the power of the Holy Spirit.
              </p>
              <p>
                With a deep passion for the Word of God and a heart for the lost, Pastor [Name]
                leads the Rehoboth Assembly family with wisdom, humility, and an apostolic grace
                that has positioned the parish as a place of destiny fulfillment. Under [his/her]
                leadership, the church has grown from a small house fellowship to a vibrant,
                multi-generational congregation impacting the Utako community and beyond.
              </p>
              <p>
                Pastor [Name] holds a [Degree/Qualification] from [Institution] and is happily
                married to [Spouse&apos;s Name], and they are blessed with [number] children.
                Together, they serve as a testament to God&apos;s faithfulness in the family and
                in ministry.
              </p>
            </div>

            {/* Quote */}
            <div className="mt-8 p-6 rounded-2xl bg-[#F5F7FF] border-l-4 border-[#D32F2F]">
              <Quote className="size-6 text-[#D32F2F] mb-2" />
              <p className="text-[#1A237E] font-medium italic leading-relaxed">
                &ldquo;The Lord has made room for us, and we shall be fruitful in the land.
                This is our Rehoboth — a place of wide spaces, divine abundance, and destiny
                fulfillment.&rdquo;
              </p>
              <p className="text-sm text-gray-500 mt-2">— Pastor [Name]</p>
            </div>

            {/* Quick stats */}
            <div className="flex flex-wrap gap-6 mt-8">
              <div className="flex items-center gap-2">
                <BookOpen className="size-5 text-[#1A237E]" />
                <span className="text-sm text-gray-600"><strong className="text-[#1A237E]">20+</strong> Years in Ministry</span>
              </div>
              <div className="flex items-center gap-2">
                <Heart className="size-5 text-[#D32F2F]" />
                <span className="text-sm text-gray-600"><strong className="text-[#1A237E]">500+</strong> Lives Impacted</span>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </SectionWrapper>
  );
}