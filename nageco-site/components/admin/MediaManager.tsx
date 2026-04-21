"use client";

import Image from "next/image";
import { useState } from "react";
import { toast } from "sonner";
import { normalizeMediaUrl } from "@/lib/media-url";

type MediaItem = {
  id: string;
  fileName: string;
  url: string;
  mimeType: string;
  size: number;
};

function formatFileSize(size: number) {
  if (size < 1024) return `${size} B`;
  if (size < 1024 * 1024) return `${(size / 1024).toFixed(1)} KB`;
  return `${(size / (1024 * 1024)).toFixed(1)} MB`;
}

async function copyText(value: string) {
  if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(value);
    return;
  }

  if (typeof document === "undefined") {
    throw new Error("Clipboard is not available");
  }

  const textarea = document.createElement("textarea");
  textarea.value = value;
  textarea.setAttribute("readonly", "true");
  textarea.style.position = "absolute";
  textarea.style.left = "-9999px";
  document.body.appendChild(textarea);
  textarea.select();

  try {
    const copied = document.execCommand("copy");
    if (!copied) {
      throw new Error("Copy command failed");
    }
  } finally {
    document.body.removeChild(textarea);
  }
}

export function MediaManager({ initialItems, canEdit }: { initialItems: MediaItem[]; canEdit: boolean }) {
  const [items, setItems] = useState(initialItems);
  const [uploading, setUploading] = useState(false);
  const [failedPreviewIds, setFailedPreviewIds] = useState<Record<string, true>>({});

  async function onUpload(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    if (!file) return;

    setUploading(true);
    const data = new FormData();
    data.append("file", file);

    const response = await fetch("/api/upload", { method: "POST", body: data });
    setUploading(false);

    if (!response.ok) {
      toast.error("Upload failed");
      return;
    }

    const uploaded = (await response.json()) as MediaItem;
    setItems((current) => [uploaded, ...current]);
    toast.success("File uploaded");
  }

  async function deleteItem(id: string) {
    const response = await fetch(`/api/admin/media/${id}`, { method: "DELETE" });
    if (!response.ok) {
      toast.error("Delete failed");
      return;
    }
    setItems((current) => current.filter((item) => item.id !== id));
    toast.success("Media deleted");
  }

  async function copyItemUrl(url: string) {
    try {
      await copyText(url);
      toast.success("URL copied");
    } catch {
      toast.error("Copy failed");
    }
  }

  return (
    <div className="space-y-4">
      {canEdit && (
        <label className="btn-secondary inline-flex cursor-pointer">
          {uploading ? "Uploading..." : "Upload File"}
          <input type="file" className="hidden" onChange={onUpload} />
        </label>
      )}
      <div className="grid gap-4 md:grid-cols-3">
        {items.map((item) => {
          const mediaSrc = normalizeMediaUrl(item.url);
          const isImage = item.mimeType.startsWith("image/") && Boolean(mediaSrc) && !failedPreviewIds[item.id];

          return (
            <article key={item.id} className="card space-y-3 overflow-hidden">
              <div className="relative overflow-hidden rounded-[1.2rem] border border-brand-700/10 bg-slate-100/80">
                {isImage && mediaSrc ? (
                  <div className="relative aspect-[16/10] w-full">
                    <Image
                      src={mediaSrc}
                      alt={item.fileName}
                      fill
                      unoptimized
                      className="object-cover"
                      sizes="(max-width: 768px) 100vw, 33vw"
                      onError={() => {
                        setFailedPreviewIds((current) => ({ ...current, [item.id]: true }));
                      }}
                    />
                  </div>
                ) : (
                  <div className="flex aspect-[16/10] items-center justify-center bg-[linear-gradient(135deg,rgba(15,39,71,0.08),rgba(31,115,221,0.16))]">
                    <span className="rounded-full border border-brand-700/10 bg-white/80 px-4 py-2 text-xs font-extrabold uppercase tracking-[0.2em] text-brand-700">
                      {item.mimeType.split("/")[0] || "File"}
                    </span>
                  </div>
                )}
              </div>

              <div className="space-y-1">
                <div className="line-clamp-2 text-sm font-semibold text-black">{item.fileName}</div>
                <div className="text-xs font-medium uppercase tracking-[0.16em] text-black/45">
                  {item.mimeType} · {formatFileSize(item.size)}
                </div>
                <div className="break-all text-xs text-slate-600">{item.url}</div>
              </div>

              <div className="flex gap-2">
                <button type="button" className="btn-secondary" onClick={() => copyItemUrl(item.url)}>
                  Copy URL
                </button>
                {canEdit && (
                  <button type="button" className="btn-secondary" onClick={() => deleteItem(item.id)}>
                    Delete
                  </button>
                )}
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
}