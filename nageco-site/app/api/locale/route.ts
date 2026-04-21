import { NextRequest, NextResponse } from "next/server";
import { defaultSiteLocale, isSiteLocale, siteLocaleCookieName } from "@/lib/site-locale";

const oneYearInSeconds = 60 * 60 * 24 * 365;

function normalizeRedirectPath(raw: string | null): string {
  if (!raw) return "/";

  if (!raw.startsWith("/") || raw.startsWith("//")) {
    return "/";
  }

  return raw;
}

export async function GET(request: NextRequest) {
  const localeParam = request.nextUrl.searchParams.get("locale");
  const nextLocale = isSiteLocale(localeParam) ? localeParam : defaultSiteLocale;
  const redirectPath = normalizeRedirectPath(request.nextUrl.searchParams.get("redirect"));
  const redirectUrl = new URL(redirectPath, request.url);

  const response = NextResponse.redirect(redirectUrl);
  response.cookies.set({
    name: siteLocaleCookieName,
    value: nextLocale,
    path: "/",
    maxAge: oneYearInSeconds,
    sameSite: "lax"
  });

  return response;
}
