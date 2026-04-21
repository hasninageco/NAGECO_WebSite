import { PostStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiRole } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

const statusSchema = z.object({
  status: z.nativeEnum(PostStatus)
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiRole(["ADMIN", "EDITOR"]);
  if (auth.error) return auth.error;

  const payload = await request.json();
  const parsed = statusSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { id } = await params;
  const post = await prisma.post.update({
    where: { id },
    data: {
      status: parsed.data.status,
      publishedAt: parsed.data.status === PostStatus.PUBLISHED ? new Date() : null,
      updatedById: auth.user.id
    },
    select: { id: true, status: true }
  });

  return NextResponse.json(post);
}
