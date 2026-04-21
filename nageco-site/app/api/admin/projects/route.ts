import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { ensureUniqueSlug, slugify } from "@/lib/slug";
import { projectSchema } from "@/lib/validators";

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

  const projects = await prisma.project.findMany({
    where: where as never,
    orderBy: { updatedAt: "desc" }
  });
  return NextResponse.json(projects);
}

export async function POST(request: NextRequest) {
  const auth = await requireApiRole(["ADMIN", "EDITOR"]);
  if (auth.error) return auth.error;

  const payload = await request.json();
  const parsed = projectSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const cleanSlug = slugify(parsed.data.slug || parsed.data.title);
  const uniqueSlug = await ensureUniqueSlug(cleanSlug, async (slug) => {
    const existing = await prisma.project.findUnique({ where: { slug } });
    return Boolean(existing);
  });

  const project = await prisma.project.create({
    data: {
      ...parsed.data,
      slug: uniqueSlug,
      coverImageUrl: parsed.data.coverImageUrl || null,
      createdById: auth.user.id,
      updatedById: auth.user.id
    } as never
  });

  return NextResponse.json(project, { status: 201 });
}