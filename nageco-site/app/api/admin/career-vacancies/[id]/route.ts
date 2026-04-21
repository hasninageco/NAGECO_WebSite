import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { requireApiRole } from "@/lib/api-auth";
import { getCareerVacancies, saveCareerVacancies } from "@/lib/career-vacancies";

const updateSchema = z.object({
  subject: z.string().trim().min(2, "Subject is required").max(140, "Subject is too long").optional(),
  subjectAr: z.string().trim().max(140, "Arabic subject is too long").optional(),
  details: z.string().trim().min(10, "Details are required").max(5000, "Details are too long").optional(),
  detailsAr: z.string().trim().max(5000, "Arabic details are too long").optional(),
  isPublished: z.boolean().optional()
});

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireApiRole(["ADMIN", "EDITOR"]);
  if (auth.error) return auth.error;

  const { id } = await context.params;
  const payload = await request.json();
  const parsed = updateSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const current = await getCareerVacancies();
  const index = current.findIndex((item) => item.id === id);
  if (index < 0) {
    return NextResponse.json({ error: "Vacancy not found" }, { status: 404 });
  }

  const existing = current[index];
  current[index] = {
    ...existing,
    subject: parsed.data.subject ?? existing.subject,
    subjectAr: parsed.data.subjectAr !== undefined ? parsed.data.subjectAr || undefined : existing.subjectAr,
    details: parsed.data.details ?? existing.details,
    detailsAr: parsed.data.detailsAr !== undefined ? parsed.data.detailsAr || undefined : existing.detailsAr,
    isPublished: parsed.data.isPublished ?? existing.isPublished,
    updatedAt: new Date().toISOString()
  };

  await saveCareerVacancies(current);
  return NextResponse.json(current[index]);
}

export async function DELETE(_: NextRequest, context: { params: Promise<{ id: string }> }) {
  const auth = await requireApiRole(["ADMIN", "EDITOR"]);
  if (auth.error) return auth.error;

  const { id } = await context.params;
  const current = await getCareerVacancies();
  const next = current.filter((item) => item.id !== id);

  if (next.length === current.length) {
    return NextResponse.json({ error: "Vacancy not found" }, { status: 404 });
  }

  await saveCareerVacancies(next);
  return NextResponse.json({ success: true });
}
