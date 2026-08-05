"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { motion, useScroll, useTransform } from "framer-motion";
import { toast } from "sonner";
import {
  ArrowRight,
  ArrowDown,
  Volume2,
  VolumeX,
  Play,
  Pause,
  Mail,
  Check,
} from "lucide-react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { DEFAULT_HOMEPAGE, fetchHomepage } from "@/lib/data/content";

const CUSTOMIZE_IMG =
  "https://images.unsplash.com/photo-1599066852653-42826a50b163?auto=format&fit=crop&w=1400&q=90";

// ---------- Hero -------------------------------------------------------------
function Hero({ c }) {
  const videoRef = useRef(null);
  const [muted, setMuted] = useState(true);
  const { scrollY } = useScroll();
  const parY = useTransform(scrollY, [0, 800], [0, 120]);
  const parScale = useTransform(scrollY, [0, 800], [1, 1.08]);

  useEffect(() => {
    const v = videoRef.current;
    if (!v) return;
    v.muted = true;
    const p = v.play();
    if (p?.catch) p.catch(() => {});
  }, [c.heroVideo]);

  // Split heading — allow "Word Word ... Last." pattern for gold italic on last word
  const parts = (c.heroHeading || "").trim().split(" ");
  const last = parts.pop();
  const head = parts.join(" ");

  return (
    <section className="relative min-h-[100svh] w-full overflow-hidden bg-black text-white">
      <div className="container-editorial relative z-10 grid min-h-[100svh] grid-cols-12 items-center gap-8 pb-24 pt-32 md:pt-40">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-12 md:col-span-5 lg:col-span-4"
        >
          <div className="eyebrow mb-6 flex items-center gap-3">
            <span className="hairline" />
            {c.heroEyebrow}
          </div>
          <h1 className="font-serif text-[54px] leading-[1.02] tracking-tight md:text-[68px] lg:text-[78px]">
            {head ? (
              <>
                {head}
                <br />
              </>
            ) : null}
            <span className="italic text-[#C9A227]">{last}</span>
          </h1>
          <p className="mt-6 max-w-md text-base leading-relaxed text-white/70 md:text-[15px]">
            {c.heroSubtitle}
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-4">
            <Link
              href={c.heroPrimaryHref || "/shop"}
              className="btn-gold inline-flex"
            >
              {c.heroPrimaryCta}
              <ArrowRight className="h-4 w-4" />
            </Link>

            <Link
              href={c.heroSecondaryHref || "/customize"}
              className="btn-ghost-light"
            >
              {c.heroSecondaryCta}
              <span className="text-[#C9A227]">⌘</span>
            </Link>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-12 md:col-span-7 lg:col-span-8"
        >
          <motion.div
            style={{ y: parY, scale: parScale }}
            className="relative aspect-[16/10] w-full overflow-hidden rounded-sm shadow-[0_50px_120px_-30px_rgba(0,0,0,0.7)] ring-1 ring-white/5"
          >
            <video
              ref={videoRef}
              key={c.heroVideo}
              className="absolute inset-0 h-full w-full object-cover animate-slow-zoom"
              poster={c.heroPoster}
              muted={muted}
              playsInline
              autoPlay
              loop
              preload="auto"
            >
              <source src={c.heroVideo} type="video/mp4" />
            </video>
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/70 via-black/10 to-transparent" />
            <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
            <div className="pointer-events-none absolute inset-0 grain" />
            <button
              onClick={() => {
                if (!videoRef.current) return;
                videoRef.current.muted = !videoRef.current.muted;
                setMuted(videoRef.current.muted);
              }}
              aria-label={muted ? "Unmute video" : "Mute video"}
              className="absolute bottom-5 right-5 grid h-11 w-11 place-items-center rounded-full border border-white/25 bg-black/40 text-white backdrop-blur-md transition hover:bg-black/60"
            >
              {muted ? (
                <VolumeX className="h-4 w-4" />
              ) : (
                <Volume2 className="h-4 w-4" />
              )}
            </button>
          </motion.div>
        </motion.div>
      </div>

      <div
        className="pointer-events-none absolute inset-0 -z-0 opacity-40"
        style={{
          backgroundImage: `url(${c.heroPoster})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          filter: "blur(60px) saturate(0.7) brightness(0.35)",
        }}
      />

      <div className="absolute bottom-6 left-0 right-0 z-20">
        <div className="container-editorial flex items-center justify-between">
          <div className="flex items-center gap-4 text-[11px] font-semibold uppercase tracking-[0.24em] text-white/70">
            Scroll to explore
            <span className="inline-block h-px w-10 bg-white/40" />
            <ArrowDown className="h-4 w-4 animate-bounce" />
          </div>
          <div className="hidden md:flex items-center gap-2 text-[11px] uppercase tracking-[0.24em] text-white/50">
            <span className="h-1.5 w-1.5 rounded-full bg-[#C9A227]" /> 01 / 04
          </div>
        </div>
      </div>
    </section>
  );
}

// ---------- Experience -------------------------------------------------------
function Experience({ c }) {
  const videoRef = useRef(null);
  const [playing, setPlaying] = useState(true);
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setLoaded(true), 2500);
    return () => clearTimeout(t);
  }, []);

  return (
    <section id="experience" className="relative bg-black text-white">
      <div
        className="relative w-full overflow-hidden"
        style={{ height: "clamp(350px, 55vw, 650px)" }}
      >
        <video
          ref={videoRef}
          key={c.experienceVideo}
          className="absolute inset-0 h-full w-full object-cover"
          muted
          playsInline
          autoPlay
          loop
          preload="metadata"
          onCanPlay={() => setLoaded(true)}
          onLoadedData={() => setLoaded(true)}
          onError={() => setLoaded(true)}
        >
          <source src={c.experienceVideo} type="video/mp4" />
        </video>
        {!loaded && (
          <div className="absolute inset-0 grid place-items-center bg-black">
            <div className="flex flex-col items-center gap-4">
              <div className="h-[1px] w-24 overflow-hidden bg-white/20">
                <div className="h-full w-1/2 animate-[marquee_1.6s_linear_infinite] bg-[#C9A227]" />
              </div>
              <span className="text-[10px] uppercase tracking-[0.3em] text-white/60">
                Loading Experience
              </span>
            </div>
          </div>
        )}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/40 to-black/30" />
        <div className="pointer-events-none absolute inset-0 grain" />
        <div className="container-editorial relative z-10 flex h-full items-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="max-w-xl"
          >
            <div className="eyebrow mb-5 flex items-center gap-3">
              <span className="hairline" />
              {c.experienceEyebrow}
            </div>
            <h3 className="font-serif text-4xl leading-[1.05] tracking-tight md:text-5xl lg:text-6xl">
              {c.experienceHeading}
            </h3>
            <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/70">
              {c.experienceSubtitle}
            </p>
            <button
              onClick={() => {
                const v = videoRef.current;
                if (!v) return;
                if (v.paused) {
                  v.play();
                  setPlaying(true);
                } else {
                  v.pause();
                  setPlaying(false);
                }
              }}
              className="mt-10 inline-flex items-center gap-4 text-white/90 hover:text-white transition"
              aria-label={playing ? "Pause video" : "Play video"}
            >
              <span className="grid h-14 w-14 place-items-center rounded-full border border-white/40 backdrop-blur-sm">
                {playing ? (
                  <Pause className="h-5 w-5" />
                ) : (
                  <Play className="h-5 w-5 translate-x-[1px]" />
                )}
              </span>
              <span className="text-sm font-semibold uppercase tracking-[0.18em]">
                {playing ? "Pause Video" : "Play Video"}
              </span>
            </button>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ---------- Customize teaser ------------------------------------------------
function CustomizeTeaser({ c }) {
  const [name, setName] = useState("Your Name");
  return (
    <section id="customize" className="relative bg-black text-white">
      <div className="container-editorial grid grid-cols-12 items-center gap-10 py-24 md:py-32">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-12 md:col-span-6"
        >
          <div className="eyebrow flex items-center gap-3">
            <span className="hairline" />
            Make It Yours
          </div>
          <h2 className="mt-5 font-serif text-4xl leading-[1.05] tracking-tight md:text-5xl lg:text-[56px]">
            {c.customizeHeading}
          </h2>
          <p className="mt-5 max-w-md text-[15px] leading-relaxed text-white/70">
            {c.customizeSubtitle}
          </p>
          <div className="mt-8 max-w-sm">
            <label
              htmlFor="engrave"
              className="text-xs uppercase tracking-[0.2em] text-white/50"
            >
              Preview Engraving
            </label>
            <input
              id="engrave"
              value={name}
              maxLength={16}
              onChange={(e) => setName(e.target.value)}
              className="mt-2 w-full rounded-sm border border-white/15 bg-white/[0.04] px-4 py-3 text-white placeholder:text-white/40 focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/20"
              placeholder="Your Name"
            />
          </div>
          <div className="mt-8">
            <Link href="/customize" className="btn-gold">
              Start Customizing <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </motion.div>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 1.2, ease: [0.22, 1, 0.36, 1] }}
          className="col-span-12 md:col-span-6"
        >
          <div className="relative aspect-[5/4] overflow-hidden rounded-sm ring-1 ring-white/10">
            <img
              src={CUSTOMIZE_IMG}
              alt="Customize your Inclex keychain"
              className="h-full w-full object-cover"
            />
            <div className="absolute inset-0 grid place-items-center">
              <span
                className="translate-x-[6%] translate-y-[8%] rotate-[-2deg] font-serif text-2xl italic tracking-wide text-[#C9A227]/90 md:text-3xl lg:text-4xl"
                style={{ textShadow: "0 2px 24px rgba(0,0,0,0.4)" }}
              >
                {name || "Your Name"}
              </span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ---------- Newsletter -------------------------------------------------------
function Newsletter({ c }) {
  const [email, setEmail] = useState("");
  const [sending, setSending] = useState(false);
  const [done, setDone] = useState(false);
  async function subscribe(e) {
    e.preventDefault();
    setSending(true);
    try {
      const r = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await r.json();
      if (data.ok) {
        toast.success("You’re on the list", {
          description: "Welcome to Inclex.",
        });
        setDone(true);
        setEmail("");
      } else toast.error(data.error || "Please enter a valid email");
    } catch {
      toast.error("Network error");
    } finally {
      setSending(false);
    }
  }
  return (
    <section className="border-y border-black/[0.06] bg-[#F8F7F4] py-14">
      <div className="container-editorial grid grid-cols-12 items-center gap-8">
        <div className="col-span-12 md:col-span-5 flex items-center gap-5">
          <span className="grid h-14 w-14 place-items-center rounded-full border border-black/10 bg-white text-[#C9A227]">
            <Mail className="h-5 w-5" />
          </span>
          <div>
            <div className="font-serif text-2xl leading-tight">
              {c.newsletterHeading}
            </div>
            <div className="text-sm text-neutral-500">
              {c.newsletterSubtitle}
            </div>
          </div>
        </div>
        <form
          onSubmit={subscribe}
          className="col-span-12 md:col-span-7 flex flex-col gap-3 sm:flex-row"
        >
          <input
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            className="flex-1 rounded-sm border border-black/10 bg-white px-5 py-3.5 text-sm text-black placeholder:text-neutral-400 focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25"
          />
          <button
            type="submit"
            disabled={sending}
            className="btn-dark min-w-[140px]"
          >
            {done ? (
              <>
                <Check className="h-4 w-4" /> Subscribed
              </>
            ) : sending ? (
              "Subscribing…"
            ) : (
              "Subscribe"
            )}
          </button>
        </form>
      </div>
    </section>
  );
}

export default function App() {
  const [content, setContent] = useState(DEFAULT_HOMEPAGE);
  useEffect(() => {
    fetchHomepage().then(setContent);
  }, []);

  return (
    <main className="min-h-screen bg-background text-foreground">
      <Header variant="dark" overlay />
      <Hero c={content} />
      <Experience c={content} />
      <CustomizeTeaser c={content} />
      <Newsletter c={content} />
      <Footer />
    </main>
  );
}
