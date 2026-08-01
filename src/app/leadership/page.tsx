import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { SeniorPastor } from "@/components/leadership/senior-pastor";
import { LeadershipTeam } from "@/components/leadership/leadership-team";
import { LeadershipCTA } from "@/components/leadership/leadership-cta";

export const metadata: Metadata = {
  title: "Leadership",
  description:
    "Meet the dedicated leaders of Mountain of Fire and Miracles Ministries, Youth Church — our pastors, ministers, and elders who serve with passion and purpose.",
};

export default function LeadershipPage() {
  return (
    <>
      <PageBanner
        title="Our Leadership"
        subtitle="Meet the men and women God has called to serve, lead, and shepherd the Youth Church family."
        breadcrumbs={[{ label: "Leadership" }]}
      />
      <SeniorPastor />
      <LeadershipTeam />
      <LeadershipCTA />
    </>
  );
}