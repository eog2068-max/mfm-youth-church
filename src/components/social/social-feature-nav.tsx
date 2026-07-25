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
      <div className="max-w-3xl mx-auto px-2 py-2">
        <div className="flex items-center justify-center gap-1 sm:gap-2">
          {otherFeatures.map((feature) => {
            const isActive = pathname === feature.href;
            return (
              <Link
                key={feature.id}
                href={feature.href}
                className={cn(
                  "flex items-center gap-1 sm:gap-1.5 px-2 sm:px-3 py-1.5 sm:py-2 rounded-xl transition-all duration-200 text-center shrink-0",
                  isActive
                    ? "bg-white/15 text-white"
                    : "text-blue-200/70 hover:text-white hover:bg-white/10"
                )}
              >
                <span className="text-sm sm:text-base leading-none">{feature.emoji}</span>
                <span className="text-[10px] sm:text-xs font-medium leading-tight whitespace-nowrap">
                  {feature.title}
                </span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
