"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export function InstantRouteLoader() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [active, setActive] = useState(false);
  const hardStopTimerRef = useRef<number | null>(null);
  const pendingTargetRef = useRef<string | null>(null);

  useEffect(() => {
    function clearTimers() {
      if (hardStopTimerRef.current !== null) {
        window.clearTimeout(hardStopTimerRef.current);
        hardStopTimerRef.current = null;
      }
    }

    function activateLoader() {
      setActive(true);
      clearTimers();
      hardStopTimerRef.current = window.setTimeout(() => setActive(false), 9000);
    }

    function onDocumentClick(event: MouseEvent) {
      if (event.defaultPrevented || event.button !== 0) return;
      if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
      const target = event.target;
      if (!(target instanceof Element)) return;

      const anchor = target.closest("a");
      if (!(anchor instanceof HTMLAnchorElement)) return;

      if (anchor.target && anchor.target !== "_self") return;
      if (anchor.hasAttribute("download")) return;

      const href = anchor.getAttribute("href");
      if (!href || href.startsWith("#") || href.startsWith("mailto:") || href.startsWith("tel:")) return;

      const nextUrl = new URL(anchor.href, window.location.href);
      const currentUrl = new URL(window.location.href);
      const nextLocation = `${nextUrl.pathname}?${nextUrl.searchParams.toString()}`;
      const currentLocation = `${currentUrl.pathname}?${currentUrl.searchParams.toString()}`;
      if (nextUrl.origin !== currentUrl.origin) return;
      if (nextLocation === currentLocation) return;

      pendingTargetRef.current = nextLocation;
      activateLoader();
    }

    document.addEventListener("click", onDocumentClick);
    return () => {
      document.removeEventListener("click", onDocumentClick);
      clearTimers();
    };
  }, []);

  useEffect(() => {
    if (!active) return;

    const locationNow = `${pathname}?${searchParams.toString()}`;
    const pendingTarget = pendingTargetRef.current;
    if (pendingTarget && locationNow === pendingTarget) {
      pendingTargetRef.current = null;
      setActive(false);
    }
  }, [active, pathname, searchParams]);

  return (
    <div className={`nageco-global-loader nageco-global-loader--instant ${active ? "is-active" : ""}`} aria-hidden={!active}>
      <div className="nageco-global-loader__panel">
        <img src="/nageco-logo.svg" alt="NAGECO Logo" width={963} height={333} className="nageco-global-loader__logo" />
        <div className="nageco-global-loader__bar">
          <span className="nageco-global-loader__bar-fill" />
        </div>
      </div>
    </div>
  );
}

