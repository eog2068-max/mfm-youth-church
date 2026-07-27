import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { getCurrentMember } from "@/lib/gaf/auth";
import { GafNotifications } from "@/components/gaf/gaf-notifications";

export const metadata: Metadata = {
  title: "Notifications | Go-A-Fishing",
  description: "Your Go-A-Fishing notifications and activity feed.",
};

export default async function GafNotificationsPage() {
  const member = await getCurrentMember();

  if (!member) {
    redirect("/go-a-fishing/login");
  }

  return (
    <>
      <PageBanner
        title="Notifications"
        subtitle="Stay updated with your Go-A-Fishing journey"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Go-A-Fishing", href: "/go-a-fishing" },
          { label: "Notifications" },
        ]}
      />
      <GafNotifications />
    </>
  );
}
