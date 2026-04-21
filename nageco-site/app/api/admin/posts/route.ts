import { PostStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { ensureUniqueSlug, slugify } from "@/lib/slug";
import { postSchema } from "@/lib/validators";

export async function GET(request: NextRequest) {
  const auth = await requireApiRole(["ADMIN", "EDITOR", "VIEWER"]);
  if (auth.error) return auth.error;

  const search = request.nextUrl.searchParams.get("search") ?? "";
  const status = request.nextUrl.searchParams.get("status") as PostStatus | null;
  const where: Record<string, unknown> = {
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { titleAr: { contains: search, mode: "insensitive" } }
          ]
        }
      : {}),
    ...(status ? { status } : {})
  };

  const posts = await prisma.post.findMany({
    where: where as never,
    orderBy: { updatedAt: "desc" }
  });

  return NextResponse.json(posts);
}

export async function POST(request: NextRequest) {
  const auth = await requireApiRole(["ADMIN", "EDITOR"]);
  if (auth.error) return auth.error;

  const payload = await request.json();
  const parsed = postSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const cleanSlug = slugify(parsed.data.slug || parsed.data.title);
  const uniqueSlug = await ensureUniqueSlug(cleanSlug, async (slug) => {
    const existing = await prisma.post.findUnique({ where: { slug } });
    return Boolean(existing);
  });

  const post = await prisma.post.create({
    data: {
      ...parsed.data,
      slug: uniqueSlug,
      coverImageUrl: parsed.data.coverImageUrl || null,
      ogImageUrl: parsed.data.ogImageUrl || null,
      publishedAt: parsed.data.status === PostStatus.PUBLISHED ? new Date() : null,
      authorId: auth.user.id,
      createdById: auth.user.id,
      updatedById: auth.user.id
    }
  });

  return NextResponse.json(post, { status: 201 });
}