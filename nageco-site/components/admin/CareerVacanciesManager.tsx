"use client";

import { useState } from "react";
import { toast } from "sonner";
import type { CareerVacancy } from "@/lib/career-vacancies";

export function CareerVacanciesManager({ initialVacancies, canManage }: { initialVacancies: CareerVacancy[]; canManage: boolean }) {
  const [vacancies, setVacancies] = useState(initialVacancies);
  const [subject, setSubject] = useState("");
  const [subjectAr, setSubjectAr] = useState("");
  const [details, setDetails] = useState("");
  const [detailsAr, setDetailsAr] = useState("");
  const [saving, setSaving] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editSubject, setEditSubject] = useState("");
  const [editSubjectAr, setEditSubjectAr] = useState("");
  const [editDetails, setEditDetails] = useState("");
  const [editDetailsAr, setEditDetailsAr] = useState("");
  const [updating, setUpdating] = useState(false);
  const [expandedDetails, setExpandedDetails] = useState<Record<string, boolean>>({});

  async function createVacancy() {
    if (!subject.trim() || !details.trim()) {
      toast.error("Subject and details are required");
      return;
    }

    setSaving(true);
    try {
      const response = await fetch("/api/admin/career-vacancies", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject,
          subjectAr,
          details,
          detailsAr
        })
      });

      if (!response.ok) {
        toast.error("Failed to add vacancy");
        return;
      }

      const created = (await response.json()) as CareerVacancy;
      setVacancies((current) => [created, ...current]);
      setSubject("");
      setSubjectAr("");
      setDetails("");
      setDetailsAr("");
      toast.success("Vacancy added");
    } finally {
      setSaving(false);
    }
  }

  async function removeVacancy(id: string) {
    if (!confirm("Delete this vacancy?")) return;

    const response = await fetch(`/api/admin/career-vacancies/${id}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("Failed to delete vacancy");
      return;
    }

    setVacancies((current) => current.filter((item) => item.id !== id));
    toast.success("Vacancy deleted");
  }

  function startEdit(vacancy: CareerVacancy) {
    setEditingId(vacancy.id);
    setEditSubject(vacancy.subject);
    setEditSubjectAr(vacancy.subjectAr ?? "");
    setEditDetails(vacancy.details);
    setEditDetailsAr(vacancy.detailsAr ?? "");
  }

  function cancelEdit() {
    setEditingId(null);
    setEditSubject("");
    setEditSubjectAr("");
    setEditDetails("");
    setEditDetailsAr("");
  }

  async function saveEdit() {
    if (!editingId) return;
    if (!editSubject.trim() || !editDetails.trim()) {
      toast.error("Subject and details are required");
      return;
    }

    setUpdating(true);
    try {
      const response = await fetch(`/api/admin/career-vacancies/${editingId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          subject: editSubject,
          subjectAr: editSubjectAr,
          details: editDetails,
          detailsAr: editDetailsAr
        })
      });

      if (!response.ok) {
        toast.error("Failed to update vacancy");
        return;
      }

      const updated = (await response.json()) as CareerVacancy;
      setVacancies((current) => current.map((item) => (item.id === updated.id ? updated : item)));
      cancelEdit();
      toast.success("Vacancy updated");
    } finally {
      setUpdating(false);
    }
  }

  async function setPublishState(id: string, isPublished: boolean) {
    const response = await fetch(`/api/admin/career-vacancies/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isPublished })
    });

    if (!response.ok) {
      toast.error("Failed to update publish status");
      return;
    }

    const updated = (await response.json()) as CareerVacancy;
    setVacancies((current) => current.map((item) => (item.id === updated.id ? updated : item)));
    toast.success(updated.isPublished ? "Vacancy published" : "Vacancy hidden");
  }

  function toggleDetails(id: string) {
    setExpandedDetails((current) => ({ ...current, [id]: !current[id] }));
  }

  function getPreview(detailsText: string) {
    const normalized = detailsText.replace(/\s+/g, " ").trim();
    if (normalized.length <= 220) return normalized;
    return `${normalized.slice(0, 220)}...`;
  }

  return (
    <div className="space-y-6">
      {canManage && (
        <section className="card space-y-3">
          <h2 className="text-lg font-semibold">Add Vacancy Job</h2>
          <div className="grid gap-3">
            <input
              className="input"
              placeholder="Subject (English)"
              value={subject}
              onChange={(event) => setSubject(event.target.value)}
            />
            <input
              className="input"
              placeholder="Subject (Arabic)"
              value={subjectAr}
              onChange={(event) => setSubjectAr(event.target.value)}
            />
            <textarea
              className="input min-h-28 resize-y py-2.5"
              placeholder="Details (English)"
              value={details}
              onChange={(event) => setDetails(event.target.value)}
            />
            <textarea
              className="input min-h-28 resize-y py-2.5"
              placeholder="Details (Arabic)"
              value={detailsAr}
              onChange={(event) => setDetailsAr(event.target.value)}
            />
          </div>
          <button type="button" className="btn-primary" onClick={createVacancy} disabled={saving}>
            {saving ? "Saving..." : "Add Vacancy"}
          </button>
        </section>
      )}

      <section className="card space-y-3">
        <div className="flex items-center justify-between gap-3">
          <h2 className="text-lg font-semibold">Vacancy Jobs</h2>
          <span className="rounded-full border border-brand-700/20 bg-brand-700/10 px-3 py-1 text-xs font-semibold text-brand-700">
            {vacancies.length} items
          </span>
        </div>

        {vacancies.length === 0 ? (
          <p className="text-sm text-slate-600">No vacancies yet.</p>
        ) : (
          <div className="space-y-3">
            {vacancies.map((vacancy) => (
              <article key={vacancy.id} className="rounded-2xl border border-slate-200 bg-white/80 p-4">
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="space-y-1">
                    <h3 className="text-base font-semibold text-slate-900">{vacancy.subject}</h3>
                    {vacancy.subjectAr ? <p className="text-sm font-semibold text-slate-700" dir="rtl">{vacancy.subjectAr}</p> : null}
                    <span
                      className={`inline-flex rounded-full border px-2 py-0.5 text-[11px] font-semibold ${
                        vacancy.isPublished
                          ? "border-emerald-200 bg-emerald-50 text-emerald-700"
                          : "border-amber-200 bg-amber-50 text-amber-700"
                      }`}
                    >
                      {vacancy.isPublished ? "Published" : "Hidden"}
                    </span>
                  </div>
                  {canManage && (
                    <div className="flex items-center gap-2">
                      <button
                        type="button"
                        className="rounded-lg border border-brand-200 bg-brand-50 px-3 py-1.5 text-xs font-semibold text-brand-700 hover:bg-brand-100"
                        onClick={() => setPublishState(vacancy.id, !vacancy.isPublished)}
                      >
                        {vacancy.isPublished ? "Hide" : "Publish"}
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-slate-300 bg-slate-50 px-3 py-1.5 text-xs font-semibold text-slate-700 hover:bg-slate-100"
                        onClick={() => startEdit(vacancy)}
                      >
                        Edit
                      </button>
                      <button
                        type="button"
                        className="rounded-lg border border-red-200 bg-red-50 px-3 py-1.5 text-xs font-semibold text-red-700 hover:bg-red-100"
                        onClick={() => removeVacancy(vacancy.id)}
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>

                {editingId === vacancy.id ? (
                  <div className="mt-3 space-y-3">
                    <input className="input" value={editSubject} onChange={(event) => setEditSubject(event.target.value)} />
                    <input className="input" value={editSubjectAr} onChange={(event) => setEditSubjectAr(event.target.value)} dir="rtl" />
                    <textarea
                      className="input min-h-28 resize-y py-2.5"
                      value={editDetails}
                      onChange={(event) => setEditDetails(event.target.value)}
                    />
                    <textarea
                      className="input min-h-28 resize-y py-2.5"
                      value={editDetailsAr}
                      onChange={(event) => setEditDetailsAr(event.target.value)}
                      dir="rtl"
                    />
                    <div className="flex items-center gap-2">
                      <button type="button" className="btn-primary" onClick={saveEdit} disabled={updating}>
                        {updating ? "Saving..." : "Save"}
                      </button>
                      <button type="button" className="btn-secondary" onClick={cancelEdit} disabled={updating}>
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div className="mt-2 space-y-2">
                    <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600">
                      {expandedDetails[vacancy.id] ? vacancy.details : getPreview(vacancy.details)}
                    </p>
                    {vacancy.detailsAr ? (
                      <p className="whitespace-pre-wrap text-sm leading-7 text-slate-600" dir="rtl">
                        {expandedDetails[vacancy.id] ? vacancy.detailsAr : getPreview(vacancy.detailsAr)}
                      </p>
                    ) : null}
                    <button
                      type="button"
                      className="text-xs font-semibold text-brand-700 hover:underline"
                      onClick={() => toggleDetails(vacancy.id)}
                    >
                      {expandedDetails[vacancy.id] ? "Hide details" : "More"}
                    </button>
                  </div>
                )}
              </article>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
