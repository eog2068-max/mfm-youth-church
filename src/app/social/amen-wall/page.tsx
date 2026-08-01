"use client";

import { useState, useEffect } from "react";
import { FeatureLandingPage } from "@/components/social/feature-landing-page";
import { AmenWall } from "@/components/social/amen-wall";
import { socialFeatures } from "@/components/social/social-data";

export default function AmenWallPage() {
  const [entered, setEntered] = useState(false);

  // PERMANENT scroll-to-top — use behavior:'instant' to bypass
  // globals.css `html { scroll-behavior: smooth }` which was animating
  // window.scrollTo(0,0) and landing mid-page.
  useEffect(() => {
    if (!entered) return;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const scrollToTop = () => {
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

  if (entered) return <AmenWall />;

  const feature = socialFeatures.find((f) => f.id === "amen-wall")!;

  return (
    <FeatureLandingPage feature={feature} onEnter={() => setEntered(true)}>
      {/* What you'll find on the wall preview */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-2">
        <p className="text-xs font-semibold text-[#4A148C] mb-3">
          What You&apos;ll Find on the Wall:
        </p>
        <div className="space-y-2.5">
          {[
            { emoji: "🙏", label: "Praise Reports", desc: "Share what God has done" },
            { emoji: "🙏", label: "Gratitude Posts", desc: "Express your thankfulness" },
            { emoji: "💪", label: "Faith Declarations", desc: "Declare God's promises" },
            { emoji: "❤️", label: "Encouragement", desc: "Uplift someone today" },
          ].map((item) => (
            <div
              key={item.label}
              className="flex items-center gap-3"
            >
              <span className="text-base">{item.emoji}</span>
              <div>
                <p className="text-xs font-semibold text-gray-700">{item.label}</p>
                <p className="text-[10px] text-gray-400">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </FeatureLandingPage>
  );
}
