import { HeroSection } from "@/components/home/hero-section";
import { ThreePillarsSection } from "@/components/home/three-pillars-section";
import { CountdownSection } from "@/components/home/countdown-section";
import { LatestSermon } from "@/components/home/latest-sermon";
import { PastorsWelcome } from "@/components/home/pastors-welcome";
import { UpcomingEvents } from "@/components/home/upcoming-events";
import { DepartmentsPreview } from "@/components/home/departments-preview";
import { DevotionalPreview } from "@/components/home/devotional-preview";
import { AnnouncementPreview } from "@/components/home/announcement-preview";
import { PhotoGalleryPreview } from "@/components/home/photo-gallery-preview";
import { VideoGalleryPreview } from "@/components/home/video-gallery-preview";
import { Testimonies } from "@/components/home/testimonies";
import { GivingSection } from "@/components/home/giving-section";
import { GafCta } from "@/components/home/gaf-cta";
import { SocialPromise } from "@/components/home/social-promise";
import { SocialCTA } from "@/components/home/social-cta";
import { LocationMap } from "@/components/home/location-map";

export default function Home() {
  return (
    <>
      <HeroSection />
      <ThreePillarsSection />
      <CountdownSection />
      <LatestSermon />
      <PastorsWelcome />
      <UpcomingEvents />
      <DepartmentsPreview />
      <DevotionalPreview />
      <AnnouncementPreview />
      <PhotoGalleryPreview />
      <VideoGalleryPreview />
      <Testimonies />
      <GivingSection />
      <GafCta />
      <SocialPromise />
      <SocialCTA />
      <LocationMap />
    </>
  );
}
