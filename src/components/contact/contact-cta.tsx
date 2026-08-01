"use client";

import { motion } from "framer-motion";
import { ArrowRight, MessageSquare, Church } from "lucide-react";
import { SectionWrapper } from "@/components/home/section-wrapper";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export function ContactCTA() {
  const scrollToForm = () => {
    const el = document.getElementById("contact-form");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

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
          <div className="w-16 h-16 rounded-2xl bg-white/10 flex items-center justify-center mx-auto mb-6">
            <MessageSquare className="size-8 text-white" />
          </div>

          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white leading-tight">
            We&apos;d Love to
            <span className="text-[#D32F2F]"> Hear from You</span>
          </h2>
          <p className="mt-6 text-lg text-purple-200/80 max-w-2xl mx-auto leading-relaxed">
            Whether you have a question, need prayer, want to visit, or simply
            want to say hello &mdash; don&apos;t hesitate to reach out. We&apos;re
            here for you, and we&apos;d love to connect.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mt-10">
            <Button
              size="lg"
              onClick={scrollToForm}
              className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-xl px-8 font-semibold shadow-lg shadow-[#D32F2F]/25 text-base"
            >
              <MessageSquare className="size-4 mr-2" />
              Send Us a Message
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-white/20 text-white hover:bg-white/10 rounded-xl px-8 font-semibold text-base"
            >
              <Link href="/about">
                <Church className="size-4 mr-2" />
                Join Us This Sunday
                <ArrowRight className="size-4 ml-2" />
              </Link>
            </Button>
          </div>
        </motion.div>
      </div>
    </SectionWrapper>
  );
}