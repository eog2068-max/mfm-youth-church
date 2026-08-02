"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { Heart, Users, MessageCircle, Flame, Sparkles } from "lucide-react";
import { SectionWrapper } from "@/components/home/section-wrapper";

const highlights = [
  { emoji: "👋", text: "No account needed", icon: Users },
  { emoji: "✨", text: "Daily questions", icon: MessageCircle },
  { emoji: "🙏", text: "Pray together", icon: Heart },
  { emoji: "🔥", text: "Weekly challenges", icon: Flame },
];

export function SocialCTA() {
  return (
    <SectionWrapper className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <div className="bg-gradient-to-br from-[#1A0033] via-[#4A148C] to-[#6A1B9A] rounded-3xl overflow-hidden relative">
          {/* Decorative elements */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute inset-0" style={{
              backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.12) 1px, transparent 1px),
                               radial-gradient(circle at 80% 70%, rgba(255,255,255,0.08) 1px, transparent 1px)`,
              backgroundSize: "50px 50px"
            }} />
          </div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-pink-400/10 rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-400/10 rounded-full blur-3xl" />

          <div className="relative z-10 p-8 md:p-12 lg:p-16 text-center">
            <motion.div
              initial={{ scale: 0 }}
              whileInView={{ scale: 1 }}
              viewport={{ once: true }}
              transition={{ type: "spring" }}
              className="text-5xl mb-4"
            >
              ❤️
            </motion.div>

            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-3xl md:text-4xl font-bold text-white mb-3"
            >
              Connect With Your Church Family
            </motion.h2>

            <motion.p
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="text-purple-100/70 mb-8 max-w-lg mx-auto"
            >
              Join YouthConnect — a place to connect, pray, encourage, and grow together. No account needed.
            </motion.p>

            {/* Feature pills */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="flex flex-wrap justify-center gap-3 mb-8"
            >
              {highlights.map((item) => (
                <span
                  key={item.text}
                  className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/15 rounded-full px-4 py-2 text-sm text-purple-100/80"
                >
                  <span>{item.emoji}</span>
                  {item.text}
                </span>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-3 justify-center"
            >
              <Link
                href="/social"
                className="inline-flex items-center justify-center gap-2 bg-white text-[#4A148C] px-8 py-3.5 rounded-xl font-semibold hover:bg-gray-100 transition-colors shadow-lg text-sm"
              >
                <Sparkles className="size-4" />
                ENTER YOUTHCONNECT
              </Link>
              <Link
                href="/social/im-here"
                className="inline-flex items-center justify-center gap-2 bg-white/10 border border-white/30 text-white px-8 py-3.5 rounded-xl font-semibold hover:bg-white/20 transition-colors text-sm"
              >
                👋 I&apos;m Here
              </Link>
            </motion.div>

            {/* Tagline */}
            <motion.p
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: 0.4 }}
              className="mt-6 text-xs text-purple-200/40 tracking-widest uppercase"
            >
              Connect. Pray. Encourage. Grow. Together.
            </motion.p>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}
