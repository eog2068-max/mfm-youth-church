/**
 * Sitemap generator for the MFM Youth Church PWA.
 *
 * Generates a complete XML sitemap including all public routes:
 * - Static pages (home, about, sermons, events, etc.)
 * - Social features
 * - Go-A-Fishing public pages (landing, leaderboard, awards)
 *
 * Excludes: auth-guarded pages, admin pages, API routes.
 *
 * Stage 12 of Go-A-Fishing.
 */
import type { MetadataRoute } from "next";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_GAF_BASE_URL || "https://www.mfmannexyouth.org";

  // Static pages.
  const staticPages = [
    "",
    "/about",
    "/live",
    "/sermons",
    "/events",
    "/announcements",
    "/devotionals",
    "/testimonies",
    "/gallery",
    "/giving",
    "/prayer",
    "/contact",
    "/members",
    "/leadership",
    "/departments",
    "/join-ministry",
    "/media",
    "/videos",
    "/search",
  ];

  // Social feature pages.
  const socialPages = [
    "/social",
    "/social/family-chat",
    "/social/prayer-circle",
    "/social/amen-wall",
    "/social/todays-question",
    "/social/weekly-challenge",
    "/social/whos-coming",
    "/social/im-here",
    "/social/live-together",
  ];

  // Go-A-Fishing public pages.
  const gafPages = [
    "/go-a-fishing",
    "/go-a-fishing/leaderboard",
    "/go-a-fishing/awards",
  ];

  const allPages = [...staticPages, ...socialPages, ...gafPages];

  return allPages.map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "weekly" : "monthly",
    priority: path.startsWith("/go-a-fishing")
      ? 0.8
      : path.startsWith("/social")
      ? 0.5
      : path === ""
      ? 1.0
      : 0.6,
  }));
}
