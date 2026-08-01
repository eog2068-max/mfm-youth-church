import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { Plus } from "lucide-react";
import { Button } from "@/components/ui/button";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Content Blocks",
};

export default async function ContentBlocksPage() {
  const blocks = await db.contentBlock.findMany({
    orderBy: { updatedAt: "desc" },
  });

  return (
    <div className="max-w-6xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-[#4A148C] mb-1">Content Blocks</h1>
          <p className="text-sm text-gray-500">Manage editable church content sections</p>
        </div>
        <Button asChild className="bg-[#4A148C] hover:bg-[#1A0033]">
          <Link href="/admin/cms/blocks/new">
            <Plus className="size-4" />
            Create Block
          </Link>
        </Button>
      </div>

      {blocks.length === 0 ? (
        <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
          <p className="text-gray-400 mb-4">No content blocks found.</p>
          <Button asChild variant="outline" className="border-[#4A148C] text-[#4A148C]">
            <Link href="/admin/cms/blocks/new">Create Your First Block</Link>
          </Button>
        </div>
      ) : (
        <div className="bg-white rounded-xl border border-gray-100 overflow-hidden">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Key</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden sm:table-cell">Section</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden md:table-cell">Title</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Status</th>
                <th className="text-left text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3 hidden lg:table-cell">Updated</th>
                <th className="text-right text-xs font-semibold text-gray-500 uppercase tracking-wider px-4 py-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {blocks.map((block) => (
                <tr key={block.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-4 py-3 text-sm font-mono text-gray-900">{block.key}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden sm:table-cell">{block.section}</td>
                  <td className="px-4 py-3 text-sm text-gray-600 hidden md:table-cell">{block.title || "—"}</td>
                  <td className="px-4 py-3">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full font-medium ${
                      block.status === "published"
                        ? "bg-green-50 text-green-700"
                        : block.status === "draft"
                        ? "bg-yellow-50 text-yellow-700"
                        : "bg-gray-100 text-gray-500"
                    }`}>
                      {block.status}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-xs text-gray-400 hidden lg:table-cell">
                    {block.updatedAt.toLocaleDateString()}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <Link
                      href={`/admin/cms/blocks/${block.id}/edit`}
                      className="text-xs font-medium text-[#4A148C] hover:underline"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
