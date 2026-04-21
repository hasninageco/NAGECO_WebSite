import { redirect } from "next/navigation";
import { DatabaseConnectionNotice } from "@/components/admin/DatabaseConnectionNotice";
import { ChartsImagesForm } from "@/components/admin/ChartsImagesForm";
import { getCurrentUser } from "@/lib/auth";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";

export default async function AdminChartsPage() {
  const user = await getCurrentUser();
  if (user?.role === "VIEWER") {
    redirect("/admin");
  }

  const settingsResult = await withDbFallback(
    () => prisma.siteSettings.findUnique({ where: { id: "singleton" } }),
    null
  );
  const mediaItemsResult = await withDbFallback(
    () => prisma.media.findMany({ where: { mimeType: { startsWith: "image/" } }, orderBy: { createdAt: "desc" } }),
    []
  );

  const settings = settingsResult.data;
  const mediaItems = mediaItemsResult.data;
  const databaseConnectionError = settingsResult.databaseConnectionError || mediaItemsResult.databaseConnectionError;

  const socialLinks =
    settings?.socialLinksJson && typeof settings.socialLinksJson === "object"
      ? (settings.socialLinksJson as Record<string, unknown>)
      : {};

  const initialHiveChartImageUrl = typeof socialLinks.hiveChartImageUrl === "string" ? socialLinks.hiveChartImageUrl : "";
  const initialOrganizationalStructureImageUrl =
    typeof socialLinks.organizationalStructureImageUrl === "string" ? socialLinks.organizationalStructureImageUrl : "";

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Charts Images</h1>
      {databaseConnectionError ? <DatabaseConnectionNotice /> : null}
      <ChartsImagesForm
        initialHiveChartImageUrl={initialHiveChartImageUrl}
        initialOrganizationalStructureImageUrl={initialOrganizationalStructureImageUrl}
        mediaItems={mediaItems}
      />
    </div>
  );
}
