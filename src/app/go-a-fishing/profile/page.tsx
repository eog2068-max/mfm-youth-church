import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { getCurrentMember } from "@/lib/gaf/auth";
import { GafProfile } from "@/components/gaf/gaf-profile";

export const metadata: Metadata = {
  title: "My Profile | Go-A-Fishing",
  description: "Your Go-A-Fishing member profile, stats, and sharing tools.",
};

/** Fallback base URL when env var is not yet configured. */
const DEFAULT_BASE_URL = "https://mfm-youthchurch.app";

export default async function GafProfilePage() {
  const member = await getCurrentMember();

  if (!member) {
    redirect("/go-a-fishing/login");
  }

  // Re-fetch with full relations for profile (more than dashboard needs).
  const { db } = await import("@/lib/db");
  const fullMember = await db.member.findUnique({
    where: { id: member.id },
    include: {
      referralsMade: {
        orderBy: { createdAt: "desc" },
        take: 50,
      },
      rewardWinners: {
        include: { cycle: { include: { category: true } } },
        orderBy: { awardedAt: "desc" },
      },
      commendations: {
        where: { visibility: { in: ["public", "members_only"] } },
        orderBy: { awardedAt: "desc" },
      },
      outreachActivities: {
        orderBy: { activityDate: "desc" },
      },
      notifications: {
        take: 5,
        orderBy: { createdAt: "desc" },
      },
    },
  });

  if (!fullMember) {
    redirect("/go-a-fishing/login");
  }

  const baseUrl = process.env.NEXT_PUBLIC_GAF_BASE_URL || DEFAULT_BASE_URL;

  return (
    <>
      <PageBanner
        title="My Profile"
        subtitle="Your Go-A-Fishing journey at a glance"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Go-A-Fishing", href: "/go-a-fishing" },
          { label: "Dashboard", href: "/go-a-fishing/dashboard" },
          { label: "My Profile" },
        ]}
      />
      <GafProfile member={fullMember} baseUrl={baseUrl} />
    </>
  );
}
