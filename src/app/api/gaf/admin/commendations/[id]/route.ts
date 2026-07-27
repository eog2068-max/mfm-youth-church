/**
 * PATCH /api/gaf/admin/commendations/[id]
 *   Update a commendation (title, message, visibility, scriptureReference).
 *
 * DELETE /api/gaf/admin/commendations/[id]
 *   Delete a commendation.
 *
 * Both admin/pastor only. Writes audit log.
 *
 * Stage 7 of Go-A-Fishing.
 */
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { isAdminOrPastor, getCurrentSupabaseUser, getCurrentMember } from "@/lib/gaf/auth";

const VALID_VISIBILITIES = ["public", "members_only", "private"];

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function PATCH(req: NextRequest, { params }: RouteParams) {
  try {
    if (!(await isAdminOrPastor())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    // Verify commendation exists.
    const existing = await db.pastoralCommendation.findUnique({
      where: { id },
    });
    if (!existing) {
      return NextResponse.json({ error: "Commendation not found" }, { status: 404 });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    // Build update data — only include provided fields.
    const updates: Record<string, unknown> = {};
    const changes: Record<string, { from: unknown; to: unknown }> = {};

    if (body.title !== undefined) {
      const title = (body.title as string).trim();
      if (title.length < 1 || title.length > 200) {
        return NextResponse.json({ error: "title must be 1-200 characters" }, { status: 400 });
      }
      updates.title = title;
      if (title !== existing.title) changes.title = { from: existing.title, to: title };
    }

    if (body.message !== undefined) {
      const message = (body.message as string).trim();
      if (message.length < 1 || message.length > 2000) {
        return NextResponse.json({ error: "message must be 1-2000 characters" }, { status: 400 });
      }
      updates.message = message;
      if (message !== existing.message) changes.message = { from: existing.message, to: message };
    }

    if (body.visibility !== undefined) {
      const vis = body.visibility as string;
      if (!VALID_VISIBILITIES.includes(vis)) {
        return NextResponse.json({ error: "visibility must be public, members_only, or private" }, { status: 400 });
      }
      updates.visibility = vis;
      if (vis !== existing.visibility) changes.visibility = { from: existing.visibility, to: vis };
    }

    if (body.scriptureReference !== undefined) {
      const ref = body.scriptureReference === null
        ? null
        : (body.scriptureReference as string).trim() || null;
      updates.scriptureReference = ref;
      if (ref !== existing.scriptureReference) changes.scriptureReference = { from: existing.scriptureReference, to: ref };
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const updated = await db.pastoralCommendation.update({
      where: { id },
      data: updates,
      include: {
        member: {
          select: { id: true, fullName: true, avatarUrl: true, referralCode: true },
        },
        giver: {
          select: { id: true, fullName: true },
        },
      },
    });

    // Audit log.
    const actorMember = await getCurrentMember().catch(() => null);
    try {
      await db.auditLog.create({
        data: {
          actorMemberId: actorMember?.id,
          action: "commendation.update",
          entityType: "commendation",
          entityId: id,
          metadata: JSON.stringify({ changes }),
        },
      });
    } catch { /* non-fatal */ }

    return NextResponse.json({ commendation: updated });
  } catch (err) {
    console.error("[gaf/admin/commendations PATCH] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function DELETE(_req: NextRequest, { params }: RouteParams) {
  try {
    if (!(await isAdminOrPastor())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const { id } = await params;

    const existing = await db.pastoralCommendation.findUnique({
      where: { id },
      include: {
        member: { select: { fullName: true } },
      },
    });
    if (!existing) {
      return NextResponse.json({ error: "Commendation not found" }, { status: 404 });
    }

    await db.pastoralCommendation.delete({ where: { id } });

    // Audit log.
    const actorMember = await getCurrentMember().catch(() => null);
    try {
      await db.auditLog.create({
        data: {
          actorMemberId: actorMember?.id,
          action: "commendation.delete",
          entityType: "commendation",
          entityId: id,
          metadata: JSON.stringify({
            recipientName: existing.member.fullName,
            title: existing.title,
            visibility: existing.visibility,
          }),
        },
      });
    } catch { /* non-fatal */ }

    return NextResponse.json({ deleted: true });
  } catch (err) {
    console.error("[gaf/admin/commendations DELETE] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
