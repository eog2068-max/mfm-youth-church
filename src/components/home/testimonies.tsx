"use client";

import { Quote, ArrowRight, Heart } from "lucide-react";
import { SectionWrapper, SectionTitle } from "./section-wrapper";
import Link from "next/link";

const testimonies = [
  {
    quote:
      "Since joining Youth Assembly, my life has taken a completely new direction. The teachings are deeply rooted in the Word of God, and the fellowship is genuine. I have experienced God's faithfulness in ways I never imagined.",
    name: "Adebayo Johnson",
    status: "Member since 2019",
  },
  {
    quote:
      "I came to this church during a very difficult season in my life. The love and support I received from the brethren, combined with powerful prayers, brought about my total healing. God is truly at work in Youth Assembly.",
    name: "Chidinma Okafor",
    status: "Member since 2021",
  },
  {
    quote:
      "The Bible Study sessions have completely transformed my understanding of Scripture. I now approach God's Word with confidence and clarity. I am forever grateful for the spiritual growth I've experienced here.",
    name: "Emmanuel Adeyemi",
    status: "Member since 2020",
  },
];

export function Testimonies() {
  return (
    <SectionWrapper className="bg-[#F3E5F5] py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionTitle title="Testimonies" subtitle="What our members are saying about God's goodness" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonies.map((item, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl p-6 shadow-md shadow-black/5 border-l-4 border-l-[#D32F2F] border-t-0 border-r-0 border-b-0 hover:shadow-lg transition-shadow"
            >
              <Quote className="size-8 text-[#D32F2F]/20 mb-3" />
              <p className="text-gray-700 text-sm leading-relaxed mb-5">
                &ldquo;{item.quote}&rdquo;
              </p>
              <div className="border-t border-gray-100 pt-4">
                <p className="font-bold text-[#4A148C] text-sm">{item.name}</p>
                <p className="text-xs text-gray-500 mt-0.5">{item.status}</p>
              </div>
            </div>
          ))}
        </div>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <Link
            href="/testimonies"
            className="inline-flex items-center gap-1.5 text-[#4A148C] font-semibold hover:gap-2.5 transition-all text-sm"
          >
            View All Testimonies
            <ArrowRight className="size-4" />
          </Link>
          <Link
            href="/testimonies"
            className="inline-flex items-center gap-1.5 text-[#D32F2F] font-semibold hover:gap-2.5 transition-all text-sm"
          >
            <Heart className="size-4" />
            Share Your Testimony
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
}