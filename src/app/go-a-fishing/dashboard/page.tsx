import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { getCurrentMember } from "@/lib/gaf/auth";
import { GafDashboard } from "@/components/gaf/gaf-dashboard";

export const metadata: Metadata = {
  title: "Dashboard | Go-A-Fishing",
  description: "Your Go-A-Fishing member dashboard.",
};

/** Fallback base URL when env var is not yet configured. */
const DEFAULT_BASE_URL = "https://mfm-youthchurch.app";

export default async function GafDashboardPage() {
  const member = await getCurrentMember();

  // If not signed in, redirect to login.
  if (!member) {
    redirect("/go-a-fishing/login");
  }

  const baseUrl = process.env.NEXT_PUBLIC_GAF_BASE_URL || DEFAULT_BASE_URL;

  return (
    <>
      <PageBanner
        title={`Welcome, ${member.fullName.split(" ")[0]}`}
        subtitle="Your Go-A-Fishing dashboard"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Go-A-Fishing", href: "/go-a-fishing" },
          { label: "Dashboard" },
        ]}
      />
      <GafDashboard member={member} baseUrl={baseUrl} />
    </>
  );
}
