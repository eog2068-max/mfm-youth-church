import { HeroSection } from "@/components/home/hero-section";
import { ThreePillarsSection } from "@/components/home/three-pillars-section";
import { ChurchVision } from "@/components/home/church-vision";
import { MissionSection } from "@/components/home/mission-section";
import { CountdownSection } from "@/components/home/countdown-section";
import { QuickAccess } from "@/components/home/quick-access";
import { LatestSermon } from "@/components/home/latest-sermon";
import { PastorsWelcome } from "@/components/home/pastors-welcome";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { DepartmentsPreview } from "@/components/home/departments-preview";
import { DevotionalPreview } from "@/components/home/devotional-preview";
import { AnnouncementPreview } from "@/components/home/announcement-preview";
import { SocialShowcase } from "@/components/home/social-showcase";
import { PhotoGalleryPreview } from "@/components/home/photo-gallery-preview";
import { VideoGalleryPreview } from "@/components/home/video-gallery-preview";
import { Testimonies } from "@/components/home/testimonies";
import { GivingSection } from "@/components/home/giving-section";
import { GafCta } from "@/components/home/gaf-cta";
import { SocialPromise } from "@/components/home/social-promise";
import { FinalCta } from "@/components/home/final-cta";
import { LocationMap } from "@/components/home/location-map";

export default function Home() {
  return (
    <>
      {/* §1 — Church Identity / Hero */}
      <HeroSection />

      {/* §2 — The Three Pillars: CONNECT / ORGANIZE / REACH */}
      <ThreePillarsSection />

      {/* §3 — Central Church Vision */}
      <ChurchVision />

      {/* §4 — CONNECT / ORGANIZE / REACH Mission Statements */}
      <MissionSection />

      {/* §3b — Countdown + Service Times */}
      <CountdownSection />

      {/* §5 — Quick Access Grid */}
      <div className="bg-white">
        <QuickAccess />
      </div>

      {/* CMS Content Previews */}
      <LatestSermon />
      <PastorsWelcome />
      <div className="bg-white">
        <UpcomingEvents />
      </div>
      <DepartmentsPreview />
      <DevotionalPreview />
      <div className="bg-[#F8FAFF]">
        <AnnouncementPreview />
      </div>

      {/* §6 — YouthConnect Showcase */}
      <SocialShowcase />

      {/* Media Previews */}
      <PhotoGalleryPreview />
      <div className="bg-[#F8FAFF]">
        <VideoGalleryPreview />
      </div>

      <Testimonies />
      <GivingSection />

      {/* §7 — Go-A-Fishing Showcase */}
      <GafCta />

      {/* Social Promise + Final CTA */}
      <SocialPromise />
      <FinalCta />

      {/* Location */}
      <div className="bg-white">
        <LocationMap />
      </div>
    </>
  );
}
