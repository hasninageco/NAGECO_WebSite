import Link from "next/link";
import Image from "next/image";
import { headers } from "next/headers";
import { getPublishedPosts } from "@/lib/public-data";
import { pickLocalizedText } from "@/lib/localized";
import { normalizeMediaUrl } from "@/lib/media-url";
import { getSiteOriginFromHeaders } from "@/lib/site-origin";
import { getCurrentSiteLocale } from "@/lib/site-locale";

export const dynamic = "force-dynamic";

export default async function NewsPage() {
  const locale = await getCurrentSiteLocale();
  const headerList = await headers();
  const siteOrigin = getSiteOriginFromHeaders(headerList);
  const posts = await getPublishedPosts();

  return (
    <div className="container-page py-8 md:py-10">
      {posts.length > 0 && (
        <div className="nageco-news-ticker-wrap">
          <div className="nageco-news-ticker" aria-label={locale === "ar" ? "شريط الأخبار" : "Latest news ticker"}>
            <span className="nageco-news-ticker__label">{locale === "ar" ? "عاجل" : "Breaking"}</span>
            <div className="nageco-news-ticker__viewport">
              <div className="nageco-news-ticker__track">
                <div className="nageco-news-ticker__group">
                  {posts.map((post) => {
                    const localizedPost = post as typeof post & { titleAr?: string | null };
                    const postTitle = pickLocalizedText(locale, post.title, localizedPost.titleAr);

                    return (
                    <Link key={`ticker-a-${post.id}`} href={`/news/${post.slug}`} className="nageco-news-ticker__item">
                      {postTitle}
                    </Link>
                    );
                  })}
                </div>
                <div className="nageco-news-ticker__group" aria-hidden>
                  {posts.map((post) => {
                    const localizedPost = post as typeof post & { titleAr?: string | null };
                    const postTitle = pickLocalizedText(locale, post.title, localizedPost.titleAr);

                    return (
                    <Link key={`ticker-b-${post.id}`} href={`/news/${post.slug}`} className="nageco-news-ticker__item">
                      {postTitle}
                    </Link>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      <section className="card rounded-[2rem] border-brand-700/30 bg-white/92 p-4 shadow-[0_30px_70px_-42px_rgba(15,39,71,0.55)] md:p-6">
        <div className="grid gap-5 lg:grid-cols-2">
          {posts.map((post, index) => {
            const coverImage = normalizeMediaUrl(post.coverImageUrl);
            const localizedPost = post as typeof post & { titleAr?: string | null; excerptAr?: string | null };
            const postTitle = pickLocalizedText(locale, post.title, localizedPost.titleAr);
            const postExcerpt = pickLocalizedText(locale, post.excerpt, localizedPost.excerptAr);
            const postUrl = `${siteOrigin}/news/${post.slug}`;
            const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(postUrl)}`;
            const publishedLabel = post.publishedAt
              ? new Intl.DateTimeFormat(locale === "ar" ? "ar-LY" : "en-GB", { day: "2-digit", month: "short", year: "numeric" }).format(
                  post.publishedAt
                )
              : locale === "ar" ? "حديث" : "Recent";
            return (
              <article
                key={post.id}
                className="card nageco-fade-up group overflow-hidden rounded-3xl border-slate-200 bg-white p-0 shadow-[0_12px_28px_rgba(2,6,23,0.06)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_18px_36px_rgba(2,6,23,0.12)]"
                style={{ animationDelay: `${index * 110}ms` }}
              >
                <div className="flex h-full flex-col md:flex-row">
                  {coverImage && (
                    <div className="relative w-full overflow-hidden bg-slate-100 md:w-[60%]">
                      <Image
                        src={coverImage}
                        alt={postTitle}
                        width={1600}
                        height={900}
                        className="block h-[150px] w-full object-cover sm:h-[170px] md:h-full md:min-h-[240px]"
                        sizes="(min-width: 1024px) 30vw, (min-width: 768px) 60vw, 100vw"
                      />
                      {postExcerpt && (
                        <div className="absolute inset-x-0 bottom-0 flex h-1/5 items-center bg-red-600/60 px-3 py-1.5 backdrop-blur-[1px]">
                          <p
                            className="overflow-hidden text-xs font-semibold leading-tight text-white sm:text-sm"
                            style={{ display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}
                          >
                            {postExcerpt}
                          </p>
                        </div>
                      )}
                      <div className="nageco-carousel-shimmer pointer-events-none absolute inset-0" />
                    </div>
                  )}
                  <div className="flex flex-1 flex-col gap-4 p-5 md:w-[40%] md:p-6">
                    <div className="flex flex-wrap items-center gap-2">
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
                        {publishedLabel}
                      </span>
                    </div>

                    <h2 className="nageco-news-item-title text-2xl font-semibold leading-tight text-slate-900">
                      {postTitle}
                    </h2>

                    <div className="mt-auto flex flex-wrap items-center gap-2">
                      <Link
                        href={`/news/${post.slug}`}
                        className="inline-flex w-fit items-center rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-brand-500"
                      >
                        {locale === "ar" ? "اقرأ الخبر" : "Read article"}
                      </Link>
                      <Link
                        href={facebookShareUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex w-fit items-center gap-1.5 rounded-full border border-[#1877F2]/25 bg-[#1877F2]/10 px-4 py-2 text-sm font-semibold text-[#1877F2] transition-all duration-300 hover:-translate-y-0.5 hover:bg-[#1877F2]/18"
                        aria-label={locale === "ar" ? `مشاركة ${postTitle} على فيسبوك` : `Share ${postTitle} on Facebook`}
                      >
                        <svg viewBox="0 0 24 24" className="h-4 w-4 fill-current" aria-hidden>
                          <path d="M13.5 22v-8h2.7l.4-3.1h-3.1V8.9c0-.9.2-1.5 1.5-1.5h1.7V4.6c-.3 0-1.3-.1-2.4-.1-2.4 0-4.1 1.5-4.1 4.3v2.1H7.5V14h2.7v8h3.3z" />
                        </svg>
                        {locale === "ar" ? "مشاركة" : "Share"}
                      </Link>
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
          {posts.length === 0 && (
            <div className="card rounded-3xl border-dashed border-slate-300 bg-white/95 px-6 py-10 text-center">
              <p className="text-lg font-semibold text-slate-800">{locale === "ar" ? "لا توجد أخبار منشورة بعد." : "No news articles yet."}</p>
              <p className="mt-2 text-sm text-slate-600">{locale === "ar" ? "انشر خبرًا من لوحة الادمن ليظهر هنا." : "Publish an item from admin to show it here."}</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
