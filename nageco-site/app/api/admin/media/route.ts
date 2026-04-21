import { NextResponse } from "next/server";
import { requireApiRole } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const auth = await requireApiRole(["ADMIN", "EDITOR", "VIEWER"]);
  if (auth.error) return auth.error;

  const media = await prisma.media.findMany({ orderBy: { createdAt: "desc" } });
  return NextResponse.json(media);
}