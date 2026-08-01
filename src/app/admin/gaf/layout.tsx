import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { getCurrentSupabaseUser, isAdminOrPastor } from "@/lib/gaf/auth";

export const metadata: Metadata = {
  title: "Go-A-Fishing Admin",
  description: "Admin and pastoral management for the Go-A-Fishing evangelism program.",
};

/**
 * Layout for all /admin/gaf/* routes.
 * Auth gate: redirects to /go-a-fishing/login if not authenticated,
 * or to /go-a-fishing if authenticated but not admin/pastor.
 */
export default async function GafAdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // If Supabase is not configured yet, show a config-needed message.
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
            The Go-A-Fishing admin panel requires a Supabase project. Please
            configure the following environment variables in Vercel and your
            local <code className="text-sm bg-gray-100 px-1 rounded">.env</code> file:
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
      <GafAdminShell role={role} userEmail={user.email || ""}>
        {children}
      </GafAdminShell>
    </div>
  );
}

// Client shell is imported below to avoid "use client" leaking into the layout.
import { GafAdminShell } from "@/components/gaf/admin/gaf-admin-shell";
