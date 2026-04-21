import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { settingsSchema } from "@/lib/validators";

export async function GET() {
  const auth = await requireApiRole(["ADMIN", "EDITOR", "VIEWER"]);
  if (auth.error) return auth.error;

  const settings = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  return NextResponse.json(settings);
}

export async function PUT(request: NextRequest) {
  const auth = await requireApiRole(["ADMIN", "EDITOR"]);
  if (auth.error) return auth.error;

  const payload = await request.json();
  const parsed = settingsSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      ...parsed.data,
      createdById: undefined,
      updatedById: auth.user.id
    },
    create: {
      id: "singleton",
      ...parsed.data,
      createdById: auth.user.id,
      updatedById: auth.user.id
    }
  });

  return NextResponse.json(settings);
}