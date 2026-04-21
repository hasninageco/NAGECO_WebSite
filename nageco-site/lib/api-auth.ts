import type { Role } from "@prisma/client";
import { NextResponse } from "next/server";
import { requireRole } from "@/lib/auth";

export async function requireApiRole(roles: Role[]) {
  try {
    const user = await requireRole(roles);
    return { user };
  } catch (error) {
    const message = error instanceof Error ? error.message : "UNAUTHORIZED";
    if (message === "FORBIDDEN") {
      return { error: NextResponse.json({ error: "Forbidden" }, { status: 403 }) };
    }
    return { error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }) };
  }
}