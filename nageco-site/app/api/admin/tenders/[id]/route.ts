import { TenderStatus } from "@prisma/client";
import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { tenderSchema } from "@/lib/validators";

export async function GET(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiRole(["ADMIN", "EDITOR", "VIEWER"]);
  if (auth.error) return auth.error;

  const { id } = await params;
  const tender = await prisma.tender.findUnique({ where: { id } });
  if (!tender) {
    return NextResponse.json({ error: "Not found" }, { status: 404 });
  }
  return NextResponse.json(tender);
}

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiRole(["ADMIN", "EDITOR"]);
  if (auth.error) return auth.error;

  const payload = await request.json();
  const parsed = tenderSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const { id } = await params;
  const tender = await prisma.tender.update({
    where: { id },
    data: {
      ...parsed.data,
      imageUrls: parsed.data.imageUrls,
      documentUrls: parsed.data.documentUrls,
      publishedAt: parsed.data.status === TenderStatus.PUBLISHED ? new Date() : null,
      updatedById: auth.user.id
    }
  });

  return NextResponse.json(tender);
}

export async function DELETE(_request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiRole(["ADMIN", "EDITOR"]);
  if (auth.error) return auth.error;

  const { id } = await params;
  await prisma.tender.delete({ where: { id } });
  return NextResponse.json({ success: true });
}
