import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Website Hierarchy | NAGECO"
};

const sitemapGroups: Array<{ title: string; links: Array<{ href: string; label: string }> }> = [
  {
    title: "Main",
    links: [
      { href: "/", label: "Home" },
      { href: "/about", label: "About" },
      { href: "/services", label: "Services" },
      { href: "/career", label: "Career" },
      { href: "/partner", label: "Clients" },
      { href: "/news", label: "News" },
      { href: "/related-links", label: "Related Links" },
      { href: "/our-team", label: "Our Team" },
      { href: "/tender", label: "Tender" },
      { href: "/hse", label: "HSE" },
      { href: "/contact", label: "Contact" }
    ]
  },
  {
    title: "About Subpages",
    links: [
      { href: "/about/organizational-structure", label: "Organizational Structure" },
      { href: "/about/hive-chart", label: "Hive Chart" },
      { href: "/about/site-map", label: "Website Hierarchy" }
    ]
  },
  {
    title: "Operations",
    links: [
      { href: "/crew", label: "Crew" },
      { href: "/projects", label: "Projects" }
    ]
  }
];

export default function SiteMapPage() {
  return (
    <div className="container-page py-8 md:py-14">
      <section className="nageco-panel rounded-3xl border border-brand-700/20 bg-white/90 p-6 shadow-2xl shadow-brand-700/10 backdrop-blur-sm md:p-10">
        <header className="mb-8">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-brand-500">About</p>
          <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-900 md:text-5xl">Website Hierarchy</h1>
          <p className="mt-3 text-base text-slate-600 md:text-lg">Quick map of the main pages and structure of the NAGECO website.</p>
        </header>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
          {sitemapGroups.map((group) => (
            <article key={group.title} className="rounded-2xl border border-brand-700/12 bg-white/80 p-4">
              <h2 className="text-lg font-bold text-slate-900">{group.title}</h2>
              <div className="mt-3 grid gap-2">
                {group.links.map((link) => (
                  <Link
                    key={link.href}
                    href={link.href}
                    className="rounded-xl border border-brand-700/10 bg-brand-500/[0.05] px-3 py-2 text-sm font-semibold text-brand-700 transition-colors hover:bg-brand-500/10"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
