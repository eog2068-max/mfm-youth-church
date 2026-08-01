"use client";

import { motion } from "framer-motion";
import { Heart, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function GivingCTA() {
  return (
    <section className="relative py-16 md:py-20 overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-[#1A0033] via-[#4A148C] to-[#6A1B9A]" />
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#D32F2F] rounded-full blur-[128px] -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-green-400/20 rounded-full blur-[128px] translate-y-1/2" />
      </div>

      <div className="relative z-10 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <div className="w-16 h-16 rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center mx-auto mb-6">
            <Heart className="size-8 text-white/80" />
          </div>
          <h2 className="text-3xl md:text-4xl font-bold text-white tracking-tight">
            Your Generosity Changes Lives
          </h2>
          <p className="mt-4 text-lg text-purple-200/80 max-w-xl mx-auto leading-relaxed">
            Every gift you give makes an eternal impact. As you sow into the Kingdom of God, know
            that He who sees in secret will reward you openly.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
            <Button
              asChild
              size="lg"
              className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-xl h-12 px-8 font-semibold shadow-lg"
            >
              <Link href="/giving#payment-section">
                <Heart className="size-4 mr-2" />
                Give Now
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-white/30 text-white hover:bg-white/10 hover:text-white rounded-xl h-12 px-8 font-semibold"
            >
              <Link href="/contact">
                <ArrowRight className="size-4 mr-2" />
                Contact Us
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
