import Image from "next/image";
import { getSiteSettings } from "@/lib/public-data";
import { normalizeMediaUrl } from "@/lib/media-url";
import { getCurrentSiteLocale } from "@/lib/site-locale";

export const dynamic = "force-dynamic";

export default async function OurTeamPage() {
  const locale = await getCurrentSiteLocale();
  const settings = await getSiteSettings();
  const socialLinks = settings?.socialLinksJson && typeof settings.socialLinksJson === "object" ? (settings.socialLinksJson as Record<string, unknown>) : {};

  const teamMembers = Array.isArray(socialLinks.ourTeam)
    ? socialLinks.ourTeam.flatMap((item) => {
      if (!item || typeof item !== "object") return [];

      const candidate = item as Record<string, unknown>;
      const fallbackName = typeof candidate.name === "string" ? candidate.name.trim() : "";
      const fallbackPosition = typeof candidate.position === "string" ? candidate.position.trim() : "";
      const fallbackShortDefinition = typeof candidate.shortDefinition === "string" ? candidate.shortDefinition.trim() : "";
      const nameEn = typeof candidate.nameEn === "string" ? candidate.nameEn.trim() : fallbackName;
      const nameAr = typeof candidate.nameAr === "string" ? candidate.nameAr.trim() : fallbackName;
      const positionEn = typeof candidate.positionEn === "string" ? candidate.positionEn.trim() : fallbackPosition;
      const positionAr = typeof candidate.positionAr === "string" ? candidate.positionAr.trim() : fallbackPosition;
      const shortDefinitionEn = typeof candidate.shortDefinitionEn === "string" ? candidate.shortDefinitionEn.trim() : fallbackShortDefinition;
      const shortDefinitionAr = typeof candidate.shortDefinitionAr === "string" ? candidate.shortDefinitionAr.trim() : fallbackShortDefinition;
      const imageRaw = typeof candidate.image === "string" ? candidate.image.trim() : "";
      const image = normalizeMediaUrl(imageRaw) ?? "";

      if ((!nameEn && !nameAr) || (!positionEn && !positionAr) || (!shortDefinitionEn && !shortDefinitionAr)) {
        return [];
      }

      return [{ nameEn, nameAr, positionEn, positionAr, shortDefinitionEn, shortDefinitionAr, image }];
    })
    : [];

  return (
    <div className="container-page py-10">
      <div className="mb-6 grid gap-3 md:grid-cols-2">
        <article className="card py-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-500">{locale === "ar" ? "القسم" : "Section"}</p>
          <h1 className="mt-1 text-3xl font-bold">{locale === "ar" ? "فريقنا" : "Our Team"}</h1>
        </article>
        <article className="card py-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-500">{locale === "ar" ? "نظرة عامة" : "Overview"}</p>
          <p className="mt-1 text-sm text-black/72">
            {locale === "ar" ? "تعرف على الفريق الذي يقود التنفيذ الميداني والتسليم الفني." : "Meet the people behind our field execution and technical delivery."}
          </p>
        </article>
      </div>

      {teamMembers.length === 0 ? (
        <article className="card">
          <p className="text-sm text-black/70">{locale === "ar" ? "لا يوجد أعضاء فريق حالياً. أضفهم من إعدادات الأدمن." : "No team members yet. Add them from admin settings."}</p>
        </article>
      ) : (
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {teamMembers.map((member, index) => (
            <article
              key={`${member.nameEn}-${member.positionEn}-${index}`}
              className="relative overflow-hidden rounded-[1.6rem] border border-brand-700/12 bg-white/88 p-5 shadow-[0_24px_48px_-34px_rgba(15,39,71,0.5)] backdrop-blur"
            >
              <span className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full border border-brand-500/22 bg-brand-500/10 px-2.5 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-brand-700">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-500" />
                Feedback
              </span>

              <div className="mt-2 flex items-start gap-4">
                <div className="flex h-36 w-36 shrink-0 items-center justify-center overflow-hidden rounded-2xl border border-brand-700/18 bg-white p-1.5 shadow-[0_16px_34px_-24px_rgba(15,39,71,0.55)]">
                  {member.image ? (
                    <Image src={member.image} alt={locale === "ar" ? member.nameAr || member.nameEn : member.nameEn || member.nameAr} width={144} height={144} className="h-full w-full rounded-xl object-cover" />
                  ) : (
                    <span className="text-xs font-bold text-black/40">PHOTO</span>
                  )}
                </div>

                <div className="min-w-0 flex-1">
                  <h2 className="text-xl font-black text-black">{locale === "ar" ? member.nameAr || member.nameEn : member.nameEn || member.nameAr}</h2>
                  <p className="mt-1 text-sm font-bold uppercase tracking-[0.08em] text-brand-700">{locale === "ar" ? member.positionAr || member.positionEn : member.positionEn || member.positionAr}</p>
                  <p className="mt-3 line-clamp-4 text-sm leading-relaxed text-black/72">
                    {locale === "ar" ? member.shortDefinitionAr || member.shortDefinitionEn : member.shortDefinitionEn || member.shortDefinitionAr}
                  </p>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}
    </div>
  );
}
