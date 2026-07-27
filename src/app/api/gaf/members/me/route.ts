/**
 * GET /api/gaf/members/me
 *   Returns the currently-authenticated Member record (or 401 if not logged in).
 *
 * PATCH /api/gaf/members/me
 *   Updates the current Member's profile (fullName, phone, whatsapp, avatarUrl).
 *
 * Stage 4 of Go-A-Fishing.
 */
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { getCurrentMember, getCurrentSupabaseUser } from "@/lib/gaf/auth";

const PHONE_REGEX = /^\+?[\d\s-]{7,18}$/;

export async function GET() {
  try {
    const member = await getCurrentMember();
    if (!member) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ member });
  } catch (err) {
    console.error("[gaf/members/me GET] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const user = await getCurrentSupabaseUser();
    if (!user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const member = await db.member.findUnique({
      where: { supabaseUserId: user.id },
    });
    if (!member) {
      return NextResponse.json({ error: "Member not found" }, { status: 404 });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};

    if (typeof body.fullName === "string") {
      const trimmed = body.fullName.trim();
      if (trimmed.length < 2) {
        return NextResponse.json({ error: "Name too short" }, { status: 400 });
      }
      if (trimmed.length > 120) {
        return NextResponse.json({ error: "Name too long" }, { status: 400 });
      }
      updates.fullName = trimmed;
    }

    if (typeof body.phone === "string") {
      const trimmed = body.phone.trim();
      if (trimmed && !PHONE_REGEX.test(trimmed)) {
        return NextResponse.json({ error: "Invalid phone format" }, { status: 400 });
      }
      updates.phone = trimmed || null;
    }

    if (typeof body.whatsapp === "string") {
      const trimmed = body.whatsapp.trim();
      if (trimmed && !PHONE_REGEX.test(trimmed)) {
        return NextResponse.json({ error: "Invalid WhatsApp format" }, { status: 400 });
      }
      updates.whatsapp = trimmed || null;
    }

    if (typeof body.avatarUrl === "string") {
      const trimmed = body.avatarUrl.trim();
      // Basic URL validation.
      try {
        if (trimmed) new URL(trimmed);
        updates.avatarUrl = trimmed || null;
      } catch {
        return NextResponse.json({ error: "Invalid avatar URL" }, { status: 400 });
      }
    }

    // Email and referralCode are NOT editable here.

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No updatable fields provided" }, { status: 400 });
    }

    const updated = await db.member.update({
      where: { id: member.id },
      data: updates,
    });

    return NextResponse.json({ member: updated });
  } catch (err) {
    console.error("[gaf/members/me PATCH] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
