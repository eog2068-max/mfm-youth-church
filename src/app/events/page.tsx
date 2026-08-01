import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { EventsMain } from "@/components/events/events-main";
import { EventsCTA } from "@/components/events/events-cta";

export const metadata: Metadata = {
  title: "Events",
  description:
    "Browse upcoming and past church events at Mountain of Fire and Miracles Ministries, Youth Church, Utako, Abuja. Register for conferences, programmes, and community events.",
};

export default function EventsPage() {
  return (
    <>
      <PageBanner
        title="Events"
        subtitle="Stay informed about upcoming services, programmes, conferences, and community events. Plan ahead and register where required."
        breadcrumbs={[{ label: "Events" }]}
      />
      <EventsMain />
      <EventsCTA />
    </>
  );
}