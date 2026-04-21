"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { signOut } from "next-auth/react";
import { InlineBrandLogo } from "@/components/BrandLogo";

type AdminSidebarProps = {
  isAdmin: boolean;
};

const baseLinks = [
  { href: "/admin", label: "Dashboard" },
  { href: "/admin/posts", label: "Posts" },
  { href: "/admin/tenders", label: "Tenders" },
  { href: "/admin/projects", label: "Projects" },
  { href: "/admin/pages", label: "Pages" },
  { href: "/admin/career-vacancies", label: "Vacancies" },
  { href: "/admin/career-applications", label: "Applications" },
  { href: "/admin/contact-feedback", label: "Contact Feedback" },
  { href: "/admin/charts", label: "Charts" },
  { href: "/admin/media", label: "Media" },
  { href: "/admin/settings", label: "Settings" }
];

export function AdminSidebar({ isAdmin }: AdminSidebarProps) {
  const pathname = usePathname();
  const links = isAdmin ? [...baseLinks, { href: "/admin/users", label: "Users" }] : baseLinks;

  return (
    <aside className="w-full border-b border-slate-200 bg-white p-4 md:min-h-screen md:w-64 md:border-b-0 md:border-r">
      <div className="mb-6 flex items-center gap-2 text-lg font-bold text-brand-900"><InlineBrandLogo className="w-24" /> <span>CMS</span></div>
      <nav className="grid gap-1">
        {links.map((link) => {
          const active = pathname === link.href;
          return (
            <Link
              key={link.href}
              href={link.href}
              className={`rounded px-3 py-2 text-sm ${active ? "bg-brand-100 text-brand-900" : "text-slate-700 hover:bg-slate-100"}`}
            >
              {link.label}
            </Link>
          );
        })}
      </nav>
      <button
        type="button"
        onClick={() => signOut({ callbackUrl: "/admin/login" })}
        className="mt-6 w-full rounded border border-slate-300 px-3 py-2 text-sm text-slate-700"
      >
        Sign out
      </button>
    </aside>
  );
}
