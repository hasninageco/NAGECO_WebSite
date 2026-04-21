import Link from "next/link";
import { DatabaseConnectionNotice } from "@/components/admin/DatabaseConnectionNotice";
import { getCurrentUser } from "@/lib/auth";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";

export default async function AdminTendersPage({ searchParams }: { searchParams: Promise<{ search?: string }> }) {
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

  const { data: tenders, databaseConnectionError } = await withDbFallback(
    () =>
      prisma.tender.findMany({
        where: where as never,
        orderBy: { updatedAt: "desc" }
      }),
    []
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Tenders</h1>
        {canEdit && (
          <Link href="/admin/tenders/new" className="btn-primary">
            New Tender
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
              <th className="p-2">Images</th>
              <th className="p-2">Documents</th>
              <th className="p-2">Updated</th>
              <th className="p-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tenders.map((tender) => (
              <tr key={tender.id} className="border-t">
                <td className="p-2">
                  <div className="font-semibold text-slate-900">{tender.title}</div>
                  {(tender as typeof tender & { titleAr?: string | null }).titleAr ? (
                    <div className="text-xs text-slate-600" dir="rtl">{(tender as typeof tender & { titleAr?: string | null }).titleAr}</div>
                  ) : null}
                </td>
                <td className="p-2">{tender.status}</td>
                <td className="p-2">{tender.imageUrls.length}</td>
                <td className="p-2">{tender.documentUrls.length}</td>
                <td className="p-2">{tender.updatedAt.toLocaleString()}</td>
                <td className="p-2">
                  {canEdit ? (
                    <Link href={`/admin/tenders/${tender.id}`} className="text-brand-700 hover:underline">
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
