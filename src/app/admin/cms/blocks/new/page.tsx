"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const sections = ["homepage", "announcements", "events", "sermons", "devotionals", "general"];
const contentTypes = ["text", "html", "json"];
const statuses = ["draft", "published"];

export default function NewContentBlockPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const data = {
      key: formData.get("key") as string,
      section: formData.get("section") as string,
      title: formData.get("title") as string,
      content: formData.get("content") as string,
      contentType: formData.get("contentType") as string,
      status: formData.get("status") as string,
    };

    if (!data.key || !data.section || !data.content) {
      setError("Key, section, and content are required.");
      setLoading(false);
      return;
    }

    const res = await fetch("/api/admin/cms/blocks", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      router.push("/admin/cms/blocks");
    } else {
      const json = await res.json();
      setError(json.error || "Failed to create block.");
    }
    setLoading(false);
  }

  return (
    <div className="max-w-2xl">
      <Link href="/admin/cms/blocks" className="inline-flex items-center gap-1 text-sm text-gray-500 hover:text-[#4A148C] mb-4">
        <ArrowLeft className="size-4" /> Back to Content Blocks
      </Link>
      <h1 className="text-2xl font-bold text-[#4A148C] mb-1">Create Content Block</h1>
      <p className="text-sm text-gray-500 mb-6">Add a new editable content section</p>

      <form onSubmit={handleSubmit} className="bg-white rounded-xl border border-gray-100 p-6 space-y-4">
        {error && <p className="text-sm text-red-600 bg-red-50 rounded-lg px-3 py-2">{error}</p>}

        <div>
          <Label htmlFor="key">Block Key *</Label>
          <Input id="key" name="key" placeholder="e.g. hero-tagline" className="mt-1" required />
          <p className="text-[10px] text-gray-400 mt-1">Unique identifier (no spaces, use hyphens)</p>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="section">Section *</Label>
            <select id="section" name="section" className="mt-1 w-full h-9 rounded-md border border-gray-200 px-3 text-sm bg-white" required>
              {sections.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="title">Title</Label>
            <Input id="title" name="title" placeholder="e.g. Hero Tagline" className="mt-1" />
          </div>
        </div>

        <div>
          <Label htmlFor="content">Content *</Label>
          <textarea
            id="content"
            name="content"
            rows={6}
            className="mt-1 w-full rounded-md border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#4A148C]/20 focus:border-[#4A148C]"
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <Label htmlFor="contentType">Content Type</Label>
            <select id="contentType" name="contentType" className="mt-1 w-full h-9 rounded-md border border-gray-200 px-3 text-sm bg-white">
              {contentTypes.map((t) => <option key={t} value={t}>{t}</option>)}
            </select>
          </div>
          <div>
            <Label htmlFor="status">Status</Label>
            <select id="status" name="status" className="mt-1 w-full h-9 rounded-md border border-gray-200 px-3 text-sm bg-white">
              {statuses.map((s) => <option key={s} value={s}>{s}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-3 pt-2">
          <Button type="submit" disabled={loading} className="bg-[#4A148C] hover:bg-[#1A0033]">
            {loading ? "Creating..." : "Create Block"}
          </Button>
          <Button type="button" variant="outline" asChild>
            <Link href="/admin/cms/blocks">Cancel</Link>
          </Button>
        </div>
      </form>
    </div>
  );
}
