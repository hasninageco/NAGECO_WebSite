import { BrandLogo } from "@/components/BrandLogo";
import Link from "next/link";

const CONTACT_EMAIL = "info@nageco.com";
const CONTACT_PHONE = "00218 21 563 4670 / 4";

export default function HomePage() {
  const phoneHref = CONTACT_PHONE.replace(/[^\d+]/g, "");

  return (
    <section className="relative isolate min-h-[100dvh] overflow-hidden px-4 py-10 sm:px-6 lg:px-10">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[url('/DSC08351.JPG')] bg-cover bg-center opacity-30"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_16%_18%,rgba(31,115,221,0.26),transparent_42%),radial-gradient(circle_at_86%_10%,rgba(15,39,71,0.2),transparent_35%),linear-gradient(180deg,rgba(255,255,255,0.55),rgba(245,249,255,0.72),rgba(255,255,255,0.78))]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-20 top-32 h-60 w-60 rounded-full bg-brand-500/20 blur-3xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 bottom-20 h-72 w-72 rounded-full bg-brand-700/20 blur-3xl"
      />

      <div className="container-page relative z-10">
        <div className="mx-auto max-w-4xl rounded-[2rem] border border-brand-700/15 bg-white/78 p-6 shadow-[0_45px_120px_-56px_rgba(15,39,71,0.55)] backdrop-blur-xl sm:p-8 lg:p-10">
          <div className="flex justify-center">
            <BrandLogo compact className="w-56 max-w-full sm:w-72" />
          </div>

          <div className="mt-8 text-center">
            <p className="inline-flex items-center gap-2 rounded-full border border-brand-700/15 bg-white/65 px-4 py-1.5 text-[0.7rem] font-extrabold uppercase tracking-[0.26em] text-brand-800/85">
              NAGECO
            </p>
            <div className="mt-4 flex justify-center">
              <span className="inline-flex items-center gap-2 rounded-full border border-amber-400/45 bg-amber-50/80 px-3 py-1.5 text-xs font-extrabold uppercase tracking-[0.14em] text-amber-700">
                <span className="relative inline-flex h-5 w-5 items-center justify-center">
                  <span className="absolute inline-flex h-5 w-5 rounded-full border border-amber-500/45 animate-ping" />
                  <svg viewBox="0 0 24 24" aria-hidden="true" className="relative h-4 w-4 animate-[spin_2.8s_linear_infinite] text-amber-600">
                    <path
                      fill="currentColor"
                      d="M11 2h2v3.1a7 7 0 0 1 2.28.95l2.2-2.2 1.42 1.42-2.2 2.2A7 7 0 0 1 17.9 11H21v2h-3.1a7 7 0 0 1-.95 2.28l2.2 2.2-1.42 1.42-2.2-2.2A7 7 0 0 1 13 17.9V21h-2v-3.1a7 7 0 0 1-2.28-.95l-2.2 2.2-1.42-1.42 2.2-2.2A7 7 0 0 1 6.1 13H3v-2h3.1a7 7 0 0 1 .95-2.28l-2.2-2.2L6.27 3.1l2.2 2.2A7 7 0 0 1 11 6.1V2Zm1 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6Z"
                    />
                  </svg>
                </span>
                Under Construction
              </span>
            </div>
            <h1 className="mt-5 text-3xl font-black leading-tight text-brand-900 sm:text-4xl lg:text-5xl">
              Website Under Construction
            </h1>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-black/70 sm:text-lg">
              We are currently preparing the new NAGECO website experience. Thank you for your patience while we finish the full content and services sections.
            </p>
          </div>

          <div className="mt-10 grid gap-4 sm:grid-cols-2">
            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="group rounded-2xl border border-brand-700/18 bg-white/80 p-5 text-start shadow-[0_26px_60px_-44px_rgba(15,39,71,0.5)] transition duration-300 hover:-translate-y-0.5 hover:border-brand-500/40 hover:bg-white"
            >
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-black/45">Email</p>
              <p className="mt-2 break-all text-lg font-bold text-brand-800 group-hover:text-brand-700">{CONTACT_EMAIL}</p>
            </a>

            <a
              href={`tel:${phoneHref}`}
              className="group rounded-2xl border border-brand-700/18 bg-white/80 p-5 text-start shadow-[0_26px_60px_-44px_rgba(15,39,71,0.5)] transition duration-300 hover:-translate-y-0.5 hover:border-brand-500/40 hover:bg-white"
            >
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-black/45">Phone</p>
              <p className="mt-2 text-lg font-bold text-brand-800 group-hover:text-brand-700">{CONTACT_PHONE}</p>
            </a>
          </div>

          <div className="mt-6 flex justify-center">
            <Link
              href="/admin"
              className="inline-flex items-center justify-center rounded-full border border-brand-700/20 bg-brand-700 px-6 py-3 text-sm font-extrabold uppercase tracking-[0.14em] text-white shadow-[0_24px_44px_-28px_rgba(15,39,71,0.7)] transition duration-300 hover:-translate-y-0.5 hover:bg-brand-800"
            >
              Open Admin
            </Link>
          </div>

          <p className="mt-9 text-center text-sm font-semibold text-black/55">
            New pages will be published progressively. Please check back soon.
          </p>
        </div>
      </div>
    </section>
  );
}
