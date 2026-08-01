/**
 * GET /api/gaf/admin/config
 *   Returns the AdminConfig singleton. Creates it with defaults if missing.
 *
 * PATCH /api/gaf/admin/config
 *   Updates the AdminConfig singleton. Requires admin role.
 *
 * Stage 6 of Go-A-Fishing.
 */
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { hasRole } from "@/lib/gaf/auth";

export async function GET() {
  try {
    // Auto-create singleton if it doesn't exist.
    const config = await db.adminConfig.upsert({
      where: { id: "singleton" },
      update: {},
      create: {
        id: "singleton",
        referralLinkBaseUrl: "https://mfm-youthchurch.app/r/",
        qrCodeDefaultColor: "#4A148C",
        qrCodeDefaultSize: 512,
        leaderboardRefreshIntervalSec: 300,
        leaderboardShowRealNames: true,
        leaderboardShowPhotos: true,
        leaderboardTopN: 10,
        defaultRewardCycleQuarters: 4,
        outreachActivitySelfReportAllowed: true,
        requireAdminApprovalForReferral: false,
        scoringWeights: JSON.stringify({
          invited: 1,
          attended: 5,
          saved: 10,
          baptized: 25,
          member: 50,
          lost_contact: 0,
        }),
        featureFlags: JSON.stringify({}),
      },
    });
    return NextResponse.json({ config });
  } catch (err) {
    console.error("[gaf/admin/config GET] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    if (!(await hasRole("admin"))) {
      return NextResponse.json({ error: "Admin access required" }, { status: 403 });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const updates: Record<string, unknown> = {};

    // String fields.
    const stringFields = [
      "referralLinkBaseUrl",
      "qrCodeDefaultColor",
      "scoringWeights",
      "featureFlags",
    ];
    for (const field of stringFields) {
      if (typeof body[field] === "string") {
        updates[field] = body[field];
      }
    }

    // Validate scoringWeights JSON if provided.
    if (typeof body.scoringWeights === "string") {
      try {
        JSON.parse(body.scoringWeights);
      } catch {
        return NextResponse.json(
          { error: "scoringWeights must be valid JSON" },
          { status: 400 }
        );
      }
    }

    // Validate featureFlags JSON if provided.
    if (typeof body.featureFlags === "string") {
      try {
        JSON.parse(body.featureFlags);
      } catch {
        return NextResponse.json(
          { error: "featureFlags must be valid JSON" },
          { status: 400 }
        );
      }
    }

    // Numeric fields.
    const numericFields = [
      "qrCodeDefaultSize",
      "leaderboardRefreshIntervalSec",
      "leaderboardTopN",
      "defaultRewardCycleQuarters",
    ];
    for (const field of numericFields) {
      if (typeof body[field] === "number" && body[field] >= 0) {
        updates[field] = body[field];
      }
    }

    // Boolean fields.
    const booleanFields = [
      "leaderboardShowRealNames",
      "leaderboardShowPhotos",
      "outreachActivitySelfReportAllowed",
      "requireAdminApprovalForReferral",
    ];
    for (const field of booleanFields) {
      if (typeof body[field] === "boolean") {
        updates[field] = body[field];
      }
    }

    if (Object.keys(updates).length === 0) {
      return NextResponse.json({ error: "No fields to update" }, { status: 400 });
    }

    const config = await db.adminConfig.update({
      where: { id: "singleton" },
      data: updates,
    });

    return NextResponse.json({ config });
  } catch (err) {
    console.error("[gaf/admin/config PATCH] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
