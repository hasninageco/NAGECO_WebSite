import { redirect } from "next/navigation";
import { DatabaseConnectionNotice } from "@/components/admin/DatabaseConnectionNotice";
import { SettingsForm } from "@/components/admin/SettingsForm";
import { getCurrentUser } from "@/lib/auth";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";

export default async function AdminSettingsPage() {
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

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Site Settings</h1>
      {databaseConnectionError ? <DatabaseConnectionNotice /> : null}
      <SettingsForm initial={settings} mediaItems={mediaItems} />
    </div>
  );
}