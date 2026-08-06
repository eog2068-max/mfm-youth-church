/**
 * /dailywalk — DailyWalk spiritual habit tracker.
 *
 * Auth-gated: redirects to /go-a-fishing/login if no session.
 * Server Component: fetches summary data, passes to client shell.
 * Stage 5 of DailyWalk.
 */
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentMember } from "@/lib/gaf/auth";
import { DailyWalkShell } from "@/components/dailywalk/dailywalk-shell";

export const metadata: Metadata = {
  title: "DailyWalk | MFM Youth Church",
  description:
    "Track your daily spiritual habits — prayer, scripture, fasting, worship and more. Build streaks and grow in faith.",
};

export default async function DailyWalkPage() {
  const member = await getCurrentMember();

  if (!member) {
    redirect("/go-a-fishing/login");
  }

  const firstName = member.fullName.split(" ")[0];

  return <DailyWalkShell memberName={firstName} />;
}
