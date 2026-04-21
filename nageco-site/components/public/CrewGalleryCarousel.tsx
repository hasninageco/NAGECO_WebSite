"use client";

import Image from "next/image";
import { useCallback, useEffect, useMemo, useState } from "react";

type CrewGalleryCarouselProps = {
  images: string[];
  crewCode: string;
};

const effectModes = ["slide", "fade", "stack"] as const;
type EffectMode = (typeof effectModes)[number];

export function CrewGalleryCarousel({ images, crewCode }: CrewGalleryCarouselProps) {
  const slides = useMemo(
    () => images.filter((item, index, all) => Boolean(item) && all.indexOf(item) === index),
    [images]
  );
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [effectIndex, setEffectIndex] = useState(0);

  const hasMultipleSlides = slides.length > 1;
  const activeEffect = effectModes[effectIndex % effectModes.length] as EffectMode;

  const goTo = useCallback((index: number) => {
    setActive(index);
    setEffectIndex((current) => current + 1);
  }, []);

  const goPrev = useCallback(() => {
    if (!hasMultipleSlides) return;
    setActive((current) => (current - 1 + slides.length) % slides.length);
    setEffectIndex((current) => current + 1);
  }, [hasMultipleSlides, slides.length]);

  const goNext = useCallback(() => {
    if (!hasMultipleSlides) return;
    setActive((current) => (current + 1) % slides.length);
    setEffectIndex((current) => current + 1);
  }, [hasMultipleSlides, slides.length]);

  const switchEffect = useCallback(() => {
    setEffectIndex((current) => current + 1);
  }, []);

  useEffect(() => {
    setActive(0);
    setEffectIndex(0);
  }, [slides.length]);

  useEffect(() => {
    if (!hasMultipleSlides || paused) return;

    const timer = setInterval(() => {
      goNext();
    }, 3800);

    return () => clearInterval(timer);
  }, [goNext, hasMultipleSlides, paused]);

  if (slides.length === 0) {
    return null;
  }

  return (
    <div
      className="space-y-3"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onTouchStart={() => setPaused(true)}
      onTouchEnd={() => setPaused(false)}
    >
      <div className="relative overflow-hidden rounded-2xl border border-brand-700/15 bg-white shadow-[0_20px_45px_-30px_rgba(31,115,221,0.6)]">
        <div className="relative h-64 w-full sm:h-72 md:h-80">
          {activeEffect === "slide" && (
            <div
              className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
              style={{ transform: `translateX(-${active * 100}%)` }}
            >
              {slides.map((src, index) => (
                <div key={`${src}-${index}`} className="relative h-full w-full shrink-0 overflow-hidden">
                  <Image
                    src={src}
                    alt={`Crew ${crewCode} image ${index + 1}`}
                    fill
                    className={`object-cover transition-transform duration-[5000ms] ${active === index ? "scale-[1.06]" : "scale-100"}`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,31,0.05),rgba(8,17,31,0.02)_40%,rgba(8,17,31,0.45)_100%)]" />
                </div>
              ))}
            </div>
          )}

          {activeEffect === "fade" && (
            <div className="relative h-full w-full overflow-hidden">
              {slides.map((src, index) => (
                <div
                  key={`${src}-${index}`}
                  className={`absolute inset-0 transition-all duration-700 ease-out ${
                    active === index ? "opacity-100 scale-100" : "opacity-0 scale-[1.03]"
                  }`}
                >
                  <Image
                    src={src}
                    alt={`Crew ${crewCode} image ${index + 1}`}
                    fill
                    className={`object-cover transition-transform duration-[5200ms] ${active === index ? "scale-[1.08]" : "scale-100"}`}
                    sizes="(max-width: 768px) 100vw, 50vw"
                  />
                  <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,31,0.08),rgba(8,17,31,0.02)_45%,rgba(8,17,31,0.5)_100%)]" />
                </div>
              ))}
            </div>
          )}

          {activeEffect === "stack" && (
            <div className="relative h-full w-full overflow-hidden">
              {slides.map((src, index) => {
                const isActive = index === active;
                const isPrev = index === (active - 1 + slides.length) % slides.length;
                const isNext = index === (active + 1) % slides.length;

                let styleClass = "opacity-0 scale-90 translate-x-0 z-0";
                if (isActive) styleClass = "opacity-100 scale-100 translate-x-0 z-20";
                if (isPrev) styleClass = "opacity-45 scale-[0.92] -translate-x-[14%] z-10";
                if (isNext) styleClass = "opacity-45 scale-[0.92] translate-x-[14%] z-10";

                return (
                  <div
                    key={`${src}-${index}`}
                    className={`absolute inset-0 transition-all duration-700 ease-[cubic-bezier(0.22,1,0.36,1)] ${styleClass}`}
                  >
                    <Image
                      src={src}
                      alt={`Crew ${crewCode} image ${index + 1}`}
                      fill
                      className={`object-cover transition-transform duration-[5000ms] ${isActive ? "scale-[1.06]" : "scale-100"}`}
                      sizes="(max-width: 768px) 100vw, 50vw"
                    />
                    <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,31,0.04),rgba(8,17,31,0.04)_35%,rgba(8,17,31,0.52)_100%)]" />
                  </div>
                );
              })}
            </div>
          )}

          {hasMultipleSlides && (
            <>
              <div className="absolute inset-x-0 top-3 flex justify-center gap-2">
                <div className="rounded-full border border-white/25 bg-white/20 px-3 py-1 text-xs font-semibold text-white backdrop-blur-md">
                  {active + 1} / {slides.length}
                </div>
                <button
                  type="button"
                  onClick={switchEffect}
                  className="rounded-full border border-white/25 bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.08em] text-white backdrop-blur-md transition hover:bg-white/30"
                  aria-label="Switch carousel effect"
                >
                  {activeEffect}
                </button>
              </div>

              <div className="pointer-events-none absolute inset-x-0 top-11 flex justify-center">
                <div className="h-6 w-24 rounded-full bg-white/20 blur-xl" />
                </div>

              <div className="absolute inset-x-0 bottom-3 flex items-center justify-between px-3">
                <button
                  type="button"
                  aria-label={`Previous Crew ${crewCode} image`}
                  onClick={goPrev}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/40"
                >
                  ←
                </button>
                <button
                  type="button"
                  aria-label={`Next Crew ${crewCode} image`}
                  onClick={goNext}
                  className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-white/30 bg-black/25 text-white backdrop-blur-sm transition hover:bg-black/40"
                >
                  →
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {hasMultipleSlides && (
        <div className="flex flex-wrap items-center gap-2">
          {slides.map((src, index) => (
            <button
              key={`crew-${crewCode}-dot-${index}`}
              type="button"
              onClick={() => goTo(index)}
              aria-label={`Go to Crew ${crewCode} image ${index + 1}`}
              className={`h-2.5 rounded-full transition-all duration-300 ${active === index ? "w-7 bg-brand-700" : "w-2.5 bg-brand-700/35 hover:bg-brand-700/60"}`}
              title={`Image ${index + 1}`}
            />
          ))}

          <div className="ml-auto flex items-center gap-2 overflow-x-auto pb-1">
            {slides.map((src, index) => (
              <button
                key={`crew-${crewCode}-thumb-${index}`}
                type="button"
                onClick={() => goTo(index)}
                className={`relative h-12 w-16 shrink-0 overflow-hidden rounded-lg border transition ${
                  active === index ? "border-brand-700 shadow-[0_8px_20px_-10px_rgba(31,115,221,0.7)]" : "border-brand-700/15 hover:border-brand-700/45"
                }`}
                aria-label={`Open Crew ${crewCode} thumbnail ${index + 1}`}
              >
                <Image src={src} alt={`Crew ${crewCode} thumbnail ${index + 1}`} fill className="object-cover" sizes="64px" />
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
