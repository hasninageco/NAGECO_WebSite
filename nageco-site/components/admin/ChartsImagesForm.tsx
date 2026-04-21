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
};

type ChartsImagesFormProps = {
  initialHiveChartImageUrl: string;
  initialOrganizationalStructureImageUrl: string;
  mediaItems: MediaItem[];
};

export function ChartsImagesForm({ initialHiveChartImageUrl, initialOrganizationalStructureImageUrl, mediaItems }: ChartsImagesFormProps) {
  const imageMediaItems = mediaItems.filter((item) => item.mimeType.startsWith("image/") && normalizeMediaUrl(item.url));

  const [hiveChartImageUrl, setHiveChartImageUrl] = useState(initialHiveChartImageUrl);
  const [organizationalStructureImageUrl, setOrganizationalStructureImageUrl] = useState(initialOrganizationalStructureImageUrl);
  const [saving, setSaving] = useState(false);

  async function save() {
    setSaving(true);
    try {
      const response = await fetch("/api/admin/charts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          hiveChartImageUrl: hiveChartImageUrl.trim(),
          organizationalStructureImageUrl: organizationalStructureImageUrl.trim()
        })
      });

      if (!response.ok) {
        toast.error("Failed to save chart images");
        return;
      }

      toast.success("Chart images saved");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="space-y-5">
      <div className="grid gap-4 lg:grid-cols-2">
        <section className="rounded-[1.3rem] border border-brand-700/12 bg-white/75 p-4">
          <p className="text-sm font-semibold text-black">Hive Chart Image</p>
          <input
            className="input mt-2"
            placeholder="/uploads/..."
            value={hiveChartImageUrl}
            onChange={(event) => setHiveChartImageUrl(event.target.value)}
          />
          <div className="mt-3 overflow-hidden rounded-xl border border-brand-700/10 bg-slate-100/80">
            {normalizeMediaUrl(hiveChartImageUrl) ? (
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={normalizeMediaUrl(hiveChartImageUrl)!}
                  alt="Hive chart preview"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center text-sm font-medium text-black/40">No image selected</div>
            )}
          </div>
        </section>

        <section className="rounded-[1.3rem] border border-brand-700/12 bg-white/75 p-4">
          <p className="text-sm font-semibold text-black">Organizational Structure Image</p>
          <input
            className="input mt-2"
            placeholder="/uploads/..."
            value={organizationalStructureImageUrl}
            onChange={(event) => setOrganizationalStructureImageUrl(event.target.value)}
          />
          <div className="mt-3 overflow-hidden rounded-xl border border-brand-700/10 bg-slate-100/80">
            {normalizeMediaUrl(organizationalStructureImageUrl) ? (
              <div className="relative aspect-[16/10] w-full">
                <Image
                  src={normalizeMediaUrl(organizationalStructureImageUrl)!}
                  alt="Organizational structure preview"
                  fill
                  className="object-contain"
                  sizes="(max-width: 1024px) 100vw, 45vw"
                />
              </div>
            ) : (
              <div className="flex aspect-[16/10] items-center justify-center text-sm font-medium text-black/40">No image selected</div>
            )}
          </div>
        </section>
      </div>

      <div className="rounded-[1.3rem] border border-brand-700/12 bg-white/75 p-4">
        <p className="text-sm font-semibold text-black">Pick from Media Library</p>
        <p className="mt-1 text-xs text-black/55">Select which page should use each image.</p>

        <div className="mt-3 grid gap-3 md:grid-cols-2 xl:grid-cols-3">
          {imageMediaItems.map((item) => {
            const mediaSrc = normalizeMediaUrl(item.url);
            if (!mediaSrc) return null;

            return (
              <article key={item.id} className="overflow-hidden rounded-[1rem] border border-brand-700/10 bg-white p-2.5">
                <div className="relative overflow-hidden rounded-[0.7rem] bg-slate-100">
                  <div className="relative aspect-[16/10] w-full">
                    <Image src={mediaSrc} alt={item.fileName} fill className="object-cover" sizes="(max-width: 768px) 100vw, 33vw" />
                  </div>
                </div>
                <div className="mt-2 line-clamp-2 text-xs font-medium text-black/85">{item.fileName}</div>
                <div className="mt-2 flex gap-2">
                  <button type="button" className="btn-secondary flex-1" onClick={() => setHiveChartImageUrl(item.url)}>
                    Use For Hive
                  </button>
                  <button type="button" className="btn-secondary flex-1" onClick={() => setOrganizationalStructureImageUrl(item.url)}>
                    Use For Org
                  </button>
                </div>
              </article>
            );
          })}
        </div>
      </div>

      <button type="button" className="btn-primary" onClick={save} disabled={saving}>
        {saving ? "Saving..." : "Save Chart Images"}
      </button>
    </div>
  );
}
