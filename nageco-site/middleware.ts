import { NextResponse } from "next/server";
import { getToken } from "next-auth/jwt";
import type { NextRequest } from "next/server";

const PUBLIC_ADMIN_PATHS = ["/admin/login"];
const SITE_LOCK_ENABLED = process.env.SITE_LOCK_ENABLED === "1";
const SITE_LOCK_LOGIN_PATH = "/maintenance-login";
const SITE_LOCK_LEGACY_LOGIN_PATH = "/__maintenance-login";
const SITE_LOCK_API_PREFIX = "/api/site-lock";
const SITE_LOCK_COOKIE_NAME = "nageco_site_lock";
const SITE_LOCK_COOKIE_VALUE = process.env.SITE_LOCK_COOKIE_VALUE?.trim() ?? "v1";
const PUBLIC_FILE_PATTERN = /\.[^/]+$/;

function isPublicAssetRequest(pathname: string) {
  if (pathname.startsWith("/_next")) {
    return true;
  }

  if (pathname.startsWith("/maps/") || pathname.startsWith("/uploads/")) {
    return true;
  }

  if (pathname === "/favicon.ico" || pathname === "/robots.txt" || pathname === "/sitemap.xml") {
    return true;
  }

  return PUBLIC_FILE_PATTERN.test(pathname);
}

function normalizeNextPath(value: string | null) {
  if (!value) {
    return "/";
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

function isSiteLockOpenPath(pathname: string) {
  if (pathname === "/") {
    return true;
  }

  if (
    pathname === SITE_LOCK_LOGIN_PATH ||
    pathname.startsWith(`${SITE_LOCK_LOGIN_PATH}/`) ||
    pathname === SITE_LOCK_LEGACY_LOGIN_PATH ||
    pathname.startsWith(`${SITE_LOCK_LEGACY_LOGIN_PATH}/`)
  ) {
    return true;
  }

  if (pathname.startsWith(SITE_LOCK_API_PREFIX)) {
    return true;
  }

  return isPublicAssetRequest(pathname);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const requestHeaders = new Headers(request.headers);
  requestHeaders.set("x-pathname", pathname);

  if (pathname === SITE_LOCK_LEGACY_LOGIN_PATH || pathname.startsWith(`${SITE_LOCK_LEGACY_LOGIN_PATH}/`)) {
    const legacyRedirectUrl = new URL(SITE_LOCK_LOGIN_PATH, request.url);
    const nextParam = request.nextUrl.searchParams.get("next");
    const errorParam = request.nextUrl.searchParams.get("error");

    if (nextParam) {
      legacyRedirectUrl.searchParams.set("next", normalizeNextPath(nextParam));
    }

    if (errorParam) {
      legacyRedirectUrl.searchParams.set("error", errorParam);
    }

    return NextResponse.redirect(legacyRedirectUrl);
  }

  if (SITE_LOCK_ENABLED) {
    const lockCookie = request.cookies.get(SITE_LOCK_COOKIE_NAME)?.value ?? "";
    const hasSiteAccess = lockCookie === SITE_LOCK_COOKIE_VALUE;

    if (pathname === SITE_LOCK_LOGIN_PATH && hasSiteAccess) {
      const nextPath = normalizeNextPath(request.nextUrl.searchParams.get("next"));
      return NextResponse.redirect(new URL(nextPath, request.url));
    }

    if (!hasSiteAccess && !isSiteLockOpenPath(pathname)) {
      const nextPath = `${pathname}${request.nextUrl.search}`;
      const loginUrl = new URL(SITE_LOCK_LOGIN_PATH, request.url);
      loginUrl.searchParams.set("next", normalizeNextPath(nextPath));
      return NextResponse.redirect(loginUrl);
    }
  }

  if (!pathname.startsWith("/admin") || PUBLIC_ADMIN_PATHS.includes(pathname)) {
    return NextResponse.next({
      request: {
        headers: requestHeaders
      }
    });
  }

  let token = null;
  const authSecret = process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET;
  try {
    token = await getToken({ req: request, secret: authSecret });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unknown middleware auth error";
    console.error(`[auth][middleware] ${message}`);
  }

  if (!token) {
    const loginUrl = new URL("/admin/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next({
    request: {
      headers: requestHeaders
    }
  });
}

export const config = {
  matcher: ["/:path*"]
};