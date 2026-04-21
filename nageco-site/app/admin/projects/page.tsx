import Link from "next/link";
import { DatabaseConnectionNotice } from "@/components/admin/DatabaseConnectionNotice";
import { getCurrentUser } from "@/lib/auth";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";

export default async function AdminProjectsPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
  const user = await getCurrentUser();
  const canEdit = user?.role === "ADMIN" || user?.role === "EDITOR";
  const resolvedSearchParams = await searchParams;
  const search = resolvedSearchParams.search ?? "";
  const where: Record<string, unknown> = search
    ? {
        OR: [
          { title: { contains: search, mode: "insensitive" } },
          { titleAr: { contains: search, mode: "insensitive" } }
        ]
      }
    : {};

  const { data: projects, databaseConnectionError } = await withDbFallback(
    () =>
      prisma.project.findMany({
        where: where as never,
        orderBy: { updatedAt: "desc" }
      }),
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Projects</h1>
        {canEdit && (
          <Link href="/admin/projects/new" className="btn-primary">
            New Project
          </Link>
        )}
      </div>

      <form className="card grid gap-3 md:grid-cols-3" method="get">
        <input className="input" name="search" placeholder="Search title" defaultValue={search} />
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
              <th className="p-2">X</th>
              <th className="p-2">Y</th>
              <th className="p-2">Updated</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {projects.map((project) => (
              <tr key={project.id} className="border-t">
                <td className="p-2">
                  <div className="font-semibold text-slate-900">{project.title}</div>
                  {(project as typeof project & { titleAr?: string | null }).titleAr ? (
                    <div className="text-xs text-slate-600" dir="rtl">{(project as typeof project & { titleAr?: string | null }).titleAr}</div>
                  ) : null}
                </td>
                <td className="p-2">{project.status}</td>
                <td className="p-2">{typeof (project as { mapX?: number | null }).mapX === "number" ? (project as { mapX?: number | null }).mapX?.toFixed(1) : "-"}</td>
                <td className="p-2">{typeof (project as { mapY?: number | null }).mapY === "number" ? (project as { mapY?: number | null }).mapY?.toFixed(1) : "-"}</td>
                <td className="p-2">{project.updatedAt.toLocaleString()}</td>
                <td className="p-2">
                  {canEdit ? (
                    <Link href={`/admin/projects/${project.id}`} className="text-brand-700 hover:underline">
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