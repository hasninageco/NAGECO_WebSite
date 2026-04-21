import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { pageSchema } from "@/lib/validators";

export async function GET() {
  const auth = await requireApiRole(["ADMIN", "EDITOR", "VIEWER"]);
  if (auth.error) return auth.error;

  const pages = await prisma.pageContent.findMany({ orderBy: { key: "asc" } });
  return NextResponse.json(pages);
}

export async function PUT(request: NextRequest) {
  const auth = await requireApiRole(["ADMIN", "EDITOR"]);
  if (auth.error) return auth.error;

  const payload = await request.json();
  const parsed = pageSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  try {
    const page = await prisma.pageContent.upsert({
      where: { key: parsed.data.key },
      update: {
        sectionsJson: parsed.data.sectionsJson,
        seoTitle: parsed.data.seoTitle,
        seoDescription: parsed.data.seoDescription,
        updatedById: auth.user.id
      },
      create: {
        key: parsed.data.key,
        sectionsJson: parsed.data.sectionsJson,
        seoTitle: parsed.data.seoTitle,
        seoDescription: parsed.data.seoDescription,
        createdById: auth.user.id,
        updatedById: auth.user.id
      }
    });

    return NextResponse.json(page);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown error";
    const isNewsEnumMismatch =
      parsed.data.key === "NEWS" &&
      (message.includes("PageKey") || message.includes("NEWS") || message.toLowerCase().includes("enum"));

    if (isNewsEnumMismatch) {
      return NextResponse.json(
        { error: "Database schema is not updated for NEWS yet. Run `npm run prisma:push` and restart dev server, then try again." },
        { status: 409 }
      );
    }

    return NextResponse.json({ error: "Failed to save page content", details: message }, { status: 500 });
  }
}
