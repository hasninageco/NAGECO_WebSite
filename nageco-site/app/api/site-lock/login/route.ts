import { NextResponse } from "next/server";
import { compare } from "bcryptjs";

const SITE_LOCK_COOKIE_NAME = "nageco_site_lock";

function normalizeNextPath(value: string) {
  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

function redirectTo(path: string) {
  return new NextResponse(null, {
    status: 303,
    headers: {
      location: path
    }
  });
}

async function getMaintenanceUser(submittedUsername: string) {
  const { prisma } = await import("@/lib/prisma");
  const normalizedUsername = submittedUsername.trim().toLowerCase();
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";

  if (normalizedUsername.includes("@")) {
    const bySubmittedEmail = await prisma.user.findUnique({
      where: { email: normalizedUsername },
      select: { id: true, passwordHash: true }
    });
    if (bySubmittedEmail) {
      return bySubmittedEmail;
    }
  }

  if (adminEmail) {
    const byAdminEmail = await prisma.user.findUnique({
      where: { email: adminEmail },
      select: { id: true, passwordHash: true }
    });
    if (byAdminEmail) {
      return byAdminEmail;
    }
  }

  return prisma.user.findFirst({
    where: { role: "ADMIN" },
    orderBy: { createdAt: "asc" },
    select: { id: true, passwordHash: true }
  });
}

async function verifyDatabasePassword(submittedUsername: string, submittedPassword: string) {
  if (!submittedPassword) {
    return false;
  }

  try {
    const user = await getMaintenanceUser(submittedUsername);
    if (!user) {
      return false;
    }

    return compare(submittedPassword, user.passwordHash);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown database error";
    console.error(`[site-lock] database password verification failed: ${message}`);
    return false;
  }
}

export async function POST(request: Request) {
  const formData = await request.formData();
  const nextPath = normalizeNextPath(String(formData.get("next") ?? "/"));

  if (process.env.SITE_LOCK_ENABLED !== "1") {
    return redirectTo(nextPath);
  }

  const submittedUsername = String(formData.get("maintenance_username") ?? formData.get("username") ?? "").trim();
  const submittedPassword = String(formData.get("maintenance_password") ?? formData.get("password") ?? "");

  const expectedUsername = process.env.SITE_LOCK_USERNAME?.trim() ?? "";
  const expectedPassword = process.env.SITE_LOCK_PASSWORD?.trim() ?? "";
  const passwordSource = (process.env.SITE_LOCK_PASSWORD_SOURCE?.trim().toLowerCase() ?? "database") as "database" | "env";
  const adminEmail = process.env.ADMIN_EMAIL?.trim().toLowerCase() ?? "";
  const cookieValue = process.env.SITE_LOCK_COOKIE_VALUE?.trim() ?? "v1";
  const cookieMaxAgeSeconds = Number.parseInt(process.env.SITE_LOCK_COOKIE_MAX_AGE_SECONDS ?? "2592000", 10);

  const normalizedSubmittedUsername = submittedUsername.toLowerCase();
  const usernameMatches = expectedUsername
    ? submittedUsername === expectedUsername || (passwordSource === "database" && adminEmail && normalizedSubmittedUsername === adminEmail)
    : true;
  let passwordMatches = false;

  if (passwordSource === "database") {
    passwordMatches = await verifyDatabasePassword(submittedUsername, submittedPassword);
  } else {
    passwordMatches = Boolean(expectedPassword) && submittedPassword === expectedPassword;
  }

  if (!usernameMatches || !passwordMatches) {
    const loginParams = new URLSearchParams({
      next: nextPath,
      error: "1"
    });
    return redirectTo(`/maintenance-login?${loginParams.toString()}`);
  }

  const response = redirectTo(nextPath);
  response.cookies.set({
    name: SITE_LOCK_COOKIE_NAME,
    value: cookieValue,
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: Number.isFinite(cookieMaxAgeSeconds) && cookieMaxAgeSeconds > 0 ? cookieMaxAgeSeconds : 60 * 60 * 24 * 30
  });

  return response;
}
