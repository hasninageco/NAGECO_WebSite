import { getPageContent } from "@/lib/public-data";
import { sanitizeRichText } from "@/lib/rich-text";
import { CareerApplicationForm } from "@/components/public/CareerApplicationForm";
import { getPublishedCareerVacancies } from "@/lib/career-vacancies";
import { CareerVacanciesBoard } from "@/components/public/CareerVacanciesBoard";
import { getCurrentSiteLocale } from "@/lib/site-locale";
import { getPageSectionsInput } from "@/lib/page-content";

export const dynamic = "force-dynamic";

export default async function CareerPage() {
  const locale = await getCurrentSiteLocale();
  const [content, vacancies] = await Promise.all([getPageContent("CAREER"), getPublishedCareerVacancies()]);
  const sections = getPageSectionsInput("CAREER", content?.sectionsJson, locale);
  const titleHtml = sanitizeRichText(sections.title, "title");
  const bodyHtml = sanitizeRichText(
    sections.body ?? (locale === "ar"
      ? "<p>اكتشف فرص العمل في ناجيكو ضمن العمليات الميدانية والخدمات الفنية وإدارة المشاريع والدعم المؤسسي.</p>"
      : "<p>Explore career opportunities with NAGECO across field operations, technical services, project delivery, and business support.</p>"),
    "block"
  );

  return (
    <div className="container-page py-10">
      <section className="card space-y-3">
        <h1 className="text-3xl font-bold" dangerouslySetInnerHTML={{ __html: titleHtml || (locale === "ar" ? "الوظائف" : "Career") }} />
        <div
          className="text-slate-700 [&_a]:font-semibold [&_a]:text-brand-700 [&_a]:underline [&_li]:ml-6 [&_li]:list-disc [&_p]:mt-2 [&_p]:leading-7 [&_ul]:space-y-2"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </section>

      <CareerVacanciesBoard vacancies={vacancies} locale={locale} />
      <CareerApplicationForm />
    </div>
  );
}