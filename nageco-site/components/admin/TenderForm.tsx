"use client";

import { useMemo, useRef, useState } from "react";
import { TenderStatus } from "@prisma/client";
import { toast } from "sonner";
import { slugify } from "@/lib/slug";

type TenderFormProps = {
  initial?: {
    id?: string;
    title: string;
    titleAr?: string | null;
    slug: string;
    summary: string;
    summaryAr?: string | null;
    imageUrls: string[];
    documentUrls: string[];
    status: TenderStatus;
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

export function TenderForm({ initial }: TenderFormProps) {
  const imageInputRef = useRef<HTMLInputElement | null>(null);
  const documentInputRef = useRef<HTMLInputElement | null>(null);
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    titleAr: initial?.titleAr ?? "",
    slug: initial?.slug ?? "",
    summary: initial?.summary ?? "",
    summaryAr: initial?.summaryAr ?? "",
    imageUrls: initial?.imageUrls.join("\n") ?? "",
    documentUrls: initial?.documentUrls.join("\n") ?? "",
    status: initial?.status ?? TenderStatus.DRAFT
  });
  const [uploadingImages, setUploadingImages] = useState(false);
  const [uploadingDocuments, setUploadingDocuments] = useState(false);

  const payload = useMemo(
    () => ({
      title: form.title,
      titleAr: form.titleAr,
      slug: form.slug,
      summary: form.summary,
      summaryAr: form.summaryAr,
      imageUrls: form.imageUrls
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      documentUrls: form.documentUrls
        .split("\n")
        .map((item) => item.trim())
        .filter(Boolean),
      status: form.status
    }),
    [form]
  );

  async function submit() {
    const endpoint = initial?.id ? `/api/admin/tenders/${initial.id}` : "/api/admin/tenders";
    const method = initial?.id ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      const message = extractApiErrorMessage(result, "Failed to save tender");
      toast.error(message);
      return;
    }

    toast.success("Tender saved");
    window.location.href = "/admin/tenders";
  }

  async function uploadFiles(files: FileList | null, type: "images" | "documents") {
    if (!files || files.length === 0) return;

    if (type === "images") {
      setUploadingImages(true);
    } else {
      setUploadingDocuments(true);
    }

    try {
      const selectedFiles = Array.from(files);
      const uploadedUrls: string[] = [];

      for (const file of selectedFiles) {
        const formData = new FormData();
        formData.append("file", file);

        const response = await fetch("/api/upload", {
          method: "POST",
          body: formData
        });

        const uploaded = (await response.json().catch(() => null)) as { url?: string; error?: string } | null;
        if (!response.ok || !uploaded?.url) {
          toast.error(uploaded?.error || `Failed to upload ${file.name}`);
          continue;
        }

        uploadedUrls.push(uploaded.url);
      }

      if (uploadedUrls.length > 0) {
        setForm((current) => {
          if (type === "images") {
            const existing = current.imageUrls
              .split("\n")
              .map((item) => item.trim())
              .filter(Boolean);
            return { ...current, imageUrls: [...new Set([...existing, ...uploadedUrls])].join("\n") };
          }

          const existing = current.documentUrls
            .split("\n")
            .map((item) => item.trim())
            .filter(Boolean);
          return { ...current, documentUrls: [...new Set([...existing, ...uploadedUrls])].join("\n") };
        });

        toast.success(`${uploadedUrls.length} file${uploadedUrls.length > 1 ? "s" : ""} imported`);
      }
    } finally {
      if (type === "images") {
        setUploadingImages(false);
      } else {
        setUploadingDocuments(false);
      }
    }
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
          <textarea className="input min-h-24" value={form.summary} onChange={(event) => setForm((current) => ({ ...current, summary: event.target.value }))} />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Summary (Arabic)</span>
          <textarea className="input min-h-24" dir="rtl" value={form.summaryAr} onChange={(event) => setForm((current) => ({ ...current, summaryAr: event.target.value }))} />
        </label>
      </div>

      <label className="space-y-1">
        <span className="text-sm">Images (one URL/path per line)</span>
        <div className="mb-2">
          <button type="button" className="btn-secondary" onClick={() => imageInputRef.current?.click()} disabled={uploadingImages}>
            {uploadingImages ? "Importing..." : "Import Images"}
          </button>
          <input
            ref={imageInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(event) => {
              void uploadFiles(event.currentTarget.files, "images");
              event.currentTarget.value = "";
            }}
            disabled={uploadingImages}
          />
        </div>
        <textarea
          className="input min-h-24"
          value={form.imageUrls}
          onChange={(event) => setForm((current) => ({ ...current, imageUrls: event.target.value }))}
          placeholder={"/uploads/tender-1.jpg\n/uploads/tender-2.jpg"}
        />
      </label>

      <label className="space-y-1">
        <span className="text-sm">Documents (one URL/path per line)</span>
        <div className="mb-2">
          <button type="button" className="btn-secondary" onClick={() => documentInputRef.current?.click()} disabled={uploadingDocuments}>
            {uploadingDocuments ? "Importing..." : "Import Documents"}
          </button>
          <input
            ref={documentInputRef}
            type="file"
            multiple
            className="hidden"
            onChange={(event) => {
              void uploadFiles(event.currentTarget.files, "documents");
              event.currentTarget.value = "";
            }}
            disabled={uploadingDocuments}
          />
        </div>
        <textarea
          className="input min-h-24"
          value={form.documentUrls}
          onChange={(event) => setForm((current) => ({ ...current, documentUrls: event.target.value }))}
          placeholder={"/uploads/specification.pdf\n/uploads/boq.pdf"}
        />
      </label>

      <label className="space-y-1">
        <span className="text-sm">Status</span>
        <select className="input" value={form.status} onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as TenderStatus }))}>
          <option value={TenderStatus.DRAFT}>DRAFT</option>
          <option value={TenderStatus.PUBLISHED}>PUBLISHED</option>
        </select>
      </label>

      <button className="btn-primary" type="button" onClick={submit}>
        Save Tender
      </button>
    </div>
  );
}
