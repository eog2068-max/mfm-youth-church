/**
 * POST /api/gaf/admin/setup
 *
 * First-time setup: creates the AdminConfig singleton row with defaults.
 * Also seeds the first RewardCategory ("Soul Winner of the Quarter").
 * Idempotent — safe to call multiple times.
 *
 * Requires admin or pastor role.
 *
 * Stage 6 of Go-A-Fishing.
 */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminOrPastor } from "@/lib/gaf/auth";

export async function POST() {
  try {
    if (!(await isAdminOrPastor())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    // Upsert AdminConfig singleton.
    const config = await db.adminConfig.upsert({
      where: { id: "singleton" },
      update: {},
      create: {
        id: "singleton",
        referralLinkBaseUrl: process.env.NEXT_PUBLIC_GAF_BASE_URL
          ? `${process.env.NEXT_PUBLIC_GAF_BASE_URL}/r/`
          : "https://mfm-youthchurch.app/r/",
        qrCodeDefaultColor: "#4A148C",
        qrCodeDefaultSize: 512,
        leaderboardRefreshIntervalSec: 300,
        leaderboardShowRealNames: true,
        leaderboardShowPhotos: true,
        leaderboardTopN: 10,
        defaultRewardCycleQuarters: 4,
        outreachActivitySelfReportAllowed: true,
        requireAdminApprovalForReferral: false,
        scoringWeights: JSON.stringify({
          invited: 1,
          attended: 5,
          saved: 10,
          baptized: 25,
          member: 50,
          lost_contact: 0,
        }),
        featureFlags: JSON.stringify({}),
      },
    });

    // Seed the first RewardCategory if none exist.
    const existingCats = await db.rewardCategory.count();
    if (existingCats === 0) {
      await db.rewardCategory.createMany({
        data: [
          {
            slug: "soul-winner-quarterly",
            name: "Soul Winner of the Quarter",
            description: "Awarded to the member who wins the most souls (by total gospel-labor points) during a calendar quarter.",
            icon: "Trophy",
            color: "#D32F2F",
            criteria: "Highest total gospel-labor points from referrals whose status progressed during the quarter.",
            scoringRule: JSON.stringify({ metric: "total_score", topN: 3 }),
            displayOrder: 1,
          },
          {
            slug: "top-inviter",
            name: "Top Inviter",
            description: "Awarded to the member who invited the most new people (by count, regardless of follow-through).",
            icon: "Users",
            color: "#4A148C",
            criteria: "Highest count of referrals created during the quarter.",
            scoringRule: JSON.stringify({ metric: "invite_count", topN: 3 }),
            displayOrder: 2,
          },
          {
            slug: "faithful-follower",
            name: "Faithful Follow-Up",
            description: "Awarded to the member who follows up consistently — most referrals that progressed from 'invited' to 'attended' or beyond.",
            icon: "Heart",
            color: "#2E7D32",
            criteria: "Highest count of referrals that advanced from 'invited' to at least 'attended' status.",
            scoringRule: JSON.stringify({ metric: "attended_count", topN: 3 }),
            displayOrder: 3,
          },
        ],
      });
    }

    return NextResponse.json({ ok: true, configId: config.id });
  } catch (err) {
    console.error("[gaf/admin/setup POST] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
