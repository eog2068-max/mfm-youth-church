"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { socialFeatures } from "./social-data";
import { cn } from "@/lib/utils";

interface SocialFeatureNavProps {
  /** The feature ID of the current page (e.g. "family-chat") */
  currentFeatureId: string;
}

export function SocialFeatureNav({ currentFeatureId }: SocialFeatureNavProps) {
  const pathname = usePathname();
  const otherFeatures = socialFeatures.filter((f) => f.id !== currentFeatureId);

  return (
    <div className="fixed bottom-0 left-0 right-0 z-30 bg-[#0B0F3A]/95 backdrop-blur-md border-t border-white/10 safe-area-bottom">
      <div className="max-w-3xl mx-auto px-1 py-1.5">
        <div className="flex items-stretch justify-center">
          {otherFeatures.map((feature, idx) => {
            const isActive = pathname === feature.href;
            return (
              <div key={feature.id} className="flex items-stretch">
                {/* Thin white vertical divider before each item (except the first) */}
                {idx > 0 && (
                  <div className="w-px bg-white/20 my-1" aria-hidden="true" />
                )}
                <Link
                  href={feature.href}
                  className={cn(
                    "flex items-center gap-1 px-2 py-1.5 transition-all duration-200 text-center shrink-0",
                    isActive
                      ? "text-white"
                      : "text-blue-200/70 hover:text-white"
                  )}
                >
                  <span className="text-sm sm:text-base leading-none">{feature.emoji}</span>
                  <span className="text-[10px] sm:text-xs font-medium leading-tight whitespace-nowrap">
                    {feature.title}
                  </span>
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
