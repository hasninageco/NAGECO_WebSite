import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { services } from "@/content/services";
import { getPageSectionsInput } from "@/lib/page-content";
import { normalizeMediaUrl } from "@/lib/media-url";
import { sanitizeRichText } from "@/lib/rich-text";
import { getPageContent } from "@/lib/public-data";
import { getCurrentSiteLocale } from "@/lib/site-locale";

export const metadata: Metadata = {
  title: "Services | NAGECO"
};

function SurveyPlanningIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-7 w-7">
      <path d="M4 19H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
      <path d="M6 15L10 11L13 13L18 8" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="18" cy="8" r="1.4" fill="currentColor" />
    </svg>
  );
}

function DataQualityIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-7 w-7">
      <path d="M12 3L19 6V11.5C19 15.5 16.3 19 12 20.6C7.7 19 5 15.5 5 11.5V6L12 3Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.4 12.2L11.2 14L14.8 10.4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function DeliveryIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-7 w-7">
      <rect x="3.5" y="6.5" width="10" height="8" rx="1.6" stroke="currentColor" strokeWidth="1.8" />
      <path d="M13.5 9H17.5L20.5 12V14.5H13.5V9Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <circle cx="8" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="17" cy="16.5" r="1.5" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function OpsCardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-7 w-7">
      <path d="M4 12H8L10 8L13 16L15 12H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5 18H19" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function CompassCardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-7 w-7">
      <circle cx="12" cy="12" r="8.5" stroke="currentColor" strokeWidth="1.8" />
      <path d="M9.2 14.8L10.8 10.8L14.8 9.2L13.2 13.2L9.2 14.8Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
    </svg>
  );
}

function ShieldCardIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-7 w-7">
      <path d="M12 3.6L18.5 6.4V11.4C18.5 15 16.1 18.1 12 19.7C7.9 18.1 5.5 15 5.5 11.4V6.4L12 3.6Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M9.4 11.8L11.1 13.5L14.6 10" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const serviceChipIcons = [SurveyPlanningIcon, DataQualityIcon, DeliveryIcon] as const;
const bodyPointIcons = [OpsCardIcon, CompassCardIcon, ShieldCardIcon] as const;
const serviceHighlightThemes = [
  {
    shell: "from-white via-brand-50/80 to-white",
    icon: "bg-brand-100 text-brand-700",
    bar: "from-brand-500/80 to-black/80"
  },
  {
    shell: "from-white via-brand-50/60 to-slate-50/70",
    icon: "bg-brand-50 text-brand-700",
    bar: "from-brand-600/80 to-black/75"
  },
  {
    shell: "from-white via-blue-50/70 to-white",
    icon: "bg-brand-100 text-brand-700",
    bar: "from-brand-500/75 to-black/80"
  }
] as const;

function toServiceChips(text: string, max = 3) {
  return text
    .split(/,|\.|;| and /gi)
    .map((part) => part.trim())
    .filter((part) => part.length > 3)
    .slice(0, max);
}

function htmlToBodyPoints(html: string) {
  return html
    .replace(/<\s*br\s*\/?\s*>/gi, "\n")
    .replace(/<\/(p|h2|h3|li|div)>/gi, "\n")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .split(/\n+/)
    .map((line) => line.replace(/\s+/g, " ").trim())
    .filter((line) => line.length >= 24)
    .slice(0, 8);
}

function toServiceHighlights(points: string[], fallbackServices: typeof services, maxItems = 10) {
  const normalizedPoints = points
    .map((point) => point.replace(/\s+/g, " ").trim())
    .filter((point) => point.length >= 24);

  const prioritizedSlugs = ["software-development", "electronic-aviation"];
  const pinnedServices = prioritizedSlugs
    .map((slug) => fallbackServices.find((service) => service.slug === slug))
    .filter((service): service is (typeof fallbackServices)[number] => Boolean(service));

  const pinnedPoints = pinnedServices
    .map((service) => `${service.title}: ${service.summary}`)
    .map((point) => point.replace(/\s+/g, " ").trim())
    .filter((point) => point.length >= 24);

  const regularServicePoints = fallbackServices
    .filter((service) => !prioritizedSlugs.includes(service.slug))
    .map((service) => `${service.title}: ${service.summary}`)
    .map((point) => point.replace(/\s+/g, " ").trim())
    .filter((point) => point.length >= 24);

  const sourcePoints = [...regularServicePoints, ...normalizedPoints];
  const mainPoints: string[] = [];
  const seen = new Set<string>();
  const availableMainSlots = Math.max(0, maxItems - pinnedPoints.length);

  for (const point of sourcePoints) {
    const key = point.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      mainPoints.push(point);
    }
    if (mainPoints.length >= availableMainSlots) {
      break;
    }
  }

  for (const point of pinnedPoints) {
    const key = point.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      mainPoints.push(point);
    }
  }

  return mainPoints.slice(0, maxItems);
}

function toBodyCard(point: string) {
  const cleanPoint = point.replace(/\s+/g, " ").trim();
  const colonParts = cleanPoint.split(":");

  if (colonParts.length > 1) {
    const title = colonParts[0].trim();
    const detail = colonParts.slice(1).join(":").trim();
    if (title.length >= 4 && detail.length >= 12) {
      return { title, detail };
    }
  }

  const words = cleanPoint.split(" ");
  const titleWords = words.slice(0, 4);
  const title = titleWords.join(" ").replace(/[.,;:]+$/, "");
  const detail = cleanPoint;

  return { title, detail };
}

export default async function ServicesPage() {
  const locale = await getCurrentSiteLocale();
  const content = await getPageContent("SERVICES");
  const sections = getPageSectionsInput("SERVICES", content?.sectionsJson, locale);
  const titleHtml = sanitizeRichText(sections.title, "title");
  const bodyHtml = sanitizeRichText(
    sections.body ?? (locale === "ar"
      ? "<p>استكشف خدمات ناجيكو الجيوفيزيائية عبر الاكتساب الميداني، الدعم التشغيلي، التفسير الفني، والتنفيذ المنضبط.</p>"
      : "<p>Explore NAGECO's seismic services across acquisition, field support, interpretation, and disciplined operational delivery.</p>"),
    "block"
  );
  const heroImageUrl = normalizeMediaUrl(sections.heroImageUrl) ?? "/DSC08351.JPG";
  const featureImageUrl = normalizeMediaUrl(sections.featureImageUrl) ?? "/DSC08351.JPG";
  const bodyPoints = htmlToBodyPoints(bodyHtml);
  const serviceHighlights = toServiceHighlights(bodyPoints, services);

  return (
    <div className="container-page py-10 md:py-12 lg:py-16">
      <section className="nageco-panel relative overflow-hidden px-5 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
        <div className="nageco-gridline pointer-events-none absolute inset-0 opacity-50" />
        <div className="pointer-events-none absolute -right-24 top-6 h-56 w-56 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-sky-300/20 blur-3xl" />

        <div className="relative space-y-8">
          <div className="space-y-4">
            <span className="nageco-overline">Operational Services</span>
            <h1
              className="max-w-4xl text-3xl font-black tracking-tight text-black md:text-4xl lg:text-5xl"
              dangerouslySetInnerHTML={{ __html: titleHtml || "Services" }}
            />
            <p className="max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
              Seismic delivery requires more than equipment in the field. It depends on planning discipline, acquisition control, processing visibility, and dependable technical follow-through.
            </p>

            <div className="flex flex-wrap gap-3 pt-1">
              <span className="inline-flex items-center rounded-full border border-brand-700/10 bg-white/78 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700 shadow-[0_14px_32px_-24px_rgba(15,39,71,0.28)]">
                Survey Planning
              </span>
              <span className="inline-flex items-center rounded-full border border-brand-700/10 bg-white/78 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700 shadow-[0_14px_32px_-24px_rgba(15,39,71,0.28)]">
                Field Execution
              </span>
              <span className="inline-flex items-center rounded-full border border-brand-700/10 bg-white/78 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700 shadow-[0_14px_32px_-24px_rgba(15,39,71,0.28)]">
                QA/QC Discipline
              </span>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] xl:items-start">
            <div className="space-y-4">
              <div className="rounded-[1.7rem] border border-brand-700/10 bg-white/80 p-5 shadow-[0_24px_60px_-42px_rgba(15,39,71,0.32)] backdrop-blur-md md:p-7 lg:p-8">
                <div className="flex flex-wrap items-end justify-between gap-3">
                  <div>
                    <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.22em] text-brand-500">Our Services</p>
                    <h2 className="mt-2 text-xl font-black text-brand-900 md:text-2xl">Clear operational scope and execution priorities</h2>
                  </div>
                  <span className="inline-flex items-center rounded-full border border-brand-700/15 bg-brand-50/75 px-3 py-1 text-[0.65rem] font-extrabold uppercase tracking-[0.16em] text-brand-700">
                    Structured delivery
                  </span>
                </div>

                <p className="mt-3 text-sm leading-7 text-slate-600 md:text-[0.94rem]">
                  Service lines are grouped to make planning, acquisition control, and interpretation support easier to track from mobilization to final reporting.
                </p>

                {serviceHighlights.length > 0 ? (
                  <div className="mt-6 grid gap-3.5 sm:grid-cols-2">
                    {serviceHighlights.map((point, index) => {
                      const PointIcon = bodyPointIcons[index % bodyPointIcons.length];
                      const card = toBodyCard(point);
                      const theme = serviceHighlightThemes[index % serviceHighlightThemes.length];

                      return (
                        <article
                          key={`${point}-${index}`}
                          className={`group relative overflow-hidden rounded-2xl border border-brand-700/14 bg-gradient-to-br ${theme.shell} p-4 shadow-[0_18px_40px_-30px_rgba(15,39,71,0.36)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_26px_50px_-26px_rgba(15,39,71,0.42)]`}
                        >
                          <div className="absolute -right-8 -top-8 h-20 w-20 rounded-full bg-brand-400/12 blur-2xl" />
                          <div className="relative flex items-start gap-3">
                            <span className={`mt-0.5 inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${theme.icon}`}>
                              <PointIcon />
                            </span>
                            <div className="min-w-0">
                              <p className="text-[0.62rem] font-extrabold uppercase tracking-[0.18em] text-brand-500">Service</p>
                              <h3 className="mt-1 text-[0.8rem] font-extrabold uppercase tracking-[0.09em] text-brand-800">{card.title}</h3>
                              <p className="mt-1.5 text-[0.79rem] font-medium leading-5 text-black/75">{card.detail}</p>
                              <div className={`mt-3 h-1.5 w-16 rounded-full bg-gradient-to-r ${theme.bar}`} />
                            </div>
                          </div>
                        </article>
                      );
                    })}
                  </div>
                ) : (
                  <div className="nageco-capabilities-article mt-4" dangerouslySetInnerHTML={{ __html: bodyHtml }} />
                )}
              </div>

              <div className="rounded-[1.45rem] border border-brand-700/10 bg-white/78 p-4 shadow-[0_20px_50px_-36px_rgba(15,39,71,0.28)] backdrop-blur-sm md:p-5">
                <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.22em] text-brand-500">Operational Coverage</p>
                <p className="mt-2 text-sm leading-7 text-slate-700">
                  Coverage spans seismic surveys, gravity and magnetic support, processing workflows, and integrated interpretation support for exploration teams.
                </p>
                <div className="mt-3 flex flex-wrap gap-2">
                  <span className="inline-flex items-center rounded-full border border-brand-700/12 bg-brand-50/75 px-3 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.09em] text-brand-700">
                    Acquisition Execution
                  </span>
                  <span className="inline-flex items-center rounded-full border border-brand-700/12 bg-brand-50/75 px-3 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.09em] text-brand-700">
                    Processing Visibility
                  </span>
                  <span className="inline-flex items-center rounded-full border border-brand-700/12 bg-brand-50/75 px-3 py-1.5 text-[0.68rem] font-extrabold uppercase tracking-[0.09em] text-brand-700">
                    Interpretation Support
                  </span>
                </div>
              </div>
            </div>

            <aside className="space-y-4 xl:sticky xl:top-24">
              <div className="relative overflow-hidden rounded-[1.6rem] border border-brand-700/12 bg-white shadow-[0_30px_70px_-40px_rgba(15,39,71,0.38)]">
                <div className="relative h-64 w-full md:h-80 xl:h-[23rem]">
                  <Image src={heroImageUrl} alt="Services field operations" fill className="object-fill" sizes="(max-width: 1280px) 100vw, 38vw" />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-900/10 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                    <div className="rounded-[1.1rem] border border-white/15 bg-black/20 px-4 py-3 text-white backdrop-blur-md">
                      <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-white/70">Field Visual</p>
                      <p className="mt-1 text-sm font-semibold leading-relaxed">Operational support environments that reflect real NAGECO service delivery conditions.</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="rounded-[1.6rem] border border-brand-700/12 bg-gradient-to-br from-brand-700 to-slate-900 p-5 text-white shadow-[0_30px_70px_-40px_rgba(15,39,71,0.75)] md:p-6">
                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-sky-200">Service Focus</p>
                <h2 className="mt-3 text-2xl font-black leading-tight">Every service line is structured to protect data quality, timing, and field reliability.</h2>
                <p className="mt-4 text-sm leading-7 text-white/74">
                  From mobilization and acquisition support to processing and interpretation, the objective is consistent: keep the workflow controlled and the final output decision-ready.
                </p>
              </div>

              <div className="grid gap-3">
                {services.slice(0, 3).map((service, index) => (
                  <div key={service.slug} className="rounded-[1.35rem] border border-brand-700/10 bg-white/82 p-4 shadow-[0_20px_44px_-36px_rgba(15,39,71,0.26)] backdrop-blur-sm">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-sm font-bold text-black">{service.title}</p>
                      <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-brand-500">0{index + 1}</p>
                    </div>
                    <p className="mt-2 text-xs leading-6 text-slate-600">{service.summary}</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {toServiceChips(service.summary).map((chip, chipIndex) => {
                        const ChipIcon = serviceChipIcons[chipIndex % serviceChipIcons.length];
                        return (
                          <span
                            key={`${service.slug}-${chip}`}
                            className="inline-flex items-center gap-1.5 rounded-full border border-brand-700/12 bg-brand-50/70 px-2.5 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-brand-700"
                          >
                            <ChipIcon />
                            {chip}
                          </span>
                        );
                      })}
                    </div>
                  </div>
                ))}
              </div>
            </aside>
          </div>

          <div className="space-y-4">
            <div className="relative overflow-hidden rounded-[1.8rem] border border-brand-700/12 bg-white shadow-[0_30px_70px_-42px_rgba(15,39,71,0.3)]">
              <div className="relative h-56 w-full md:h-72 lg:h-80">
                <Image src={featureImageUrl} alt="NAGECO services field execution" fill className="object-cover object-center" sizes="100vw" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(90deg,rgba(15,23,42,0.65),rgba(15,23,42,0.18)_48%,rgba(15,23,42,0.06))]" />
                <div className="absolute inset-y-0 left-0 flex max-w-xl items-end p-5 md:p-8">
                  <div className="rounded-[1.25rem] border border-white/12 bg-white/10 px-5 py-4 text-white backdrop-blur-md">
                    <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-sky-200">Operational Coverage</p>
                    <p className="mt-2 text-lg font-bold leading-relaxed md:text-xl">Field planning, acquisition support, processing continuity, and interpretation workflows aligned in one service environment.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex items-end justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-brand-500">Service Portfolio</p>
                <h2 className="mt-2 text-2xl font-bold text-black md:text-3xl">Core services delivered across seismic operations and interpretation scopes.</h2>
              </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
              {services.map((service, index) => (
                <article key={service.slug} className="card relative overflow-hidden border border-brand-700/10 bg-white/82">
                  <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-500/10 blur-2xl" />
                  <p className="mb-3 text-xs font-extrabold uppercase tracking-[0.24em] text-brand-500">0{index + 1}</p>
                  <h3 className="text-xl font-bold text-black">{service.title}</h3>
                  <p className="mt-2 text-sm leading-relaxed text-black/70">{service.summary}</p>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {toServiceChips(service.summary).map((chip, chipIndex) => {
                      const ChipIcon = serviceChipIcons[chipIndex % serviceChipIcons.length];
                      return (
                        <span
                          key={`${service.slug}-list-${chip}`}
                          className="inline-flex items-center gap-1.5 rounded-full border border-brand-700/12 bg-brand-50/70 px-2.5 py-1.5 text-[0.68rem] font-bold uppercase tracking-[0.08em] text-brand-700"
                        >
                          <ChipIcon />
                          {chip}
                        </span>
                      );
                    })}
                  </div>
                  <Link href={`/services/${service.slug}`} className="mt-5 inline-flex text-sm font-semibold text-brand-700 hover:underline">
                    Learn more
                  </Link>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}