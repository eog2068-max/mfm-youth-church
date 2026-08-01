import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { LivePlayer } from "@/components/live/live-player";
import { ServiceScheduleSection } from "@/components/live/service-schedule";
import { LivePrayerRequest } from "@/components/live/live-prayer";
import { PastStreams } from "@/components/live/past-streams";
import { LiveFAQ } from "@/components/live/live-faq";
import { LiveCTA } from "@/components/live/live-cta";

export const metadata: Metadata = {
  title: "Live Stream",
  description:
    "Watch our services live online. Mountain of Fire and Miracles Ministries, Youth Church, Utako, Abuja — Sunday, Tuesday, and Thursday services streamed live.",
};

export default function LivePage() {
  return (
    <>
      <PageBanner
        title="Live Stream"
        subtitle="Watch our services live from anywhere in the world. Join us in worship, the Word, and prayers as we fellowship together in God's presence."
        breadcrumbs={[{ label: "Live Stream" }]}
      />

      {/* Player + Sidebar layout */}
      <section className="py-10 md:py-14 bg-[#F8FAFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 lg:gap-8">
            {/* Main column: Player + Schedule + Replays + FAQ */}
            <div className="lg:col-span-2 space-y-8">
              <LivePlayer />
              <ServiceScheduleSection />
              <PastStreams />
            </div>

            {/* Sidebar: Prayer Request + Info */}
            <div className="space-y-6">
              <LivePrayerRequest />

              {/* Quick info cards */}
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 space-y-4">
                <h3 className="text-sm font-bold text-[#4A148C] mb-1">Streaming Tips</h3>
                <div className="space-y-3 text-xs text-gray-500 leading-relaxed">
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#F3E5F5] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-[#4A148C]">1</span>
                    </div>
                    <p>Use a stable WiFi or 4G/5G connection for the best streaming experience.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#F3E5F5] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-[#4A148C]">2</span>
                    </div>
                    <p>If the stream buffers, refresh the page or reduce other bandwidth usage.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#F3E5F5] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-[#4A148C]">3</span>
                    </div>
                    <p>Use the Share button to send the stream link to family and friends.</p>
                  </div>
                  <div className="flex items-start gap-2.5">
                    <div className="w-6 h-6 rounded-lg bg-[#F3E5F5] flex items-center justify-center shrink-0 mt-0.5">
                      <span className="text-[10px] font-bold text-[#4A148C]">4</span>
                    </div>
                    <p>Service recordings are available in the Video Gallery within 24-48 hours.</p>
                  </div>
                </div>
              </div>

              <LiveFAQ />
            </div>
          </div>
        </div>
      </section>

      <LiveCTA />
    </>
  );
}