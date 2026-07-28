/**
 * PATCH /api/gaf/admin/cycles/[id]
 *   Update cycle status (open → tallying → closed).
 *
 * POST /api/gaf/admin/cycles/[id]/close
 *   Close a cycle and compute winners. Admin only.
 *
 * Stage 6 of Go-A-Fishing.
 */
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { hasRole, getCurrentSupabaseUser } from "@/lib/gaf/auth";
import { computeMemberScore, parseScoringWeights } from "@/lib/gaf/scoring";

export async function PATCH(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await hasRole("admin"))) {
      return NextResponse.json({ error: "Admin required" }, { status: 403 });
    }

    const { id } = await params;
    const cycle = await db.rewardCycle.findUnique({ where: { id } });
    if (!cycle) {
      return NextResponse.json({ error: "Cycle not found" }, { status: 404 });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const validStatuses = ["open", "tallying", "closed"];
    if (!validStatuses.includes((body.status as string) || "")) {
      return NextResponse.json(
        { error: `status must be one of: ${validStatuses.join(", ")}` },
        { status: 400 }
      );
    }

    const updated = await db.rewardCycle.update({
      where: { id },
      data: { status: body.status as string },
    });

    return NextResponse.json({ cycle: updated });
  } catch (err) {
    console.error("[gaf/admin/cycles/[id] PATCH] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    if (!(await hasRole("admin"))) {
      return NextResponse.json({ error: "Admin required" }, { status: 403 });
    }

    const { id } = await params;
    const cycle = await db.rewardCycle.findUnique({
      where: { id },
      include: { category: true },
    });
    if (!cycle) {
      return NextResponse.json({ error: "Cycle not found" }, { status:  404 });
    }
    if (cycle.status === "closed") {
      return NextResponse.json({ error: "Cycle already closed" }, { status: 400 });
    }

    // Load scoring weights.
    const config = await db.adminConfig.findUnique({
      where: { id: "singleton" },
      select: { scoringWeights: true },
    });
    const weights = parseScoringWeights(config?.scoringWeights);

    // Load all active members and their referrals within the cycle window.
    const members = await db.member.findMany({
      where: { status: "active" },
      select: {
        id: true,
        referralsMade: {
          where: {
            updatedAt: { gte: cycle.startDate, lt: cycle.endDate },
          },
          select: { status: true },
        },
      },
    });

    // Compute scores.
    const scored = members
      .map((m) => ({
        memberId: m.id,
        total: computeMemberScore(m.referralsMade, weights).total,
        counts: computeMemberScore(m.referralsMade, weights).counts,
        breakdown: computeMemberScore(m.referralsMade, weights).breakdown,
      }))
      .filter((s) => s.total > 0)
      .sort((a, b) => b.total - a.total);

    // Take top 3 (or fewer if not enough members).
    const topN = 3;
    const winners = scored.slice(0, topN);

    // Delete any existing winners for this cycle (re-run safe).
    await db.rewardWinner.deleteMany({ where: { cycleId: id } });

    // Create RewardWinner rows.
    if (winners.length > 0) {
      await db.rewardWinner.createMany({
        data: winners.map((w, idx) => ({
          cycleId: id,
          memberId: w.memberId,
          rank: idx + 1,
          score: w.total,
          scoreBreakdown: JSON.stringify({
            total: w.total,
            counts: w.counts,
            weights,
          }),
        })),
      });
    }

    // Close the cycle.
    const updated = await db.rewardCycle.update({
      where: { id },
      data: { status: "closed" },
    });

    // Audit.
    const actor = await getCurrentSupabaseUser();
    try {
      await db.auditLog.create({
        data: {
          actorMemberId: actor?.id,
          action: "cycle.close",
          entityType: "cycle",
          entityId: id,
          metadata: JSON.stringify({
            cycleName: updated.name,
            winnerCount: winners.length,
            topScores: winners.map((w) => ({ memberId: w.memberId, rank: w.rank + 1, score: w.total })),
            actorEmail: actor?.email,
          }),
        },
      });
    } catch { /* non-fatal */ }

    return NextResponse.json({
      cycle: updated,
      winnersCount: winners.length,
      topScores: winners.map((w) => ({
        memberId: w.memberId,
        rank: w.rank + 1,
        score: w.total,
        counts: w.counts,
      })),
    });
  } catch (err) {
    console.error("[gaf/admin/cycles/[id] POST] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
