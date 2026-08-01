import Link from "next/link";
import { Play, Calendar, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { SectionWrapper, SectionTitle } from "./section-wrapper";

export function LatestSermon() {
  const lastSunday = new Date();
  const dayOfWeek = lastSunday.getDay();
  const daysAgo = dayOfWeek === 0 ? 0 : dayOfWeek;
  lastSunday.setDate(lastSunday.getDate() - daysAgo);
  const dateStr = lastSunday.toLocaleDateString("en-NG", {
    weekday: "long",
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <SectionWrapper className="py-16 md:py-24">
      <div className="max-w-4xl mx-auto px-4 sm:px-6">
        <SectionTitle title="Latest Sermon" />

        <div className="bg-white rounded-2xl shadow-lg shadow-black/5 overflow-hidden border border-gray-100">
          <div className="flex flex-col md:flex-row">
            {/* Thumbnail placeholder */}
            <div className="relative md:w-80 aspect-video md:aspect-auto bg-gradient-to-br from-[#4A148C] to-[#7B1FA2] flex items-center justify-center shrink-0">
              <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center cursor-pointer hover:bg-white/30 transition-colors">
                <Play className="size-7 text-white fill-white ml-1" />
              </div>
              <span className="absolute bottom-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-md">
                45:20
              </span>
            </div>

            {/* Content */}
            <div className="p-6 md:p-8 flex flex-col justify-center">
              <h3 className="text-xl md:text-2xl font-bold text-[#4A148C] mb-2">
                The Power of Faith
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 mb-4">
                <span className="flex items-center gap-1.5">
                  <User className="size-3.5" />
                  Senior Pastor
                </span>
                <span className="flex items-center gap-1.5">
                  <Calendar className="size-3.5" />
                  {dateStr}
                </span>
              </div>
              <p className="text-gray-600 text-sm leading-relaxed mb-6">
                In this powerful message, we explore how unwavering faith in God can move mountains
                and transform circumstances. Drawing from Hebrews 11:1, the Senior Pastor
                delivers an inspiring word that will strengthen your walk with God.
              </p>
              <div>
                <Button
                  asChild
                  className="bg-[#D32F2F] hover:bg-[#B71C1C] text-white rounded-xl px-6"
                >
                  <Link href="/sermons">
                    <Play className="size-4" />
                    Watch Now
                  </Link>
                </Button>
              </div>
              <div className="mt-3">
                <Link href="/sermons" className="text-xs text-gray-400 hover:text-[#4A148C] transition-colors">
                  Browse Sermon Library →
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </SectionWrapper>
  );
}