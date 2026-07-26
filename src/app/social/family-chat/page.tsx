"use client";

import { useState, useEffect } from "react";
import { FeatureLandingPage } from "@/components/social/feature-landing-page";
import { FamilyChat } from "@/components/social/family-chat";
import { socialFeatures } from "@/components/social/social-data";

export default function FamilyChatPage() {
  const [entered, setEntered] = useState(false);

  // PERMANENT scroll-to-top when entering the feature.
  // Root cause: globals.css sets `html { scroll-behavior: smooth }` which
  // turns window.scrollTo(0,0) into an animation that gets interrupted by
  // the chat container's auto-scroll-to-bottom, landing mid-page.
  // Fix: use behavior:'instant' to bypass the CSS smooth-scroll.
  useEffect(() => {
    if (!entered) return;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const scrollToTop = () => {
      // behavior:'instant' overrides CSS scroll-behavior:smooth
      try {
        window.scrollTo({ top: 0, left: 0, behavior: "instant" as ScrollBehavior });
      } catch {
        window.scrollTo(0, 0);
      }
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    scrollToTop();
    const raf = requestAnimationFrame(scrollToTop);
    const t1 = setTimeout(scrollToTop, 50);
    const t2 = setTimeout(scrollToTop, 200);
    const t3 = setTimeout(scrollToTop, 500);
    const t4 = setTimeout(scrollToTop, 1000);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  }, [entered]);

  if (entered) return <FamilyChat />;

  const feature = socialFeatures.find((f) => f.id === "family-chat")!;

  return (
    <FeatureLandingPage feature={feature} onEnter={() => setEntered(true)}>
      {/* Channel previews — FamilyChat-specific content */}
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-2">
        {[
          { emoji: "🏠", name: "General Family", desc: "Everyday conversation" },
          { emoji: "🙏", name: "Prayer & Encouragement", desc: "Spiritual support" },
          { emoji: "📖", name: "Bible & Faith", desc: "Bible discussions" },
          { emoji: "👨‍👩‍👧", name: "Family & Marriage", desc: "Relationships" },
          { emoji: "🎉", name: "Church Life", desc: "Activities & events" },
          { emoji: "📢", name: "Announcements", desc: "Official updates" },
        ].map((ch) => (
          <div
            key={ch.name}
            className="bg-gray-50 rounded-xl p-3 border border-gray-100"
          >
            <div className="flex items-center gap-2 mb-1">
              <span className="text-base">{ch.emoji}</span>
              <span className="text-xs font-semibold text-gray-700 truncate">
                {ch.name}
              </span>
            </div>
            <p className="text-[10px] text-gray-400">{ch.desc}</p>
          </div>
        ))}
      </div>
    </FeatureLandingPage>
  );
}
