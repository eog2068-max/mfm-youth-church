import type { Metadata } from "next";
import { SocialAdminDashboard } from "@/components/admin/social-admin-dashboard";

export const metadata: Metadata = {
  title: "YouthConnect Admin",
  description: "Manage YouthConnect features, moderation, and content.",
};

export default function SocialAdminPage() {
  return (
    <div className="min-h-screen bg-[#F3E5F5]">
      <SocialAdminDashboard />
    </div>
  );
}
