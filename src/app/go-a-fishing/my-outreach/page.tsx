import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { getCurrentMember } from "@/lib/gaf/auth";
import { GafMyOutreach } from "@/components/gaf/gaf-my-outreach";

export const metadata: Metadata = {
  title: "My Outreach | Go-A-Fishing",
  description: "Log and track your evangelism outreach activities.",
};

export default async function GafMyOutreachPage() {
  const member = await getCurrentMember();
  if (!member) redirect("/go-a-fishing/login");

  return (
    <>
      <PageBanner
        title="My Outreach"
        subtitle="Track your evangelism activities"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Go-A-Fishing", href: "/go-a-fishing" },
          { label: "My Outreach" },
        ]}
      />
      <GafMyOutreach />
    </>
  );
}
