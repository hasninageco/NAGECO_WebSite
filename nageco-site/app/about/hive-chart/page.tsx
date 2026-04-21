import type { Metadata } from "next";
import Image from "next/image";
import { getSiteSettings } from "@/lib/public-data";
import { normalizeMediaUrl } from "@/lib/media-url";

export const metadata: Metadata = {
  title: "Hive Chart | NAGECO"
};

export default async function HiveChartPage() {
  const settings = await getSiteSettings();
  const socialLinks =
    settings?.socialLinksJson && typeof settings.socialLinksJson === "object"
      ? (settings.socialLinksJson as Record<string, unknown>)
      : {};

  const hiveChartImageUrl =
    typeof socialLinks.hiveChartImageUrl === "string" ? normalizeMediaUrl(socialLinks.hiveChartImageUrl) : null;

  return (
    <div className="container-page py-8 md:py-14">
      <section className="relative overflow-hidden rounded-3xl border border-brand-700/24 bg-[#f7fbff] p-4 shadow-[0_28px_90px_-62px_rgba(15,39,71,0.55)] md:p-8">
        <header className="mb-5 text-center md:mb-7">
          <h1 className="text-3xl font-black tracking-tight text-slate-900 md:text-5xl">Hive Organizational Structure</h1>
        </header>

        {hiveChartImageUrl ? (
          <div className="relative mx-auto max-w-[900px] overflow-hidden rounded-2xl border border-brand-700/15 bg-white p-2 md:p-3">
            <div className="relative aspect-[16/10] w-full md:aspect-[16/9]">
              <Image
                src={hiveChartImageUrl}
                alt="Hive organizational chart"
                fill
                className="object-contain"
                sizes="(max-width: 1200px) 100vw, 1200px"
                priority
              />
            </div>
          </div>
        ) : (
          <div className="mx-auto max-w-3xl rounded-2xl border border-amber-200 bg-amber-50 px-5 py-4 text-center text-sm font-medium text-amber-800">
            No Hive Chart image selected yet. Go to Admin Settings and set Hive Chart Image from Media.
          </div>
        )}
      </section>
    </div>
  );
}
