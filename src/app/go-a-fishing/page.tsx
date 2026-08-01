import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { GafLanding } from "@/components/gaf/gaf-landing";

export const metadata: Metadata = {
  title: "Go-A-Fishing | MFM Youth Church",
  description:
    "Join the Go-A-Fishing evangelism movement at MFM Youth Church. Win souls, share Christ's love, and earn eternal rewards.",
};

export default async function GoAFishingPage({
  searchParams,
}: {
  searchParams: Promise<{ ref?: string }>;
}) {
  const { ref } = await searchParams;
  const invalidRef = ref === "invalid_code";

  return (
    <>
      <PageBanner
        title="Go-A-Fishing"
        subtitle="Winning souls for Christ, one invitation at a time."
        breadcrumbs={[
          { label: "Home", href: "/" },
          { label: "Go-A-Fishing" },
        ]}
      />
      {invalidRef && (
        <div className="bg-amber-50 border-y border-amber-200 py-3 text-center text-sm text-amber-800">
          The referral link you used is no longer valid. Please ask the member who
          shared it with you for a fresh link.
        </div>
      )}
      <GafLanding />
    </>
  );
}
