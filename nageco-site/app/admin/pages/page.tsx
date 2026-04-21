import { redirect } from "next/navigation";
import { DatabaseConnectionNotice } from "@/components/admin/DatabaseConnectionNotice";
import { PagesEditor } from "@/components/admin/PagesEditor";
import { getCurrentUser } from "@/lib/auth";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";

export default async function AdminPagesPage() {
  const user = await getCurrentUser();
  if (user?.role === "VIEWER") {
    redirect("/admin");
  }

  const pagesResult = await withDbFallback(
    () => prisma.pageContent.findMany({ orderBy: { key: "asc" } }),
    []
  );
  const newsPostsResult = await withDbFallback(
    () =>
      prisma.post.findMany({
        orderBy: { updatedAt: "desc" },
        select: { id: true, title: true, status: true, updatedAt: true }
      }),
    []
  );

  const pages = pagesResult.data;
  const newsPosts = newsPostsResult.data;
  const databaseConnectionError = pagesResult.databaseConnectionError || newsPostsResult.databaseConnectionError;

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Pages</h1>
      {databaseConnectionError ? <DatabaseConnectionNotice /> : null}
      <PagesEditor
        initialPages={pages}
        initialNewsPosts={newsPosts.map((post) => ({ ...post, updatedAt: post.updatedAt.toISOString() }))}
      />
    </div>
  );
}
