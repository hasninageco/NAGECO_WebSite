import { getPageContent } from "@/lib/public-data";
import { sanitizeRichText } from "@/lib/rich-text";
import { getCurrentSiteLocale } from "@/lib/site-locale";
import { getPageSectionsInput } from "@/lib/page-content";

export const dynamic = "force-dynamic";

export default async function TermsPage() {
  const locale = await getCurrentSiteLocale();
  const content = await getPageContent("TERMS");
  const sections = getPageSectionsInput("TERMS", content?.sectionsJson, locale);
  const titleHtml = sanitizeRichText(sections.title, "title");
  const bodyHtml = sanitizeRichText(
    sections.body ?? (locale === "ar"
      ? "<p>توضح هذه الشروط أحكام استخدام الموقع ومبادئ التعامل مع خدماتنا.</p>"
      : "<p>These terms define website use and service engagement principles.</p>"),
    "block"
  );

  return (
    <div className="container-page py-10">
      <article className="card space-y-4">
        <h1 className="text-3xl font-bold" dangerouslySetInnerHTML={{ __html: titleHtml || (locale === "ar" ? "شروط الاستخدام" : "Terms of Use") }} />
        <div
          className="text-slate-700 [&_a]:font-semibold [&_a]:text-brand-700 [&_a]:underline [&_li]:ml-6 [&_li]:list-disc [&_p]:mt-2 [&_ul]:space-y-2"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </article>
    </div>
  );
}
