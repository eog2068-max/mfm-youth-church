import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { PrayerRequestForm } from "@/components/prayer/prayer-request-form";

export const metadata: Metadata = {
  title: "Prayer Request",
  description:
    "Submit your prayer request to Mountain of Fire and Miracles Ministries, Youth Church, Utako, Abuja. Our prayer team will stand in agreement with you.",
};

export default function PrayerPage() {
  return (
    <>
      <PageBanner
        title="Prayer Request"
        subtitle="We believe in the power of prayer. Share your prayer need with us and our dedicated prayer team will stand in agreement with you before God."
        breadcrumbs={[{ label: "Prayer Request" }]}
      />
      <section className="py-10 md:py-14 bg-[#F8FAFF]">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <PrayerRequestForm />
        </div>
      </section>
    </>
  );
}