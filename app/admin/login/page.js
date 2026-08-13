"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Mail, ArrowRight } from "lucide-react";
import { toast } from "sonner";

export default function AdminLoginPage() {
  const router = useRouter();

  const [email, setEmail] = useState("admin@inclex.com");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch("/api/admin/me");

        if (r.ok) {
          router.replace("/admin");
        }
      } catch {
        // Ignore authentication check errors.
      }
    })();
  }, [router]);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);

    try {
      const r = await fetch("/api/admin/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          email,
          password,
        }),
      });

      const data = await r.json();

      if (r.ok && data.ok) {
        toast.success("Welcome back", {
          description: "Signed in as " + email,
        });

        router.replace("/admin");
      } else {
        toast.error(data.error || "Invalid credentials");
      }
    } catch {
      toast.error("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="grid min-h-screen grid-cols-1 bg-[#F8F7F4] lg:grid-cols-2">

      {/* =========================================================
          LEFT — BRAND / IMAGE PANEL
      ========================================================= */}
      <section className="relative hidden min-h-screen overflow-hidden bg-black text-white lg:block">

        {/* Replace this image with your preferred INCLEX image */}
        <img
          src="/uploads/images/login_banner.jpeg"
          alt="INCLEX"
          className="absolute inset-0 h-full w-full object-cover opacity-65"
        />

        {/* Dark overlay */}
        <div className="absolute inset-0 bg-gradient-to-br from-black/90 via-black/55 to-black/80" />

        {/* Content */}
        <div className="relative z-10 flex h-full flex-col justify-between p-12">

          {/* Logo */}
          <Link
            href="/"
            className="inline-flex w-fit items-baseline gap-3 font-sans text-[22px] font-light tracking-[0.4em]"
          >
            INCLEX

            <span className="rounded-sm bg-[#C9A227] px-2 py-0.5 text-[10px] font-bold tracking-[0.18em] text-black">
              ADMIN
            </span>
          </Link>

          {/* Main message */}
          <div className="max-w-xl">

            <div className="eyebrow flex items-center gap-3 text-[#C9A227]">
              <span className="hairline bg-[#C9A227]" />
              INCLEX COMMAND CENTER
            </div>

            <h1 className="mt-5 max-w-lg font-serif text-5xl leading-[1.02] xl:text-6xl">
              Everything behind
              <br />
              the experience.
            </h1>

            <p className="mt-6 max-w-md text-base leading-7 text-white/65">
              Manage your products, orders, customers, content and
              brand experience from one place.
            </p>

          </div>

          {/* Footer */}
          <div className="flex items-center justify-between text-[10px] uppercase tracking-[0.24em] text-white/40">
            <span>
              © {new Date().getFullYear()} INCLEX
            </span>

            <span>
              PRIVATE ADMIN AREA
            </span>
          </div>

        </div>
      </section>


      {/* =========================================================
          RIGHT — LOGIN FORM
      ========================================================= */}
      <section className="flex min-h-screen items-center justify-center px-6 py-16">

        <form
          onSubmit={submit}
          className="w-full max-w-md"
        >

          {/* Mobile logo */}
          <div className="mb-16 lg:hidden">
            <Link
              href="/"
              className="inline-flex items-baseline gap-3 font-sans text-[21px] tracking-[0.4em]"
            >
              INCLEX

              <span className="rounded-sm bg-[#C9A227] px-2 py-0.5 text-[10px] font-bold tracking-widest text-black">
                ADMIN
              </span>
            </Link>
          </div>


          {/* Heading */}
          <div className="eyebrow flex items-center gap-3 text-[#C9A227]">
            <span className="hairline bg-[#C9A227]" />
            SECURE ACCESS
          </div>

          <h2 className="mt-5 font-serif text-4xl leading-tight md:text-5xl">
            Welcome to
            <br />
            the Command Center.
          </h2>

          <p className="mt-4 max-w-sm text-sm leading-6 text-neutral-500">
            Sign in to manage the INCLEX store, products, orders and
            customer experience.
          </p>


          {/* =====================================================
              FORM
          ===================================================== */}
          <div className="mt-10 space-y-5">

            {/* Email */}
            <label className="block">

              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Email address
              </span>

              <div className="relative mt-2">

                <Mail
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                />

                <input
                  type="email"
                  required
                  autoComplete="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@inclex.com"
                  className="w-full rounded-sm border border-black/10 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/15"
                />

              </div>

            </label>


            {/* Password */}
            <label className="block">

              <span className="text-[11px] font-semibold uppercase tracking-[0.2em] text-neutral-500">
                Password
              </span>

              <div className="relative mt-2">

                <Lock
                  className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400"
                />

                <input
                  type="password"
                  required
                  autoComplete="current-password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full rounded-sm border border-black/10 bg-white py-3.5 pl-11 pr-4 text-sm outline-none transition focus:border-[#C9A227] focus:ring-2 focus:ring-[#C9A227]/15"
                />

              </div>

            </label>

          </div>


          {/* Login button */}
          <button
            type="submit"
            disabled={loading}
            className="btn-dark mt-8 flex h-14 w-full items-center justify-center gap-3 text-sm uppercase tracking-[0.16em] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {loading ? "Signing in…" : "Enter Command Center"}

            {!loading && (
              <ArrowRight className="h-4 w-4" />
            )}
          </button>


          {/* Security note */}
          <div className="mt-6 border-t border-black/10 pt-5">

            <p className="text-[11px] leading-5 text-neutral-400">
              Authorized personnel only. This area is restricted to
              INCLEX administration.
            </p>

          </div>

        </form>

      </section>

    </main>
  );
}