/**
 * PATCH /api/gaf/admin/referrals/[id]
 *   Updates a referral's status. Admin/pastor only.
 *   Body: { status: "attended" | "saved" | "baptized" | "member" | "invited" | "lost_contact", firstVisitDate?, notes? }
 *
 * Stage 6 of Go-A-Fishing.
 */
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { isAdminOrPastor, getCurrentSupabaseUser } from "@/lib/gaf/auth";
import { validateStatusTransition } from "@/lib/gaf/scoring";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminOrPastor())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const referral = await db.referralEvent.findUnique({ where: { id } });
    if (!referral) {
      return NextResponse.json({ error: "Referral not found" }, { status: 404 });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};

    if (typeof body.status === "string") {
      const validStatuses = ["invited", "attended", "saved", "baptized", "member", "lost_contact"];
      if (!validStatuses.includes(body.status)) {
        return NextResponse.json(
          { error: `Invalid status: "${body.status}". Must be one of: ${validStatuses.join(", ")}` },
          { status: 400 }
        );
      }

      // Validate transition (admin can override with force=true).
      if (body.force !== true) {
        const check = validateStatusTransition(referral.status, body.status);
        if (!check.valid) {
          return NextResponse.json({ error: check.reason }, { status: 400 });
        }
      }

      updates.status = body.status;

      // Auto-set firstVisitDate when moving to "attended".
      if (body.status === "attended" && !referral.firstVisitDate) {
        updates.firstVisitDate = new Date();
      }
    }

    if (typeof body.notes === "string") updates.notes = body.notes.trim() || null;
    if (typeof body.prayerPoint === "string") updates.prayerPoint = body.prayerPoint.trim() || null;

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const updated = await db.referralEvent.update({
      where: { id },
      data: updates,
    });

    // Audit log.
    const actor = await getCurrentSupabaseUser();
    try {
      await db.auditLog.create({
        data: {
          actorMemberId: actor?.id,
          action: "referral.update_status",
          entityType: "referral",
          entityId: id,
          metadata: JSON.stringify({
            from: referral.status,
            to: updates.status,
            referralId: id,
            actorEmail: actor?.email,
          }),
          ipAddress: req.headers.get("x-forwarded-for") || null,
          userAgent: req.headers.get("user-agent") || null,
        },
      });
    } catch { /* non-fatal */ }

    return NextResponse.json({ referral: updated });
  } catch (err) {
    console.error("[gaf/admin/referrals/[id] PATCH] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
