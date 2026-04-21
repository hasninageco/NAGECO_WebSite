import Image from "next/image";
import { getPageSectionsInput } from "@/lib/page-content";
import { getPageContent } from "@/lib/public-data";
import { getSiteSettings } from "@/lib/public-data";
import { sanitizeRichText } from "@/lib/rich-text";
import { normalizeMediaUrl } from "@/lib/media-url";
import { getCurrentSiteLocale } from "@/lib/site-locale";

export const dynamic = "force-dynamic";

export default async function PartnerPage() {
  const locale = await getCurrentSiteLocale();
  const [content, settings] = await Promise.all([getPageContent("PARTNER"), getSiteSettings()]);
  const sections = getPageSectionsInput("PARTNER", content?.sectionsJson, locale);
  const socialLinks =
    settings?.socialLinksJson && typeof settings.socialLinksJson === "object"
      ? (settings.socialLinksJson as Record<string, unknown>)
      : {};

  const partnerLogos = Array.isArray(socialLinks.partnerLogos)
    ? socialLinks.partnerLogos
        .filter((item): item is string => typeof item === "string")
        .map((item) => normalizeMediaUrl(item))
        .filter((item): item is string => !!item)
    : [];

  const titleHtml = sanitizeRichText(sections.title, "title");
  const bodyHtml = sanitizeRichText(
    sections.body ?? (locale === "ar"
      ? "<p>تعرف كيف تتعاون ناجيكو مع العملاء والمقاولين والشركاء الاستراتيجيين لتقديم تنفيذ جيوفيزيائي موثوق.</p>"
      : "<p>Learn how NAGECO collaborates with clients, contractors, and strategic partners to deliver reliable geophysical execution.</p>"),
    "block"
  );
  const headingHtml = titleHtml ? (locale === "en" ? titleHtml.replace(/partner/gi, "Clients") : titleHtml) : (locale === "ar" ? "العملاء" : "Clients");

  const midpoint = Math.ceil(partnerLogos.length / 2);
  const firstRowLogos = partnerLogos.slice(0, midpoint);
  const secondRowLogos = partnerLogos.slice(midpoint);

  return (
    <div className="container-page py-10 md:py-14">
      <section className="relative overflow-hidden rounded-[1.6rem] bg-[linear-gradient(180deg,rgba(255,255,255,0.93),rgba(248,251,255,0.88))] p-5 shadow-[0_34px_78px_-42px_rgba(15,39,71,0.34)] md:p-8">
        <h1 className="relative text-center text-3xl font-black tracking-tight text-slate-900 md:text-5xl" dangerouslySetInnerHTML={{ __html: headingHtml }} />
        <div className="mx-auto mt-3 h-1 w-36 rounded-full bg-gradient-to-r from-cyan-500 to-brand-500" />
        <div
          className="relative mx-auto mt-3 max-w-3xl text-center text-[1.02rem] text-slate-700 [&_a]:font-semibold [&_a]:text-brand-700 [&_a]:underline [&_li]:ml-6 [&_li]:list-disc [&_p]:mt-2 [&_p]:leading-8 [&_ul]:space-y-2"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />

        {partnerLogos.length === 0 ? (
          <div className="relative mx-auto mt-8 max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-center text-sm font-medium text-amber-800">
            {locale === "ar" ? "لا توجد شعارات عملاء حالياً. أضف الشعارات من إعدادات الادمن." : "No partner logos found. Add logos from Admin Settings."}
          </div>
        ) : (
          <div className="relative mx-auto mt-10 max-w-[1160px]">
            <div className="rounded-[1.3rem]    bg-white/64 p-4 shadow-[0_28px_64px_-34px_rgba(15,39,71,0.3)] md:p-6">
              <div className="space-y-3 md:space-y-4">
                <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
                  {firstRowLogos.map((logo, index) => (
                    <article
                      key={`${logo}-${index}`}
                      className="group relative h-[180px] w-[170px] overflow-hidden rounded-sm border border-slate-200 bg-white shadow-[0_10px_24px_-18px_rgba(15,39,71,0.22)] transition-shadow duration-300 hover:shadow-[0_18px_36px_-20px_rgba(15,39,71,0.28)]"
                    >
                      <div className="relative h-full w-full p-4">
                        <Image src={logo} alt={`Partner logo ${index + 1}`} fill className="object-contain p-4 transition-transform duration-300 group-hover:scale-105" sizes="170px" />
                      </div>
                    </article>
                  ))}
                </div>

                {secondRowLogos.length > 0 && (
                  <div className="flex flex-wrap items-center justify-center gap-3 md:gap-4">
                    {secondRowLogos.map((logo, index) => (
                      <article
                        key={`${logo}-${midpoint + index}`}
                        className="group relative h-[150px] w-[170px] overflow-hidden rounded-sm border border-slate-200 bg-white shadow-[0_10px_24px_-18px_rgba(15,39,71,0.22)] transition-shadow duration-300 hover:shadow-[0_18px_36px_-20px_rgba(15,39,71,0.28)]"
                      >
                        <div className="relative h-full w-full p-4">
                          <Image src={logo} alt={`Partner logo ${midpoint + index + 1}`} fill className="object-contain p-4 transition-transform duration-300 group-hover:scale-105" sizes="170px" />
                        </div>
                      </article>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
