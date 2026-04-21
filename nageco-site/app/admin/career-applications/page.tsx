import { getCareerApplications } from "@/lib/career-applications";
import { CareerApplicationsTable } from "@/components/admin/CareerApplicationsTable";

export default async function CareerApplicationsAdminPage() {
  const applications = await getCareerApplications();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Career Applications</h1>
        <span className="rounded-full border border-brand-700/20 bg-brand-700/10 px-3 py-1 text-sm font-semibold text-brand-700">
          {applications.length} submissions
        </span>
      </div>

      {applications.length === 0 ? (
        <section className="card">
          <p className="text-sm text-slate-600">No applications received yet.</p>
        </section>
      ) : (
        <CareerApplicationsTable applications={applications} />
      )}
    </div>
  );
}
