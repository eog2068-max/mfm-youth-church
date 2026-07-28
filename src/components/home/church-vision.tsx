"use client";

import { motion } from "framer-motion";

export function ChurchVision() {
  return (
    <section className="relative bg-gradient-to-b from-[#0D1557] via-[#1A237E] to-[#0D1557] py-20 md:py-28 overflow-hidden">
      {/* Subtle decorative dot pattern overlay */}
      <div className="absolute inset-0 opacity-10">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `radial-gradient(circle at 30% 40%, rgba(255,255,255,0.12) 1px, transparent 1px),
                             radial-gradient(circle at 70% 60%, rgba(255,255,255,0.08) 1px, transparent 1px)`,
            backgroundSize: "80px 80px",
          }}
        />
      </div>
      {/* Soft ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-400/5 rounded-full blur-3xl" />

      <div className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0 }}
          className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-relaxed"
        >
          THE CHURCH IS MORE THAN A BUILDING.
        </motion.h2>

        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
          className="text-xl sm:text-2xl md:text-3xl font-bold text-white tracking-tight leading-relaxed mt-2"
        >
          THE CHURCH IS A FAMILY.
        </motion.h2>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-80px" }}
          transition={{ duration: 0.8, ease: "easeOut", delay: 0.4 }}
          className="text-base md:text-lg text-white/90 leading-relaxed mt-6"
        >
          You Don&rsquo;t Have To Wait Until The Next Church Service To Feel Connected
          To Your Church Family.
        </motion.p>
      </div>
    </section>
  );
}
