import { getPageContent } from "@/lib/public-data";
import { sanitizeRichText } from "@/lib/rich-text";
import { ContactFeedbackForm } from "@/components/public/ContactFeedbackForm";
import { getCurrentSiteLocale } from "@/lib/site-locale";
import { getPageSectionsInput } from "@/lib/page-content";

export const dynamic = "force-dynamic";

export default async function ContactPage() {
  const locale = await getCurrentSiteLocale();
  const content = await getPageContent("CONTACT");
  const sections = getPageSectionsInput("CONTACT", content?.sectionsJson, locale);
  const notSetLabel = locale === "ar" ? "غير محدد" : "Not set";
  const pickText = (value: string | undefined, fallback: string) => {
    const normalized = (value ?? "").trim();
    return normalized.length > 0 ? normalized : fallback;
  };
  const titleHtml = sanitizeRichText(pickText(sections.title, locale === "ar" ? "اتصل بنا" : "Contact"), "title");
  const subtitleHtml = sanitizeRichText(
    pickText(sections.subtitle, locale === "ar" ? "تواصل مع فرقنا الفنية والتجارية." : "Get in touch with our technical and commercial teams."),
    "block"
  );
  const phones = pickText(sections.phones, notSetLabel);
  const emails = pickText(sections.emails, notSetLabel);
  const address = pickText(sections.address, notSetLabel);
  const whatsapp = pickText(sections.whatsapp, notSetLabel);
  const firstValue = (value: string) =>
    value
      .split("|")
      .map((item) => item.trim())
      .find((item) => item.length > 0 && item.toLowerCase() !== notSetLabel.toLowerCase()) ?? "";
  const primaryPhone = firstValue(phones);
  const primaryEmail = firstValue(emails);

  return (
    <div className="container-page py-8 md:py-10">
      <section className="overflow-hidden rounded-[1.75rem] border border-slate-200 bg-white/95 shadow-[0_24px_70px_-50px_rgba(15,23,42,0.45)]">
        <div className="h-1.5 w-full bg-gradient-to-r from-brand-700 via-brand-500 to-cyan-500" />

        <div className="space-y-6 p-6 md:p-8">
          <div className="space-y-3">
            <span className="inline-flex rounded-full border border-brand-200 bg-brand-50 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700">
              {locale === "ar" ? "مركز التواصل" : "Contact Center"}
            </span>
            <h1 className="text-4xl font-black leading-tight text-slate-900 md:text-5xl" dangerouslySetInnerHTML={{ __html: titleHtml || (locale === "ar" ? "اتصل بنا" : "Contact") }} />
            <div
              className="max-w-3xl text-sm leading-relaxed text-slate-700 md:text-[15px] [&_a]:font-semibold [&_a]:text-brand-700 [&_a]:underline [&_p]:mt-2 [&_p]:leading-7"
              dangerouslySetInnerHTML={{ __html: subtitleHtml }}
            />
          </div>

          <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-4">
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{locale === "ar" ? "الهواتف" : "Phones"}</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{phones}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{locale === "ar" ? "البريد الإلكتروني" : "Emails"}</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{emails}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">{locale === "ar" ? "العنوان" : "Address"}</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{address}</p>
            </div>
            <div className="rounded-2xl border border-slate-200 bg-slate-50 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-slate-500">واتساب</p>
              <p className="mt-2 text-base font-semibold text-slate-900">{whatsapp}</p>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 border-t border-slate-200 pt-5">
            {primaryPhone ? (
              <a href={`tel:${primaryPhone.replace(/\s+/g, "")}`} className="rounded-xl bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition hover:bg-brand-800">
                {locale === "ar" ? "اتصل الآن" : "Call Now"}
              </a>
            ) : null}
            {primaryEmail ? (
              <a href={`mailto:${primaryEmail}`} className="rounded-xl border border-brand-200 bg-white px-4 py-2 text-sm font-semibold text-brand-700 transition hover:bg-brand-50">
                {locale === "ar" ? "أرسل بريدًا" : "Send Email"}
              </a>
            ) : null}
            {whatsapp.toLowerCase() !== notSetLabel.toLowerCase() ? (
              <a href={`https://wa.me/${whatsapp.replace(/[^\d]/g, "")}`} className="rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-700 transition hover:bg-emerald-100">
                {locale === "ar" ? "دردشة واتساب" : "WhatsApp Chat"}
              </a>
            ) : null}
          </div>

          <div className="grid gap-4 border-t border-slate-200 pt-6 lg:grid-cols-[0.95fr_1.05fr]">
            <div className="rounded-2xl border border-brand-100 bg-brand-50/65 p-5">
              <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-brand-700">{locale === "ar" ? "تواصل ناجيكو" : "Contact NAGECO"}</p>
              <h2 className="mt-2 text-2xl font-black leading-tight text-slate-900">{locale === "ar" ? "الملاحظات والتواصل المباشر" : "Feedback & Direct Communication"}</h2>
              <p className="mt-2 text-sm leading-7 text-slate-700">
                {locale === "ar"
                  ? "شارك ملاحظاتك أو استفساراتك أو اطلب دعم مشروعك. فريقنا يراجع كل رسالة ويرد عبر بيانات التواصل التي تتركها."
                  : "Share your feedback, ask questions, or request project support. Our team reviews every message and replies through the contact details you provide."}
              </p>
              <div className="mt-4 space-y-2 text-sm text-slate-700">
                <p>
                  <span className="font-semibold text-slate-900">{locale === "ar" ? "زمن الرد:" : "Response time:"}</span> {locale === "ar" ? "خلال 1-2 يوم عمل" : "within 1-2 business days"}
                </p>
                <p>
                  <span className="font-semibold text-slate-900">{locale === "ar" ? "أفضل قناة:" : "Best channel:"}</span> {locale === "ar" ? "البريد للملفات، وواتساب للتنسيق السريع" : "Email for documents, WhatsApp for quick coordination"}
                </p>
              </div>
            </div>

            <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <ContactFeedbackForm />
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
