import { getCurrentUser } from "@/lib/auth";
import { DatabaseConnectionNotice } from "@/components/admin/DatabaseConnectionNotice";
import { withDbFallback } from "@/lib/db-fallback";
import { MediaManager } from "@/components/admin/MediaManager";
import { prisma } from "@/lib/prisma";

export default async function AdminMediaPage() {
  const user = await getCurrentUser();
  const canEdit = user?.role === "ADMIN" || user?.role === "EDITOR";
  const { data: mediaItems, databaseConnectionError } = await withDbFallback(
    () => prisma.media.findMany({ orderBy: { createdAt: "desc" } }),
    []
  );

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Media Library</h1>
      {databaseConnectionError ? <DatabaseConnectionNotice /> : null}
      <MediaManager initialItems={mediaItems} canEdit={canEdit} />
    </div>
  );
}