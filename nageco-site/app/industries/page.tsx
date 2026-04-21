import Image from "next/image";
import { normalizeMediaUrl } from "@/lib/media-url";
import { getPageSectionsInput } from "@/lib/page-content";
import { getPageContent } from "@/lib/public-data";
import { sanitizeRichText } from "@/lib/rich-text";
import { getCurrentSiteLocale } from "@/lib/site-locale";

export const dynamic = "force-dynamic";

export default async function IndustriesPage() {
  const locale = await getCurrentSiteLocale();
  const content = await getPageContent("INDUSTRIES");
  const sections = getPageSectionsInput("INDUSTRIES", content?.sectionsJson, locale);
  const titleHtml = sanitizeRichText(sections.title, "title");
  const bodyHtml = sanitizeRichText(
    sections.body ?? (locale === "ar"
      ? "<p>ندعم برامج الطاقة والبنية التحتية والمشاريع البيئية التي تتطلب دعمًا جيوفيزيائيًا موثوقًا لاتخاذ القرار.</p>"
      : "<p>We support energy, infrastructure, and environmental programs requiring reliable geophysical decision support.</p>"),
    "block"
  );
  const heroImageUrl = normalizeMediaUrl(sections.heroImageUrl) ?? "/DSC08351.JPG";
  const featureImageUrl = normalizeMediaUrl(sections.featureImageUrl) ?? "/uploads/1773139602969-f2453df7-9b54-46a2-866e-9405a1b4f71e.JPG";

  return (
    <div className="container-page py-10 md:py-12 lg:py-16">
      <section className="nageco-panel relative overflow-hidden px-5 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
        <div className="nageco-gridline pointer-events-none absolute inset-0 opacity-45" />
        <div className="pointer-events-none absolute -right-24 top-8 h-56 w-56 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-sky-300/20 blur-3xl" />

        <div className="relative">
          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.1fr)_minmax(320px,0.9fr)] xl:items-start">
            <div className="space-y-6 xl:-mt-3">
              <div className="space-y-4">
                <span className="nageco-overline">Sector Coverage</span>
                <h1
                  className="max-w-4xl text-3xl font-black tracking-tight text-black md:text-4xl lg:text-5xl"
                  dangerouslySetInnerHTML={{ __html: titleHtml || "Industries" }}
                />
                <p className="max-w-3xl text-sm leading-7 text-slate-600 md:text-base text-justify">
                  Field execution, subsurface intelligence, and dependable geophysical workflows tailored for operators working across complex sectors and demanding environments.
                </p>

                <div className="flex flex-wrap gap-3 pt-1">
                  <span className="inline-flex items-center rounded-full border border-brand-700/10 bg-white/78 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700 shadow-[0_14px_32px_-24px_rgba(15,39,71,0.28)]">
                    Oil & Gas
                  </span>
                  <span className="inline-flex items-center rounded-full border border-brand-700/10 bg-white/78 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700 shadow-[0_14px_32px_-24px_rgba(15,39,71,0.28)]">
                    Infrastructure
                  </span>
                  <span className="inline-flex items-center rounded-full border border-brand-700/10 bg-white/78 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700 shadow-[0_14px_32px_-24px_rgba(15,39,71,0.28)]">
                    Environmental Studies
                  </span>
                </div>
              </div>

              <article
                className="rounded-[1.7rem] border border-brand-700/10 bg-white/82 p-5 text-slate-700 shadow-[0_24px_60px_-42px_rgba(15,39,71,0.32)] backdrop-blur-md md:p-7 lg:p-8 [&_a]:font-semibold [&_a]:text-brand-700 [&_a]:underline [&_li]:ml-6 [&_li]:list-disc [&_li]:leading-8 [&_ol]:space-y-2 [&_p]:leading-8 [&_p]:text-justify [&_p:not(:first-child)]:mt-5 [&_strong]:text-black [&_ul]:space-y-2"
                dangerouslySetInnerHTML={{ __html: bodyHtml }}
              />
            </div>

            <div className="space-y-4 xl:mt-56 xl:pt-2">
              <div className="relative overflow-hidden rounded-[1.7rem] border border-brand-700/12 bg-white shadow-[0_30px_70px_-40px_rgba(15,39,71,0.38)]">
                <div className="relative h-64 w-full md:h-80 xl:h-[24rem]">
                  <Image src={heroImageUrl} alt="Industries field operations" fill className="object-cover object-center" sizes="(max-width: 1280px) 100vw, 40vw" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-900/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                    <div className="rounded-[1.1rem] border border-white/15 bg-black/20 px-4 py-3 text-white backdrop-blur-md">
                      <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-white/70">Industry Visual</p>
                      <p className="mt-1 text-sm font-semibold leading-relaxed">Operational environments where reliable acquisition, field discipline, and subsurface clarity matter most.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-brand-700/12 bg-gradient-to-br from-brand-700 to-slate-900 p-5 text-white shadow-[0_30px_70px_-40px_rgba(15,39,71,0.75)] md:p-6">
                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-sky-200">Why It Matters</p>
                <h2 className="mt-3 text-2xl font-black leading-tight">Each sector needs different field conditions, but the same standard of subsurface confidence.</h2>
                <p className="mt-4 text-sm leading-7 text-white/74 text-justify">
                  NAGECO aligns acquisition quality, logistics discipline, and reporting clarity so clients can make operational and technical decisions with less uncertainty.
                </p>
              </div>

              <div className="relative overflow-hidden rounded-[1.6rem] border border-brand-700/12 bg-white shadow-[0_30px_70px_-40px_rgba(15,39,71,0.38)]">
                <div className="relative h-56 w-full md:h-72 xl:h-80">
                  <Image src={featureImageUrl} alt="Industry operations support" fill className="object-cover object-center" sizes="(max-width: 1280px) 100vw, 32vw" />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08),rgba(15,23,42,0.65))]" />
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                    <div className="rounded-[1.1rem] border border-white/15 bg-white/10 px-4 py-3 text-white backdrop-blur-md">
                      <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-white/70">Second Visual</p>
                      <p className="mt-1 text-sm font-semibold leading-relaxed">Use this image to reinforce the sector, terrain, or crew context most relevant to your target clients.</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}