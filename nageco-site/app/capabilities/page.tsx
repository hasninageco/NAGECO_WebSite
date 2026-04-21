import Image from "next/image";
import { getPageSectionsInput } from "@/lib/page-content";
import { getPageContent } from "@/lib/public-data";
import { sanitizeRichText } from "@/lib/rich-text";
import { getCurrentSiteLocale } from "@/lib/site-locale";

export const dynamic = "force-dynamic";

function FieldExecutionIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-6 w-6">
      <path d="M8 31H15L20 18L25 34L30 23H40" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 38H38" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

function QualityControlIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-6 w-6">
      <circle cx="21" cy="21" r="8" stroke="currentColor" strokeWidth="2.4" />
      <path d="M27 27L36 36" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M18.5 21.5L20.8 24L24.8 18.8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IntegratedSupportIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-6 w-6">
      <path d="M16 25C17.7 25 19 23.7 19 22C19 20.3 17.7 19 16 19C14.3 19 13 20.3 13 22C13 23.7 14.3 25 16 25Z" stroke="currentColor" strokeWidth="2.4" />
      <path d="M32 25C33.7 25 35 23.7 35 22C35 20.3 33.7 19 32 19C30.3 19 29 20.3 29 22C29 23.7 30.3 25 32 25Z" stroke="currentColor" strokeWidth="2.4" />
      <path d="M19 22H29" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M12 32C13.8 29.6 16.5 28 19.5 28H28.5C31.5 28 34.2 29.6 36 32" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const capabilityHighlights = [
  {
    icon: FieldExecutionIcon,
    title: "Field Execution",
    body: "Survey planning, mobilization discipline, and dependable crew coordination across demanding operating environments."
  },
  {
    icon: QualityControlIcon,
    title: "Quality Control",
    body: "Consistent QA/QC checkpoints that keep acquisition, recording, and reporting quality visible throughout delivery."
  },
  {
    icon: IntegratedSupportIcon,
    title: "Integrated Support",
    body: "Operational workflows that connect field teams, technical supervision, and interpretation support into one delivery rhythm."
  }
];

export default async function CapabilitiesPage() {
  const locale = await getCurrentSiteLocale();
  const content = await getPageContent("CAPABILITIES");
  const sections = getPageSectionsInput("CAPABILITIES", content?.sectionsJson, locale);
  const titleHtml = sanitizeRichText(sections.title, "title");
  const bodyHtml = sanitizeRichText(
    sections.body ?? (locale === "ar"
      ? "<p>من تخطيط الاكتساب إلى التفسير المتكامل، تجمع فرقنا بين التنفيذ الميداني والتحليل الفني المنهجي.</p>"
      : "<p>From acquisition planning to integrated interpretation, our teams combine field execution with robust analytical workflows.</p>"),
    "block"
  );

  return (
    <div className="container-page py-10 md:py-12 lg:py-16">
      <section className="nageco-panel relative overflow-hidden px-5 py-6 md:px-8 md:py-8 lg:px-10 lg:py-10">
        <div className="nageco-gridline pointer-events-none absolute inset-0 opacity-50" />
        <div className="pointer-events-none absolute -right-20 top-8 h-56 w-56 rounded-full bg-brand-500/10 blur-3xl" />
        <div className="pointer-events-none absolute -left-16 bottom-0 h-48 w-48 rounded-full bg-sky-300/20 blur-3xl" />

        <div className="relative space-y-6 xl:space-y-7">
          <div className="space-y-3">
            <span className="nageco-overline">Operational Capabilities</span>
            <h1 className="max-w-4xl text-3xl font-black tracking-tight text-black md:text-4xl lg:text-5xl" dangerouslySetInnerHTML={{ __html: titleHtml || (locale === "ar" ? "القدرات" : "Capabilities") }} />
            <p className="max-w-3xl text-sm leading-7 text-slate-600 md:text-base">
              A clearer editorial layout for long-form operational content, built to keep dense technical text readable and structured.
            </p>
            <div className="flex flex-wrap gap-3 pt-1">
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-700/10 bg-white/78 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700 shadow-[0_14px_32px_-24px_rgba(15,39,71,0.28)]">
                <FieldExecutionIcon />
                Field Ready
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-700/10 bg-white/78 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700 shadow-[0_14px_32px_-24px_rgba(15,39,71,0.28)]">
                <QualityControlIcon />
                QA/QC Driven
              </span>
              <span className="inline-flex items-center gap-2 rounded-full border border-brand-700/10 bg-white/78 px-3 py-2 text-xs font-extrabold uppercase tracking-[0.18em] text-brand-700 shadow-[0_14px_32px_-24px_rgba(15,39,71,0.28)]">
                <IntegratedSupportIcon />
                Integrated Teams
              </span>
            </div>
          </div>

          <div className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_22rem] xl:items-start">
            <div
              className="nageco-capabilities-article rounded-[1.7rem] border border-brand-700/10 bg-white/78 p-5 shadow-[0_24px_60px_-42px_rgba(15,39,71,0.32)] backdrop-blur-md md:p-7 lg:p-8"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />

          <aside className="space-y-4 xl:sticky xl:top-24">
            <div className="rounded-[1.6rem] border border-brand-700/12 bg-gradient-to-br from-brand-700 to-slate-900 p-5 text-white shadow-[0_30px_70px_-40px_rgba(15,39,71,0.75)] md:p-6">
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-sky-200">Capability Lens</p>
              <h2 className="mt-3 text-2xl font-black leading-tight">Seismic capability here means disciplined field execution, visible QA/QC, and reliable delivery under operating pressure.</h2>
              <p className="mt-4 text-sm leading-7 text-white/74">
                From survey planning and crew mobilization to acquisition control and reporting clarity, the focus is on keeping data quality, safety discipline, and operational continuity measurable throughout the job.
              </p>
            </div>

            <div className="relative overflow-hidden rounded-[1.6rem] border border-brand-700/12 bg-white shadow-[0_30px_70px_-40px_rgba(15,39,71,0.38)]">
              <div className="relative h-64 w-full md:h-72 xl:h-80">
                <Image src="/DSC08351.JPG" alt="NAGECO field operations" fill className="object-cover" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-900/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                  <div className="rounded-[1.1rem] border border-white/15 bg-black/20 px-4 py-3 text-white backdrop-blur-md">
                    <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-white/70">Field Visual</p>
                    <p className="mt-1 text-sm font-semibold leading-relaxed">Live operational environment supporting NAGECO capability delivery.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-3">
              {capabilityHighlights.map((item, index) => (
                <div key={item.title} className="rounded-[1.35rem] border border-brand-700/10 bg-white/82 p-4 shadow-[0_20px_44px_-36px_rgba(15,39,71,0.26)] backdrop-blur-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-brand-700/12 bg-brand-500/8 text-brand-700 shadow-[0_14px_28px_-22px_rgba(31,115,221,0.35)]">
                      <item.icon />
                    </span>
                    <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-brand-500">0{index + 1}</p>
                  </div>
                  <h3 className="mt-2 text-lg font-bold text-black">{item.title}</h3>
                  <p className="mt-2 text-sm leading-7 text-slate-600">{item.body}</p>
                </div>
              ))}
            </div>
          </aside>
          </div>
        </div>
      </section>
    </div>
  );
}