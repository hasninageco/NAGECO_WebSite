import { redirect } from "next/navigation";
import { ProjectForm } from "@/components/admin/ProjectForm";
import { getCurrentUser } from "@/lib/auth";

export default async function NewProjectPage() {
  const user = await getCurrentUser();
  if (user?.role === "VIEWER") {
    redirect("/admin/projects");
  }

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">New Project</h1>
      <ProjectForm />
    </div>
  );
}