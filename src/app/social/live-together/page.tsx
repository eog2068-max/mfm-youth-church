"use client";

import { useState, useEffect } from "react";
import { FeatureLandingPage } from "@/components/social/feature-landing-page";
import { LiveTogether } from "@/components/social/live-together";
import { socialFeatures } from "@/components/social/social-data";

export default function LiveTogetherPage() {
  const [entered, setEntered] = useState(false);

  // Scroll to top when entering the feature
  useEffect(() => {
    if (entered) window.scrollTo(0, 0);
  }, [entered]);

  if (entered) return <LiveTogether />;

  const feature = socialFeatures.find((f) => f.id === "live-together")!;

  return (
    <FeatureLandingPage feature={feature} onEnter={() => setEntered(true)}>
      {/* Reaction types preview */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-2">
        <p className="text-xs font-semibold text-[#1A237E] mb-3">
          React in Real-Time During Service:
        </p>
        <div className="flex flex-wrap gap-3">
          {[
            { emoji: "🙌", label: "Worship" },
            { emoji: "🙏", label: "Prayer" },
            { emoji: "❤️", label: "Love" },
            { emoji: "🔥", label: "Fire" },
          ].map((r) => (
            <div
              key={r.label}
              className="bg-white rounded-lg px-4 py-2.5 border border-gray-200 text-center"
            >
              <span className="text-xl block">{r.emoji}</span>
              <p className="text-[10px] font-medium text-gray-600 mt-0.5">
                {r.label}
              </p>
            </div>
          ))}
        </div>
      </div>
    </FeatureLandingPage>
  );
}
