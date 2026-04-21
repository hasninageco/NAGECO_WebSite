"use client";

import Link from "next/link";

type AdminErrorProps = {
  error: Error & { digest?: string };
  reset: () => void;
};

export default function AdminError({ error, reset }: AdminErrorProps) {
  const isDatabaseAuthError =
    error.message.includes("PrismaClientInitializationError") ||
    error.message.includes("Authentication failed") ||
    error.message.includes("database credentials");

  return (
    <div className="mx-auto max-w-2xl space-y-4 py-10">
      <h2 className="text-2xl font-bold text-slate-900">Admin temporarily unavailable</h2>
      <p className="text-sm text-slate-600">
        {isDatabaseAuthError
          ? "Database authentication failed. Update DATABASE_URL and DIRECT_URL with valid credentials, then try again."
          : "An unexpected error occurred while loading this admin page."}
      </p>

      <div className="flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center rounded-full border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 hover:bg-slate-100"
        >
          Try again
        </button>
        <Link href="/admin/login" className="inline-flex items-center rounded-full bg-brand-700 px-4 py-2 text-sm font-semibold text-white hover:bg-brand-800">
          Go to login
        </Link>
      </div>
    </div>
  );
}
