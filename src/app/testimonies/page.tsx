import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { TestimoniesMain } from "@/components/testimonies/testimonies-main";
import { TestimoniesCTA } from "@/components/testimonies/testimonies-cta";

export const metadata: Metadata = {
  title: "Testimonies",
  description:
    "Read and share testimonies of God's faithfulness at Mountain of Fire and Miracles Ministries, Youth Church, Utako, Abuja. Be encouraged by real stories of healing, provision, and breakthrough.",
};

export default function TestimoniesPage() {
  return (
    <>
      <PageBanner
        title="Testimonies"
        subtitle="Share what God has done in your life and encourage others through your story"
        breadcrumbs={[{ label: "Testimonies" }]}
      />
      <TestimoniesMain />
      <TestimoniesCTA />
    </>
  );
}