/**
 * GET /api/gaf/awards
 *
 * Public endpoint. Returns:
 *   1. Closed reward cycles with their top-3 winners (most recent first)
 *   2. Recent public pastoral commendations
 *
 * Used by the /go-a-fishing/awards page.
 *
 * Query params:
 *   limit   = 1-20 cycles (default 6)
 *   commendLimit = 1-20 commendations (default 10)
 *
 * Stage 7 of Go-A-Fishing.
 */
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const limitRaw = Number(searchParams.get("limit"));
    const limit = Math.min(Math.max(1, limitRaw || 6), 20);
    const commendLimitRaw = Number(searchParams.get("commendLimit"));
    const commendLimit = Math.min(Math.max(1, commendLimitRaw || 10), 20);

    // Fetch closed cycles with winners, most recent first.
    const cycles = await db.rewardCycle.findMany({
      where: { status: "closed" },
      orderBy: [{ year: "desc" }, { quarter: "desc" }],
      take: limit,
      include: {
        category: {
          select: { name: true, icon: true, color: true, slug: true },
        },
        winners: {
          orderBy: { rank: "asc" },
          include: {
            member: {
              select: {
                id: true,
                fullName: true,
                avatarUrl: true,
                referralCode: true,
              },
            },
          },
        },
      },
    });

    // Fetch recent public commendations.
    const commendations = await db.pastoralCommendation.findMany({
      where: { visibility: "public" },
      orderBy: { awardedAt: "desc" },
      take: commendLimit,
      select: {
        id: true,
        title: true,
        message: true,
        givenBy: true,
        scriptureReference: true,
        awardedAt: true,
        member: {
          select: {
            id: true,
            fullName: true,
            avatarUrl: true,
            referralCode: true,
          },
        },
      },
    });

    // Also fetch open/tallying cycles to show status context.
    const activeCycles = await db.rewardCycle.findMany({
      where: { status: { in: ["open", "tallying"] } },
      orderBy: [{ endDate: "asc" }],
      include: {
        category: {
          select: { name: true, icon: true, color: true },
        },
      },
      take: 3,
    });

    return NextResponse.json({
      cycles,
      commendations,
      activeCycles,
    });
  } catch (err) {
    console.error("[gaf/awards GET] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
