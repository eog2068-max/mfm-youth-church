import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { SermonLibrary } from "@/components/sermons/sermon-library";
import { SermonCTA } from "@/components/sermons/sermon-cta";

export const metadata: Metadata = {
  title: "Sermon Library",
  description:
    "Browse and listen to powerful sermons, Bible studies, and spiritual teachings from Mountain of Fire and Miracles Ministries, Youth Church, Utako, Abuja.",
};

export default function SermonsPage() {
  return (
    <>
      <PageBanner
        title="Sermon Library"
        subtitle="Explore our archive of anointed messages, Bible studies, and spiritual teachings. Listen, watch, or read sermon notes to grow in your faith."
        breadcrumbs={[{ label: "Sermon Library" }]}
      />
      <SermonLibrary />
      <SermonCTA />
    </>
  );
}
