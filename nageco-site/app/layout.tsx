import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { headers } from "next/headers";
import "./globals.css";
import { Toaster } from "sonner";
import { Cairo, Plus_Jakarta_Sans } from "next/font/google";
import { BrandLogo } from "@/components/BrandLogo";
import { MainNavbar } from "@/components/public/MainNavbar";
import { InstantRouteLoader } from "@/components/public/InstantRouteLoader";
import { getI18nMessages } from "@/lib/i18n/messages";
import { pickLocalizedText } from "@/lib/localized";
import { normalizeMediaUrl } from "@/lib/media-url";
import { getLatestPublishedPostHeadline, getSiteSettings } from "@/lib/public-data";
import { getCurrentSiteLocale, getDirectionForLocale, type SiteLocale } from "@/lib/site-locale";

const headingFont = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-heading",
  weight: ["600", "700", "800"]
});

const bodyFont = Cairo({
  subsets: ["latin", "arabic"],
  variable: "--font-body",
  weight: ["400", "500", "600", "700"]
});

export const metadata: Metadata = {
  title: "NAGECO",
  description: "Geophysical exploration and subsurface intelligence",
  icons: {
    icon: "/TabLogo.png",
    shortcut: "/TabLogo.png",
    apple: "/TabLogo.png"
  }
};

function isValidExternalUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

function normalizeExternalUrl(raw: string) {
  const value = raw.trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

export default async function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const headerList = await headers();
  const pathname = headerList.get("x-pathname") ?? "";
  const isAdminRoute = pathname.startsWith("/admin");
  const isUnderConstructionHome = pathname === "/";
  const isMaintenanceLockRoute = pathname.startsWith("/maintenance-login") || pathname.startsWith("/__maintenance-login");
  const showPublicShell = !isAdminRoute && !isUnderConstructionHome && !isMaintenanceLockRoute;
  const siteLocale = isAdminRoute ? "en" : await getCurrentSiteLocale();
  const pageDirection = isAdminRoute ? "ltr" : getDirectionForLocale(siteLocale);
  const copy = getI18nMessages(siteLocale).footer;

  let settings: Awaited<ReturnType<typeof getSiteSettings>> | null = null;
  let latestBreaking: Awaited<ReturnType<typeof getLatestPublishedPostHeadline>> | null = null;

  if (showPublicShell) {
    [settings, latestBreaking] = await Promise.all([getSiteSettings(), getLatestPublishedPostHeadline()]);
  }

  const localizedSettings = settings as (typeof settings & {
    brandNameAr?: string | null;
    taglineAr?: string | null;
  }) | null;
  const socialLinks = settings?.socialLinksJson && typeof settings.socialLinksJson === "object" ? (settings.socialLinksJson as Record<string, unknown>) : {};
  const configuredBackgrounds = Array.isArray(socialLinks.globalBackgroundImages)
    ? socialLinks.globalBackgroundImages.filter((item): item is string => typeof item === "string")
    : [];

  const globalBackgroundImage1 = normalizeMediaUrl(configuredBackgrounds[0]) ?? "/uploads/1772694098901-f9fb9b18-9bda-4f8d-9b17-f4f219629dcf.jpg";
  const globalBackgroundImage2 = normalizeMediaUrl(configuredBackgrounds[1]) ?? "/uploads/1772694103125-1cd73b92-24f6-49dc-8ef4-de20fc44246b.jpg";

  const bodyStyle = {
    "--global-bg-1": `url("${globalBackgroundImage1}")`,
    "--global-bg-2": `url("${globalBackgroundImage2}")`
  } as React.CSSProperties;

  const brandName = pickLocalizedText(siteLocale, settings?.brandName, localizedSettings?.brandNameAr, "NAGECO");
  const tagline = pickLocalizedText(siteLocale, settings?.tagline, localizedSettings?.taglineAr, "Geophysical exploration and subsurface intelligence");
  const latestBreakingTitle = pickLocalizedText(siteLocale, latestBreaking?.title, latestBreaking?.titleAr) || null;
  const primaryEmail = settings?.emails?.[0] ?? "info@nageco.com";
  const primaryPhone = settings?.phones?.[0] ?? "00218 21 563 4670 / 4";
  const importantLinks = Array.isArray(socialLinks.importantLinks)
    ? socialLinks.importantLinks.flatMap((item) => {
      if (!item || typeof item !== "object") return [];

      const candidate = item as Record<string, unknown>;
      const fallbackLabel = typeof candidate.label === "string" ? candidate.label.trim() : "";
      const nameAr = typeof candidate.nameAr === "string" ? candidate.nameAr.trim() : "";
      const nameEn = typeof candidate.nameEn === "string" ? candidate.nameEn.trim() : "";
      const url = typeof candidate.url === "string" ? normalizeExternalUrl(candidate.url) : "";
      const logo = typeof candidate.logo === "string" ? candidate.logo.trim() : "";
      const normalizedLogo = normalizeMediaUrl(logo) ?? "";

      if (!url || !isValidExternalUrl(url)) {
        return [];
      }

      const resolvedNameAr = nameAr || fallbackLabel;
      const resolvedNameEn = nameEn || fallbackLabel;
      const resolvedLabel = resolvedNameAr || resolvedNameEn;
      if (!resolvedLabel) {
        return [];
      }

      return [{ nameAr: resolvedNameAr, nameEn: resolvedNameEn, label: resolvedLabel, url, logo: normalizedLogo }];
    })
    : [];
  const footerImportantLinks = importantLinks.slice(0, 3);
  const footerGridClassName = importantLinks.length > 0
    ? "container-page grid gap-8 py-10 md:grid-cols-2 xl:grid-cols-[1.15fr_0.8fr_0.95fr_0.9fr] md:py-12"
    : "container-page grid gap-8 py-10 md:grid-cols-[1.15fr_0.9fr_0.9fr] md:py-12";

  return (
    <html lang={siteLocale} dir={pageDirection}>
      <body
        suppressHydrationWarning
        className={`${headingFont.variable} ${bodyFont.variable} flex min-h-screen flex-col ${isAdminRoute ? "nageco-admin-shell bg-white" : ""} ${isMaintenanceLockRoute ? "nageco-maintenance-shell" : ""}`.trim()}
        style={isAdminRoute || isMaintenanceLockRoute ? undefined : bodyStyle}
      >
        {showPublicShell && <InstantRouteLoader />}
        {showPublicShell && <MainNavbar locale={siteLocale} latestBreakingTitle={latestBreakingTitle} latestBreakingSlug={latestBreaking?.slug} />}
        <main className={`relative z-10 flex-1 ${isAdminRoute ? "bg-white pb-0 pt-0" : isUnderConstructionHome || isMaintenanceLockRoute ? "pb-0 pt-0" : "pb-10 pt-0"}`}>{children}</main>
        {showPublicShell && <footer className="relative mt-6 overflow-hidden border-t border-brand-700/10 bg-white/70 backdrop-blur-xl">
          <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-500/40 to-transparent" />
          <div className={footerGridClassName}>
            <div className="flex items-center gap-4 md:gap-6">
              <Image src="/Stamp.png" alt={`${brandName} stamp`} width={220} height={72} className="h-auto w-20 shrink-0 md:w-28" />
              <div className="max-w-xl">
                <h2 className="text-lg font-black leading-tight text-black md:text-[1.5rem]">{copy.trustedTitle}</h2>
                <p className="mt-2 text-sm leading-relaxed text-black/66">{tagline}</p>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-[0.22em] text-black/55">{copy.quickLinks}</h3>
              <div className="mt-4 grid gap-3 text-sm font-semibold text-black/72">
                <Link href="/about" className="transition-colors hover:text-brand-700">{copy.about}</Link>
                <Link href="/services" className="transition-colors hover:text-brand-700">{copy.services}</Link>
                <Link href="/projects" className="transition-colors hover:text-brand-700">{copy.projects}</Link>
                <Link href="/news" className="transition-colors hover:text-brand-700">{copy.news}</Link>
              </div>
            </div>

            {footerImportantLinks.length > 0 && (
              <div>
                <h3 className="text-sm font-extrabold uppercase tracking-[0.22em] text-black/55">{copy.importantLinks}</h3>
                <div className="mt-4 grid gap-3 text-sm font-semibold text-black/72">
                  {footerImportantLinks.map((item) => (
                    <a
                      key={`${item.label}-${item.url}`}
                      href={item.url}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-2.5 transition-colors hover:text-brand-700"
                    >
                      {item.logo ? (
                        <span className="inline-flex h-6 w-6 items-center justify-center rounded-md bg-white p-0.5 shadow-[0_8px_18px_-14px_rgba(15,39,71,0.6)]">
                          <Image src={item.logo} alt={`${item.nameEn || item.nameAr || item.label} logo`} width={20} height={20} className="h-5 w-5 object-contain" />
                        </span>
                      ) : null}
                      <span className="inline-flex flex-col leading-tight">
                        <span>{siteLocale === "ar" ? item.nameAr || item.nameEn || item.label : item.nameEn || item.nameAr || item.label}</span>
                        {siteLocale === "ar" ? (
                          item.nameEn ? <span className="text-xs font-medium text-black/55">{item.nameEn}</span> : null
                        ) : (
                          item.nameAr ? <span className="text-xs font-medium text-black/55">{item.nameAr}</span> : null
                        )}
                      </span>
                    </a>
                  ))}
                </div>
              </div>
            )}

            <div>
              <h3 className="text-sm font-extrabold uppercase tracking-[0.22em] text-black/55">{copy.contact}</h3>
              <div className="mt-4 space-y-3 text-sm text-black/70">
                <p>{primaryEmail}</p>
                <p>{primaryPhone}</p>
                <Link href="/contact" className="btn-secondary inline-flex rounded-full px-5 py-3 font-semibold text-brand-700">
                  {copy.startConversation}
                </Link>
              </div>
            </div>
          </div>

          <div className="border-t border-brand-700/10">
            <div className="container-page flex flex-col gap-2 py-4 text-sm text-black/58 md:flex-row md:items-center md:justify-between">
              <p className="flex items-center gap-2">© {new Date().getFullYear()} <Image src="/Stamp.png" alt={`${brandName} stamp`} width={120} height={40} className="h-auto w-10 shrink-0" /> {copy.allRightsReserved}</p>
              <div className="flex gap-4">
                <Link href="/privacy" className="transition-colors hover:text-brand-700">{copy.privacy}</Link>
                <Link href="/terms" className="transition-colors hover:text-brand-700">{copy.terms}</Link>
              </div>
            </div>
          </div>
        </footer>}
        <Toaster position="top-right" richColors />
      </body>
    </html>
  );
}
