import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { getCurrentMember } from "@/lib/gaf/auth";
import { db } from "@/lib/db";
import { GafMyReferrals } from "@/components/gaf/gaf-my-referrals";

export const metadata: Metadata = {
  title: "My Referrals | Go-A-Fishing",
  description: "Track your gospel-labor referrals.",
};

export default async function GafMyReferralsPage() {
  const member = await getCurrentMember();

  if (!member) {
    redirect("/go-a-fishing/login");
  }

  // Fetch full referral list (server-side).
  const referrals = await db.referralEvent.findMany({
    where: { referrerId: member.id },
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      inviteeName: true,
      inviteePhone: true,
      inviteeEmail: true,
      channel: true,
      status: true,
      firstVisitDate: true,
      prayerPoint: true,
      notes: true,
      createdAt: true,
      updatedAt: true,
    },
  });

  return (
    <>
      <PageBanner
        title="My Referrals"
        subtitle="Track every soul you've fished for Christ"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Go-A-Fishing", href: "/go-a-fishing" },
          { label: "Dashboard", href: "/go-a-fishing/dashboard" },
          { label: "My Referrals" },
        ]}
      />
      <GafMyReferrals referrals={referrals} />
    </>
  );
}
