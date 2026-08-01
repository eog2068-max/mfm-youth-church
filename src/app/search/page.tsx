import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { SearchMain } from "@/components/search/search-main";
import { SearchCTA } from "@/components/search/search-cta";

export const metadata: Metadata = {
  title: "Search",
  description:
    "Find sermons, events, announcements, devotionals, testimonies, and more across MFM Youth Church, Utako, Abuja.",
};

export default function SearchPage() {
  return (
    <>
      <PageBanner
        title="Search"
        subtitle="Find sermons, events, announcements, and more"
        breadcrumbs={[{ label: "Search" }]}
      />
      <div className="bg-[#F8FAFF] min-h-screen">
        <SearchMain />
      </div>
      <SearchCTA />
    </>
  );
}
