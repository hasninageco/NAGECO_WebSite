"use client";

import Image from "next/image";
import { useEffect, useState } from "react";

type CarouselSlide = {
  src: string;
  alt: string;
};

const defaultSlides: CarouselSlide[] = [
  {
    src: "https://images.unsplash.com/photo-1572287811806-e78f31f7e6fb?auto=format&fit=crop&w=1200&q=80",
    alt: "NAGECO field operations"
  },
  {
    src: "https://images.unsplash.com/photo-1473341304170-971dccb5ac1e?auto=format&fit=crop&w=1200&q=80",
    alt: "Seismic acquisition convoy"
  },
  {
    src: "https://images.unsplash.com/photo-1509395176047-4a66953fd231?auto=format&fit=crop&w=1200&q=80",
    alt: "Exploration and energy infrastructure"
  }
];

export function ImageCarousel({ slides }: { slides?: CarouselSlide[] }) {
  const resolvedSlides = slides && slides.length > 0 ? slides : defaultSlides;
  const [active, setActive] = useState(0);

  function goTo(index: number) {
    setActive(index);
  }

  function goPrev() {
    setActive((current) => (current - 1 + resolvedSlides.length) % resolvedSlides.length);
  }

  function goNext() {
    setActive((current) => (current + 1) % resolvedSlides.length);
  }

  useEffect(() => {
    const timer = setInterval(() => {
      goNext();
    }, 3500);

    return () => clearInterval(timer);
  }, [resolvedSlides.length]);

  useEffect(() => {
    setActive(0);
  }, [resolvedSlides.length]);

  return (
    <div className="relative mx-auto w-full max-w-[42rem] group">
      <div className="absolute -inset-2 rounded-[2.5rem] bg-gradient-to-br from-brand-500 via-brand-500 to-brand-700" />
      <div className="pointer-events-none absolute -inset-6 rounded-[3rem] bg-brand-500/20 blur-3xl" />

      <div className="relative overflow-hidden rounded-[2.2rem] border-4 border-white/90 bg-white shadow-[0_30px_80px_-34px_rgba(31,115,221,0.55)]">
        <div className="relative h-[300px] w-full md:h-[360px] xl:h-[390px]">
          <div
            className="flex h-full transition-transform duration-700 ease-[cubic-bezier(0.22,1,0.36,1)]"
            style={{ transform: `translateX(-${active * 100}%)` }}
          >
            {resolvedSlides.map((slide, index) => (
              <div key={`${slide.src}-${index}`} className="relative h-full w-full shrink-0 overflow-hidden">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  className={`object-cover transition-transform duration-[5000ms] ${active === index ? "scale-[1.08]" : "scale-100"}`}
                  priority={index === 0}
                />
                <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,31,0.08),rgba(8,17,31,0.05)_35%,rgba(8,17,31,0.42)_100%)]" />
              </div>
            ))}
          </div>

          <div className="pointer-events-none absolute inset-0 nageco-carousel-shimmer" />

          <div className="absolute left-1/2 top-4 flex -translate-x-1/2 gap-2 rounded-full border border-white/20 bg-white/16 px-3 py-2 backdrop-blur-md">
            {resolvedSlides.map((slide, index) => (
              <button
                key={slide.alt}
                type="button"
                aria-label={`Slide ${index + 1}`}
                onClick={() => goTo(index)}
                className={`h-2.5 rounded-full transition-all duration-300 ${active === index ? "w-8 bg-white" : "w-2.5 bg-white/55 hover:bg-white/80"}`}
              />
            ))}
          </div>

          <div className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-4 md:p-5">
            <div className="max-w-[72%] rounded-[1.25rem] border border-white/20 bg-black/20 px-4 py-3 text-white backdrop-blur-md">
              <p className="text-[0.68rem] font-extrabold uppercase tracking-[0.26em] text-white/72">Featured Visual</p>
              <p className="mt-1 text-sm font-semibold leading-relaxed md:text-base">{resolvedSlides[active].alt}</p>
            </div>

            <div className="flex items-center gap-2 rounded-full border border-white/20 bg-black/20 p-1.5 backdrop-blur-md">
              <button
                type="button"
                aria-label="Previous slide"
                onClick={goPrev}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/12 text-white transition hover:bg-white/22"
              >
                ←
              </button>
              <button
                type="button"
                aria-label="Next slide"
                onClick={goNext}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white text-brand-700 transition hover:scale-105"
              >
                →
              </button>
            </div>
          </div>
        </div>
      </div>

      <span className="pointer-events-none absolute -bottom-6 -left-8 text-brand-500/40 nageco-dots" />
    </div>
  );
}