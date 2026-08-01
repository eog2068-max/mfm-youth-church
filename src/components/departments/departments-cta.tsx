"use client";

import { motion } from "framer-motion";
import { SectionWrapper } from "@/components/home/section-wrapper";
import { ArrowRight, Phone } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function DepartmentsCTA() {
  return (
    <SectionWrapper className="py-16 md:py-24 bg-gradient-to-br from-[#4A148C] to-[#1A0033] relative overflow-hidden">
      <div className="absolute inset-0 opacity-10">
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-[#D32F2F] rounded-full blur-[128px]" />
        <div className="absolute bottom-0 left-1/4 w-80 h-80 bg-[#7B1FA2] rounded-full blur-[128px]" />
      </div>

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
        >
          <h2 className="text-3xl md:text-4xl font-bold text-white leading-tight">
            Find Your Place to Serve
          </h2>
          <p className="mt-4 text-lg text-purple-200/80 max-w-2xl mx-auto leading-relaxed">
            There is a department waiting for you at Youth Assembly. Whether you are gifted in
            music, teaching, administration, or hospitality — there is room for your gift to
            flourish and impact lives for the Kingdom of God.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Button
              asChild
              size="lg"
              className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-xl px-8 font-semibold shadow-lg shadow-[#D32F2F]/25 text-base"
            >
              <Link href="/join-ministry">
                Join a Department
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
                Speak to Us
              </a>
            </Button>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}