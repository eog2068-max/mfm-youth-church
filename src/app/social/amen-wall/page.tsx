"use client";

import { useState, useEffect } from "react";
import { FeatureLandingPage } from "@/components/social/feature-landing-page";
import { AmenWall } from "@/components/social/amen-wall";
import { socialFeatures } from "@/components/social/social-data";

export default function AmenWallPage() {
  const [entered, setEntered] = useState(false);

  // Scroll to top when entering the feature
  useEffect(() => {
    if (entered) window.scrollTo(0, 0);
  }, [entered]);

  if (entered) return <AmenWall />;

  const feature = socialFeatures.find((f) => f.id === "amen-wall")!;

  return (
    <FeatureLandingPage feature={feature} onEnter={() => setEntered(true)}>
      {/* What you'll find on the wall preview */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-2">
        <p className="text-xs font-semibold text-[#1A237E] mb-3">
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
