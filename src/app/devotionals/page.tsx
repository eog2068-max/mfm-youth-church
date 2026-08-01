import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { DevotionalMain } from "@/components/devotionals/devotional-main";
import { DevotionalCTA } from "@/components/devotionals/devotional-cta";

export const metadata: Metadata = {
  title: "Daily Devotionals",
  description:
    "Grow in faith through daily encounters with God's Word. Read Bible-based devotionals from the pastors and ministers of MFM Youth Church, Utako, Abuja.",
};

export default function DevotionalsPage() {
  return (
    <div id="top" className="bg-[#F8FAFF] min-h-screen">
      <PageBanner
        title="Daily Devotionals"
        subtitle="Grow in faith through daily encounters with God's Word"
        breadcrumbs={[{ label: "Devotionals" }]}
      />
      <DevotionalMain />
      <DevotionalCTA />
    </div>
  );
}
