import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { MembersGallery } from "@/components/members/members-gallery";
import { MembersCTA } from "@/components/members/members-cta";

export const metadata: Metadata = {
  title: "Members Gallery",
  description:
    "Meet the wonderful members of Mountain of Fire and Miracles Ministries, Youth Church, Utako, Abuja. A family united in faith and service to God.",
};

export default function MembersPage() {
  return (
    <>
      <PageBanner
        title="Members Gallery"
        subtitle="Meet the beautiful people who make up the Youth Assembly family. Each member is a testament of God's grace and a vital part of our community."
        breadcrumbs={[{ label: "Members Gallery" }]}
      />
      <MembersGallery />
      <MembersCTA />
    </>
  );
}