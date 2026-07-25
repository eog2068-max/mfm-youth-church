"use client";

import { useState, useEffect } from "react";
import { FeatureLandingPage } from "@/components/social/feature-landing-page";
import { TodaysQuestion } from "@/components/social/todays-question";
import { socialFeatures } from "@/components/social/social-data";

export default function TodaysQuestionPage() {
  const [entered, setEntered] = useState(false);

  // Aggressive scroll-to-top when entering the feature
  useEffect(() => {
    if (!entered) return;
    if ("scrollRestoration" in history) history.scrollRestoration = "manual";
    const scrollToTop = () => {
      window.scrollTo(0, 0);
      document.documentElement.scrollTop = 0;
      document.body.scrollTop = 0;
    };
    scrollToTop();
    const raf = requestAnimationFrame(scrollToTop);
    const t1 = setTimeout(scrollToTop, 50);
    const t2 = setTimeout(scrollToTop, 200);
    const t3 = setTimeout(scrollToTop, 500);
    return () => {
      cancelAnimationFrame(raf);
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
    };
  }, [entered]);

  if (entered) return <TodaysQuestion />;

  const feature = socialFeatures.find((f) => f.id === "todays-question")!;

  return (
    <FeatureLandingPage feature={feature} onEnter={() => setEntered(true)}>
      {/* Sample question types preview */}
      <div className="bg-gray-50 rounded-xl p-4 border border-gray-100 mb-2">
        <p className="text-xs font-semibold text-[#1A237E] mb-3">
          Example Questions You Might See:
        </p>
        <div className="space-y-2">
          {[
            '"What Scripture has been speaking to you this week?"',
            '"How did you experience God\'s faithfulness today?"',
            '"What\'s one thing you\'re grateful for right now?"',
            '"How can we be praying for you this week?"',
          ].map((q, i) => (
            <div
              key={i}
              className="flex items-start gap-2 text-xs text-gray-600"
            >
              <span className="text-sm mt-0.5">💬</span>
              <p className="italic leading-relaxed">{q}</p>
            </div>
          ))}
        </div>
      </div>
    </FeatureLandingPage>
  );
}
