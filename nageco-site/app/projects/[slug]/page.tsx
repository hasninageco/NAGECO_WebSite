import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import { pickLocalizedText } from "@/lib/localized";
import { normalizeMediaUrl } from "@/lib/media-url";
import { getPublishedProjectBySlug } from "@/lib/public-data";
import { getCurrentSiteLocale } from "@/lib/site-locale";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const locale = await getCurrentSiteLocale();
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) {
    return {};
  }

  const localizedProject = project as typeof project & {
    titleAr?: string | null;
    summaryAr?: string | null;
  };
  const title = pickLocalizedText(locale, project.title, localizedProject.titleAr);
  const summary = pickLocalizedText(locale, project.summary, localizedProject.summaryAr);

  const metadataImage = normalizeMediaUrl(project.coverImageUrl);

  return {
    title: `${title} | NAGECO`,
    description: summary,
    openGraph: {
      title,
      description: summary,
      images: metadataImage ? [metadataImage] : []
    }
  };
}

export default async function ProjectDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const locale = await getCurrentSiteLocale();
  const { slug } = await params;
  const project = await getPublishedProjectBySlug(slug);
  if (!project) {
    notFound();
  }

  const localizedProject = project as typeof project & {
    titleAr?: string | null;
    summaryAr?: string | null;
    challengeAr?: string | null;
    approachAr?: string | null;
    outcomeAr?: string | null;
  };
  const title = pickLocalizedText(locale, project.title, localizedProject.titleAr);
  const summary = pickLocalizedText(locale, project.summary, localizedProject.summaryAr);
  const challenge = pickLocalizedText(locale, project.challenge, localizedProject.challengeAr);
  const approach = pickLocalizedText(locale, project.approach, localizedProject.approachAr);
  const outcome = pickLocalizedText(locale, project.outcome, localizedProject.outcomeAr);

  const coverImage = normalizeMediaUrl(project.coverImageUrl);
  const galleryImages = project.gallery.map((imageUrl) => normalizeMediaUrl(imageUrl)).filter((imageUrl): imageUrl is string => Boolean(imageUrl));

  return (
    <div className="container-page py-10">
      <article className="card space-y-4">
        {coverImage && (
          <div className="relative h-64 w-full overflow-hidden rounded-xl border border-brand-700/15 md:h-80">
            <Image src={coverImage} alt={title} fill className="object-fill" />
          </div>
        )}
        <h1 className="text-3xl font-bold">{title}</h1>
        <p>{summary}</p>
        {challenge && (
          <section>
            <h2 className="text-lg font-semibold">{locale === "ar" ? "التحدي" : "Challenge"}</h2>
            <p>{challenge}</p>
          </section>
        )}
        {approach && (
          <section>
            <h2 className="text-lg font-semibold">{locale === "ar" ? "المنهجية" : "Approach"}</h2>
            <p>{approach}</p>
          </section>
        )}
        {outcome && (
          <section>
            <h2 className="text-lg font-semibold">{locale === "ar" ? "النتيجة" : "Outcome"}</h2>
            <p>{outcome}</p>
          </section>
        )}

        {galleryImages.length > 0 && (
          <section className="space-y-3">
            <h2 className="text-lg font-semibold">{locale === "ar" ? "المعرض" : "Gallery"}</h2>
            <div className="grid gap-3 md:grid-cols-2">
              {galleryImages.map((imageUrl, index) => (
                <div key={`${imageUrl}-${index}`} className="relative h-56 overflow-hidden rounded-xl border border-brand-700/15">
                  <Image src={imageUrl} alt={`${title} ${locale === "ar" ? "صورة" : "image"} ${index + 1}`} fill className="object-fill" />
                </div>
              ))}
            </div>
          </section>
        )}
      </article>
    </div>
  );
}