/**
 * Robots.txt configuration for the MFM Youth Church PWA.
 *
 * Allows all crawlers on public routes, blocks admin and API routes.
 *
 * Stage 12 of Go-A-Fishing.
 */
import type { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  const baseUrl = process.env.NEXT_PUBLIC_GAF_BASE_URL || "https://www.mfmannexyouth.org";

  return {
    rules: [
      {
        userAgent: "*",
        allow: "/",
        disallow: ["/admin/", "/api/", "/r/"],
      },
    ],
    sitemap: `${baseUrl}/sitemap.xml`,
  };
}
