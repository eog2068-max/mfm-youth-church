import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { DepartmentsList } from "@/components/departments/departments-list";
import { DepartmentsCTA } from "@/components/departments/departments-cta";

export const metadata: Metadata = {
  title: "Departments",
  description:
    "Explore the various departments and ministries at Mountain of Fire and Miracles Ministries, Youth Church. Find your place to serve and grow.",
};

export default function DepartmentsPage() {
  return (
    <>
      <PageBanner
        title="Our Departments"
        subtitle="Every member has a gift, and every gift has a place. Discover the department where your God-given talents can flourish and impact lives for the Kingdom."
        breadcrumbs={[{ label: "Departments" }]}
      />
      <DepartmentsList />
      <DepartmentsCTA />
    </>
  );
}