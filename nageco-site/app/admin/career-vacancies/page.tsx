import { redirect } from "next/navigation";
import { CareerVacanciesManager } from "@/components/admin/CareerVacanciesManager";
import { getCurrentUser } from "@/lib/auth";
import { getCareerVacancies } from "@/lib/career-vacancies";

export const dynamic = "force-dynamic";

export default async function AdminCareerVacanciesPage() {
  const user = await getCurrentUser();
  if (!user) {
    redirect("/admin/login");
  }

  const vacancies = await getCareerVacancies();
  const canManage = user.role === "ADMIN" || user.role === "EDITOR";

  return (
    <div className="space-y-4">
      <h1 className="text-2xl font-bold">Career Vacancies</h1>
      <CareerVacanciesManager initialVacancies={vacancies} canManage={canManage} />
    </div>
  );
}
