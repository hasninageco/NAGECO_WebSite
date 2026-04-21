import Link from "next/link";
import { notFound } from "next/navigation";
import { redirect } from "next/navigation";
import { DatabaseConnectionNotice } from "@/components/admin/DatabaseConnectionNotice";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { getCurrentUser } from "@/lib/auth";
import { withDbFallback } from "@/lib/db-fallback";
import { prisma } from "@/lib/prisma";

export default async function EditProjectPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const user = await getCurrentUser();
  if (user?.role === "VIEWER") {
    redirect("/admin/projects");
  }

  const { data: project, databaseConnectionError } = await withDbFallback(
    () => prisma.project.findUnique({ where: { id } }),
    null
  );

  if (databaseConnectionError) {
    return (
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Edit Project</h1>
        <DatabaseConnectionNotice />
        <Link href="/admin/projects" className="text-sm font-semibold text-brand-700 hover:underline">
          Back to projects
        </Link>
      </div>
    );
  }

  if (!project) {
    notFound();
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Edit Project</h1>
      <ProjectForm initial={project} />
    </div>
  );
}