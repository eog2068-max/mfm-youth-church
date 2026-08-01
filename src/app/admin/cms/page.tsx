import type { Metadata } from "next";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "CMS Dashboard",
};

export default async function CmsDashboardPage() {
  const [totalBlocks, publishedBlocks, draftBlocks, recentBlocks] = await Promise.all([
    db.contentBlock.count(),
    db.contentBlock.count({ where: { status: "published" } }),
    db.contentBlock.count({ where: { status: "draft" } }),
    db.contentBlock.findMany({
      orderBy: { updatedAt: "desc" },
      take: 5,
      select: { key: true, title: true, section: true, status: true, updatedAt: true },
    }),
  ]);

  return (
    <div className="max-w-5xl">
      <h1 className="text-2xl font-bold text-[#4A148C] mb-1">CMS Dashboard</h1>
      <p className="text-sm text-gray-500 mb-6">Overview of church content management</p>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Total Blocks</p>
          <p className="text-3xl font-bold text-[#4A148C] mt-1">{totalBlocks}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Published</p>
          <p className="text-3xl font-bold text-green-600 mt-1">{publishedBlocks}</p>
        </div>
        <div className="bg-white rounded-xl border border-gray-100 p-5">
          <p className="text-xs text-gray-500 uppercase tracking-wider font-medium">Drafts</p>
          <p className="text-3xl font-bold text-yellow-600 mt-1">{draftBlocks}</p>
        </div>
      </div>

      {/* Recent Blocks */}
      <div className="bg-white rounded-xl border border-gray-100 p-5">
        <h2 className="text-sm font-semibold text-gray-900 mb-3">Recently Updated</h2>
        {recentBlocks.length === 0 ? (
          <p className="text-sm text-gray-400">No content blocks yet. Create one to get started.</p>
        ) : (
          <div className="divide-y divide-gray-50">
            {recentBlocks.map((block) => (
              <div key={block.key} className="flex items-center justify-between py-2.5">
                <div>
                  <p className="text-sm font-medium text-gray-900">{block.title || block.key}</p>
                  <p className="text-xs text-gray-400">{block.section} / {block.key}</p>
                </div>
                <div className="flex items-center gap-2">
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                    block.status === "published"
                      ? "bg-green-50 text-green-700"
                      : block.status === "draft"
                      ? "bg-yellow-50 text-yellow-700"
                      : "bg-gray-100 text-gray-500"
                  }`}>
                    {block.status}
                  </span>
                  <span className="text-[10px] text-gray-400">
                    {block.updatedAt.toLocaleDateString()}
                  </span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
