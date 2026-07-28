import { db } from "@/lib/db";
import { GafAdminCycles } from "@/components/gaf/admin/gaf-admin-cycles";

export default async function GafAdminCyclesPage() {
  const categories = await db.rewardCategory.findMany({
    orderBy: { displayOrder: "asc" },
    select: { id: true, name: true, slug: true, icon: true, color: true, active: true },
  }).catch(() => []);

  return <GafAdminCycles categories={categories} />;
}
