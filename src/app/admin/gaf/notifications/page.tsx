import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { hasRole } from "@/lib/gaf/auth";
import { getSupabaseServer } from "@/lib/gaf/supabase-server";
import { GafAdminNotifications } from "@/components/gaf/admin/gaf-admin-notifications";
import { GafAdminShell } from "@/components/gaf/admin/gaf-admin-shell";

export const metadata: Metadata = {
  title: "Notifications | GAF Admin",
  description: "Manage and broadcast member notifications.",
};

export default async function GafAdminNotificationsPage() {
  // Auth check: must be admin or pastor.
  const isAllowed = await hasRole("admin");
  if (!isAllowed) {
    const user = await (await getSupabaseServer()).auth.getUser();
    if (!user.data.user) redirect("/go-a-fishing/login");
    redirect("/go-a-fishing/dashboard");
  }

  // Get user info for the shell.
  const supabase = await getSupabaseServer();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  const role = (user?.app_metadata?.role as string) || "member";

  return (
    <GafAdminShell role={role} userEmail={user?.email || ""}>
      <GafAdminNotifications />
    </GafAdminShell>
  );
}
