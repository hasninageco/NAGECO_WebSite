import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { DatabaseConnectionNotice } from "@/components/admin/DatabaseConnectionNotice";
import { TenderForm } from "@/components/admin/TenderForm";
import { getCurrentUser } from "@/lib/auth";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";

export default async function EditTenderPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (user?.role === "VIEWER") {
    redirect("/admin/tenders");
  }

  const { data: tender, databaseConnectionError } = await withDbFallback(
    () => prisma.tender.findUnique({ where: { id } }),
    null
  );

  if (databaseConnectionError) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Edit Tender</h1>
        <DatabaseConnectionNotice />
        <Link href="/admin/tenders" className="text-sm font-semibold text-brand-700 hover:underline">
          Back to tenders
        </Link>
      </div>
    );
  }

  if (!tender) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Edit Tender</h1>
      <TenderForm initial={tender} />
    </div>
  );
}
