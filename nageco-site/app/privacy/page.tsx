import { getPageContent } from "@/lib/public-data";
import { sanitizeRichText } from "@/lib/rich-text";
import { getCurrentSiteLocale } from "@/lib/site-locale";
import { getPageSectionsInput } from "@/lib/page-content";

export const dynamic = "force-dynamic";

export default async function PrivacyPage() {
  const locale = await getCurrentSiteLocale();
  const content = await getPageContent("PRIVACY");
  const sections = getPageSectionsInput("PRIVACY", content?.sectionsJson, locale);
  const titleHtml = sanitizeRichText(sections.title, "title");
  const bodyHtml = sanitizeRichText(
    sections.body ?? (locale === "ar"
      ? "<p>توضح هذه الصفحة كيفية تعامل ناجيكو مع البيانات ووسائل التواصل.</p>"
      : "<p>This page describes how NAGECO handles data and communications.</p>"),
    "block"
  );

  return (
    <div className="container-page py-10">
      <article className="card space-y-4">
        <h1 className="text-3xl font-bold" dangerouslySetInnerHTML={{ __html: titleHtml || (locale === "ar" ? "سياسة الخصوصية" : "Privacy Policy") }} />
        <div
          className="text-slate-700 [&_a]:font-semibold [&_a]:text-brand-700 [&_a]:underline [&_li]:ml-6 [&_li]:list-disc [&_p]:mt-2 [&_ul]:space-y-2"
          dangerouslySetInnerHTML={{ __html: bodyHtml }}
        />
      </article>
    </div>
  );
}
