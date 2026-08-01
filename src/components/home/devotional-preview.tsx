import Link from "next/link";
import { BookOpen, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper, SectionTitle } from "./section-wrapper";

export function DevotionalPreview() {
  const today = new Date().toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <SectionWrapper className="bg-gradient-to-b from-[#EBF0FA] to-white py-16 md:py-24">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <SectionTitle title="Today's Devotional" />

        <div className="bg-white rounded-2xl shadow-lg shadow-black/5 p-6 md:p-8 border border-[#4A148C]/5">
          <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
            <BookOpen className="size-4 text-[#4A148C]" />
            <span>{today}</span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-[#4A148C] mb-4">
            Walking in God&apos;s Purpose
          </h3>

          <div className="space-y-3 text-gray-600 leading-relaxed text-sm md:text-base">
            <p>
              For I know the plans I have for you, declares the Lord, plans to prosper you and
              not to harm you, plans to give you hope and a future. — Jeremiah 29:11
            </p>
            <p>
              God has a unique and beautiful purpose for every one of His children. Often, the
              journey to discovering that purpose requires patience, trust, and a willingness to
              step out in faith even when the path ahead seems unclear...
            </p>
          </div>

          <div className="mt-6 pt-6 border-t border-gray-100">
            <Button
              asChild
              variant="outline"
              className="rounded-xl border-[#4A148C]/20 text-[#4A148C] hover:bg-[#EBF0FA]"
            >
              <Link href="/devotionals">
                Read Full Devotional
                <ArrowRight className="size-4" />
              </Link>
            </Button>
            <div className="mt-3">
              <Link href="/devotionals" className="text-xs text-gray-400 hover:text-[#4A148C] transition-colors">
                View All Devotionals →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}