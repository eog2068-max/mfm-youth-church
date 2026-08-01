"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Shield, Zap, Globe } from "lucide-react";
import type { SocialFeature } from "./social-data";

interface FeatureLandingPageProps {
  feature: SocialFeature;
  children?: React.ReactNode;
  onEnter: () => void;
}

export function FeatureLandingPage({
  feature,
  children,
  onEnter,
}: FeatureLandingPageProps) {
  return (
    <div className="min-h-screen bg-[#F8FAFF]">
      {/* Back to YouthConnect */}
      <motion.div
        initial={{ opacity: 0, x: -10 }}
        animate={{ opacity: 1, x: 0 }}
        className="pt-6 pb-4 max-w-3xl mx-auto px-4"
      >
        <Link
          href="/social"
          className="inline-flex items-center gap-2 text-sm font-medium text-[#4A148C] hover:text-[#1A0033] transition-colors"
        >
          <ArrowLeft className="size-4" />
          Back to YouthConnect
        </Link>
      </motion.div>

      {/* Feature Hero */}
      <section
        className={`relative overflow-hidden bg-gradient-to-br ${feature.color} pt-16 pb-16 md:pt-20 md:pb-20`}
      >
        {/* Decorative */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 20% 30%, rgba(255,255,255,0.12) 1px, transparent 1px),
                               radial-gradient(circle at 80% 70%, rgba(255,255,255,0.08) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>
        <div className="absolute top-0 right-1/4 w-72 h-72 bg-white/5 rounded-full blur-3xl" />
        <div className="absolute bottom-0 left-1/3 w-60 h-60 bg-white/5 rounded-full blur-3xl" />

        <div className="relative z-10 max-w-3xl mx-auto px-4 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="text-5xl md:text-6xl mb-5"
          >
            {feature.emoji}
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-3xl sm:text-4xl md:text-5xl font-bold text-white tracking-tight mb-4"
          >
            {feature.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
            className="text-sm md:text-base text-white/70 max-w-lg mx-auto leading-relaxed"
          >
            {feature.description}
          </motion.p>
        </div>
      </section>

      {/* Main Content Card */}
      <section className="max-w-3xl mx-auto px-4 -mt-8 relative z-20 mb-10">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white rounded-2xl border border-gray-100 shadow-xl overflow-hidden"
        >
          <div className="p-6 md:p-8">
            {/* Extended description */}
            <p className="text-base text-gray-600 leading-relaxed mb-6">
              {feature.extendedDescription}
            </p>

            {/* Feature-specific content slot */}
            {children}

            {/* How to Use This Feature */}
            <div className="mt-8 border-t border-gray-100 pt-6">
              <h3 className="text-sm font-bold text-[#4A148C] mb-4 uppercase tracking-wider">
                How to Use {feature.title}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {feature.landingSteps.map((step, i) => (
                  <motion.div
                    key={step.title}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className="text-center"
                  >
                    <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-[#4A148C] to-[#6A1B9A] flex items-center justify-center mx-auto mb-2.5 text-lg">
                      {step.emoji}
                    </div>
                    <h4 className="text-xs font-bold text-gray-800 mb-1">
                      {step.title}
                    </h4>
                    <p className="text-[11px] text-gray-500 leading-relaxed">
                      {step.description}
                    </p>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>

          {/* CTA Button */}
          <div className="bg-gray-50 px-6 md:px-8 py-5">
            <button
              onClick={onEnter}
              className={`w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-gradient-to-r ${feature.color} hover:opacity-90 text-white px-8 py-4 rounded-xl font-bold transition-all shadow-lg text-sm sm:text-base`}
            >
              {feature.emoji} {feature.ctaText}
              <ArrowRight className="size-4" />
            </button>
          </div>
        </motion.div>
      </section>

      {/* Trust Indicators */}
      <section className="max-w-3xl mx-auto px-4 pb-14">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {[
            {
              icon: Shield,
              title: "Safe & Moderated",
              desc: "All content is reviewed to ensure a healthy, Christ-honouring environment.",
            },
            {
              icon: Zap,
              title: "Instant Access",
              desc: "No registration, no login. Participate immediately.",
            },
            {
              icon: Globe,
              title: "Open to All",
              desc: "Members, visitors, and newcomers are all welcome.",
            },
          ].map((item) => (
            <div key={item.title} className="text-center">
              <div className="w-10 h-10 rounded-xl bg-[#F3E5F5] flex items-center justify-center mx-auto mb-2">
                <item.icon className="size-5 text-[#4A148C]" />
              </div>
              <h3 className="text-xs font-bold text-gray-800 mb-0.5">
                {item.title}
              </h3>
              <p className="text-[11px] text-gray-500 leading-relaxed">
                {item.desc}
              </p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
