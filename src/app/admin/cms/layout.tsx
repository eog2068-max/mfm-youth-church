import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentSupabaseUser, isAdminOrPastor } from "@/lib/gaf/auth";

export const metadata: Metadata = {
  title: "CMS Administration",
  description: "Manage church content blocks, announcements, and service information.",
};

export default async function CmsAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (
    !process.env.NEXT_PUBLIC_SUPABASE_URL ||
    !process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  ) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F3E5F5]">
        <div className="text-center p-8 max-w-md">
          <div className="text-6xl mb-4">⚙️</div>
          <h1 className="text-2xl font-bold text-[#4A148C] mb-2">Supabase Not Connected</h1>
          <p className="text-gray-600 leading-relaxed">
            The CMS admin panel requires a Supabase project. Please configure
            the following environment variables:
          </p>
          <ul className="text-left text-sm text-gray-500 mt-4 space-y-1">
            <li><code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_URL</code></li>
            <li><code className="bg-gray-100 px-1 rounded">NEXT_PUBLIC_SUPABASE_ANON_KEY</code></li>
            <li><code className="bg-gray-100 px-1 rounded">SUPABASE_SERVICE_ROLE_KEY</code></li>
            <li><code className="bg-gray-100 px-1 rounded">DATABASE_URL</code></li>
          </ul>
        </div>
      </div>
    );
  }

  const user = await getCurrentSupabaseUser();
  if (!user) {
    redirect("/go-a-fishing/login");
  }

  const isAuthorized = await isAdminOrPastor();
  if (!isAuthorized) {
    redirect("/go-a-fishing");
  }

  const role = (user.app_metadata?.role as string) || "member";

  return (
    <div className="min-h-screen bg-[#F3E5F5]">
      <CmsAdminShell role={role} userEmail={user.email || ""}>
        {children}
      </CmsAdminShell>
    </div>
  );
}

import { CmsAdminShell } from "@/components/admin/cms-admin-shell";
