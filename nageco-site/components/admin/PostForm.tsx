"use client";

import { useMemo, useState } from "react";
import { PostStatus } from "@prisma/client";
import { toast } from "sonner";
import { slugify } from "@/lib/slug";

type PostFormProps = {
  initial?: {
    id?: string;
    title: string;
    titleAr?: string | null;
    slug: string;
    excerpt: string;
    excerptAr?: string | null;
    contentHtml: string;
    contentHtmlAr?: string | null;
    coverImageUrl?: string | null;
    tags: string[];
    status: PostStatus;
    seoTitle?: string | null;
    seoTitleAr?: string | null;
    seoDescription?: string | null;
    seoDescriptionAr?: string | null;
    ogImageUrl?: string | null;
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

export function PostForm({ initial }: PostFormProps) {
  const [preview, setPreview] = useState(false);
  const [form, setForm] = useState({
    title: initial?.title ?? "",
    titleAr: initial?.titleAr ?? "",
    slug: initial?.slug ?? "",
    excerpt: initial?.excerpt ?? "",
    excerptAr: initial?.excerptAr ?? "",
    contentHtml: initial?.contentHtml ?? "",
    contentHtmlAr: initial?.contentHtmlAr ?? "",
    coverImageUrl: initial?.coverImageUrl ?? "",
    tags: initial?.tags.join(",") ?? "",
    status: initial?.status ?? PostStatus.DRAFT,
    seoTitle: initial?.seoTitle ?? "",
    seoTitleAr: initial?.seoTitleAr ?? "",
    seoDescription: initial?.seoDescription ?? "",
    seoDescriptionAr: initial?.seoDescriptionAr ?? "",
    ogImageUrl: initial?.ogImageUrl ?? ""
  });

  const payload = useMemo(
    () => ({
      ...form,
      tags: form.tags
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean)
    }),
    [form]
  );

  async function submit() {
    const endpoint = initial?.id ? `/api/admin/posts/${initial.id}` : "/api/admin/posts";
    const method = initial?.id ? "PATCH" : "POST";

    const response = await fetch(endpoint, {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const result = await response.json().catch(() => null);
      const message = extractApiErrorMessage(result, "Failed to save post");
      toast.error(message);
      return;
    }

    toast.success("Post saved");
    window.location.href = "/admin/posts";
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
          <input
            className="input"
            dir="rtl"
            value={form.titleAr}
            onChange={(event) => setForm((current) => ({ ...current, titleAr: event.target.value }))}
          />
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
          <span className="text-sm">Excerpt (English)</span>
          <textarea className="input min-h-24" value={form.excerpt} onChange={(event) => setForm((current) => ({ ...current, excerpt: event.target.value }))} />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Excerpt (Arabic)</span>
          <textarea
            className="input min-h-24"
            dir="rtl"
            value={form.excerptAr}
            onChange={(event) => setForm((current) => ({ ...current, excerptAr: event.target.value }))}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm">Content HTML (English)</span>
          <textarea className="input min-h-48" value={form.contentHtml} onChange={(event) => setForm((current) => ({ ...current, contentHtml: event.target.value }))} />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Content HTML (Arabic)</span>
          <textarea
            className="input min-h-48"
            dir="rtl"
            value={form.contentHtmlAr}
            onChange={(event) => setForm((current) => ({ ...current, contentHtmlAr: event.target.value }))}
          />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <label className="space-y-1">
          <span className="text-sm">Cover Image URL</span>
          <input className="input" value={form.coverImageUrl} onChange={(event) => setForm((current) => ({ ...current, coverImageUrl: event.target.value }))} />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Tags (comma separated)</span>
          <input className="input" value={form.tags} onChange={(event) => setForm((current) => ({ ...current, tags: event.target.value }))} />
        </label>
        <label className="space-y-1">
          <span className="text-sm">Status</span>
          <select
            className="input"
            value={form.status}
            onChange={(event) => setForm((current) => ({ ...current, status: event.target.value as PostStatus }))}
          >
            <option value={PostStatus.DRAFT}>DRAFT</option>
            <option value={PostStatus.PUBLISHED}>PUBLISHED</option>
            <option value={PostStatus.ARCHIVED}>ARCHIVED</option>
          </select>
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm">SEO title (English)</span>
          <input className="input" value={form.seoTitle} onChange={(event) => setForm((current) => ({ ...current, seoTitle: event.target.value }))} />
        </label>
        <label className="space-y-1">
          <span className="text-sm">SEO title (Arabic)</span>
          <input className="input" dir="rtl" value={form.seoTitleAr} onChange={(event) => setForm((current) => ({ ...current, seoTitleAr: event.target.value }))} />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm">OG image URL</span>
          <input className="input" value={form.ogImageUrl} onChange={(event) => setForm((current) => ({ ...current, ogImageUrl: event.target.value }))} />
        </label>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <label className="space-y-1">
          <span className="text-sm">SEO description (English)</span>
          <textarea className="input min-h-20" value={form.seoDescription} onChange={(event) => setForm((current) => ({ ...current, seoDescription: event.target.value }))} />
        </label>
        <label className="space-y-1">
          <span className="text-sm">SEO description (Arabic)</span>
          <textarea
            className="input min-h-20"
            dir="rtl"
            value={form.seoDescriptionAr}
            onChange={(event) => setForm((current) => ({ ...current, seoDescriptionAr: event.target.value }))}
          />
        </label>
      </div>

      <div className="flex gap-3">
        <button className="btn-primary" type="button" onClick={submit}>
          Save Post
        </button>
        <button className="btn-secondary" type="button" onClick={() => setPreview((current) => !current)}>
          {preview ? "Hide Preview" : "Preview"}
        </button>
      </div>

      {preview && (
        <div className="grid gap-4 md:grid-cols-2">
          <article className="card prose max-w-none" dangerouslySetInnerHTML={{ __html: form.contentHtml }} />
          <article className="card prose max-w-none" dir="rtl" dangerouslySetInnerHTML={{ __html: form.contentHtmlAr || "<p>No Arabic content preview.</p>" }} />
        </div>
      )}
    </div>
  );
}