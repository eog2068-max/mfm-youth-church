/**
 * Admin Overview — /admin/gaf
 *
 * Shows: setup check, summary stats, quick actions, recent activity preview.
 *
 * Stage 6 of Go-A-Fishing.
 */
import { db } from "@/lib/db";
import { GafAdminOverview } from "@/components/gaf/admin/gaf-admin-overview";

export default async function GafAdminPage() {
  // Load summary stats server-side.
  const [memberCount, referralCount, activeCycleCount, commendationCount] =
    await Promise.all([
      db.member.count(),
      db.referralEvent.count(),
      db.rewardCycle.count({ where: { status: "open" } }),
      db.pastoralCommendation.count(),
    ]).catch(() => [0, 0, 0, 0]);

  // Load recent audit log entries.
  const recentLogs = await db.auditLog
    .findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: {
        action: true,
        entityType: true,
        createdAt: true,
        actorMember: { select: { fullName: true } },
      },
    })
    .catch(() => []);

  return (
    <GafAdminOverview
      stats={{
        memberCount,
        referralCount,
        activeCycleCount,
        commendationCount,
      }}
      recentLogs={recentLogs.map((l) => ({
        action: l.action,
        entityType: l.entityType,
        createdAt: l.createdAt.toISOString(),
        actorName: l.actorMember?.fullName || "System",
      }))}
    />
  );
}
