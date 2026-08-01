"use client";

import { motion } from "framer-motion";
import { SectionWrapper, SectionTitle } from "@/components/home/section-wrapper";
import { BookOpen, HandHeart, Users, Sparkles, ShieldCheck, Globe } from "lucide-react";

const values = [
  {
    icon: BookOpen,
    title: "Word of God",
    description:
      "The Word of God is the foundation of everything we do. We are committed to studying, teaching, and living by the Bible as our supreme authority. Every sermon, program, and decision is anchored in Scripture.",
    color: "bg-[#4A148C]/10 text-[#4A148C]",
  },
  {
    icon: Sparkles,
    title: "Prayer",
    description:
      "Prayer is the lifeline of our church. We believe in the power of persistent, fervent prayer to move mountains, heal the sick, and bring about supernatural transformation in lives and circumstances.",
    color: "bg-[#D32F2F]/10 text-[#D32F2F]",
  },
  {
    icon: HandHeart,
    title: "Love & Compassion",
    description:
      "We are called to love one another as Christ loved us. This value drives our commitment to genuine fellowship, caring for the needy, supporting the weak, and extending grace to all who cross our path.",
    color: "bg-[#2E7D32]/10 text-[#2E7D32]",
  },
  {
    icon: Users,
    title: "Fellowship & Unity",
    description:
      "We value authentic Christian community where every member belongs, contributes, and grows. We celebrate diversity within the body of Christ and pursue unity without compromise, knowing that together we are stronger.",
    color: "bg-[#4A148C]/10 text-[#4A148C]",
  },
  {
    icon: ShieldCheck,
    title: "Integrity & Excellence",
    description:
      "We pursue excellence in all we do because we serve an excellent God. Our conduct, stewardship, and service reflect the highest standards of integrity, transparency, and accountability in every area of ministry.",
    color: "bg-[#D32F2F]/10 text-[#D32F2F]",
  },
  {
    icon: Globe,
    title: "Evangelism & Missions",
    description:
      "We are compelled by Christ&apos;s Great Commission to reach the unreached and make disciples of all nations. From our local community in Utako to the ends of the earth, we are committed to spreading the Gospel.",
    color: "bg-[#2E7D32]/10 text-[#2E7D32]",
  },
];

export function AboutValues() {
  return (
    <SectionWrapper className="py-16 md:py-24 bg-[#F3E5F5]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionTitle
          title="Our Core Values"
          subtitle="These timeless principles guide everything we do at Youth Church — from our worship services to our community outreach programs."
        />

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {values.map((value, index) => (
            <motion.div
              key={value.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.08 }}
              className="group bg-white rounded-2xl p-7 hover:shadow-xl hover:shadow-[#4A148C]/8 border border-transparent hover:border-[#4A148C]/8 transition-all duration-300"
            >
              <div
                className={`w-14 h-14 rounded-2xl ${value.color} flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300`}
              >
                <value.icon className="size-7" />
              </div>
              <h3 className="text-xl font-bold text-[#4A148C] mb-3">{value.title}</h3>
              <p className="text-gray-600 text-sm leading-relaxed">{value.description}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </SectionWrapper>
  );
}