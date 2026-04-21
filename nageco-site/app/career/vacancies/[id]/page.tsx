import Link from "next/link";
import { notFound } from "next/navigation";
import { CareerApplicationForm } from "@/components/public/CareerApplicationForm";
import { OpenCareerFormButton } from "@/components/public/OpenCareerFormButton";
import { getPublishedCareerVacancyById } from "@/lib/career-vacancies";
import { pickLocalizedText } from "@/lib/localized";
import { getCurrentSiteLocale } from "@/lib/site-locale";

export const dynamic = "force-dynamic";

export default async function VacancyDetailsPage({ params }: { params: Promise<{ id: string }> }) {
  const locale = await getCurrentSiteLocale();
  const { id } = await params;
  const vacancy = await getPublishedCareerVacancyById(id);

  if (!vacancy) {
    notFound();
  }

  const title = pickLocalizedText(locale, vacancy.subject, vacancy.subjectAr);
  const details = pickLocalizedText(locale, vacancy.details, vacancy.detailsAr);

  return (
    <div className="container-page py-10">
      <section className="card space-y-4">
        <Link href="/career" className="text-sm font-semibold text-brand-700 hover:underline">
          {locale === "ar" ? "الرجوع إلى الوظائف" : "Back to Career"}
        </Link>

        <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-4xl">{title}</h1>

        <div className="rounded-2xl border border-brand-700/12 bg-white/85 p-4 md:p-6">
          <p className="whitespace-pre-wrap text-sm leading-8 text-slate-700 md:text-base">{details}</p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <OpenCareerFormButton
            subject={title}
            className="btn-primary rounded-xl px-5 py-3"
            label={locale === "ar" ? "أضف سيرتك الذاتية" : "Add Your CV"}
          />
          <Link href="/career" className="btn-secondary rounded-xl px-5 py-3">
            {locale === "ar" ? "عرض كل الوظائف" : "View All Vacancies"}
          </Link>
        </div>
      </section>

      <CareerApplicationForm />
    </div>
  );
}
