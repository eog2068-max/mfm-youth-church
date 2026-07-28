/**
 * GET /api/gaf/admin/cycles
 *   Returns all reward cycles (with category info). Admin/pastor only.
 *
 * POST /api/gaf/admin/cycles
 *   Creates a new reward cycle for a category + quarter.
 *   Body: { categoryId, year, quarter }
 *
 * Stage 6 of Go-A-Fishing.
 */
import { NextResponse, type NextRequest } from "next/server";
import { db } from "@/lib/db";
import { isAdminOrPastor, getCurrentSupabaseUser } from "@/lib/gaf/auth";
import { getQuarterRange } from "@/lib/gaf/leaderboard";

export async function GET() {
  try {
    if (!(await isAdminOrPastor())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    const cycles = await db.rewardCycle.findMany({
      orderBy: [{ year: "desc" }, { quarter: "desc" }],
      include: {
        category: { select: { name: true, icon: true, color: true } },
        _count: { select: { winners: true } },
      },
    });

    return NextResponse.json({ cycles });
  } catch (err) {
    console.error("[gaf/admin/cycles GET] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!(await isAdminOrPastor())) {
      return NextResponse.json({ error: "Forbidden" }, { status: 403 });
    }

    let body: Record<string, unknown>;
    try {
      body = await req.json();
    } catch {
      return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
    }

    const categoryId = body.categoryId as string;
    const year = Number(body.year);
    const quarter = Number(body.quarter);

    if (!categoryId || !year || !quarter) {
      return NextResponse.json(
        { error: "categoryId, year, and quarter are required" },
        { status: 400 }
      );
    }

    if (quarter < 1 || quarter > 4) {
      return NextResponse.json({ error: "quarter must be 1-4" }, { status: 400 });
    }

    const cat = await db.rewardCategory.findUnique({ where: { id: categoryId } });
    if (!cat) {
      return NextResponse.json({ error: "Category not found" }, { status: 404 });
    }

    const { startDate, endDate } = getQuarterRange(year, quarter);

    // Check for duplicate.
    const existing = await db.rewardCycle.findFirst({
      where: { categoryId, year, quarter },
    });
    if (existing) {
      return NextResponse.json({ error: "Cycle already exists for this category + quarter" }, { status: 409 });
    }

    const cycle = await db.rewardCycle.create({
      data: {
        categoryId,
        name: `Q${quarter} ${year} — ${cat.name}`,
        year,
        quarter,
        startDate,
        endDate,
        status: "open",
      },
    });

    // Audit.
    const actor = await getCurrentSupabaseUser();
    try {
      await db.auditLog.create({
        data: {
          actorMemberId: actor?.id,
          action: "cycle.create",
          entityType: "cycle",
          entityId: cycle.id,
          metadata: JSON.stringify({ cycleName: cycle.name, actorEmail: actor?.email }),
        },
      });
    } catch { /* non-fatal */ }

    return NextResponse.json({ cycle }, { status: 201 });
  } catch (err) {
    console.error("[gaf/admin/cycles POST] error:", err);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
