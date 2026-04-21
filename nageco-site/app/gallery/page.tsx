import type { Metadata } from "next";
import { readdir } from "node:fs/promises";
import path from "node:path";
import Image from "next/image";

export const metadata: Metadata = {
  title: "Gallery | NAGECO"
};

const IMAGE_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp", ".avif"]);

async function getGalleryImages() {
  const uploadsDir = path.join(process.cwd(), "public", "uploads");

  try {
    const entries = await readdir(uploadsDir, { withFileTypes: true });
    const uploadedImages = entries
      .filter((entry) => entry.isFile())
      .map((entry) => entry.name)
      .filter((fileName) => IMAGE_EXTENSIONS.has(path.extname(fileName).toLowerCase()))
      .map((fileName) => `/uploads/${fileName}`);

    if (uploadedImages.length > 0) {
      return uploadedImages;
    }
  } catch {
    // Fall back to curated images when uploads folder is empty or unavailable.
  }

  return ["/DSC08351.JPG", "/nageco-logo1.svg", "/Stamp.png"];
}

export default async function GalleryPage() {
  const images = await getGalleryImages();

  return (
    <div className="container-page py-10 md:py-14">
      <section className="nageco-panel relative overflow-hidden rounded-3xl border border-brand-700/20 bg-white/90 p-6 shadow-2xl shadow-brand-700/10 backdrop-blur-sm md:p-10">
        <div className="pointer-events-none absolute -right-16 -top-16 h-44 w-44 rounded-full bg-brand-500/15 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-20 -left-14 h-44 w-44 rounded-full bg-brand-700/10 blur-3xl" />

        <div className="relative space-y-4 md:space-y-6">
          <span className="nageco-overline">NAGECO Gallery</span>
          <h1 className="max-w-4xl text-3xl font-black tracking-tight text-black md:text-5xl">Gallery</h1>
          <p className="max-w-3xl text-base leading-7 text-slate-600 md:text-lg">
            A curated look at field operations, technical workflows, and visual milestones from NAGECO projects.
          </p>

          <div className="grid gap-4 pt-2 sm:grid-cols-2 lg:grid-cols-3">
            {images.map((src, index) => (
              <article
                key={`${src}-${index}`}
                className="group relative overflow-hidden rounded-2xl border border-brand-700/12 bg-white shadow-[0_20px_60px_-42px_rgba(15,39,71,0.45)]"
              >
                <div className="relative aspect-[4/3] w-full">
                  <Image
                    src={src}
                    alt={`NAGECO gallery image ${index + 1}`}
                    fill
                    sizes="(max-width: 1024px) 100vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
