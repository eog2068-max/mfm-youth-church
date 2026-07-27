/**
 * GET /api/gaf/admin/members
 *   Returns all members (paginated, searchable). Admin/pastor only.
 *   Query: ?search=term&status=active&take=20&cursor=...
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
    const search = (searchParams.get("search") || "").trim();
    const status = searchParams.get("status") || undefined;
    const cursor = searchParams.get("cursor");
    const takeRaw = Number(searchParams.get("take")) || DEFAULT_TAKE;
    const take = Math.min(Math.max(1, takeRaw), MAX_TAKE);

    const where: Record<string, unknown> = {};
    if (search) {
      where.OR = [
        { fullName: { contains: search, mode: "insensitive" } },
        { email: { contains: search, mode: "insensitive" } },
        { referralCode: { contains: search, mode: "insensitive" } },
        { phone: { contains: search } },
      ];
    }
    if (status && ["active", "suspended", "inactive"].includes(status)) {
      where.status = status;
    }

    const [members, total] = await Promise.all([
      db.member.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: take + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        select: {
          id: true,
          fullName: true,
          email: true,
          phone: true,
          referralCode: true,
          avatarUrl: true,
          status: true,
          joinDate: true,
          createdAt: true,
          _count: { select: { referralsMade: true, rewardWinners: true, commendations: true } },
        },
      }),
      db.member.count({ where }),
    ]);

    const hasMore = members.length > take;
    const items = hasMore ? members.slice(0, take) : members;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return NextResponse.json({ members: items, total, nextCursor, hasMore });
  } catch (err) {
    console.error("[gaf/admin/members GET] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
