"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/home/section-wrapper";
import { ArrowRight, Phone, MapPin } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function AboutCTA() {
  return (
    <SectionWrapper className="py-16 md:py-24 bg-gradient-to-br from-[#4A148C] to-[#1A0033] relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#D32F2F] rounded-full blur-[128px]" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-[#7B1FA2] rounded-full blur-[128px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            Ready to Experience the
            <span className="text-[#D32F2F]"> Youth</span> Difference?
          </h2>
          <p className="mt-6 text-lg text-purple-200/80 max-w-2xl mx-auto leading-relaxed">
            We invite you to worship with us this Sunday and become part of a family where
            God&apos;s presence is real, His Word is power, and His love is unconditional.
            Your destiny finds fulfillment here.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Button
              asChild
              size="lg"
              className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-xl px-8 font-semibold shadow-lg shadow-[#D32F2F]/25 text-base"
            >
              <Link href="/contact">
                Plan Your Visit
                <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 rounded-xl px-8 font-semibold text-base"
            >
              <a href="tel:+2349050017238">
                <Phone className="size-4 mr-2" />
                Contact Us
              </a>
            </Button>
          </div>

          <div className="mt-10 flex items-center justify-center gap-2 text-purple-200/60 text-sm">
            <MapPin className="size-4" />
            <span>14 Ekukinam Street, Opp. Chisco Motor Park Utako, Abuja.</span>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}