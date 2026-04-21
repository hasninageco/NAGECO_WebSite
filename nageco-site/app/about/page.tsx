import type { Metadata } from "next";
import Image from "next/image";
import { InlineBrandLogo } from "@/components/BrandLogo";
import { getPageSectionsInput } from "@/lib/page-content";
import { getPageContent } from "@/lib/public-data";
import { sanitizeRichText } from "@/lib/rich-text";
import { normalizeMediaUrl } from "@/lib/media-url";
import { getCurrentSiteLocale } from "@/lib/site-locale";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "About | NAGECO"
};

export default async function AboutPage() {
  const locale = await getCurrentSiteLocale();
  const content = await getPageContent("ABOUT");
  const sections = getPageSectionsInput("ABOUT", content?.sectionsJson, locale);
  const fallbackBody = locale === "ar"
    ? "<p>يقدم فريق الاستكشاف الجيوفيزيائي لدينا رؤى عملية وثقة فنية تدعم قرارات مشاريع الطاقة والبنية التحتية.</p>"
    : "<p>Our geophysical exploration team delivers practical insights and technical confidence for upstream and infrastructure decisions.</p>";
  const sanitizedTitle = sanitizeRichText(sections.title, "title");
  const sanitizedBody = sanitizeRichText(sections.body ?? fallbackBody, "block");
  const heroImageUrl = normalizeMediaUrl(sections.heroImageUrl) ?? "/DSC08351.JPG";
  const featureImageUrl = normalizeMediaUrl(sections.featureImageUrl) ??
    "/uploads/1773139602969-f2453df7-9b54-46a2-866e-9405a1b4f71e.JPG";

  return (
    <div className="container-page py-8 md:py-14">
      <section className="nageco-panel relative overflow-hidden rounded-3xl border border-brand-700/20 bg-white/90 p-6 shadow-2xl shadow-brand-700/10 backdrop-blur-sm md:p-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-brand-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-14 h-44 w-44 rounded-full bg-brand-700/10 blur-3xl" />
        <div className="pointer-events-none absolute right-10 top-8 text-brand-500/30 nageco-dots" />

        <div className="relative grid gap-6 xl:grid-cols-[minmax(0,1.05fr)_minmax(320px,0.95fr)] xl:items-start">
          <div className="space-y-5">
            <h1 className="relative flex flex-wrap items-center gap-3 text-4xl font-black tracking-tight text-slate-900 md:text-5xl">
              {sanitizedTitle ? <span dangerouslySetInnerHTML={{ __html: sanitizedTitle }} /> : <span>{locale === "ar" ? "من نحن" : "About"}</span>}
              {!sections.title && <InlineBrandLogo className="w-28 md:w-32" />}
            </h1>
            <p className="relative max-w-3xl text-base leading-7 text-slate-600 md:text-lg text-justify">
              {locale === "ar"
                ? "نجمع بين الخبرة المحلية والانضباط التشغيلي والموثوقية الفنية لدعم العملاء في المشاريع الجيوفيزيائية والطاقة."
                : "We combine local expertise, operational reliability, and technical discipline to support clients across geophysical and energy projects."}
            </p>

            <div
              className="relative rounded-2xl border border-brand-700/15 bg-white/90 p-4 text-slate-700 shadow-inner shadow-brand-700/5 md:p-6 [&_a]:font-semibold [&_a]:text-brand-700 [&_a]:underline [&_blockquote]:rounded-xl [&_blockquote]:border-l-4 [&_blockquote]:border-brand-500/60 [&_blockquote]:bg-brand-500/5 [&_blockquote]:px-4 [&_blockquote]:py-3 [&_h2]:mb-4 [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-slate-900 [&_h3]:mt-7 [&_h3]:text-xl [&_h3]:font-bold [&_h3]:text-brand-700 [&_li]:ml-6 [&_li]:list-disc [&_ol]:space-y-2 [&_p]:mt-3 [&_p]:text-lg [&_p]:leading-8 [&_p]:text-justify [&_ul]:space-y-2"
              dangerouslySetInnerHTML={{ __html: sanitizedBody }}
            />
          </div>

          <div className="space-y-4 xl:mt-16 xl:pt-2">
            <div className="relative overflow-hidden rounded-[1.6rem] border border-brand-700/12 bg-white shadow-[0_30px_70px_-40px_rgba(15,39,71,0.38)]">
              <div className="relative h-56 w-full md:h-72 xl:h-[20rem]">
                <Image src={heroImageUrl} alt="About NAGECO" fill className="object-cover object-center" sizes="(max-width: 1280px) 100vw, 40vw" />
                <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-950/55 via-slate-900/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                  <div className="rounded-[1.1rem] border border-white/15 bg-black/20 px-4 py-3 text-white backdrop-blur-md">
                    <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-white/70">Company Visual</p>
                    <p className="mt-1 text-sm font-semibold leading-relaxed">Field operations and subsurface workflows that define our practice.</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-[1.6rem] border border-brand-700/12 bg-white shadow-[0_30px_70px_-40px_rgba(15,39,71,0.38)]">
              <div className="relative h-56 w-full md:h-72 xl:h-[20rem]">
                <Image src={featureImageUrl} alt="NAGECO team and operations" fill className="object-cover object-center" sizes="(max-width: 1280px) 100vw, 32vw" />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(15,23,42,0.08),rgba(15,23,42,0.65))]" />
                <div className="absolute inset-x-0 bottom-0 p-4 md:p-5">
                  <div className="rounded-[1.1rem] border border-white/15 bg-black/20 px-4 py-3 text-white backdrop-blur-md">
                    <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.24em] text-white/70">Second Visual</p>
                    <p className="mt-1 text-sm font-semibold leading-relaxed">Imagery that reinforces our mission and client focus.</p>
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