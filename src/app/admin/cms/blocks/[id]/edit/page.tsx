"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const sections = ["homepage", "announcements", "events", "sermons", "devotionals", "general"];
const contentTypes = ["text", "html", "json"];
const statuses = ["draft", "published", "archived"];

export default function EditContentBlockPage() {
  const router = useRouter();
  const params = useParams();
  const id = params.id as string;

  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const [formData, setFormData] = useState({
    key: "",
    section: "",
    title: "",
    content: "",
    contentType: "text",
    status: "draft",
  });

  useEffect(() => {
    fetch(`/api/admin/cms/blocks/${id}`)
      .then((res) => {
        if (!res.ok) throw new Error("Failed to load block");
        return res.json();
      })
      .then((block) => {
        setFormData({
          key: block.key,
          section: block.section,
          title: block.title || "",
          content: block.content,
          contentType: block.contentType,
          status: block.status,
        });
      })
      .catch(() => setError("Failed to load content block."))
      .finally(() => setLoading(false));
  }, [id]);

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setSaving(true);
    setError("");

    const res = await fetch(`/api/admin/cms/blocks/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(formData),
    });

    if (res.ok) {
      router.push("/admin/cms/blocks");
    } else {
      const json = await res.json();
      setError(json.error || "Failed to update block.");
    }
    setSaving(false);
  }

  if (loading) return <p className="text-sm text-gray-400">Loading...</p>;

  return (
    <div className="max-w-2xl">
      <Link href="/admin/cms/blocks" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#4A148C] mb-4">
        <ArrowLeft className="size-4" /> Back to Content Blocks
      </Link>
      <h1 className="text-2xl font-bold text-[#4A148C] mb-1">Edit Content Block</h1>
      <p className="text-sm text-gray-500 mb-6">
        Editing: <span className="font-mono">{formData.key}</span>
      </p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

        <div>
          <Label>Block Key</Label>
          <Input value={formData.key} disabled className="mt-1 bg-gray-50" />
          <p className="text-[10px] text-gray-400 mt-1">Key cannot be changed after creation</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="section">Section</Label>
            <select
              id="section"
              value={formData.section}
              onChange={(e) => setFormData({ ...formData, section: e.target.value })}
              className="mt-1 w-full h-9 rounded-md border border-gray-200 px-3 text-sm bg-white"
            >
              {sections.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              placeholder="e.g. Hero Tagline"
              className="mt-1"
            />
          </div>
        </div>

        <div>
          <Label htmlFor="content">Content</Label>
          <textarea
            id="content"
            value={formData.content}
            onChange={(e) => setFormData({ ...formData, content: e.target.value })}
            rows={8}
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A148C]/20 focus:border-[#4A148C]"
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contentType">Content Type</Label>
            <select
              id="contentType"
              value={formData.contentType}
              onChange={(e) => setFormData({ ...formData, contentType: e.target.value })}
              className="mt-1 w-full h-9 rounded-md border border-gray-200 px-3 text-sm bg-white"
            >
              {contentTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select
              id="status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              className="mt-1 w-full h-9 rounded-md border border-gray-200 px-3 text-sm bg-white"
            >
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={saving} className="bg-[#4A148C] hover:bg-[#1A0033]">
            {saving ? "Saving..." : "Save Changes"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/cms/blocks">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
