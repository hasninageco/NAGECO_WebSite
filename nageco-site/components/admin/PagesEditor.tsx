"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { PostStatus } from "@prisma/client";
import { toast } from "sonner";
import { normalizeMediaUrl } from "@/lib/media-url";
import { buildLocalizedPageSectionsJson, getPageSectionsByLocale, pageFieldDefinitions, pageKeys, type EditablePageKey } from "@/lib/page-content";
import type { SiteLocale } from "@/lib/site-locale";

type PageContentItem = {
  key: EditablePageKey;
  sectionsJson: unknown;
  seoTitle?: string | null;
  seoDescription?: string | null;
};

type NewsListItem = {
  id: string;
  title: string;
  status: PostStatus;
  updatedAt: string;
};

export function PagesEditor({ initialPages, initialNewsPosts }: { initialPages: PageContentItem[]; initialNewsPosts: NewsListItem[] }) {
  const [activeKey, setActiveKey] = useState<PageContentItem["key"]>("HOME");
  const [activeLanguage, setActiveLanguage] = useState<SiteLocale>("en");
  const [newsPosts, setNewsPosts] = useState<NewsListItem[]>(initialNewsPosts);
  const current = initialPages.find((item) => item.key === activeKey);
  const [sectionsByLocale, setSectionsByLocale] = useState<Record<SiteLocale, Record<string, string>>>(
    getPageSectionsByLocale(activeKey, current?.sectionsJson)
  );
  const [seoTitle, setSeoTitle] = useState(current?.seoTitle ?? "");
  const [seoDescription, setSeoDescription] = useState(current?.seoDescription ?? "");
  const sections = sectionsByLocale[activeLanguage];

  async function save() {
    const response = await fetch("/api/admin/pages", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        key: activeKey,
        sectionsJson: buildLocalizedPageSectionsJson(activeKey, sectionsByLocale),
        seoTitle,
        seoDescription
      })
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string; details?: string } | null;
      toast.error(payload?.error ?? "Failed to save page content");
      return;
    }
    toast.success("Page content saved");
  }

  function switchPage(key: PageContentItem["key"]) {
    setActiveKey(key);
    const next = initialPages.find((item) => item.key === key);
    setSectionsByLocale(getPageSectionsByLocale(key, next?.sectionsJson));
    setSeoTitle(next?.seoTitle ?? "");
    setSeoDescription(next?.seoDescription ?? "");
  }

  function updateSectionField(name: string, value: string) {
    setSectionsByLocale((currentSectionsByLocale) => ({
      ...currentSectionsByLocale,
      [activeLanguage]: {
        ...currentSectionsByLocale[activeLanguage],
        [name]: value
      }
    }));
  }

  async function updateNewsStatus(postId: string, status: PostStatus) {
    const response = await fetch(`/api/admin/posts/${postId}/status`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });

    if (!response.ok) {
      const payload = (await response.json().catch(() => null)) as { error?: string } | null;
      toast.error(payload?.error ?? "Failed to update news status");
      return;
    }

    setNewsPosts((currentPosts) => currentPosts.map((post) => (post.id === postId ? { ...post, status, updatedAt: new Date().toISOString() } : post)));
    toast.success(`News moved to ${status}`);
  }

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2">
        {pageKeys.map((key) => (
          <button
            key={key}
            type="button"
            className={`rounded px-3 py-2 text-sm ${activeKey === key ? "bg-brand-700 text-white" : "border border-slate-300"}`}
            onClick={() => switchPage(key)}
          >
            {key}
          </button>
        ))}
      </div>

      <div className="rounded-2xl border border-slate-200 bg-white/70 p-4">
        <div className="mb-4 flex items-center justify-between gap-3">
          <div>
            <p className="text-sm font-semibold text-slate-900">Page Content</p>
            <p className="text-xs text-slate-500">حرر النصوص مباشرة. HTML مسموح في حقول الوصف والمحتوى.</p>
          </div>
          <div className="inline-flex rounded-lg border border-slate-200 bg-slate-50 p-1 text-xs font-semibold">
            <button
              type="button"
              onClick={() => setActiveLanguage("en")}
              className={`rounded-md px-3 py-1.5 transition ${activeLanguage === "en" ? "bg-white text-brand-700 shadow" : "text-slate-600"}`}
            >
              English
            </button>
            <button
              type="button"
              onClick={() => setActiveLanguage("ar")}
              className={`rounded-md px-3 py-1.5 transition ${activeLanguage === "ar" ? "bg-white text-brand-700 shadow" : "text-slate-600"}`}
            >
              العربية
            </button>
          </div>
        </div>

        <div className="grid gap-4">
          {pageFieldDefinitions[activeKey].map((field) => (
            <label key={field.name} className="space-y-1.5">
              <span className="text-sm font-medium text-slate-700">{field.label}</span>
              {field.type === "textarea" ? (
                <textarea
                  className="input min-h-24"
                  rows={field.rows}
                  placeholder={field.placeholder}
                  value={sections[field.name] ?? ""}
                  onChange={(event) => updateSectionField(field.name, event.target.value)}
                />
              ) : field.type === "media" ? (
                <div className="space-y-2">
                  <input
                    className="input"
                    placeholder={field.placeholder}
                    value={sections[field.name] ?? ""}
                    onChange={(event) => updateSectionField(field.name, event.target.value)}
                  />
                  <p className="text-xs text-slate-500">Paste a local path مثل /uploads/file.jpg أو رابط صورة كامل. يمكنك رفع الصور من Media ثم نسخ الرابط.</p>
                  {normalizeMediaUrl(sections[field.name]) ? (
                    <div className="relative h-40 w-full overflow-hidden rounded-2xl border border-slate-200 bg-slate-100/70 md:h-48">
                      <Image
                        src={normalizeMediaUrl(sections[field.name])!}
                        alt={field.label}
                        fill
                        className="object-fill"
                        sizes="(max-width: 768px) 100vw, 50vw"
                      />
                    </div>
                  ) : null}
                </div>
              ) : (
                <input
                  className="input"
                  placeholder={field.placeholder}
                  value={sections[field.name] ?? ""}
                  onChange={(event) => updateSectionField(field.name, event.target.value)}
                />
              )}
            </label>
          ))}
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <input className="input" placeholder="SEO title" value={seoTitle} onChange={(event) => setSeoTitle(event.target.value)} />
        <input className="input" placeholder="SEO description" value={seoDescription} onChange={(event) => setSeoDescription(event.target.value)} />
      </div>

      <button type="button" className="btn-primary" onClick={save}>
        Save Page
      </button>

      {activeKey === "NEWS" && (
        <div className="card space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-3">
            <h2 className="text-lg font-semibold">News List</h2>
            <Link href="/admin/posts/new" className="btn-primary">
              New News
            </Link>
          </div>
          <div className="overflow-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="text-left text-slate-600">
                  <th className="p-2">Title</th>
                  <th className="p-2">Status</th>
                  <th className="p-2">Updated</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {newsPosts.map((post) => (
                  <tr key={post.id} className="border-t">
                    <td className="p-2">{post.title}</td>
                    <td className="p-2">{post.status}</td>
                    <td className="p-2">{new Date(post.updatedAt).toLocaleString()}</td>
                    <td className="p-2">
                      <div className="flex flex-wrap items-center gap-3">
                        <Link href={`/admin/posts/${post.id}`} className="text-brand-700 hover:underline">
                          Edit
                        </Link>
                        <button
                          type="button"
                          className="text-emerald-700 hover:underline disabled:text-slate-400"
                          disabled={post.status === PostStatus.PUBLISHED}
                          onClick={() => updateNewsStatus(post.id, PostStatus.PUBLISHED)}
                        >
                          Publish
                        </button>
                        <button
                          type="button"
                          className="text-amber-700 hover:underline disabled:text-slate-400"
                          disabled={post.status === PostStatus.DRAFT}
                          onClick={() => updateNewsStatus(post.id, PostStatus.DRAFT)}
                        >
                          Draft
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
                {newsPosts.length === 0 && (
                  <tr>
                    <td className="p-2 text-slate-500" colSpan={4}>
                      No news items yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
