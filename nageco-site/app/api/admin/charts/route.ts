import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiRole } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

const chartsSchema = z.object({
  hiveChartImageUrl: z.string().trim().optional().default(""),
  organizationalStructureImageUrl: z.string().trim().optional().default("")
});

export async function PUT(request: NextRequest) {
  const auth = await requireApiRole(["ADMIN", "EDITOR"]);
  if (auth.error) return auth.error;

  const payload = await request.json();
  const parsed = chartsSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const existing = await prisma.siteSettings.findUnique({ where: { id: "singleton" } });
  const existingSocialLinks =
    existing?.socialLinksJson && typeof existing.socialLinksJson === "object"
      ? (existing.socialLinksJson as Record<string, unknown>)
      : {};

  const socialLinksJson = {
    ...existingSocialLinks,
    hiveChartImageUrl: parsed.data.hiveChartImageUrl,
    organizationalStructureImageUrl: parsed.data.organizationalStructureImageUrl
  };

  const settings = await prisma.siteSettings.upsert({
    where: { id: "singleton" },
    update: {
      socialLinksJson,
      updatedById: auth.user.id
    },
    create: {
      id: "singleton",
      brandName: "NAGECO",
      tagline: "",
      phones: [],
      emails: [],
      socialLinksJson,
      createdById: auth.user.id,
      updatedById: auth.user.id
    }
  });

  return NextResponse.json({
    hiveChartImageUrl: (settings.socialLinksJson as Record<string, unknown>).hiveChartImageUrl,
    organizationalStructureImageUrl: (settings.socialLinksJson as Record<string, unknown>).organizationalStructureImageUrl
  });
}
