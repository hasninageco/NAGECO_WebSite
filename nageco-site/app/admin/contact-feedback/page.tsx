import { ContactFeedbackTable } from "@/components/admin/ContactFeedbackTable";
import { getContactFeedbackRecords } from "@/lib/contact-feedback";

export default async function ContactFeedbackAdminPage() {
  const records = await getContactFeedbackRecords();

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-2xl font-bold">Contact Feedback</h1>
        <span className="rounded-full border border-brand-700/20 bg-brand-700/10 px-3 py-1 text-sm font-semibold text-brand-700">
          {records.length} messages
        </span>
      </div>

      {records.length === 0 ? (
        <section className="card">
          <p className="text-sm text-slate-600">No feedback messages received yet.</p>
        </section>
      ) : (
        <ContactFeedbackTable records={records} />
      )}
    </div>
  );
}

