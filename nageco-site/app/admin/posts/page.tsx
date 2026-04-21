import Link from "next/link";
import { PostStatus } from "@prisma/client";
import { DatabaseConnectionNotice } from "@/components/admin/DatabaseConnectionNotice";
import { getCurrentUser } from "@/lib/auth";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";

type SearchParams = {
  search?: string;
  status?: PostStatus;
};

export default async function AdminPostsPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const user = await getCurrentUser();
  const canEdit = user?.role === "ADMIN" || user?.role === "EDITOR";
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams.search ?? "";
  const status = resolvedSearchParams.status;
  const where: Record<string, unknown> = {
    ...(search
      ? {
          OR: [
            { title: { contains: search, mode: "insensitive" } },
            { titleAr: { contains: search, mode: "insensitive" } }
          ]
        }
      : {}),
    ...(status ? { status } : {})
  };

  const { data: posts, databaseConnectionError } = await withDbFallback(
    () =>
      prisma.post.findMany({
        where: where as never,
        orderBy: { updatedAt: "desc" }
      }),
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Posts</h1>
        {canEdit && (
          <Link href="/admin/posts/new" className="btn-primary">
            New Post
          </Link>
        )}
      </div>
      <form className="card grid gap-3 md:grid-cols-3" method="get">
        <input className="input" name="search" placeholder="Search title" defaultValue={search} />
        <select className="input" name="status" defaultValue={status ?? ""}>
          <option value="">All statuses</option>
          <option value={PostStatus.DRAFT}>DRAFT</option>
          <option value={PostStatus.PUBLISHED}>PUBLISHED</option>
          <option value={PostStatus.ARCHIVED}>ARCHIVED</option>
        </select>
        <button type="submit" className="btn-secondary">
          Apply
        </button>
      </form>

      {databaseConnectionError ? <DatabaseConnectionNotice /> : null}

      <div className="card overflow-auto">
        <table className="min-w-full text-sm">
          <thead>
            <tr className="text-left text-slate-600">
              <th className="p-2">Title</th>
              <th className="p-2">Status</th>
              <th className="p-2">Updated</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {posts.map((post) => (
              <tr key={post.id} className="border-t">
                <td className="p-2">
                  <div className="font-semibold text-slate-900">{post.title}</div>
                  {(post as typeof post & { titleAr?: string | null }).titleAr ? (
                    <div className="text-xs text-slate-600" dir="rtl">{(post as typeof post & { titleAr?: string | null }).titleAr}</div>
                  ) : null}
                </td>
                <td className="p-2">{post.status}</td>
                <td className="p-2">{post.updatedAt.toLocaleString()}</td>
                <td className="p-2">
                  {canEdit ? (
                    <Link href={`/admin/posts/${post.id}`} className="text-brand-700 hover:underline">
                      Edit
                    </Link>
                  ) : (
                    <span className="text-slate-400">Read only</span>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}