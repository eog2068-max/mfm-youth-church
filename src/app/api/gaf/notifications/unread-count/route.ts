/**
 * GET /api/gaf/notifications/unread-count
 *   Lightweight endpoint for polling unread notification count.
 *   Returns { count: number }.
 *   Used by the notification bell badge on the dashboard.
 *
 * Stage 10 of Go-A-Fishing.
 */
import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { requireMember } from "@/lib/gaf/auth";

export async function GET() {
  try {
    const member = await requireMember();

    const count = await db.notification.count({
      where: { memberId: member.id, read: false },
    });

    return NextResponse.json({ count });
  } catch (err) {
    if (err instanceof Response) return err;
    console.error("[gaf/notifications/unread-count GET] error:", err);
    return NextResponse.json({ count: 0 });
  }
}
