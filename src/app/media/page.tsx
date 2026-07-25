import type { Metadata } from "next";
import { Suspense } from "react";
import { PageBanner } from "@/components/layout/page-banner";
import { MediaCenter } from "@/components/media/media-center";
import { MediaCTA } from "@/components/media/media-cta";

export const metadata: Metadata = {
  title: "Media Center",
  description:
    "Watch live services, browse sermon videos, view photos, and listen to audio content from The Redeemed Christian Church of God, Rehoboth Assembly Parish, Utako, Abuja.",
};

export default function MediaPage() {
  return (
    <>
      <PageBanner
        title="Media Center"
        subtitle="Watch our services live, catch up on past sermons, browse event photos, and listen to inspiring audio content from Rehoboth Assembly Parish."
        breadcrumbs={[{ label: "Media Center" }]}
      />
      <Suspense fallback={<div className="py-20 text-center text-gray-400">Loading media...</div>}>
        <MediaCenter />
      </Suspense>
      <MediaCTA />
    </>
  );
}