import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { EventRegistrationForm } from "@/components/events/event-registration";

export const metadata: Metadata = {
  title: "Event Registration",
  description:
    "Register for upcoming events at Mountain of Fire and Miracles Ministries, Youth Church, Utako, Abuja.",
};

export default function EventRegistrationPage() {
  return (
    <>
      <PageBanner
        title="Event Registration"
        subtitle="Secure your spot at our upcoming events, conferences, and programmes. Fill in the form below to register."
        breadcrumbs={[
          { label: "Events", href: "/events" },
          { label: "Register" },
        ]}
      />
      <section className="py-10 md:py-14 bg-[#F8FAFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <EventRegistrationForm />
        </div>
      </section>
    </>
  );
}