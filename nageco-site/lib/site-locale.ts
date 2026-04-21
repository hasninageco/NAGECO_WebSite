import { cookies, headers } from "next/headers";

export const supportedLocales = ["en", "ar"] as const;

export type SiteLocale = (typeof supportedLocales)[number];

export const defaultSiteLocale: SiteLocale = "en";
export const siteLocaleCookieName = "nageco_locale";

function normalizeLocale(value: string | null | undefined): SiteLocale | null {
  if (value === "ar") return "ar";
  if (value === "en") return "en";
  return null;
}

export function isSiteLocale(value: string | null | undefined): value is SiteLocale {
  return normalizeLocale(value) !== null;
}

function getPreferredLocaleFromAcceptLanguage(acceptLanguageHeader: string | null): SiteLocale {
  if (!acceptLanguageHeader) return defaultSiteLocale;

  const normalized = acceptLanguageHeader.toLowerCase();
  if (normalized.includes("ar")) {
    return "ar";
  }

  return defaultSiteLocale;
}

export async function getCurrentSiteLocale(): Promise<SiteLocale> {
  const cookieStore = await cookies();
  const cookieLocale = normalizeLocale(cookieStore.get(siteLocaleCookieName)?.value);
  if (cookieLocale) {
    return cookieLocale;
  }

  const headerStore = await headers();
  return getPreferredLocaleFromAcceptLanguage(headerStore.get("accept-language"));
}

export function getDirectionForLocale(locale: SiteLocale): "rtl" | "ltr" {
  return locale === "ar" ? "rtl" : "ltr";
}

export function isRtlLocale(locale: SiteLocale): boolean {
  return getDirectionForLocale(locale) === "rtl";
}
