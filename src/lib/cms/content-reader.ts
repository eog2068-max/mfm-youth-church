import { db } from "@/lib/db";

/**
 * Fetches a single published content block by its key.
 * Returns null if not found or not published.
 */
export async function getContentBlock(key: string): Promise<string | null> {
  const block = await db.contentBlock.findUnique({
    where: { key, status: "published" },
    select: { content: true },
  });
  return block?.content ?? null;
}

/**
 * Fetches all published content blocks for a given section.
 */
export async function getContentBlocksBySection(section: string) {
  return db.contentBlock.findMany({
    where: { section, status: "published" },
    orderBy: { key: "asc" },
  });
}

/**
 * Seed initial content blocks. Idempotent — skips keys that already exist.
 */
export async function seedContentBlocks() {
  const seeds = [
    { key: "hero-tagline", section: "homepage", title: "Hero Tagline", content: "MORE THAN A CHURCH. A CONNECTED FAMILY.", contentType: "text", status: "published" },
    { key: "church-vision-heading", section: "homepage", title: "Church Vision Heading", content: "THE CHURCH IS MORE THAN A BUILDING.", contentType: "text", status: "published" },
    { key: "church-vision-subheading", section: "homepage", title: "Church Vision Subheading", content: "THE CHURCH IS A FAMILY.", contentType: "text", status: "published" },
    { key: "church-vision-body", section: "homepage", title: "Church Vision Body", content: "You Don\u2019t Have To Wait Until The Next Church Service To Feel Connected To Your Church Family.", contentType: "text", status: "published" },
    { key: "social-slogan", section: "homepage", title: "YouthConnect Slogan", content: "I REMAIN CONNECTED TO MY CHURCH FAMILY THROUGHOUT THE WEEK.", contentType: "text", status: "published" },
    { key: "gaf-quote", section: "homepage", title: "Go-A-Fishing Quote", content: "I will make you fishers of men. \u2014 Matthew 4:19", contentType: "text", status: "published" },
    { key: "final-cta-heading-1", section: "homepage", title: "Final CTA Line 1", content: "YOUR CHURCH.", contentType: "text", status: "published" },
    { key: "final-cta-heading-2", section: "homepage", title: "Final CTA Line 2", content: "YOUR FAMILY.", contentType: "text", status: "published" },
    { key: "final-cta-heading-3", section: "homepage", title: "Final CTA Line 3", content: "YOUR DIGITAL HOME.", contentType: "text", status: "published" },
    { key: "final-cta-tagline", section: "homepage", title: "Final CTA Tagline", content: "CONNECT. ORGANIZE. REACH.", contentType: "text", status: "published" },
    { key: "connect-mission", section: "homepage", title: "CONNECT Mission", content: "Keep your Church family connected throughout the week.", contentType: "text", status: "published" },
    { key: "organize-mission", section: "homepage", title: "ORGANIZE Mission", content: "Help your Church communicate, coordinate and manage its activities.", contentType: "text", status: "published" },
    { key: "reach-mission", section: "homepage", title: "REACH Mission", content: "Mobilize your Church family to reach beyond the walls.", contentType: "text", status: "published" },
  ];

  let created = 0;
  for (const seed of seeds) {
    const exists = await db.contentBlock.findUnique({ where: { key: seed.key } });
    if (!exists) {
      await db.contentBlock.create({ data: seed });
      created++;
    }
  }
  return created;
}
