"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { BrandLogo } from "@/components/BrandLogo";
import { getI18nMessages, type I18nNavItem } from "@/lib/i18n/messages";
import type { SiteLocale } from "@/lib/site-locale";

function isNavItemActive(pathname: string, item: I18nNavItem) {
  if (pathname === item.href) {
    return true;
  }

  return item.children?.some((child) => pathname === child.href) ?? false;
}

export function MainNavbar({
  locale,
  latestBreakingTitle,
  latestBreakingSlug
}: {
  locale: SiteLocale;
  latestBreakingTitle?: string | null;
  latestBreakingSlug?: string | null;
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [openSubmenu, setOpenSubmenu] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const isArabicLocale = locale === "ar";
  const i18n = getI18nMessages(locale);
  const nav = i18n.navbar.navItems;
  const switchToArabicHref = `/api/locale?locale=ar&redirect=${encodeURIComponent(pathname || "/")}`;
  const switchToEnglishHref = `/api/locale?locale=en&redirect=${encodeURIComponent(pathname || "/")}`;

  useEffect(() => {
    const scrolledEnterThreshold = 132;
    const scrolledExitThreshold = 18;

    const onScroll = () => {
      const currentY = window.scrollY;
      setScrolled((previous) => {
        if (previous) {
          return currentY > scrolledExitThreshold;
        }

        return currentY > scrolledEnterThreshold;
      });
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    setOpen(false);
    setOpenSubmenu(null);
  }, [pathname]);

  return (
    <header className="sticky top-0 z-50 pt-1 md:pt-1.5">
      <div className="container-page">
        <div
          className={`w-full overflow-hidden lg:overflow-visible rounded-[1.8rem] border transition-all duration-300 ${
            scrolled
              ? "border-brand-700/12 bg-white/82 shadow-[0_24px_70px_-38px_rgba(15,39,71,0.45)] backdrop-blur-2xl"
              : "border-white/60 bg-white/72 shadow-[0_22px_60px_-42px_rgba(15,39,71,0.45)] backdrop-blur-xl"
          }`}
        >
          <div className={`overflow-hidden transition-all duration-300 ${scrolled ? "max-h-0 opacity-0" : "max-h-20 opacity-100"}`}>
            <div className="flex flex-col gap-2 bg-[linear-gradient(90deg,#0f2747,#1f73dd)] px-5 py-3 text-white md:flex-row md:items-center md:justify-between md:px-7">
              <p className="text-xs font-semibold uppercase tracking-[0.24em] text-white/80 md:flex-1">
                {i18n.navbar.companyName}
              </p>
              <div className="hidden max-w-[42%] items-center md:flex">
                <Link
                  href={latestBreakingSlug ? `/news/${latestBreakingSlug}` : "/news"}
                  className="inline-flex max-w-full origin-center scale-[0.82] items-center gap-2 rounded-full border border-red-200/70 bg-red-500/75 px-4 py-1.5 text-white shadow-[0_10px_24px_-14px_rgba(239,68,68,0.85)] backdrop-blur-sm transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-500/90"
                  title={latestBreakingTitle ?? i18n.navbar.latestBreakingActionTitle}
                >
                  <span className="relative flex h-2.5 w-2.5">
                    <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-white/75" />
                    <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-white" />
                  </span>
                  <span className="text-[11px] font-extrabold uppercase tracking-[0.16em]">{i18n.navbar.latestBreakingLabel}</span>
                  <span className="h-1 w-1 rounded-full bg-white/70" />
                  <span className="truncate text-sm font-semibold text-white/95">
                    {latestBreakingTitle ?? i18n.navbar.latestBreakingDefaultTitle}
                  </span>
                </Link>
              </div>
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/88 md:flex-1 md:justify-end">
                <span>{i18n.navbar.executionTagline}</span>
                <span className="hidden h-1 w-1 rounded-full bg-white/70 md:inline-block" />
                <span>info@nageco.com</span>
                <span className="hidden h-1 w-1 rounded-full bg-white/70 md:inline-block" />
                <span>00218 21 563 4670 / 4</span>
              </div>
            </div>
          </div>

          <div className={`flex items-center justify-between gap-4 px-4 transition-all duration-300 md:px-6 ${scrolled ? "py-2.5" : "py-3"}`}>
            <BrandLogo compact src="/nageco-logo1.svg" className="w-16 md:w-20" />

            <nav className={`hidden items-center rounded-full border border-brand-700/10 bg-white/70 shadow-[0_14px_30px_-24px_rgba(15,39,71,0.4)] backdrop-blur lg:flex ${isArabicLocale ? "gap-0.5 p-1" : "gap-1 p-1.5"}`}>
              {nav.map((item) => {
                const active = isNavItemActive(pathname, item);

                if (item.children?.length) {
                  return (
                    <div key={item.href} className="group relative">
                      <Link
                        href={item.href}
                        aria-current={active ? "page" : undefined}
                        className={`nageco-main-link ${isArabicLocale ? "nageco-main-link--ar" : ""} inline-flex items-center gap-1.5 ${active ? "bg-brand-500/10 text-brand-700" : "text-black/75"}`}
                      >
                        {item.label}
                        <span className="text-xs">▾</span>
                      </Link>

                      <div className="pointer-events-none absolute left-0 top-full z-20 w-56 pt-3 opacity-0 transition duration-200 group-hover:pointer-events-auto group-hover:opacity-100 group-focus-within:pointer-events-auto group-focus-within:opacity-100">
                        <div className="rounded-2xl border border-brand-700/12 bg-white/95 p-2 shadow-[0_22px_60px_-34px_rgba(15,39,71,0.45)] backdrop-blur">
                          {item.children.map((child) => {
                            const childActive = pathname === child.href;
                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                className={`block rounded-xl px-3 py-2.5 font-semibold transition-colors ${isArabicLocale ? "text-[0.82rem]" : "text-sm"} ${
                                  childActive ? "bg-brand-500/10 text-brand-700" : "text-black/75 hover:bg-brand-700/5"
                                }`}
                              >
                                {child.label}
                              </Link>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  );
                }

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={`nageco-main-link ${isArabicLocale ? "nageco-main-link--ar" : ""} ${active ? "bg-brand-500/10 text-brand-700" : "text-black/75"}`}
                  >
                    {item.label}
                  </Link>
                );
              })}

            </nav>

            <div className="hidden lg:flex lg:items-center">
              <div className="inline-flex rounded-full border border-brand-700/12 bg-white/75 p-1 shadow-[0_12px_24px_-18px_rgba(15,39,71,0.35)]">
                <a
                  href={switchToEnglishHref}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${locale === "en" ? "bg-brand-700 text-white" : "text-brand-700 hover:bg-brand-700/8"}`}
                >
                  EN
                </a>
                <a
                  href={switchToArabicHref}
                  className={`rounded-full px-3 py-1.5 text-xs font-bold transition-colors ${locale === "ar" ? "bg-brand-700 text-white" : "text-brand-700 hover:bg-brand-700/8"}`}
                >
                  AR
                </a>
              </div>
            </div>

            <button
              type="button"
              onClick={() => setOpen((current) => !current)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-brand-500/18 bg-white/70 text-brand-700 shadow-[0_14px_30px_-22px_rgba(15,39,71,0.45)] backdrop-blur lg:hidden"
              aria-label="Toggle menu"
            >
              {open ? "✕" : "☰"}
            </button>
          </div>

          {open && (
            <div className="border-t border-brand-700/10 bg-white/82 px-4 pb-4 pt-2 backdrop-blur lg:hidden md:px-6">
              <div className="grid gap-2 rounded-[1.5rem] border border-brand-700/10 bg-white/80 p-3 shadow-[0_24px_50px_-34px_rgba(15,39,71,0.4)]">
                <div className="mb-1 inline-flex w-fit rounded-full border border-brand-700/12 bg-white p-1 text-xs font-bold">
                  <a
                    href={switchToEnglishHref}
                    className={`rounded-full px-3 py-1.5 ${locale === "en" ? "bg-brand-700 text-white" : "text-brand-700"}`}
                  >
                    EN
                  </a>
                  <a
                    href={switchToArabicHref}
                    className={`rounded-full px-3 py-1.5 ${locale === "ar" ? "bg-brand-700 text-white" : "text-brand-700"}`}
                  >
                    AR
                  </a>
                </div>
                {nav.map((item) => {
                  const active = isNavItemActive(pathname, item);

                  if (item.children?.length) {
                    const expanded = openSubmenu === item.href;

                    return (
                      <div key={item.href} className="rounded-xl border border-brand-700/10 bg-white/75 p-1.5">
                        <button
                          type="button"
                          onClick={() => setOpenSubmenu((current) => (current === item.href ? null : item.href))}
                          className={`flex w-full items-center justify-between rounded-lg px-3 py-2.5 text-left text-sm font-semibold transition-colors ${
                            active ? "bg-brand-500/10 text-brand-700" : "text-black/78 hover:bg-brand-700/5"
                          }`}
                          aria-expanded={expanded}
                        >
                          <span>{item.label}</span>
                          <span className="text-xs">{expanded ? "▴" : "▾"}</span>
                        </button>

                        {expanded && (
                          <div className="mt-1 grid gap-1 pb-1">
                            {item.children.map((child) => {
                              const childActive = pathname === child.href;

                              return (
                                <Link
                                  key={child.href}
                                  href={child.href}
                                  className={`rounded-lg px-3 py-2.5 text-sm font-semibold transition-colors ${
                                    childActive ? "bg-brand-500/10 text-brand-700" : "text-black/78 hover:bg-brand-700/5"
                                  }`}
                                  onClick={() => setOpen(false)}
                                >
                                  {child.label}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      className={`rounded-xl px-4 py-3 text-sm font-semibold transition-colors ${
                        active ? "bg-brand-500/10 text-brand-700" : "text-black/78 hover:bg-brand-700/5"
                      }`}
                      onClick={() => setOpen(false)}
                    >
                      {item.label}
                    </Link>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
