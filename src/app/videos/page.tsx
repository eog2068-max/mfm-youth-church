import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { VideoGalleryMain } from "@/components/videos/video-gallery-main";
import { VideoCTA } from "@/components/videos/video-cta";

export const metadata: Metadata = {
  title: "Video Gallery",
  description:
    "Watch powerful sermons, sermon series, and service recordings from Mountain of Fire and Miracles Ministries, Youth Church, Utako, Abuja.",
};

export default function VideosPage() {
  return (
    <>
      <PageBanner
        title="Video Gallery"
        subtitle="Browse our collection of anointed sermons, powerful messages, and complete worship service recordings. Be blessed as you watch and share with others."
        breadcrumbs={[{ label: "Video Gallery" }]}
      />
      <VideoGalleryMain />
      <VideoCTA />
    </>
  );
}