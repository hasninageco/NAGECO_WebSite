import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { updateUserSchema } from "@/lib/validators";

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const auth = await requireApiRole(["ADMIN"]);
  if (auth.error) return auth.error;

  const payload = await request.json();
  const parsed = updateUserSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const data: { role?: "ADMIN" | "EDITOR" | "VIEWER"; passwordHash?: string } = {};
  if (parsed.data.role) {
    data.role = parsed.data.role;
  }
  if (parsed.data.password) {
    data.passwordHash = await bcrypt.hash(parsed.data.password, 10);
  }

  const { id } = await params;
  const user = await prisma.user.update({
    where: { id },
    data,
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });

  return NextResponse.json(user);
}