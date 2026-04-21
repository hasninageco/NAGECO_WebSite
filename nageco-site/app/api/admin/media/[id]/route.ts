import { promises as fs } from "node:fs";
import path from "node:path";
import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiRole(["ADMIN", "EDITOR"]);
  if (auth.error) return auth.error;

  const { id } = await params;
  const media = await prisma.media.findUnique({ where: { id } });
  if (!media) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }

  if (media.url.startsWith("/uploads/")) {
    const filePath = path.join(process.cwd(), "public", media.url);
    await fs.unlink(filePath).catch(() => null);
  }

  await prisma.media.delete({ where: { id } });
  return NextResponse.json({ success: true });
}