import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminOrPastor } from "@/lib/gaf/auth";

// GET /api/admin/cms/blocks — List all content blocks
export async function GET(req: NextRequest) {
  if (!(await isAdminOrPastor())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { searchParams } = new URL(req.url);
  const section = searchParams.get("section");
  const status = searchParams.get("status");

  const where: Record<string, unknown> = {};
  if (section) where.section = section;
  if (status) where.status = status;

  const blocks = await db.contentBlock.findMany({
    where: Object.keys(where).length > 0 ? where : undefined,
    orderBy: { updatedAt: "desc" },
  });

  return NextResponse.json(blocks);
}

// POST /api/admin/cms/blocks — Create new content block
export async function POST(req: NextRequest) {
  if (!(await isAdminOrPastor())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  try {
    const body = await req.json();
    const { key, section, title, content, contentType, status, authoredBy } = body;

    if (!key || !section || !content) {
      return NextResponse.json(
        { error: "key, section, and content are required." },
        { status: 400 }
      );
    }

    const block = await db.contentBlock.create({
      data: {
        key,
        section,
        title: title || null,
        content,
        contentType: contentType || "text",
        status: status || "draft",
        publishedAt: status === "published" ? new Date() : null,
        authoredBy: authoredBy || null,
      },
    });

    return NextResponse.json(block, { status: 201 });
  } catch (error: unknown) {
    const msg = error instanceof Error ? error.message : "Unknown error";
    if (msg.includes("Unique")) {
      return NextResponse.json(
        { error: "A content block with this key already exists." },
        { status: 409 }
      );
    }
    return NextResponse.json({ error: "Failed to create content block." }, { status: 500 });
  }
}
