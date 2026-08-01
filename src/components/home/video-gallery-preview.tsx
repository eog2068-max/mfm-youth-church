import Link from "next/link";
import { Play, Eye, ArrowRight } from "lucide-react";
import { SectionWrapper, SectionTitle } from "./section-wrapper";

const videos = [
  {
    title: "The Power of Faith — Sunday Service",
    date: "Last Sunday",
    views: "1.2K views",
    bg: "from-[#4A148C] to-[#6A1B9A]",
  },
  {
    title: "Walking in Divine Guidance — Bible Study",
    date: "Last Wednesday",
    views: "845 views",
    bg: "from-[#D32F2F] to-[#C62828]",
  },
  {
    title: "Praise & Worship Session Highlights",
    date: "2 Weeks Ago",
    views: "2.1K views",
    bg: "from-[#2E7D32] to-[#1B5E20]",
  },
];

export function VideoGalleryPreview() {
  return (
    <SectionWrapper className="py-16 md:py-24">
      <div className="max-w-6xl mx-auto px-4 sm:px-6">
        <SectionTitle title="Video Gallery" subtitle="Watch our latest service recordings and highlights" />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {videos.map((video, index) => (
            <div
              key={index}
              className="bg-white rounded-2xl shadow-lg shadow-black/5 overflow-hidden border border-gray-100 hover:shadow-xl hover:-translate-y-1 transition-all duration-300 group"
            >
              {/* Thumbnail */}
              <div
                className={`relative aspect-video bg-gradient-to-br ${video.bg} flex items-center justify-center`}
              >
                <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-white/30 group-hover:scale-110 transition-all cursor-pointer">
                  <Play className="size-6 text-white fill-white ml-0.5" />
                </div>
                <span className="absolute bottom-2 right-2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-md">
                  45:20
                </span>
              </div>

              {/* Info */}
              <div className="p-4">
                <h3 className="font-bold text-[#4A148C] text-sm leading-snug mb-2 line-clamp-2">
                  {video.title}
                </h3>
                <div className="flex items-center gap-3 text-xs text-gray-500">
                  <span>{video.date}</span>
                  <span className="flex items-center gap-1">
                    <Eye className="size-3" />
                    {video.views}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="text-center mt-10">
          <Link
            href="/media"
            className="inline-flex items-center gap-1.5 text-[#D32F2F] font-semibold hover:gap-2.5 transition-all text-sm"
          >
            View All Videos
            <ArrowRight className="size-4" />
          </Link>
        </div>
      </div>
    </SectionWrapper>
  );
}