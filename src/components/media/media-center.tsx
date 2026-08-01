"use client";

import { useSearchParams } from "next/navigation";
import { Radio, Video, Image as ImageIcon, Headphones } from "lucide-react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { SectionWrapper } from "@/components/home/section-wrapper";
import { LiveStreamSection } from "./live-stream-section";
import { VideoGallery } from "./video-gallery";
import { PhotoGallery } from "./photo-gallery";
import { AudioGallery } from "./audio-gallery";

const tabItems = [
  { value: "livestream", label: "Live Stream", icon: Radio },
  { value: "videos", label: "Videos", icon: Video },
  { value: "photos", label: "Photos", icon: ImageIcon },
  { value: "audio", label: "Audio", icon: Headphones },
];

export function MediaCenter() {
  const searchParams = useSearchParams();
  const tab = searchParams.get("tab") || "livestream";

  return (
    <section className="py-12 md:py-16 bg-[#F8FAFF]">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <SectionWrapper>
          {/* Tab navigation */}
          <Tabs defaultValue={tab} className="w-full">
            <TabsList className="bg-[#F3E5F5] p-1.5 rounded-xl mx-auto w-fit flex-wrap gap-1 mb-10">
              {tabItems.map((item) => (
                <TabsTrigger
                  key={item.value}
                  value={item.value}
                  className="rounded-lg px-4 py-2.5 text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-[#4A148C] data-[state=active]:shadow-sm gap-2"
                >
                  <item.icon className="size-4" />
                  <span className="hidden sm:inline">{item.label}</span>
                </TabsTrigger>
              ))}
            </TabsList>

            <TabsContent value="livestream">
              <LiveStreamSection />
            </TabsContent>

            <TabsContent value="videos">
              <VideoGallery />
            </TabsContent>

            <TabsContent value="photos">
              <PhotoGallery />
            </TabsContent>

            <TabsContent value="audio">
              <AudioGallery />
            </TabsContent>
          </Tabs>
        </SectionWrapper>
      </div>
    </section>
  );
}