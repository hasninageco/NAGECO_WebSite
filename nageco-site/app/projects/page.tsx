import { getPublishedProjects } from "@/lib/public-data";
import { pickLocalizedText } from "@/lib/localized";
import { ProjectsOperationsMap } from "@/components/public/ProjectsOperationsMap";
import { normalizeMediaUrl } from "@/lib/media-url";
import { getCurrentSiteLocale } from "@/lib/site-locale";

export const dynamic = "force-dynamic";

export default async function ProjectsPage() {
  const locale = await getCurrentSiteLocale();
  const projects = await getPublishedProjects();
  const mapPoints = projects.map((project, index) => {
    const typedProject = project as typeof project & {
      titleAr?: string | null;
      countryAr?: string | null;
      industryAr?: string | null;
      summaryAr?: string | null;
      mapX?: number | null;
      mapY?: number | null;
    };
    const hasManualCoordinates = typeof typedProject.mapX === "number" && typeof typedProject.mapY === "number";

    const fallbackX = 34 + (index % 4) * 9;
    const fallbackY = 26 + (Math.floor(index / 4) % 3) * 11;

    return {
      id: project.id,
      title: pickLocalizedText(locale, project.title, typedProject.titleAr),
      slug: project.slug,
      country: pickLocalizedText(locale, project.country, typedProject.countryAr),
      industry: pickLocalizedText(locale, project.industry, typedProject.industryAr),
      summary: pickLocalizedText(locale, project.summary, typedProject.summaryAr),
      imageUrl: normalizeMediaUrl(project.coverImageUrl) ?? normalizeMediaUrl(project.gallery?.[0]),
      x: hasManualCoordinates ? Math.max(0, Math.min(100, Number(typedProject.mapX))) : fallbackX,
      y: hasManualCoordinates ? Math.max(0, Math.min(100, Number(typedProject.mapY))) : fallbackY
    };
  });

  return (
    <div className="container-page py-10">
      <div className="mb-6 grid gap-3 md:grid-cols-2">
        <article className="card py-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-500">{locale === "ar" ? "القسم" : "Section"}</p>
          <h1 className="mt-1 text-3xl font-bold">{locale === "ar" ? "المشاريع" : "Projects"}</h1>
        </article>
        <article className="card py-4">
          <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-500">{locale === "ar" ? "نظرة عامة" : "Overview"}</p>
          <p className="mt-1 text-sm text-black/72">
            {locale === "ar" ? "المشاريع المنشورة وبصمة العمليات عبر ليبيا." : "Published projects and operation footprint across Libya."}
          </p>
        </article>
      </div>

      {mapPoints.length > 0 && (
        <div className="mb-6">
          <ProjectsOperationsMap points={mapPoints} />
        </div>
      )}
    </div>
  );
}
