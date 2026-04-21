"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [errorDetail, setErrorDetail] = useState("");

  const backgroundImages = [
    "/uploads/1773139488658-3856445c-3867-48ae-8b46-49a4613167b1.JPG",
    "/uploads/1774856009779-885793fe-070b-4511-b292-49f2382ae796.jpg",
    "/uploads/1773916864515-48e32b38-92ed-452a-ab50-23054ed6a288.JPG"
  ];

  function getLoginErrorMessage(result: { error?: string | null; status?: number } | undefined) {
    if (!result) {
      return "Sign-in failed. No response from auth service.";
    }

    if (result.error === "CredentialsSignin") {
      return "Sign-in failed: invalid credentials or backend login API is unreachable.";
    }

    if (result.error) {
      return `Sign-in failed: ${result.error}`;
    }

    if (result.status) {
      return `Sign-in failed with status ${result.status}.`;
    }

    return "Sign-in failed for an unknown reason.";
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    setLoading(true);
    setErrorDetail("");

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
      callbackUrl: "/admin"
    });

    setLoading(false);

    if (!result?.ok) {
      const message = getLoginErrorMessage(result);
      console.error("[admin-login] signIn failed", result);
      setErrorDetail(message);
      toast.error(message);
      return;
    }

    window.location.href = "/admin";
  }

  return (
    <div className="relative isolate overflow-hidden">
      <div className="absolute inset-0 -z-30 bg-slate-950" />

      <div className="absolute inset-0 -z-20 md:grid md:grid-cols-3">
        {backgroundImages.map((imageUrl, index) => (
          <div
            key={imageUrl}
            className={`h-full min-h-screen bg-cover bg-center ${index > 0 ? "hidden md:block" : "block"}`}
            style={{ backgroundImage: `url('${imageUrl}')` }}
          />
        ))}
      </div>

      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_20%_20%,rgba(17,24,39,0.2),transparent_40%),radial-gradient(circle_at_80%_80%,rgba(30,58,138,0.35),transparent_45%),linear-gradient(120deg,rgba(2,6,23,0.72),rgba(15,23,42,0.64),rgba(30,41,59,0.7))]" />

      <div className="container-page flex min-h-screen items-center py-8 md:py-14">
        <div className="grid w-full items-center gap-6 lg:grid-cols-[minmax(0,1fr)_minmax(360px,460px)]">
          <section className="hidden rounded-3xl border border-white/20 bg-white/10 p-7 text-white shadow-2xl backdrop-blur-sm lg:block">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-sky-100/90">NAGECO Control</p>
            <h1 className="mt-4 text-4xl font-black leading-tight">Secure Admin Access</h1>
            <p className="mt-4 max-w-xl text-sm leading-7 text-slate-100/90">
              Sign in to manage site content, media assets, and platform configuration through the protected admin dashboard.
            </p>
          </section>

          <form
            onSubmit={submit}
            className="w-full rounded-3xl border border-sky-100/50 bg-white/85 p-6 shadow-[0_26px_80px_-30px_rgba(15,23,42,0.9)] backdrop-blur-md md:p-8"
          >
            <p className="text-xs font-bold uppercase tracking-[0.24em] text-brand-700/75">Admin Area</p>
            <h2 className="mt-2 text-3xl font-black text-slate-900">Admin Login</h2>

            <div className="mt-6 space-y-4">
              <input
                className="input h-12 bg-white/90"
                type="email"
                placeholder="Email address"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                autoComplete="username"
                required
              />

              <input
                className="input h-12 bg-white/90"
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            {errorDetail ? <p className="mt-3 text-sm font-medium text-red-700">{errorDetail}</p> : null}

            <button className="btn-primary mt-6 h-12 w-full text-base" type="submit" disabled={loading}>
              {loading ? "Signing in..." : "Sign In"}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}