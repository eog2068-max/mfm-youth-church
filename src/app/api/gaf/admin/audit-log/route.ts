/**
 * GET /api/gaf/admin/audit-log
 *   Returns the admin audit trail. Admin/pastor only.
 *   Query: ?entityType=member&action=member.update&take=50&cursor=...
 *
 * Stage 6 of Go-A-Fishing.
 */
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { isAdminOrPastor } from "@/lib/gaf/auth";

const MAX_TAKE = 200;
const DEFAULT_TAKE = 50;

export async function GET(req: NextRequest) {
  try {
    if (!(await isAdminOrPastor())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { searchParams } = new URL(req.url);
    const entityType = searchParams.get("entityType") || undefined;
    const action = searchParams.get("action") || undefined;
    const cursor = searchParams.get("cursor");
    const takeRaw = Number(searchParams.get("take")) || DEFAULT_TAKE;
    const take = Math.min(Math.max(1, takeRaw), MAX_TAKE);

    const where: Record<string, unknown> = {};
    if (entityType) where.entityType = entityType;
    if (action) where.action = action;

    const [logs, total] = await Promise.all([
      db.auditLog.findMany({
        where,
        orderBy: { createdAt: "desc" },
        take: take + 1,
        ...(cursor ? { cursor: { id: cursor }, skip: 1 } : {}),
        select: {
          id: true,
          action: true,
          entityType: true,
          entityId: true,
          metadata: true,
          ipAddress: true,
          createdAt: true,
          actorMember: { select: { fullName: true, email: true } },
        },
      }),
      db.auditLog.count({ where }),
    ]);

    const hasMore = logs.length > take;
    const items = hasMore ? logs.slice(0, take) : logs;
    const nextCursor = hasMore ? items[items.length - 1].id : null;

    return NextResponse.json({ logs: items, total, nextCursor, hasMore });
  } catch (err) {
    console.error("[gaf/admin/audit-log GET] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
