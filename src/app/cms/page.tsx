import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { CmsLanding } from "@/components/cms/cms-landing";

export const metadata: Metadata = {
  title: "Church Management System | RCCG Rehoboth Assembly",
  description:
    "Manage every aspect of church life at The Redeemed Christian Church of God, Rehoboth Assembly Parish. Announcements, events, devotionals, sermons, giving, and more — all in one place.",
};

export default function CmsPage() {
  return (
    <>
      <PageBanner
        title="Church Management System"
        subtitle="Everything you need to manage and organize church life — all in one place."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Church Management System" },
        ]}
      />
      <CmsLanding />
    </>
  );
}
