import type { Metadata } from "next";
import { PageBanner } from "@/components/layout/page-banner";
import { AboutStory } from "@/components/about/about-story";
import { AboutMissionVision } from "@/components/about/about-mission-vision";
import { AboutBeliefs } from "@/components/about/about-beliefs";
import { AboutValues } from "@/components/about/about-values";
import { AboutCTA } from "@/components/about/about-cta";

export const metadata: Metadata = {
  title: "About Us",
  description:
    "Learn about Mountain of Fire and Miracles Ministries, Youth Church — our story, mission, vision, beliefs, and core values as we serve God in Utako, Abuja.",
};

export default function AboutPage() {
  return (
    <>
      <PageBanner
        title="About Us"
        subtitle="Discover who we are, what we believe, and the vision that drives our mission to transform lives through the power of God's Word."
        breadcrumbs={[{ label: "About Us" }]}
      />
      <AboutStory />
      <AboutMissionVision />
      <AboutBeliefs />
      <AboutValues />
      <AboutCTA />
    </>
  );
}