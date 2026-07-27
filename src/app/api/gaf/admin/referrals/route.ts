/**
 * GET /api/gaf/admin/referrals
 *   Returns all referrals across all members (paginated, filterable).
 *   Admin/pastor only.
 *
 * Stage 6 of Go-A-Fishing.
 */
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { isAdminOrPastor } from "@/lib/gaf/auth";

const MAX_TAKE = 200;
const DEFAULT_TAKE = 20;

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdminOrPastor())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || undefined;
    const channel = searchParams.get("channel") || undefined;
    const referrerId = searchParams.get("referrerId") || undefined;
    const cursor = searchParams.get("cursor");
    const takeRaw = Number(searchParams.get("take")) || DEFAULT_TAKE;
    const take = Math.min(Math.max(1, takeRaw), MAX_TAKE);

    const where: Record<string, unknown> = {};
    if (status) where.status = status;
    if (channel) where.channel = channel;
    if (referrerId) where.referrerId = referrerId;

    const [referrals, total] = await Promise.all([
      db.referralEvent.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: take + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        select: {
          id: true,
          referrerId: true,
          referralCode: true,
          inviteeName: true,
          inviteePhone: true,
          inviteeEmail: true,
          inviteeMemberId: true,
          channel: true,
          status: true,
          firstVisitDate: true,
          prayerPoint: true,
          notes: true,
          createdAt: true,
          updatedAt: true,
          referrer: { select: { fullName: true, referralCode: true } },
          inviteeMember: { select: { fullName: true, id: true } },
        },
      }),
      db.referralEvent.count({ where }),
    ]);

    const hasMore = referrals.length > take;
    const items = hasMore ? referrals.slice(0, take) : referrals;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return NextResponse.json({ referrals: items, total, nextCursor, hasMore });
  } catch (err) {
    console.error("[gaf/admin/referrals GET] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
