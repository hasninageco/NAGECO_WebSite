import { getPageContent } from "@/lib/public-data";
import Image from "next/image";
import { normalizeMediaUrl } from "@/lib/media-url";
import { sanitizeRichText } from "@/lib/rich-text";
import { getCurrentSiteLocale } from "@/lib/site-locale";
import { getPageSectionsInput } from "@/lib/page-content";

export const dynamic = "force-dynamic";

export default async function HsePage() {
  const locale = await getCurrentSiteLocale();
  const impactMetrics = [
    { value: "20+", label: "Years of operational experience" },
    { value: "100+", label: "Projects executed with disciplined delivery" },
    { value: "3M+", label: "Work hours without accident" }
  ];

  const content = await getPageContent("HSE");
  const sections = getPageSectionsInput("HSE", content?.sectionsJson, locale);
  const pickText = (value: string | undefined, fallback: string) => {
    const normalized = (value ?? "").trim();
    return normalized.length > 0 ? normalized : fallback;
  };
  const titleHtml = sanitizeRichText(pickText(sections.title, locale === "ar" ? "الصحة والسلامة والبيئة" : "Health, Safety & Environment"), "title");
  const subtitleHtml = sanitizeRichText(
    pickText(
      sections.subtitle,
      locale === "ar"
        ? "<p>تميز تشغيلي من خلال سلامة الأفراد، وانضباط العمليات، والمسؤولية البيئية.</p>"
        : "<p>Operational excellence through people safety, process integrity, and environmental stewardship.</p>"
    ),
    "block"
  );
  const bodyHtml = sanitizeRichText(
    pickText(
      sections.body,
      locale === "ar"
        ? "<p>تعمل ناجيكو وفق إطار صارم للصحة والسلامة والبيئة يعتمد على التخطيط المبني على المخاطر، ومنع الحوادث، والتحسين المستمر.</p>"
        : "<p>NAGECO operates under a strict HSE framework with risk-based planning, incident prevention, and continuous improvement.</p>"
    ),
    "block"
  );
  const heroImage = normalizeMediaUrl(sections.heroImageUrl);
  const featureImage = normalizeMediaUrl(sections.featureImageUrl);
  const panelImage = normalizeMediaUrl(sections.panelImageUrl);

  return (
    <div className="container-page py-8 md:py-10">
      <section className="overflow-hidden rounded-[2rem] border border-red-400/35 bg-gradient-to-br from-red-50 via-amber-50 to-white shadow-[0_30px_70px_-42px_rgba(220,38,38,0.45)]">
        <div className="h-3 w-full bg-[repeating-linear-gradient(135deg,#111827_0px,#111827_16px,#facc15_16px,#facc15_32px)]" />
        <div className="grid gap-0 lg:grid-cols-[1.05fr_0.95fr]">
          <div className="relative min-h-[260px] bg-red-950/[0.65] p-6 text-white md:min-h-[320px] md:p-8">
            {heroImage && (
              <Image
                src={heroImage}
                alt="HSE hero"
                fill
                className="object-cover opacity-30"
                sizes="(min-width: 1024px) 50vw, 100vw"
              />
            )}
            <div className="absolute inset-0 bg-[linear-gradient(130deg,rgba(127,29,29,0.65),rgba(153,27,27,0.5))]" />
            <div className="relative z-10 space-y-4">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-200/45 bg-amber-300/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.14em] text-amber-100">
                HSE Alert Zone
              </span>
              <h1
                className="text-[1.7rem] font-black leading-tight drop-shadow-[0_2px_10px_rgba(0,0,0,0.4)] md:text-[2rem]"
                dangerouslySetInnerHTML={{ __html: titleHtml || "Health, Safety & Environment" }}
              />
              <div
                className="max-w-2xl text-xs leading-relaxed text-red-50/95 md:text-[13px] [&_p]:mt-2 [&_p]:leading-6"
                dangerouslySetInnerHTML={{ __html: subtitleHtml }}
              />
              <div className="grid gap-2 sm:grid-cols-3">
                {impactMetrics.map((metric) => (
                  <div key={metric.label} className="rounded-xl border border-amber-200/40 bg-black/25 px-3 py-2">
                    <p className="text-[10px] font-bold uppercase tracking-[0.16em] text-amber-200/90">Achievement</p>
                    <p className="mt-1 text-xl font-black leading-none text-white">{metric.value}</p>
                    <p className="mt-1 text-[11px] leading-snug text-red-100/95">{metric.label}</p>
                  </div>
                ))}
              </div>
              <div className="grid gap-2 text-sm sm:grid-cols-3">
                <div className="rounded-xl border border-amber-200/35 bg-black/20 px-3 py-2">
                  <p className="font-semibold">🛡️ Safety First</p>
                </div>
                <div className="rounded-xl border border-amber-200/35 bg-black/20 px-3 py-2">
                  <p className="font-semibold">🌱 Environment</p>
                </div>
                <div className="rounded-xl border border-amber-200/35 bg-black/20 px-3 py-2">
                  <p className="font-semibold">⚙️ Risk Control</p>
                </div>
              </div>

              <div className="rounded-2xl border border-amber-200/40 bg-black/25 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-[0.16em] text-amber-200/90">Emergency Line</p>
                <p className="mt-1 text-lg font-extrabold">00218 21 563 4670 / 4</p>
                <p className="text-xs text-red-100/90">Report incidents immediately and follow site supervisor instructions.</p>
              </div>

              <div className="grid gap-2 text-xs sm:grid-cols-3">
                <div className="rounded-xl border border-red-200/35 bg-red-900/35 px-3 py-2">
                  <p className="font-semibold text-amber-100">Daily Toolbox Talks</p>
                </div>
                <div className="rounded-xl border border-red-200/35 bg-red-900/35 px-3 py-2">
                  <p className="font-semibold text-amber-100">PPE Compliance Checks</p>
                </div>
                <div className="rounded-xl border border-red-200/35 bg-red-900/35 px-3 py-2">
                  <p className="font-semibold text-amber-100">Permit To Work Control</p>
                </div>
              </div>

              {panelImage ? (
                <div className="relative overflow-hidden rounded-2xl border border-amber-200/45 bg-black/20">
                  <Image
                    src={panelImage}
                    alt="HSE panel"
                    width={1200}
                    height={700}
                    className="block h-[170px] w-full object-cover md:h-[190px]"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
                </div>
              ) : null}
            </div>
          </div>

          <div className="space-y-5 p-6 md:p-8">
            <div className="h-2 w-full rounded-full bg-[repeating-linear-gradient(135deg,#111827_0px,#111827_12px,#facc15_12px,#facc15_24px)]" />
            {featureImage ? (
              <div className="relative overflow-hidden rounded-2xl border border-red-200/70 bg-amber-50">
                <Image src={featureImage} alt="HSE feature" width={1200} height={700} className="block h-[210px] w-full object-cover md:h-[240px]" />
              </div>
            ) : null}
            <div
              className="rounded-2xl border border-red-200/70 bg-white/85 p-4 text-slate-800 [&_a]:font-semibold [&_a]:text-red-700 [&_a]:underline [&_li]:ml-6 [&_li]:list-disc [&_p]:mt-2 [&_p]:leading-7 [&_ul]:space-y-2"
              dangerouslySetInnerHTML={{ __html: bodyHtml }}
            />

          </div>
        </div>
      </section>
    </div>
  );
}
