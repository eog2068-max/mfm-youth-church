import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { AnnouncementsMain } from "@/components/announcements/announcements-main";
import { AnnouncementsCTA } from "@/components/announcements/announcements-cta";

export const metadata: Metadata = {
  title: "Announcements",
  description:
    "Stay up to date with everything happening at The Redeemed Christian Church of God, Rehoboth Assembly Parish, Utako, Abuja. View church announcements, notices, and important updates.",
};

export default function AnnouncementsPage() {
  return (
    <>
      <PageBanner
        title="Announcements"
        subtitle="Stay up to date with everything happening at Rehoboth Assembly"
        breadcrumbs={[{ label: "Announcements" }]}
      />
      <AnnouncementsMain />
      <AnnouncementsCTA />
    </>
  );
}
