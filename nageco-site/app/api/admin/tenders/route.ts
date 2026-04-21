import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { ensureUniqueSlug, slugify } from "@/lib/slug";
import { tenderSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const auth = await requireApiRole(["ADMIN", "EDITOR", "VIEWER"]);
  if (auth.error) return auth.error;

  const search = request.nextUrl.searchParams.get("search") ?? "";
  const where: Record<string, unknown> = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { titleAr: { contains: search, mode: "insensitive" } }
        ]
      }
    : {};

  const tenders = await prisma.tender.findMany({
    where: where as never,
    orderBy: { updatedAt: "desc" }
  });

  return NextResponse.json(tenders);
}

export async function POST(request: NextRequest) {
  const auth = await requireApiRole(["ADMIN", "EDITOR"]);
  if (auth.error) return auth.error;

  const payload = await request.json();
  const parsed = tenderSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const cleanSlug = slugify(parsed.data.slug || parsed.data.title);
  const uniqueSlug = await ensureUniqueSlug(cleanSlug, async (slug) => {
    const existing = await prisma.tender.findUnique({ where: { slug } });
    return Boolean(existing);
  });

  const tender = await prisma.tender.create({
    data: {
      ...parsed.data,
      slug: uniqueSlug,
      imageUrls: parsed.data.imageUrls,
      documentUrls: parsed.data.documentUrls,
      publishedAt: parsed.data.status === "PUBLISHED" ? new Date() : null,
      createdById: auth.user.id,
      updatedById: auth.user.id
    }
  });

  return NextResponse.json(tender, { status: 201 });
}
