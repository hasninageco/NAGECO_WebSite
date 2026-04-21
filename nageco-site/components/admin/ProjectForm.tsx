"use client";

import { useMemo, useState } from "react";
import { ProjectStatus } from "@prisma/client";
import { toast } from "sonner";
import { slugify } from "@/lib/slug";

type ProjectFormProps = {
  initial?: {
    id?: string;
    title: string;
    titleAr?: string | null;
    slug: string;
    summary: string;
    summaryAr?: string | null;
    challenge?: string | null;
    challengeAr?: string | null;
    approach?: string | null;
    approachAr?: string | null;
    methods: string[];
    methodsAr?: string[];
    deliverables: string[];
    deliverablesAr?: string[];
    outcome?: string | null;
    outcomeAr?: string | null;
    year?: number | null;
    country?: string | null;
    countryAr?: string | null;
    industry?: string | null;
    industryAr?: string | null;
    mapX?: number | null;
    mapY?: number | null;
    coverImageUrl?: string | null;
    gallery: string[];
    status: ProjectStatus;
  };
};

function extractApiErrorMessage(result: unknown, fallback: string) {
  if (!result || typeof result !== "object") return fallback;

  const error = (result as { error?: unknown }).error;
  if (!error) return fallback;
  if (typeof error === "string") return error;

  if (typeof error === "object") {
    const normalized = error as { formErrors?: unknown; fieldErrors?: unknown };

    if (Array.isArray(normalized.formErrors)) {
      const firstFormError = normalized.formErrors.find((item): item is string => typeof item === "string" && item.trim().length > 0);
      if (firstFormError) return firstFormError;
    }

    if (normalized.fieldErrors && typeof normalized.fieldErrors === "object") {
      const entries = Object.entries(normalized.fieldErrors as Record<string, unknown>);
      for (const [, value] of entries) {
        if (Array.isArray(value)) {
          const firstFieldError = value.find((item): item is string => typeof item === "string" && item.trim().length > 0);
          if (firstFieldError) return firstFieldError;
        }
      }
    }
  }

  return fallback;
}

export function ProjectForm({ initial }: ProjectFormProps) {
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    titleAr: initial?.titleAr ?? "",
    slug: initial?.slug ?? "",
    summary: initial?.summary ?? "",
    summaryAr: initial?.summaryAr ?? "",
    challenge: initial?.challenge ?? "",
    challengeAr: initial?.challengeAr ?? "",
    approach: initial?.approach ?? "",
    approachAr: initial?.approachAr ?? "",
    methods: initial?.methods.join(",") ?? "",
    methodsAr: initial?.methodsAr?.join(",") ?? "",
    deliverables: initial?.deliverables.join(",") ?? "",
    deliverablesAr: initial?.deliverablesAr?.join(",") ?? "",
    outcome: initial?.outcome ?? "",
    outcomeAr: initial?.outcomeAr ?? "",
    year: initial?.year ? String(initial.year) : "",
    country: initial?.country ?? "",
    countryAr: initial?.countryAr ?? "",
    industry: initial?.industry ?? "",
    industryAr: initial?.industryAr ?? "",
    mapX: typeof initial?.mapX === "number" ? String(initial.mapX) : "",
    mapY: typeof initial?.mapY === "number" ? String(initial.mapY) : "",
    coverImageUrl: initial?.coverImageUrl ?? "",
    gallery: initial?.gallery.join(",") ?? "",
    status: initial?.status ?? ProjectStatus.DRAFT
  });

  const payload = useMemo(
    () => ({
      ...form,
      methods: form.methods.split(",").map((item) => item.trim()).filter(Boolean),
      methodsAr: form.methodsAr.split(",").map((item) => item.trim()).filter(Boolean),
      deliverables: form.deliverables.split(",").map((item) => item.trim()).filter(Boolean),
      deliverablesAr: form.deliverablesAr.split(",").map((item) => item.trim()).filter(Boolean),
      gallery: form.gallery.split(",").map((item) => item.trim()).filter(Boolean),
      year: form.year ? Number(form.year) : null,
      mapX: form.mapX ? Number(form.mapX) : null,
      mapY: form.mapY ? Number(form.mapY) : null
    }),
    [form]
  );

  async function submit() {
    const endpoint = initial?.id ? `/api/admin/projects/${initial.id}` : "/api/admin/projects";
    const method = initial?.id ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      const message = extractApiErrorMessage(result, "Failed to save project");
      toast.error(message);
      return;
    }

    toast.success("Project saved");
    window.location.href = "/admin/projects";
  }

  return (
    <div className="space-y-4">
      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm">Title (English)</span>
          <input
            className="input"
            value={form.title}
            onChange={(event) =>
              setForm((current) => ({
                ...current,
                title: event.target.value,
                slug: current.slug ? current.slug : slugify(event.target.value)
              }))
            }
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Title (Arabic)</span>
          <input className="input" dir="rtl" value={form.titleAr} onChange={(event) => setForm((current) => ({ ...current, titleAr: event.target.value }))} />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm">Slug</span>
          <input className="input" value={form.slug} onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))} />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm">Summary (English)</span>
          <textarea className="input min-h-20" value={form.summary} onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))} />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Summary (Arabic)</span>
          <textarea className="input min-h-20" dir="rtl" value={form.summaryAr} onChange={(event) => setForm((current) => ({ ...current, summaryAr: event.target.value }))} />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm">Challenge (English)</span>
          <textarea className="input min-h-20" value={form.challenge} onChange={(event) => setForm((current) => ({ ...current, challenge: event.target.value }))} />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Challenge (Arabic)</span>
          <textarea className="input min-h-20" dir="rtl" value={form.challengeAr} onChange={(event) => setForm((current) => ({ ...current, challengeAr: event.target.value }))} />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Approach (English)</span>
          <textarea className="input min-h-20" value={form.approach} onChange={(event) => setForm((current) => ({ ...current, approach: event.target.value }))} />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Approach (Arabic)</span>
          <textarea className="input min-h-20" dir="rtl" value={form.approachAr} onChange={(event) => setForm((current) => ({ ...current, approachAr: event.target.value }))} />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm">Methods (English)</span>
          <input className="input" value={form.methods} onChange={(event) => setForm((current) => ({ ...current, methods: event.target.value }))} />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Methods (Arabic)</span>
          <input className="input" dir="rtl" value={form.methodsAr} onChange={(event) => setForm((current) => ({ ...current, methodsAr: event.target.value }))} />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Deliverables (English)</span>
          <input className="input" value={form.deliverables} onChange={(event) => setForm((current) => ({ ...current, deliverables: event.target.value }))} />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Deliverables (Arabic)</span>
          <input className="input" dir="rtl" value={form.deliverablesAr} onChange={(event) => setForm((current) => ({ ...current, deliverablesAr: event.target.value }))} />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm">Gallery URLs</span>
          <input className="input" value={form.gallery} onChange={(event) => setForm((current) => ({ ...current, gallery: event.target.value }))} />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm">Year</span>
          <input className="input" value={form.year} onChange={(event) => setForm((current) => ({ ...current, year: event.target.value }))} />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Country (English)</span>
          <input className="input" value={form.country} onChange={(event) => setForm((current) => ({ ...current, country: event.target.value }))} />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Country (Arabic)</span>
          <input className="input" dir="rtl" value={form.countryAr} onChange={(event) => setForm((current) => ({ ...current, countryAr: event.target.value }))} />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Industry (English)</span>
          <input className="input" value={form.industry} onChange={(event) => setForm((current) => ({ ...current, industry: event.target.value }))} />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Industry (Arabic)</span>
          <input className="input" dir="rtl" value={form.industryAr} onChange={(event) => setForm((current) => ({ ...current, industryAr: event.target.value }))} />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm">Outcome (English)</span>
          <textarea className="input min-h-20" value={form.outcome} onChange={(event) => setForm((current) => ({ ...current, outcome: event.target.value }))} />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Outcome (Arabic)</span>
          <textarea className="input min-h-20" dir="rtl" value={form.outcomeAr} onChange={(event) => setForm((current) => ({ ...current, outcomeAr: event.target.value }))} />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm">Map X (0-100)</span>
          <input
            type="number"
            min={0}
            max={100}
            step="0.1"
            className="input"
            value={form.mapX}
            onChange={(event) => setForm((current) => ({ ...current, mapX: event.target.value }))}
            placeholder="e.g. 42.5"
          />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Map Y (0-100)</span>
          <input
            type="number"
            min={0}
            max={100}
            step="0.1"
            className="input"
            value={form.mapY}
            onChange={(event) => setForm((current) => ({ ...current, mapY: event.target.value }))}
            placeholder="e.g. 36.2"
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm">Cover Image URL</span>
          <input className="input" value={form.coverImageUrl} onChange={(event) => setForm((current) => ({ ...current, coverImageUrl: event.target.value }))} />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Status</span>
          <select className="input" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as ProjectStatus }))}>
            <option value={ProjectStatus.DRAFT}>DRAFT</option>
            <option value={ProjectStatus.PUBLISHED}>PUBLISHED</option>
          </select>
        </label>
      </div>

      <button className="btn-primary" type="button" onClick={submit}>
        Save Project
      </button>
    </div>
  );
}