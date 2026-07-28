import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { isAdminOrPastor } from "@/lib/gaf/auth";

// GET /api/admin/cms/blocks/[id] — Get single content block
export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminOrPastor())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;
  const block = await db.contentBlock.findUnique({ where: { id } });

  if (!block) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  return NextResponse.json(block);
}

// PUT /api/admin/cms/blocks/[id] — Update content block
export async function PUT(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminOrPastor())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const body = await req.json();
    const { content, contentType, status, title, authoredBy } = body;

    // If publishing, set publishedAt
    const updateData: Record<string, unknown> = {
      content,
      contentType: contentType || undefined,
      title: title !== undefined ? title : undefined,
      authoredBy: authoredBy || undefined,
      version: { increment: 1 },
    };

    if (status === "published") {
      updateData.status = "published";
      updateData.publishedAt = new Date();
    } else if (status) {
      updateData.status = status;
    }

    const block = await db.contentBlock.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(block);
  } catch (error) {
    return NextResponse.json({ error: "Failed to update content block." }, { status: 500 });
  }
}

// DELETE /api/admin/cms/blocks/[id] — Archive (soft delete) content block
export async function DELETE(
  req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  if (!(await isAdminOrPastor())) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const { id } = await params;

  try {
    const block = await db.contentBlock.update({
      where: { id },
      data: { status: "archived" },
    });

    return NextResponse.json(block);
  } catch (error) {
    return NextResponse.json({ error: "Failed to archive content block." }, { status: 500 });
  }
}
