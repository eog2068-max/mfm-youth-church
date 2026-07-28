/**
 * GET /api/gaf/commendations
 *
 * Public endpoint. Returns pastoral commendations.
 * Visibility filtering:
 *   - Unauthenticated users see only "public" commendations.
 *   - Authenticated members see "public" + "members_only".
 *
 * Query params:
 *   memberId = filter by recipient member (optional)
 *   cursor   = pagination cursor (optional)
 *   take     = 1-50 (default 20)
 *
 * Stage 7 of Go-A-Fishing.
 */
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentSupabaseUser } from "@/lib/gaf/auth";

const MAX_TAKE = 50;
const DEFAULT_TAKE = 20;

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const memberId = searchParams.get("memberId") || undefined;
    const cursor = searchParams.get("cursor");
    const takeRaw = Number(searchParams.get("take"));
    const take = Math.min(Math.max(1, takeRaw || DEFAULT_TAKE), MAX_TAKE);

    // Determine visibility filter based on auth status.
    const user = await getCurrentSupabaseUser().catch(() => null);
    const visibilityFilter = user
      ? { in: ["public", "members_only"] as const }
      : { equals: "public" as const };

    const where: Record<string, unknown> = {
      visibility: visibilityFilter,
    };
    if (memberId) where.memberId = memberId;

    const [commendations, total] = await Promise.all([
      db.pastoralCommendation.findMany({
        where,
        orderBy: { awardedAt: "desc" },
        take: take + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        select: {
          id: true,
          title: true,
          message: true,
          givenBy: true,
          scriptureReference: true,
          awardedAt: true,
          visibility: true,
          member: {
            select: {
              id: true,
              fullName: true,
              avatarUrl: true,
              referralCode: true,
            },
          },
        },
      }),
      db.pastoralCommendation.count({ where }),
    ]);

    const hasMore = commendations.length > take;
    const items = hasMore ? commendations.slice(0, take) : commendations;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return NextResponse.json({
      commendations: items,
      total,
      nextCursor,
      hasMore,
    });
  } catch (err) {
    console.error("[gaf/commendations GET] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
