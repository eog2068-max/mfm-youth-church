import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { ContactMain } from "@/components/contact/contact-main";
import { ContactCTA } from "@/components/contact/contact-cta";

export const metadata: Metadata = {
  title: "Contact Us",
  description:
    "Get in touch with MFM Youth Church, Utako, Abuja. Find our address, phone, email, service times, and send us a message.",
};

export default function ContactPage() {
  return (
    <div className="bg-[#F8FAFF] min-h-screen">
      <PageBanner
        title="Contact Us"
        subtitle="We'd love to hear from you. Reach out to us anytime."
        breadcrumbs={[{ label: "Contact" }]}
      />
      <ContactMain />
      <ContactCTA />
    </div>
  );
}