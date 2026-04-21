import { redirect } from "next/navigation";
import { BrandLogo } from "@/components/BrandLogo";

type SearchParams = {
  next?: string;
  error?: string;
};

function normalizeNextPath(value?: string) {
  if (!value) {
    return "/";
  }

  if (!value.startsWith("/") || value.startsWith("//")) {
    return "/";
  }

  return value;
}

export default async function MaintenanceLoginPage({ searchParams }: { searchParams: Promise<SearchParams> }) {
  const resolvedSearchParams = await searchParams;
  const nextPath = normalizeNextPath(resolvedSearchParams.next);

  if (process.env.SITE_LOCK_ENABLED !== "1") {
    redirect(nextPath);
  }

  const requiresUsername = Boolean(process.env.SITE_LOCK_USERNAME?.trim());
  const hasError = resolvedSearchParams.error === "1";

  return (
    <section className="relative isolate flex min-h-[100dvh] items-center justify-center overflow-hidden px-4 py-10 sm:px-6">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[url('/DSC08351.JPG')] bg-cover bg-center"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 bg-[linear-gradient(180deg,rgba(8,17,31,0.28),rgba(8,17,31,0.62)),radial-gradient(circle_at_15%_12%,rgba(77,160,255,0.28),transparent_42%),radial-gradient(circle_at_84%_84%,rgba(31,115,221,0.2),transparent_40%)]"
      />

      <form
        action="/api/site-lock/login"
        method="post"
        autoComplete="on"
        className="relative z-10 w-full max-w-md space-y-4 rounded-[1.4rem] border border-white/35 bg-[rgba(6,22,47,0.78)] p-6 text-white shadow-[0_30px_90px_-42px_rgba(2,8,24,0.95)] backdrop-blur-md"
      >
        <div className="flex justify-center pb-1">
          <BrandLogo compact className="w-52 drop-shadow-[0_14px_26px_rgba(2,8,24,0.22)]" />
        </div>

        <h1 className="text-3xl font-black text-white drop-shadow-[0_3px_14px_rgba(0,0,0,0.45)]">Protected Access</h1>
        <p className="text-sm leading-relaxed text-white/92">This page is temporarily protected while content is being completed.</p>

        {requiresUsername ? (
          <input
            className="input placeholder:text-slate-500"
            type="text"
            name="username"
            placeholder="Username"
            autoComplete="username"
            required
          />
        ) : null}

        <input
          className="input placeholder:text-slate-500"
          type="password"
          name="password"
          placeholder="Password"
          autoComplete="current-password"
          required
        />

        <input type="hidden" name="next" value={nextPath} />

        {hasError ? (
          <p className="rounded-lg border border-rose-300/35 bg-rose-900/35 px-3 py-2 text-sm font-semibold text-rose-100">
            Wrong password. Please try again.
          </p>
        ) : null}

        <button className="btn-primary w-full" type="submit">
          Continue
        </button>
      </form>
    </section>
  );
}
