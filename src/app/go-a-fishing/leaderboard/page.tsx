import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { GafLeaderboard } from "@/components/gaf/gaf-leaderboard";
import { getCurrentMemberId } from "@/lib/gaf/auth";

export const metadata: Metadata = {
  title: "Leaderboard | Go-A-Fishing",
  description:
    "See the top gospel-laborers at MFM Youth Church. Quarterly standings, year-to-date, and all-time rankings.",
};

export default async function GafLeaderboardPage() {
  // Optional: highlight current member in the list. Page is public —
  // unauthenticated visitors still see the full leaderboard.
  const currentMemberId = await getCurrentMemberId();

  return (
    <>
      <PageBanner
        title="Leaderboard"
        subtitle="Honoring those who labor for souls"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Go-A-Fishing", href: "/go-a-fishing" },
          { label: "Leaderboard" },
        ]}
      />
      <GafLeaderboard currentMemberId={currentMemberId} />
    </>
  );
}
