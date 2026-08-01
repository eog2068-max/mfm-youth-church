import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { GafAwards } from "@/components/gaf/gaf-awards";

export const metadata: Metadata = {
  title: "Awards & Commendations | Go-A-Fishing",
  description:
    "Celebrating the faithful soul winners and pastoral commendations at MFM Youth Church.",
};

export default async function GafAwardsPage() {
  return (
    <>
      <PageBanner
        title="Awards & Commendations"
        subtitle="Celebrating faithful laborers in God's harvest"
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Go-A-Fishing", href: "/go-a-fishing" },
          { label: "Awards" },
        ]}
      />
      <GafAwards />
    </>
  );
}
