import { notFound } from "next/navigation";
import { services } from "@/content/services";

function InsightIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <path d="M12 4.5C7.5 4.5 4.4 8.1 3.5 12C4.4 15.9 7.5 19.5 12 19.5C16.5 19.5 19.6 15.9 20.5 12C19.6 8.1 16.5 4.5 12 4.5Z" stroke="currentColor" strokeWidth="1.8" />
      <circle cx="12" cy="12" r="2.7" stroke="currentColor" strokeWidth="1.8" />
    </svg>
  );
}

function OpsIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <path d="M4 12H8L10 8L13 16L15 12H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4 19H20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
    </svg>
  );
}

function GeoIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4">
      <path d="M12 3.5L18.5 6.5V11.5C18.5 15 16.2 18 12 19.7C7.8 18 5.5 15 5.5 11.5V6.5L12 3.5Z" stroke="currentColor" strokeWidth="1.8" strokeLinejoin="round" />
      <path d="M8.7 11.8L10.7 13.8L15.3 9.2" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const detailChipIcons = [InsightIcon, OpsIcon, GeoIcon] as const;

function detailToChips(text: string) {
  return text
    .split(/,|\.|;| and /gi)
    .map((part) => part.trim())
    .filter((part) => part.length > 3)
    .slice(0, 6);
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const service = services.find((entry) => entry.slug === slug);
  if (!service) {
    notFound();
  }

  return (
    <div className="container-page py-10">
      <article className="card space-y-5">
        <h1 className="text-3xl font-bold">{service.title}</h1>
        <div className="flex flex-wrap gap-2">
          {detailToChips(service.details).map((chip, index) => {
            const ChipIcon = detailChipIcons[index % detailChipIcons.length];
            return (
              <span
                key={`${service.slug}-${chip}`}
                className="inline-flex items-center gap-2 rounded-full border border-brand-700/12 bg-brand-50/70 px-3 py-1.5 text-xs font-bold uppercase tracking-[0.09em] text-brand-700"
              >
                <ChipIcon />
                {chip}
              </span>
            );
          })}
        </div>
        <p className="text-slate-700">{service.details}</p>
      </article>
    </div>
  );
}