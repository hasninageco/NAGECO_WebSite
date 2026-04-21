import type { Metadata } from "next";
import Image from "next/image";
import { notFound } from "next/navigation";
import sanitizeHtml from "sanitize-html";
import { pickLocalizedText } from "@/lib/localized";
import { normalizeMediaUrl } from "@/lib/media-url";
import { getPublishedPostBySlug } from "@/lib/public-data";
import { getCurrentSiteLocale } from "@/lib/site-locale";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const locale = await getCurrentSiteLocale();
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) {
    return {};
  }

  const localizedPost = post as typeof post & {
    titleAr?: string | null;
    excerptAr?: string | null;
    seoTitleAr?: string | null;
    seoDescriptionAr?: string | null;
  };
  const title = pickLocalizedText(locale, post.title, localizedPost.titleAr);
  const excerpt = pickLocalizedText(locale, post.excerpt, localizedPost.excerptAr);
  const seoTitle = pickLocalizedText(locale, post.seoTitle, localizedPost.seoTitleAr, `${title} | NAGECO`);
  const seoDescription = pickLocalizedText(locale, post.seoDescription, localizedPost.seoDescriptionAr, excerpt);

  const ogImage = normalizeMediaUrl(post.ogImageUrl);
  const coverImage = normalizeMediaUrl(post.coverImageUrl);

  return {
    title: seoTitle,
    description: seoDescription,
    openGraph: {
      title: seoTitle,
      description: seoDescription,
      images: ogImage ? [ogImage] : coverImage ? [coverImage] : []
    }
  };
}

export default async function NewsDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const locale = await getCurrentSiteLocale();
  const { slug } = await params;
  const post = await getPublishedPostBySlug(slug);
  if (!post) {
    notFound();
  }

  const localizedPost = post as typeof post & {
    titleAr?: string | null;
    contentHtmlAr?: string | null;
  };
  const title = pickLocalizedText(locale, post.title, localizedPost.titleAr);
  const localizedContentHtml = pickLocalizedText(locale, post.contentHtml, localizedPost.contentHtmlAr, post.contentHtml);

  const coverImage = normalizeMediaUrl(post.coverImageUrl);

  const safeHtml = sanitizeHtml(localizedContentHtml, {
    allowedTags: sanitizeHtml.defaults.allowedTags.concat(["img", "h1", "h2", "h3"]),
    allowedAttributes: {
      ...sanitizeHtml.defaults.allowedAttributes,
      img: ["src", "alt"]
    }
  });

  return (
    <div className="container-page py-8 md:py-10">
      <article className="card space-y-5 rounded-3xl">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="inline-flex items-center gap-2 rounded-full border border-red-200 bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-[0.12em] text-red-700">
            <span className="nageco-news-icon" aria-hidden>
              <svg viewBox="0 0 24 24" fill="none">
                <rect x="5.5" y="6.5" width="13" height="11" rx="2" />
                <path d="M8.5 10h7M8.5 13h5" strokeLinecap="round" />
              </svg>
            </span>
            {locale === "ar" ? "خبر" : "News"}
          </span>
          <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600">
            {new Intl.DateTimeFormat(locale === "ar" ? "ar-LY" : "en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(
              post.publishedAt ?? post.updatedAt
            )}
          </span>
        </div>
        {coverImage && (
          <div className="relative w-full overflow-hidden rounded-2xl border border-brand-700/15 bg-slate-100">
            <Image src={coverImage} alt={title} width={1800} height={1000} className="block h-auto w-full" />
          </div>
        )}
        <h1 className="nageco-news-title text-3xl font-bold tracking-tight md:text-4xl">{title}</h1>
        <div className="prose max-w-none" dangerouslySetInnerHTML={{ __html: safeHtml }} />
      </article>
    </div>
  );
}