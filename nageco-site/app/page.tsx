import type { Metadata } from "next";
import Link from "next/link";
import { BrandLogo, InlineBrandLogo } from "@/components/BrandLogo";
import { ImageCarousel } from "@/components/public/ImageCarousel";
import { Reveal } from "@/components/public/Reveal";
import { SeismicRig3D } from "@/components/public/SeismicRig3D";
import { services } from "@/content/services";
import { normalizeMediaUrl } from "@/lib/media-url";
import { sanitizeRichText } from "@/lib/rich-text";
import { getPageContent, getPublishedPosts, getPublishedProjects, getSiteSettings } from "@/lib/public-data";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSiteSettings();
  return {
    title: settings?.defaultSeoTitle ?? "NAGECO",
    description: settings?.defaultSeoDescription ?? "Geophysical exploration and subsurface intelligence"
  };
}

function SeismicAcquisitionIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-8 w-8">
      <path d="M6 33C10 33 10 15 14 15C18 15 18 33 22 33C26 33 26 15 30 15C34 15 34 33 38 33C40.5 33 41.5 25.5 42 21" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 38H40" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M12 10H36" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.5" />
    </svg>
  );
}

function IntegratedInterpretationIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-8 w-8">
      <path d="M9 13.5L24 8L39 13.5L24 19L9 13.5Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M9 24L24 18.5L39 24L24 29.5L9 24Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" opacity="0.78" />
      <path d="M9 34.5L24 29L39 34.5L24 40L9 34.5Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" opacity="0.56" />
    </svg>
  );
}

function HseExcellenceIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-8 w-8">
      <path d="M24 7L37 12V22C37 30 31.6 37.1 24 40C16.4 37.1 11 30 11 22V12L24 7Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M18.5 24.5L22.5 28.5L30.5 19.5" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function OperationalReliabilityIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-6 w-6">
      <path d="M10 30H16L20 18L25 34L29 24H38" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M10 38H38" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" opacity="0.55" />
    </svg>
  );
}

function DecisionClarityIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-6 w-6">
      <circle cx="22" cy="22" r="9" stroke="currentColor" strokeWidth="2.4" />
      <path d="M28.5 28.5L36 36" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M22 18V22L25 24" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ExecutionDisciplineIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-6 w-6">
      <rect x="11" y="10" width="26" height="28" rx="4" stroke="currentColor" strokeWidth="2.4" />
      <path d="M18 18H30" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M18 24H30" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M18 30H26" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function VisibleQaQcIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-8 w-8">
      <circle cx="21" cy="21" r="8" stroke="currentColor" strokeWidth="2.4" />
      <path d="M27 27L36 36" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M18.5 21.5L20.8 24L24.8 18.8" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function HseDefaultIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-8 w-8">
      <path d="M24 8L35 12.5V21.5C35 28.4 30.3 34.6 24 37C17.7 34.6 13 28.4 13 21.5V12.5L24 8Z" stroke="currentColor" strokeWidth="2.4" strokeLinejoin="round" />
      <path d="M24 16V28" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M18 22H30" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
    </svg>
  );
}

function ClientAlignedIcon() {
  return (
    <svg viewBox="0 0 48 48" fill="none" aria-hidden="true" className="h-8 w-8">
      <path d="M16 25C17.7 25 19 23.7 19 22C19 20.3 17.7 19 16 19C14.3 19 13 20.3 13 22C13 23.7 14.3 25 16 25Z" stroke="currentColor" strokeWidth="2.4" />
      <path d="M32 25C33.7 25 35 23.7 35 22C35 20.3 33.7 19 32 19C30.3 19 29 20.3 29 22C29 23.7 30.3 25 32 25Z" stroke="currentColor" strokeWidth="2.4" />
      <path d="M19 22H29" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" />
      <path d="M12 32C13.8 29.6 16.5 28 19.5 28H28.5C31.5 28 34.2 29.6 36 32" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const capabilities = [
  {
    icon: SeismicAcquisitionIcon,
    title: "Seismic Acquisition",
    body:
      "Advanced 2D/3D survey planning, crew mobilization, and field execution built around consistent coverage, disciplined QA/QC, and dependable operational uptime in demanding environments."
  },
  {
    icon: IntegratedInterpretationIcon,
    title: "Integrated Interpretation",
    body:
      "Cross-disciplinary interpretation that brings seismic, geological, and spatial datasets together to reduce uncertainty, sharpen structural understanding, and support faster technical decisions."
  },
  {
    icon: HseExcellenceIcon,
    title: "HSE Excellence",
    body:
      "Strict health, safety, and environmental controls embedded across planning, mobilization, and field activity to protect crews, maintain compliance, and keep execution stable."
  }
];

const workflowSteps = [
  {
    title: "Assess & Plan",
    body: "Define survey objectives, logistics, and risk controls before field mobilization."
  },
  {
    title: "Acquire & Process",
    body: "Execute acquisition with disciplined QA/QC and consistent data conditioning."
  },
  {
    title: "Interpret & Deliver",
    body: "Convert geophysical outputs into practical recommendations for faster decisions."
  }
];

const strategicFocusPoints = [
  {
    icon: OperationalReliabilityIcon,
    title: "Operational Reliability",
    body: "Keep crews, equipment, and field decisions aligned around stable execution and fewer avoidable disruptions."
  },
  {
    icon: DecisionClarityIcon,
    title: "Decision Clarity",
    body: "Turn technical outputs into usable insight that supports planning, prioritization, and faster operator action."
  },
  {
    icon: ExecutionDisciplineIcon,
    title: "Execution Discipline",
    body: "Apply consistent HSE, QA/QC, and reporting standards so delivery quality remains visible from start to finish."
  }
];

const executionStandards = [
  {
    icon: VisibleQaQcIcon,
    title: "Visible QA/QC",
    body: "Quality checks are embedded in field activity and processing reviews so issues are identified early, not after delivery."
  },
  {
    icon: HseDefaultIcon,
    title: "HSE By Default",
    body: "Safety and environmental controls are treated as operating requirements, not add-ons layered in after mobilization."
  },
  {
    icon: ClientAlignedIcon,
    title: "Client-Aligned Delivery",
    body: "Outputs are structured around practical client decisions, timelines, and reporting needs rather than generic technical handover."
  }
];

const heroHighlights = ["Seismic acquisition", "Integrated interpretation", "Field-proven HSE discipline"];

const impactMetrics = [
  { value: "20+", label: "Years of operational experience" },
  { value: "100+", label: "Projects executed with disciplined delivery" },
  { value: "3M+", label: "Work hours without accident" }
];

type WeatherDay = {
  date: string;
  max: number;
  min: number;
  code: number | null;
};

type FxPair = {
  pair: string;
  rate: number | null;
};

type OilSnapshot = {
  price: number | null;
  unit: string;
  updatedAt: string | null;
  sourceLabel: string;
};

function formatForecastDayLabel(value: string): string {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleDateString("en-GB", { weekday: "short", day: "2-digit", month: "short" });
}

function WeatherConditionIcon({ code, className = "h-5 w-5" }: { code: number | null; className?: string }) {
  if (code === 0 || code === 1) {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
        <circle cx="12" cy="12" r="5" fill="#FACC15" />
        <path d="M12 2.5V5M12 19V21.5M2.5 12H5M19 12H21.5M5.3 5.3L7 7M17 17L18.7 18.7M18.7 5.3L17 7M7 17L5.3 18.7" stroke="#F59E0B" strokeWidth="1.6" strokeLinecap="round" />
      </svg>
    );
  }

  if (code === 2 || code === 3 || code === 45 || code === 48) {
    return (
      <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
        <circle cx="9" cy="9" r="4" fill="#FACC15" />
        <path d="M8 17.5H16.8C18.7 17.5 20.2 16.2 20.2 14.4C20.2 12.8 19.1 11.5 17.5 11.2C17 9.3 15.4 8 13.5 8C11.2 8 9.3 9.9 9.3 12.2C7.7 12.3 6.3 13.6 6.3 15.3C6.3 16.7 7.3 17.5 8 17.5Z" fill="#E5E7EB" stroke="#9CA3AF" strokeWidth="1" />
      </svg>
    );
  }

  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className={className}>
      <path d="M6.8 17.5H17.4C19.3 17.5 20.7 16.1 20.7 14.3C20.7 12.7 19.6 11.3 18 11C17.5 8.9 15.8 7.5 13.7 7.5C11.2 7.5 9.2 9.5 9.2 12C7.5 12.1 6.1 13.5 6.1 15.2C6.1 16.5 7 17.5 6.8 17.5Z" fill="#D1D5DB" stroke="#9CA3AF" strokeWidth="1" />
    </svg>
  );
}

async function fetchWeatherForecast(): Promise<WeatherDay[]> {
  try {
    const response = await fetch(
      "https://api.open-meteo.com/v1/forecast?latitude=32.8872&longitude=13.1913&daily=temperature_2m_max,temperature_2m_min,weather_code&timezone=auto&forecast_days=7",
      { next: { revalidate: 60 * 60 } }
    );

    if (!response.ok) return [];

    const data = (await response.json()) as {
      daily?: {
        time?: string[];
        temperature_2m_max?: number[];
        temperature_2m_min?: number[];
        weather_code?: number[];
      };
    };

    const days = data.daily?.time ?? [];
    const maxList = data.daily?.temperature_2m_max ?? [];
    const minList = data.daily?.temperature_2m_min ?? [];
    const codeList = data.daily?.weather_code ?? [];

    return days.slice(0, 7).map((date, index) => ({
      date,
      max: Number(maxList[index] ?? 0),
      min: Number(minList[index] ?? 0),
      code: typeof codeList[index] === "number" ? codeList[index] : null
    }));
  } catch {
    return [];
  }
}

async function fetchExchangeRates(): Promise<FxPair[]> {
  try {
    const [usdResponse, gbpResponse] = await Promise.all([
      fetch("https://open.er-api.com/v6/latest/USD", { next: { revalidate: 60 * 30 } }),
      fetch("https://open.er-api.com/v6/latest/GBP", { next: { revalidate: 60 * 30 } })
    ]);

    if (!usdResponse.ok || !gbpResponse.ok) {
      return [
        { pair: "USD/LYD", rate: null },
        { pair: "EUR/LYD", rate: null },
        { pair: "GBP/LYD", rate: null },
        { pair: "USD/EUR", rate: null }
      ];
    }

    const usdData = (await usdResponse.json()) as { rates?: Record<string, number> };
    const gbpData = (await gbpResponse.json()) as { rates?: Record<string, number> };
    const usdRates = usdData.rates ?? {};
    const gbpRates = gbpData.rates ?? {};

    const lydPerUsd = usdRates.LYD;
    const eurPerUsd = usdRates.EUR;
    const lydPerGbp = gbpRates.LYD;
    const usdPerEur = eurPerUsd ? 1 / eurPerUsd : null;
    const lydPerEur = lydPerUsd && eurPerUsd ? lydPerUsd / eurPerUsd : null;

    return [
      { pair: "USD/LYD", rate: typeof lydPerUsd === "number" ? lydPerUsd : null },
      { pair: "EUR/LYD", rate: typeof lydPerEur === "number" ? lydPerEur : null },
      { pair: "GBP/LYD", rate: typeof lydPerGbp === "number" ? lydPerGbp : null },
      { pair: "USD/EUR", rate: typeof usdPerEur === "number" ? usdPerEur : null }
    ];
  } catch {
    return [
      { pair: "USD/LYD", rate: null },
      { pair: "EUR/LYD", rate: null },
      { pair: "GBP/LYD", rate: null },
      { pair: "USD/EUR", rate: null }
    ];
  }
}

async function fetchOilBarrelSnapshot(): Promise<OilSnapshot> {
  const fallbackFromStooq = async (): Promise<OilSnapshot> => {
    const fallbackResponse = await fetch("https://stooq.com/q/l/?s=cb.f&f=sd2t2ohlcv&h&e=csv", {
      next: { revalidate: 60 * 60 }
    });

    if (!fallbackResponse.ok) {
      return {
        price: null,
        unit: "USD / barrel",
        updatedAt: null,
        sourceLabel: "Brent data unavailable"
      };
    }

    const csv = await fallbackResponse.text();
    const lines = csv.trim().split(/\r?\n/);
    const values = lines[1]?.split(",") ?? [];
    const date = values[1] ?? null;
    const close = values[6];
    const parsed = typeof close === "string" ? Number.parseFloat(close) : Number.NaN;

    return {
      price: Number.isFinite(parsed) ? parsed : null,
      unit: "USD / barrel",
      updatedAt: date,
      sourceLabel: "Stooq - Brent Futures (CB.F)"
    };
  };

  try {
    const response = await fetch(
      "https://api.eia.gov/v2/petroleum/pri/spt/data/?frequency=daily&data[0]=value&facets[product][]=EPCBRENT&sort[0][column]=period&sort[0][direction]=desc&offset=0&length=1",
      { next: { revalidate: 60 * 60 } }
    );

    if (!response.ok) {
      return fallbackFromStooq();
    }

    const data = (await response.json()) as {
      response?: { data?: Array<{ period?: string; value?: number }> };
    };

    const latest = data.response?.data?.[0];
    const price = typeof latest?.value === "number" ? latest.value : null;

    const eiaSnapshot: OilSnapshot = {
      price,
      unit: "USD / barrel",
      updatedAt: latest?.period ?? null,
      sourceLabel: "EIA - Brent Spot"
    };

    if (eiaSnapshot.price !== null) {
      return eiaSnapshot;
    }

    return fallbackFromStooq();
  } catch {
    return fallbackFromStooq();
  }
}

export default async function HomePage() {
  const [settings, content, posts, projects, weatherForecast, fxRates, oilSnapshot] = await Promise.all([
    getSiteSettings(),
    getPageContent("HOME"),
    getPublishedPosts(),
    getPublishedProjects(),
    fetchWeatherForecast(),
    fetchExchangeRates(),
    fetchOilBarrelSnapshot()
  ]);

  const hero = (content?.sectionsJson as { heroTitle?: string; heroSubtitle?: string; ctaLabel?: string } | null) ?? {};
  const heroTitleHtml = sanitizeRichText(hero.heroTitle, "title");
  const heroSubtitleHtml = sanitizeRichText(hero.heroSubtitle, "inline");

  const socialLinks =
    settings?.socialLinksJson && typeof settings.socialLinksJson === "object"
      ? (settings.socialLinksJson as Record<string, unknown>)
      : {};

  const configuredImages = Array.isArray(socialLinks.heroCarouselImages)
    ? socialLinks.heroCarouselImages.filter((item): item is string => typeof item === "string")
    : [];

  const configuredCaptions = Array.isArray(socialLinks.heroCarouselCaptions)
    ? socialLinks.heroCarouselCaptions.filter((item): item is string => typeof item === "string")
    : [];

  const heroSlides = configuredImages
    .map((item, index) => {
      const normalizedSrc = normalizeMediaUrl(item);
      if (!normalizedSrc) return null;

      return {
        src: normalizedSrc,
        alt: configuredCaptions[index] ?? `NAGECO operations ${index + 1}`
      };
    })
    .filter((item): item is { src: string; alt: string } => Boolean(item));

  const organizationLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: settings?.brandName ?? "NAGECO",
    description: settings?.tagline,
    email: settings?.emails?.[0],
    telephone: settings?.phones?.[0],
    url: process.env.NEXTAUTH_URL ?? "http://localhost:3000"
  };

  return (
    <div className="container-page space-y-8 py-0 md:py-1 lg:space-y-12">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationLd) }} />

      <div className="relative mt-12 lg:mt-16">
        <div className="nageco-hero-rig hidden lg:block" aria-hidden="true">
          <div className="nageco-hero-rig__line" />
          <div className="nageco-hero-rig__runner">
            <SeismicRig3D className="w-full" />
          </div>
        </div>

        <Reveal className="absolute -left-[10.5rem] top-2 z-20 hidden w-36 xl:block" delayMs={80}>
          <aside className="animate-[pulse_4s_ease-in-out_infinite] rounded-[1.2rem] border border-brand-700/22 bg-gradient-to-br from-white/88 to-sky-100/72 p-2.5 shadow-[0_18px_36px_rgba(16,40,120,0.18)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-brand-500">FX Market</p>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4 text-brand-700/85 animate-[spin_8s_linear_infinite]">
                <path d="M4 7H18L15.5 4.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M20 17H6L8.5 19.5" stroke="currentColor" strokeWidth="1.9" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <h3 className="mt-1 text-sm font-black text-black">أسعار العملات</h3>
            <div className="mt-2.5 space-y-2">
              {fxRates.map((item) => (
                <div key={item.pair} className="rounded-lg border border-brand-700/12 bg-white/85 px-2 py-2">
                  <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-500">{item.pair}</p>
                  <p className="mt-1 text-base font-black text-black">{item.rate ? item.rate.toFixed(4) : "N/A"}</p>
                </div>
              ))}
              <div className="rounded-lg border border-brand-700/16 bg-white/88 px-2 py-2">
                <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-500">Brent Oil</p>
                <p className="mt-1 text-sm font-black text-black">{oilSnapshot.price ? `${oilSnapshot.price.toFixed(2)} ${oilSnapshot.unit}` : "N/A"}</p>
              </div>
            </div>
          </aside>
        </Reveal>

        <Reveal className="absolute -right-[10.5rem] top-2 z-20 hidden w-36 xl:block" delayMs={120}>
          <aside className="animate-[pulse_4s_ease-in-out_infinite] rounded-[1.2rem] border border-brand-700/22 bg-gradient-to-br from-white/88 to-sky-100/72 p-2.5 shadow-[0_18px_36px_rgba(16,40,120,0.18)] backdrop-blur-md transition-transform duration-300 hover:-translate-y-1">
            <div className="flex items-center justify-between">
              <p className="text-[10px] font-extrabold uppercase tracking-[0.24em] text-brand-500">Weather API</p>
              <svg viewBox="0 0 24 24" fill="none" aria-hidden="true" className="h-4 w-4 text-brand-700/85 animate-[bounce_2.4s_ease-in-out_infinite]">
                <path d="M7 17H17C19 17 20.5 15.5 20.5 13.5C20.5 11.7 19.2 10.2 17.5 10C17 7.8 15.1 6.2 12.8 6.2C10.1 6.2 8 8.3 8 11C6.1 11.1 4.5 12.7 4.5 14.7C4.5 16.6 6.1 17.9 8 17.9" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                <path d="M9 19.5H15" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
            <h3 className="mt-1 text-sm font-black text-black">درجة الحرارة للأسبوع</h3>
            <div className="mt-2.5 space-y-2">
              {weatherForecast.length > 0 ? (
                weatherForecast.map((day) => (
                  <div key={day.date} className="rounded-lg border border-brand-700/12 bg-white/85 px-2 py-2">
                    <div className="flex items-center justify-between gap-2">
                      <p className="text-[10px] font-extrabold uppercase tracking-[0.18em] text-brand-500">{formatForecastDayLabel(day.date)}</p>
                      <span className="inline-flex animate-bounce">
                        <WeatherConditionIcon code={day.code} className="h-4 w-4" />
                      </span>
                    </div>
                    <p className="mt-1 text-xs font-bold text-black">
                      {day.max.toFixed(0)}° / {day.min.toFixed(0)}°
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-lg border border-brand-700/12 bg-white/85 px-2 py-2 text-[11px] font-semibold text-black/65">
                  Weather data unavailable.
                </div>
              )}
            </div>
          </aside>
        </Reveal>

        <section className="nageco-hero-focus relative mt-0 overflow-hidden rounded-[2rem] border border-brand-700/15 p-6 md:p-10 lg:p-12">
          <div className="nageco-gridline pointer-events-none absolute inset-0 opacity-60" />
          <div className="pointer-events-none absolute -left-20 top-10 h-56 w-56 rounded-full bg-brand-500/12 blur-3xl" />
          <div className="pointer-events-none absolute bottom-0 right-0 h-72 w-72 rounded-full bg-sky-300/20 blur-3xl" />

          <div className="relative space-y-8 lg:space-y-10">
            <div className="grid gap-10 lg:grid-cols-[1.06fr_0.94fr] lg:items-center">
              <Reveal className="space-y-8">
                <div className="space-y-5">
                  <div>
                    <BrandLogo compact className="block w-44 md:w-48" />
                  </div>
                  <div className="flex flex-wrap items-center gap-3">
                    {heroHighlights.map((item) => (
                      <span key={item} className="nageco-chip">
                        {item}
                      </span>
                    ))}
                  </div>

                  <h1
                    className="max-w-4xl text-[2.05rem] font-black leading-[0.98] text-black md:text-[3.45rem] xl:text-[4.2rem]"
                    dangerouslySetInnerHTML={{ __html: heroTitleHtml || "Subsurface intelligence built for confident field decisions." }}
                  />

                  {heroSubtitleHtml ? (
                    <p
                      className="max-w-2xl text-lg leading-relaxed text-black/72 md:text-xl [&_a]:font-semibold [&_a]:text-brand-700 [&_a]:underline [&_strong]:font-bold [&_strong]:text-black"
                      dangerouslySetInnerHTML={{ __html: heroSubtitleHtml }}
                    />
                  ) : (
                    <p className="max-w-2xl text-lg leading-relaxed text-black/72 md:text-xl">
                      <InlineBrandLogo className="mr-2 w-28 md:w-32" />
                      blends disciplined acquisition, integrated interpretation, and operational reliability to turn exploration complexity into clear project momentum.
                    </p>
                  )}
                </div>

                <div className="flex flex-wrap gap-3">
                  <Link href="/contact" className="btn-primary nageco-glow inline-flex rounded-full px-7 py-3.5 text-base">
                    {hero.ctaLabel ?? "Contact Our Team"}
                  </Link>
                  <Link href="/projects" className="btn-secondary inline-flex rounded-full px-7 py-3.5 text-base">
                    Explore Projects
                  </Link>
                </div>
              </Reveal>

              <Reveal className="nageco-fade-right" delayMs={120}>
                <div className="relative mx-auto w-full max-w-xl">
                  <ImageCarousel slides={heroSlides.length > 0 ? heroSlides : undefined} />
                </div>
              </Reveal>
            </div>

            <Reveal className="space-y-4" delayMs={180}>
              <div className="grid gap-3 md:grid-cols-3 lg:grid-cols-3">
                {impactMetrics.map((metric) => (
                  <div key={metric.label} className="nageco-stat-card">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-[0.78rem] font-black uppercase tracking-[0.22em] text-emerald-800">Achievement</p>
                      <p className="text-[2.15rem] font-black leading-none text-current md:text-[2.35rem]">{metric.value}</p>
                    </div>
                    <p className="mt-3 text-[0.95rem] font-semibold leading-relaxed text-black/85 md:text-[1rem]">{metric.label}</p>
                  </div>
                ))}
              </div>

              <div className="glass-panel rounded-[1.7rem] p-5 md:p-6">
                <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
                  <div>
                    <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-brand-700">Operational Flow</p>
                    <h2 className="mt-2 text-2xl font-bold text-black">From field planning to final interpretation, the delivery stays controlled.</h2>
                  </div>
                  <Link href="/capabilities" className="text-sm font-semibold text-brand-700 hover:underline">
                    Explore capabilities
                  </Link>
                </div>

                <div className="mt-5 grid gap-3 md:grid-cols-3">
                  {workflowSteps.map((step, index) => (
                    <div key={step.title} className="rounded-[1.35rem] border border-brand-700/10 bg-white/72 p-4">
                      <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-brand-500">0{index + 1}</p>
                      <h3 className="mt-2 text-lg font-bold text-black">{step.title}</h3>
                      <p className="mt-2 text-sm leading-relaxed text-black/65">{step.body}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </section>
      </div>

      <Reveal>
        <section className="grid gap-4 xl:hidden">
          <article className="nageco-panel p-6 md:p-7">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-brand-500">Exchange Rates</p>
            <h2 className="mt-2 text-2xl font-bold text-black">Live currency monitor</h2>
            <p className="mt-2 text-sm text-black/65">USD/LYD, EUR/LYD, GBP/LYD, and USD/EUR</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {fxRates.map((item) => (
                <div key={item.pair} className="rounded-[1.15rem] border border-brand-700/10 bg-white/70 p-4">
                  <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-500">{item.pair}</p>
                  <p className="mt-2 text-2xl font-black text-black">{item.rate ? item.rate.toFixed(4) : "N/A"}</p>
                </div>
              ))}
            </div>
            <div className="mt-3 rounded-[1.15rem] border border-brand-700/10 bg-white/70 p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-500">Brent Oil (Global)</p>
              <p className="mt-2 text-2xl font-black text-black">{oilSnapshot.price ? `${oilSnapshot.price.toFixed(2)} ${oilSnapshot.unit}` : "N/A"}</p>
            </div>
          </article>

          <article className="nageco-panel p-6 md:p-7">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-brand-500">Weather Forecast</p>
            <h2 className="mt-2 text-2xl font-bold text-black">Tripoli weekly temperature</h2>
            <p className="mt-2 text-sm text-black/65">7-day max and min in Celsius</p>

            <div className="mt-5 grid gap-3 sm:grid-cols-2">
              {weatherForecast.length > 0 ? (
                weatherForecast.map((day) => (
                  <div key={day.date} className="rounded-[1.15rem] border border-brand-700/10 bg-white/70 p-4">
                    <div className="flex items-center justify-between gap-3">
                      <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-500">{formatForecastDayLabel(day.date)}</p>
                      <span className="inline-flex animate-bounce">
                        <WeatherConditionIcon code={day.code} className="h-6 w-6" />
                      </span>
                    </div>
                    <p className="mt-2 text-base font-bold text-black">
                      Max {day.max.toFixed(0)}°C
                      <span className="mx-2 text-black/35">|</span>
                      Min {day.min.toFixed(0)}°C
                    </p>
                  </div>
                ))
              ) : (
                <div className="rounded-[1.15rem] border border-brand-700/10 bg-white/70 p-4 text-sm text-black/65">
                  Weather data is temporarily unavailable.
                </div>
              )}
            </div>
          </article>
        </section>
      </Reveal>

      <Reveal>
        <section className="nageco-panel p-6 md:p-7">
          <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-brand-500">Oil Market</p>
          <h2 className="mt-2 text-2xl font-bold text-black">Daily barrel price snapshot</h2>
          <div className="mt-5 grid gap-3 md:grid-cols-3">
            <div className="rounded-[1.15rem] border border-brand-700/10 bg-white/70 p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-500">Price</p>
              <p className="mt-2 text-2xl font-black text-black">{oilSnapshot.price ? `${oilSnapshot.price.toFixed(2)} ${oilSnapshot.unit}` : "N/A"}</p>
            </div>
            <div className="rounded-[1.15rem] border border-brand-700/10 bg-white/70 p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-500">Updated</p>
              <p className="mt-2 text-lg font-bold text-black">{oilSnapshot.updatedAt ?? "Not available"}</p>
            </div>
            <div className="rounded-[1.15rem] border border-brand-700/10 bg-white/70 p-4">
              <p className="text-xs font-extrabold uppercase tracking-[0.2em] text-brand-500">Source</p>
              <p className="mt-2 text-lg font-bold text-black">{oilSnapshot.sourceLabel}</p>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="grid gap-4 xl:grid-cols-[1.15fr_0.85fr]">
          <div className="grid gap-4 md:grid-cols-3">
            {capabilities.map((item, index) => (
              <article key={item.title} className="card relative overflow-hidden">
                <div className="absolute -right-10 -top-10 h-28 w-28 rounded-full bg-brand-500/10 blur-2xl" />
                <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-[1.15rem] border border-brand-700/12 bg-brand-500/8 text-brand-700 shadow-[0_14px_28px_rgba(13,110,253,0.1)]">
                  <item.icon />
                </div>
                <p className="mb-2 text-xs font-extrabold uppercase tracking-[0.24em] text-brand-500">0{index + 1}</p>
                <h3 className="text-xl font-bold text-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-black/68">{item.body}</p>
              </article>
            ))}
          </div>

          <div className="nageco-panel nageco-dark-panel p-6 md:p-7">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-sky-200">Strategic Focus</p>
            <h2 className="mt-3 text-3xl font-black leading-tight">Built for operators who need clarity before committing the next move.</h2>
            <p className="mt-4 max-w-xl text-sm leading-relaxed text-white/72">
              The visual identity now pushes a more premium direction, but the substance stays operational: reliability, disciplined execution, and actionable interpretation.
            </p>
            <div className="mt-6 grid gap-3">
              {strategicFocusPoints.map((point) => (
                <div key={point.title} className="rounded-[1.25rem] border border-white/10 bg-white/6 px-4 py-3">
                  <div className="flex items-start gap-3">
                    <span className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-[0.95rem] border border-white/12 bg-white/8 text-sky-100">
                      <point.icon />
                    </span>
                    <div>
                      <p className="text-sm font-bold text-white">{point.title}</p>
                      <p className="mt-1 text-sm leading-relaxed text-white/68">{point.body}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="grid gap-4 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="nageco-panel p-6 md:p-7">
            <div className="mb-5 flex items-center justify-between gap-4">
              <div>
                <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-brand-500">Latest News</p>
                <h2 className="mt-2 text-2xl font-bold text-black">Recent updates and public announcements.</h2>
              </div>
              <Link href="/news" className="text-sm font-semibold text-brand-700">
                View all
              </Link>
            </div>

            <ul className="space-y-3">
              {posts.length > 0 ? (
                posts.slice(0, 3).map((post) => (
                  <li key={post.id}>
                    <Link
                      href={`/news/${post.slug}`}
                      className="flex items-center justify-between gap-4 rounded-[1.25rem] border border-brand-700/10 bg-white/68 px-4 py-4 transition-all hover:-translate-y-0.5 hover:border-brand-500/25"
                    >
                      <span className="text-base font-bold text-brand-700">{post.title}</span>
                      <span className="text-xs font-extrabold uppercase tracking-[0.18em] text-black/45">Read</span>
                    </Link>
                  </li>
                ))
              ) : (
                <li className="text-sm text-black/65">No published news yet. Check back soon for updates.</li>
              )}
            </ul>
          </div>

          <div className="grid gap-4">
            <div className="nageco-panel p-6 md:p-7">
              <div className="mb-5 flex items-center justify-between gap-4">
                <div>
                  <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-brand-500">Featured Projects</p>
                  <h2 className="mt-2 text-2xl font-bold text-black">Selected work across surveys and interpretation scopes.</h2>
                </div>
                <Link href="/projects" className="text-sm font-semibold text-brand-700">
                  View all
                </Link>
              </div>

              <ul className="space-y-3">
                {projects.length > 0 ? (
                  projects.slice(0, 3).map((project, index) => (
                    <li key={project.id}>
                      <Link
                        href={`/projects/${project.slug}`}
                        className="flex min-h-[112px] flex-col items-center justify-center gap-2 rounded-[1.25rem] border border-brand-700/10 bg-white/68 px-4 py-4 text-center transition-all hover:-translate-y-0.5 hover:border-brand-500/25"
                      >
                        <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-brand-500/10 text-sm font-black text-brand-700">
                          0{index + 1}
                        </span>
                        <span className="text-[10px] font-extrabold uppercase tracking-[0.2em] text-brand-500">Project</span>
                        <span className="text-base font-bold text-black">{project.title}</span>
                      </Link>
                    </li>
                  ))
                ) : (
                  <li className="text-sm text-black/65">No published projects yet. Explore our services in the meantime.</li>
                )}
              </ul>
            </div>

            <div className="nageco-panel p-6 md:p-7">
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-brand-500">Operational Promise</p>
              <h2 className="mt-2 text-2xl font-bold text-black">Sharper planning. Safer execution. Clearer outcomes.</h2>
              <p className="mt-3 text-sm leading-relaxed text-black/68">
                Every section now carries a stronger sense of hierarchy and depth so the brand feels more established, more technical, and more confident on first impression.
              </p>
              <Link href="/about" className="mt-5 inline-flex items-center gap-2 text-sm font-semibold text-brand-700 hover:underline">
                Learn more about <InlineBrandLogo className="w-20" />
              </Link>
            </div>
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="space-y-5">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-brand-500">Core Services</p>
              <h2 className="mt-1 text-3xl font-black text-black md:text-4xl">A service mix designed for real operational momentum.</h2>
            </div>
            <Link href="/services" className="text-sm font-semibold text-brand-700 hover:underline">
              View all services
            </Link>
          </div>

          <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
            {services.map((service, index) => (
              <article key={service.slug} className="card flex h-full flex-col overflow-hidden">
                <div className="flex items-center justify-between gap-3">
                  <span className="text-xs font-extrabold uppercase tracking-[0.22em] text-brand-500">Service 0{index + 1}</span>
                  <span className="h-9 w-9 rounded-full bg-brand-500/10" />
                </div>
                <h3 className="mt-4 text-xl font-bold text-black">{service.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-black/68">{service.summary}</p>
                <Link href={`/services/${service.slug}`} className="mt-5 text-sm font-semibold text-brand-700 hover:underline">
                  Learn more
                </Link>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="nageco-panel p-6 md:p-7">
          <div className="max-w-3xl">
            <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-brand-500">Execution Standards</p>
            <h2 className="mt-2 text-3xl font-black text-black md:text-4xl">The operating standards behind consistent delivery quality.</h2>
          </div>

          <div className="mt-6 grid gap-4 md:grid-cols-3">
            {executionStandards.map((item, index) => (
              <article key={item.title} className="nageco-process-card">
                <div className="inline-flex h-14 w-14 items-center justify-center rounded-[1.15rem] border border-brand-700/12 bg-brand-500/8 text-brand-700 shadow-[0_14px_28px_rgba(13,110,253,0.1)]">
                  <item.icon />
                </div>
                <p className="text-xs font-extrabold uppercase tracking-[0.22em] text-brand-500">Standard 0{index + 1}</p>
                <h3 className="mt-3 text-xl font-bold text-black">{item.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-black/68">{item.body}</p>
              </article>
            ))}
          </div>
        </section>
      </Reveal>

      <Reveal>
        <section className="nageco-cta-panel p-6 md:p-8 lg:p-10">
          <div className="pointer-events-none absolute -right-12 -top-12 h-40 w-40 rounded-full bg-brand-500/10 blur-2xl" />
          <div className="pointer-events-none absolute bottom-0 left-0 h-52 w-52 rounded-full bg-sky-300/18 blur-3xl" />
          <div className="relative flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <p className="text-xs font-extrabold uppercase tracking-[0.24em] text-brand-500">Start a Project</p>
              <h2 className="mt-2 max-w-3xl text-3xl font-black text-black md:text-4xl">Need subsurface intelligence for your next decision?</h2>
              <p className="mt-3 max-w-3xl text-sm leading-relaxed text-black/72 md:text-base">
                Talk to our team about your objectives, constraints, and timeline. We will shape a practical and safe execution plan.
              </p>
            </div>
            <div className="flex flex-wrap gap-3">
              <Link href="/contact" className="btn-primary inline-flex rounded-full px-7 py-3.5">
                Contact Us
              </Link>
              <Link href="/capabilities" className="btn-secondary inline-flex rounded-full px-7 py-3.5">
                Explore Capabilities
              </Link>
            </div>
          </div>
        </section>
      </Reveal>
    </div>
  );
}
