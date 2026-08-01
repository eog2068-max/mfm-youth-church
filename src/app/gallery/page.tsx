import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { GalleryMain } from "@/components/gallery/gallery-main";
import { GalleryCTA } from "@/components/gallery/gallery-cta";

export const metadata: Metadata = {
  title: "Photo Gallery",
  description:
    "Browse beautiful photos from services, events, and community life at Mountain of Fire and Miracles Ministries, Youth Church, Utako, Abuja.",
};

export default function GalleryPage() {
  return (
    <>
      <PageBanner
        title="Photo Gallery"
        subtitle="Relive the beautiful moments of God's faithfulness captured through the lens. From powerful worship services to community outreach, every photo tells a story of His grace."
        breadcrumbs={[{ label: "Photo Gallery" }]}
      />
      <GalleryMain />
      <GalleryCTA />
    </>
  );
}