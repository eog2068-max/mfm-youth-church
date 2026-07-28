/**
 * PATCH /api/gaf/admin/members/[id]
 *   Update a member's status (suspend, reactivate, etc.) or profile fields.
 *   Admin/pastor only.
 *
 * Stage 6 of Go-A-Fishing.
 */
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { isAdminOrPastor, getCurrentSupabaseUser } from "@/lib/gaf/auth";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await isAdminOrPastor())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const member = await db.member.findUnique({ where: { id } });
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};

    if (typeof body.fullName === "string") {
      const trimmed = body.fullName.trim();
      if (trimmed.length >= 2 && trimmed.length <= 120) updates.fullName = trimmed;
    }
    if (typeof body.phone === "string") updates.phone = body.phone.trim() || null;
    if (typeof body.whatsapp === "string") updates.whatsapp = body.whatsapp.trim() || null;
    if (typeof body.avatarUrl === "string") {
      try { if (body.avatarUrl.trim()) new URL(body.avatarUrl.trim()); } catch { /* skip */ }
      updates.avatarUrl = body.avatarUrl.trim() || null;
    }
    if (typeof body.status === "string" && ["active", "suspended", "inactive"].includes(body.status)) {
      updates.status = body.status;
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No valid fields to update" }, { status: 400 });
    }

    const updated = await db.member.update({
      where: { id },
      data: updates,
    });

    // Audit log.
    const actor = await getCurrentSupabaseUser();
    try {
      await db.auditLog.create({
        data: {
          actorMemberId: actor?.id,
          action: "member.update",
          entityType: "member",
          entityId: id,
          metadata: JSON.stringify({ changes: updates, actorEmail: actor?.email }),
          ipAddress: req.headers.get("x-forwarded-for") || null,
          userAgent: req.headers.get("user-agent") || null,
        },
      });
    } catch { /* non-fatal */ }

    return NextResponse.json({ member: updated });
  } catch (err) {
    console.error("[gaf/admin/members/[id] PATCH] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
