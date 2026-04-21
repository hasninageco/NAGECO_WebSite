import Image from "next/image";
import Link from "next/link";
import { getCurrentSiteLocale } from "@/lib/site-locale";
import { getSiteSettings } from "@/lib/public-data";
import { normalizeMediaUrl } from "@/lib/media-url";

function normalizeExternalUrl(raw: string) {
  const value = raw.trim();
  if (!value) return "";
  if (/^https?:\/\//i.test(value)) return value;
  return `https://${value}`;
}

function isValidExternalUrl(value: string) {
  try {
    const url = new URL(value);
    return url.protocol === "http:" || url.protocol === "https:";
  } catch {
    return false;
  }
}

export const dynamic = "force-dynamic";

export default async function RelatedLinksPage() {
  const locale = await getCurrentSiteLocale();
  const settings = await getSiteSettings();
  const socialLinks = settings?.socialLinksJson && typeof settings.socialLinksJson === "object" ? (settings.socialLinksJson as Record<string, unknown>) : {};

  const relatedLinks = Array.isArray(socialLinks.importantLinks)
    ? socialLinks.importantLinks.flatMap((item) => {
      if (!item || typeof item !== "object") return [];

      const candidate = item as Record<string, unknown>;
      const fallbackLabel = typeof candidate.label === "string" ? candidate.label.trim() : "";
      const nameAr = typeof candidate.nameAr === "string" ? candidate.nameAr.trim() : "";
      const nameEn = typeof candidate.nameEn === "string" ? candidate.nameEn.trim() : "";
      const url = typeof candidate.url === "string" ? normalizeExternalUrl(candidate.url) : "";
      const logoRaw = typeof candidate.logo === "string" ? candidate.logo.trim() : "";
      const logo = normalizeMediaUrl(logoRaw) ?? "";

      if (!url || !isValidExternalUrl(url)) {
        return [];
      }

      const resolvedNameAr = nameAr || fallbackLabel;
      const resolvedNameEn = nameEn || fallbackLabel;
      const resolvedLabel = resolvedNameAr || resolvedNameEn;
      if (!resolvedLabel) {
        return [];
      }

      return [{ nameAr: resolvedNameAr, nameEn: resolvedNameEn, label: resolvedLabel, url, logo }];
    })
    : [];

  return (
    <div className="container-page py-10">
      <div className="mb-6 grid gap-3 md:grid-cols-2">
        <article className="card py-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-500">{locale === "ar" ? "القسم" : "Section"}</p>
          <h1 className="mt-1 text-3xl font-bold">{locale === "ar" ? "روابط ذات صلة" : "Related Links"}</h1>
        </article>
        <article className="card py-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-500">{locale === "ar" ? "نظرة عامة" : "Overview"}</p>
          <p className="mt-1 text-sm text-black/72">
            {locale === "ar" ? "مؤسسات مهمة وبوابات حكومية ومنظمات شريكة." : "Important institutions, government portals, and partner organizations."}
          </p>
        </article>
      </div>

      {relatedLinks.length === 0 ? (
        <article className="card">
          <p className="text-sm text-black/70">{locale === "ar" ? "لا توجد روابط بعد. أضفها من إعدادات الأدمن." : "No related links yet. Add them from admin settings."}</p>
        </article>
      ) : (
        <article className="card">
          <ul className="grid gap-x-6 gap-y-1 md:grid-cols-2">
            {relatedLinks.map((item) => (
              <li key={`${item.label}-${item.url}`} className="flex items-center gap-4 border-b border-brand-700/10 py-4 md:[&:nth-last-child(-n+2)]:border-b-0">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-xl border border-brand-700/20 bg-white p-1.5 shadow-[0_10px_24px_-18px_rgba(15,39,71,0.55)]">
                  {item.logo ? (
                    <Image src={item.logo} alt={`${item.nameEn || item.nameAr || item.label} logo`} width={44} height={44} className="h-11 w-11 object-contain" />
                  ) : (
                    <span className="text-xs font-bold text-black/40">LOGO</span>
                  )}
                </div>

                <div className="min-w-0">
                  <h2 className="truncate text-lg font-bold text-black">{locale === "ar" ? item.nameAr || item.nameEn || item.label : item.nameEn || item.nameAr || item.label}</h2>
                  {locale === "ar"
                    ? item.nameEn ? <p className="truncate text-sm font-semibold text-black/58">{item.nameEn}</p> : null
                    : item.nameAr ? <p className="truncate text-sm font-semibold text-black/58">{item.nameAr}</p> : null}
                  <Link href={item.url} target="_blank" rel="noreferrer" className="mt-1 inline-flex text-sm font-semibold text-brand-700 hover:text-brand-500">
                    {locale === "ar" ? "زيارة الرابط" : "Visit link"}
                  </Link>
                </div>
              </li>
            ))}
          </ul>
        </article>
      )}
    </div>
  );
}
