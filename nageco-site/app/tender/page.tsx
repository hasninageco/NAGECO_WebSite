import Link from "next/link";
import Image from "next/image";
import { pickLocalizedText } from "@/lib/localized";
import { normalizeMediaUrl } from "@/lib/media-url";
import { getPublishedTenders } from "@/lib/public-data";
import { getCurrentSiteLocale } from "@/lib/site-locale";

export const dynamic = "force-dynamic";

export default async function TenderPage() {
  const locale = await getCurrentSiteLocale();
  const tenders = await getPublishedTenders();

  return (
    <div className="container-page py-10">
      <div className="mb-6 grid gap-3 md:grid-cols-2">
        <article className="card py-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-500">{locale === "ar" ? "القسم" : "Section"}</p>
          <h1 className="mt-1 text-3xl font-bold">{locale === "ar" ? "العطاءات" : "Tender"}</h1>
        </article>
        <article className="card py-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-500">{locale === "ar" ? "نظرة عامة" : "Overview"}</p>
          <p className="mt-1 text-sm text-black/72">
            {locale === "ar" ? "أحدث العطاءات المنشورة مع المستندات المرتبطة." : "Latest published tenders with related documents."}
          </p>
        </article>
      </div>

      {tenders.length === 0 ? (
        <article className="card">
          <p className="text-sm text-black/70">{locale === "ar" ? "لا توجد عطاءات منشورة حالياً." : "No published tenders yet."}</p>
        </article>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {tenders.map((tender) => {
            const localizedTender = tender as typeof tender & { titleAr?: string | null; summaryAr?: string | null };
            const title = pickLocalizedText(locale, tender.title, localizedTender.titleAr);
            const summary = pickLocalizedText(locale, tender.summary, localizedTender.summaryAr);
            const images = tender.imageUrls.map((image) => normalizeMediaUrl(image)).filter((image): image is string => Boolean(image));
            const documents = tender.documentUrls.map((doc) => normalizeMediaUrl(doc) ?? doc).filter((doc): doc is string => Boolean(doc));
            return (
              <article key={tender.id} className="card flex h-full flex-col">
                {images.length > 0 ? (
                  <div className="mb-4 grid grid-cols-2 gap-2">
                    <div className="relative col-span-2 h-40 w-full overflow-hidden rounded-xl border border-brand-700/15">
                      <Image src={images[0]} alt={title} fill className="object-fill" />
                    </div>
                    {images.slice(1, 3).map((image, index) => (
                      <div key={`${image}-${index}`} className="relative h-24 w-full overflow-hidden rounded-xl border border-brand-700/15">
                        <Image src={image} alt={`${title} ${index + 2}`} fill className="object-fill" />
                      </div>
                    ))}
                  </div>
                ) : null}

                <h2 className="text-lg font-bold text-black">{title}</h2>
                <p className="mt-2 text-sm leading-relaxed text-black/72">{summary}</p>

                <div className="mt-4">
                  {documents.length > 0 ? (
                    <div className="flex flex-wrap gap-2">
                      {documents.map((documentUrl, index) => (
                        <Link key={`${documentUrl}-${index}`} href={documentUrl} target="_blank" rel="noreferrer" className="btn-secondary inline-flex rounded-full">
                          {locale === "ar" ? `مستند ${index + 1}` : `Document ${index + 1}`}
                        </Link>
                      ))}
                    </div>
                  ) : (
                    <span className="text-sm text-slate-400">{locale === "ar" ? "لا توجد مستندات مرفوعة" : "No document uploaded"}</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
