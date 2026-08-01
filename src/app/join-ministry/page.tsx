import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { JoinMinistryMain } from "@/components/ministry/join-ministry-main";
import { MinistryCTA } from "@/components/ministry/ministry-cta";

export const metadata: Metadata = {
  title: "Join a Ministry",
  description:
    "Find your place of service at Mountain of Fire and Miracles Ministries, Youth Church. Browse all ministries and submit your application to join.",
};

export default function JoinMinistryPage() {
  return (
    <>
      <PageBanner
        title="Join a Ministry"
        subtitle="Discover your spiritual gifts and find where you belong. Every member has a role to play in building the body of Christ."
        breadcrumbs={[{ label: "Join a Ministry" }]}
      />
      <JoinMinistryMain />
      <MinistryCTA />
    </>
  );
}