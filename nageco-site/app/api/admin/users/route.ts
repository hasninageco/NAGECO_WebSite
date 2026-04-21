import bcrypt from "bcryptjs";
import { NextRequest, NextResponse } from "next/server";
import { requireApiRole } from "@/lib/api-auth";
import { prisma } from "@/lib/prisma";
import { createUserSchema } from "@/lib/validators";

export async function GET() {
  const auth = await requireApiRole(["ADMIN"]);
  if (auth.error) return auth.error;

  const users = await prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });

  return NextResponse.json(users);
}

export async function POST(request: NextRequest) {
  const auth = await requireApiRole(["ADMIN"]);
  if (auth.error) return auth.error;

  const payload = await request.json();
  const parsed = createUserSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
  }

  const passwordHash = await bcrypt.hash(parsed.data.password, 10);
  const user = await prisma.user.create({
    data: {
      name: parsed.data.name,
      email: parsed.data.email,
      role: parsed.data.role,
      passwordHash
    },
    select: { id: true, name: true, email: true, role: true, createdAt: true }
  });

  return NextResponse.json(user, { status: 201 });
}