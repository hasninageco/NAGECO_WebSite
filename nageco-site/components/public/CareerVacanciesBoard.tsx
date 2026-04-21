"use client";

import Link from "next/link";
import type { CareerVacancy } from "@/lib/career-vacancies";
import { pickLocalizedText } from "@/lib/localized";
import type { SiteLocale } from "@/lib/site-locale";

type CareerVacanciesBoardProps = {
  vacancies: CareerVacancy[];
  locale: SiteLocale;
};

export function CareerVacanciesBoard({ vacancies, locale }: CareerVacanciesBoardProps) {
  function openApplicationForm(subject?: string) {
    window.dispatchEvent(new CustomEvent("nageco:open-career-form", { detail: { subject: subject || "" } }));
  }

  function getPreview(details: string) {
    const normalized = details.replace(/\s+/g, " ").trim();
    if (normalized.length <= 180) return normalized;
    return `${normalized.slice(0, 180)}...`;
  }

  return (
    <section className="mt-8 space-y-4 md:mt-10">
      <div className="card space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <h2 className="text-2xl font-black text-slate-900">{locale === "ar" ? "الوظائف الشاغرة" : "Vacancy Jobs"}</h2>
          <span className="rounded-full border border-brand-700/20 bg-brand-700/10 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-brand-700">
            {vacancies.length} {locale === "ar" ? "فرصة" : "Openings"}
          </span>
        </div>

        {vacancies.length === 0 ? (
          <div className="rounded-2xl border border-slate-200 bg-white/80 p-4 text-sm text-slate-600">
            {locale === "ar"
              ? "لا توجد وظائف نشطة حالياً. يمكنك إرسال سيرتك الذاتية للفرص القادمة."
              : "No active vacancies at the moment. You can still submit your CV for future opportunities."}
            <button
              type="button"
              className="btn-primary ml-3 rounded-xl px-4 py-2 text-xs"
              onClick={() => openApplicationForm()}
            >
              {locale === "ar" ? "أضف سيرتك الذاتية" : "Add Your CV"}
            </button>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {vacancies.map((vacancy) => (
              <article key={vacancy.id} className="rounded-2xl border border-brand-700/12 bg-white/85 p-4 shadow-[0_20px_56px_-40px_rgba(15,39,71,0.4)]">
                <h3 className="text-lg font-bold text-slate-900">{pickLocalizedText(locale, vacancy.subject, vacancy.subjectAr)}</h3>
                <p className="mt-2 text-sm leading-7 text-slate-600">{getPreview(pickLocalizedText(locale, vacancy.details, vacancy.detailsAr))}</p>

                <div className="mt-4 flex flex-wrap items-center gap-2">
                  <Link href={`/career/vacancies/${vacancy.id}`} className="btn-secondary rounded-xl px-4 py-2 text-xs font-semibold">
                    {locale === "ar" ? "المزيد من التفاصيل" : "More Details"}
                  </Link>

                  <button
                    type="button"
                    className="btn-primary rounded-xl px-4 py-2"
                    onClick={() => openApplicationForm(pickLocalizedText(locale, vacancy.subject, vacancy.subjectAr))}
                  >
                    {locale === "ar" ? "أضف سيرتك الذاتية" : "Add Your CV"}
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}
