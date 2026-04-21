import { getPageContent } from "@/lib/public-data";
import { sanitizeRichText } from "@/lib/rich-text";
import { normalizeMediaUrl } from "@/lib/media-url";
import { getSiteSettings } from "@/lib/public-data";
import { CrewGalleryCarousel } from "@/components/public/CrewGalleryCarousel";
import { pickLocalizedList, pickLocalizedText } from "@/lib/localized";
import { getCurrentSiteLocale } from "@/lib/site-locale";
import { getPageSectionsInput } from "@/lib/page-content";

export const dynamic = "force-dynamic";

export default async function CrewPage() {
  const locale = await getCurrentSiteLocale();
  const [content, settings] = await Promise.all([getPageContent("CREW"), getSiteSettings()]);
  const sections = getPageSectionsInput("CREW", content?.sectionsJson, locale);
  const settingsJson = settings?.socialLinksJson && typeof settings.socialLinksJson === "object"
    ? (settings.socialLinksJson as Record<string, unknown>)
    : {};

  const toArray = (value: unknown) =>
    Array.isArray(value) ? value.filter((item): item is string => typeof item === "string" && item.trim().length > 0) : [];

  const crews = [
    {
      code: "203",
      definition: typeof settingsJson.crew203Definition === "string" ? settingsJson.crew203Definition : "",
      definitionAr: typeof settingsJson.crew203DefinitionAr === "string" ? settingsJson.crew203DefinitionAr : "",
      achievements: toArray(settingsJson.crew203Achievements),
      achievementsAr: toArray(settingsJson.crew203AchievementsAr),
      pictures: toArray(settingsJson.crew203Pictures).map((item) => normalizeMediaUrl(item)).filter((item): item is string => Boolean(item))
    },
    {
      code: "206",
      definition: typeof settingsJson.crew206Definition === "string" ? settingsJson.crew206Definition : "",
      definitionAr: typeof settingsJson.crew206DefinitionAr === "string" ? settingsJson.crew206DefinitionAr : "",
      achievements: toArray(settingsJson.crew206Achievements),
      achievementsAr: toArray(settingsJson.crew206AchievementsAr),
      pictures: toArray(settingsJson.crew206Pictures).map((item) => normalizeMediaUrl(item)).filter((item): item is string => Boolean(item))
    }
  ];

  const titleHtml = sanitizeRichText(sections.title, "title");
  const bodyHtml = sanitizeRichText(
    sections.body ?? (locale === "ar"
      ? "<p>تعرف على هيكل طواقم ناجيكو الداعم للجاهزية الميدانية، والسلامة، والتنفيذ الجيوفيزيائي المنضبط.</p>"
      : "<p>Meet the NAGECO crew structure supporting field readiness, safety performance, and disciplined geophysical operations.</p>"),
    "block"
  );

  return (
    <div className="container-page py-10">
      <section className="card space-y-3">
        <h1 className="text-3xl font-bold" dangerouslySetInnerHTML={{ __html: titleHtml || (locale === "ar" ? "الطواقم" : "Crew") }} />
        <div
          className="text-slate-700 [&_a]:font-semibold [&_a]:text-brand-700 [&_a]:underline [&_li]:ml-6 [&_li]:list-disc [&_p]:mt-2 [&_p]:leading-7 [&_ul]:space-y-2"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </section>

      <section className="mt-6 grid gap-4 md:grid-cols-2">
        {crews.map((crew) => (
          <article key={crew.code} className="card space-y-3">
            <h2 className="text-xl font-semibold">{locale === "ar" ? "طاقم" : "Crew"} {crew.code}</h2>
            <p className="text-slate-700">
              {pickLocalizedText(
                locale,
                crew.definition,
                crew.definitionAr,
                locale === "ar"
                  ? `طاقم ${crew.code} يدعم عمليات ناجيكو الميدانية بتنفيذ منضبط ومتوافق مع معايير الصحة والسلامة والبيئة.`
                  : `Crew ${crew.code} supports NAGECO field operations with disciplined execution and HSE-aligned delivery.`
              )}
            </p>

            {pickLocalizedList(locale, crew.achievements, crew.achievementsAr).length > 0 && (
              <div>
                <h3 className="text-sm font-semibold text-slate-900">{locale === "ar" ? "الإنجازات" : "Achievements"}</h3>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-700">
                  {pickLocalizedList(locale, crew.achievements, crew.achievementsAr).map((item, index) => (
                    <li key={`${crew.code}-achievement-${index}`}>{item}</li>
                  ))}
                </ul>
              </div>
            )}

            {crew.pictures.length > 0 && (
              <CrewGalleryCarousel images={crew.pictures} crewCode={crew.code} />
            )}
          </article>
        ))}
      </section>
    </div>
  );
}