import { randomUUID } from "node:crypto";
import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiRole } from "@/lib/api-auth";
import { getCareerVacancies, saveCareerVacancies } from "@/lib/career-vacancies";

const vacancySchema = z.object({
  subject: z.string().trim().min(2, "Subject is required").max(140, "Subject is too long"),
  subjectAr: z.string().trim().max(140, "Arabic subject is too long").optional(),
  details: z.string().trim().min(10, "Details are required").max(5000, "Details are too long"),
  detailsAr: z.string().trim().max(5000, "Arabic details are too long").optional()
});

export async function GET() {
  const auth = await requireApiRole(["ADMIN", "EDITOR", "VIEWER"]);
  if (auth.error) return auth.error;

  const vacancies = await getCareerVacancies();
  return NextResponse.json(vacancies);
}

export async function POST(request: NextRequest) {
  const auth = await requireApiRole(["ADMIN", "EDITOR"]);
  if (auth.error) return auth.error;

  const payload = await request.json();
  const parsed = vacancySchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const now = new Date().toISOString();
  const vacancy = {
    id: randomUUID(),
    subject: parsed.data.subject,
    subjectAr: parsed.data.subjectAr || undefined,
    details: parsed.data.details,
    detailsAr: parsed.data.detailsAr || undefined,
    isPublished: true,
    createdAt: now,
    updatedAt: now
  };

  const current = await getCareerVacancies();
  await saveCareerVacancies([vacancy, ...current]);

  return NextResponse.json(vacancy, { status: 201 });
}
