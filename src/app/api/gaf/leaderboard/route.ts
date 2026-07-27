/**
 * GET /api/gaf/leaderboard
 *
 * Returns the leaderboard for a given period. Public endpoint (any visitor
 * can view the leaderboard — it's a public celebration of gospel labor).
 *
 * Query params:
 *   period  = "current" (default) | "previous" | "ytd" | "all"
 *   limit   = 1-100 (default 10, clamped)
 *   offset  = 0+ (default 0)
 *
 * Response shape: see LeaderboardResult in src/lib/gaf/leaderboard.ts
 *
 * Stage 5 of Go-A-Fishing.
 */
import { NextResponse, type NextRequest } from "next/server";
import { computeLeaderboard, type LeaderboardPeriod } from "@/lib/gaf/leaderboard";

const VALID_PERIODS: LeaderboardPeriod[] = ["current", "previous", "ytd", "all"];

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);

    const periodRaw = (searchParams.get("period") || "current") as LeaderboardPeriod;
    const period: LeaderboardPeriod = VALID_PERIODS.includes(periodRaw)
      ? periodRaw
      : "current";

    const limitRaw = Number(searchParams.get("limit"));
    const limit = Number.isFinite(limitRaw) && limitRaw > 0 ? limitRaw : 10;

    const offsetRaw = Number(searchParams.get("offset"));
    const offset = Number.isFinite(offsetRaw) && offsetRaw > 0 ? offsetRaw : 0;

    const result = await computeLeaderboard(period, limit, offset);

    // Strip sensitive fields (referralCode is OK to expose publicly — it's
    // the member's public handle. We do NOT expose email/phone/whatsapp.)
    return NextResponse.json({
      entries: result.entries.map((e) => ({
        rank: e.rank,
        memberId: e.memberId,
        fullName: e.fullName,
        avatarUrl: e.avatarUrl,
        referralCode: e.referralCode,
        totalScore: e.totalScore,
        counts: e.counts,
      })),
      totalParticipants: result.totalParticipants,
      cycle: result.cycle,
      scoringWeights: result.scoringWeights,
      generatedAt: result.generatedAt,
    });
  } catch (err) {
    console.error("[gaf/leaderboard GET] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
