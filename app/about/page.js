"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Award, Compass, Feather, Hammer } from "lucide-react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

const STORY_IMG =
  "https://images.unsplash.com/photo-1676276550349-580c49631496?auto=format&fit=crop&w=2000&q=90";
const CRAFT_IMG =
  "https://images.pexels.com/photos/33242820/pexels-photo-33242820.jpeg?auto=compress&cs=tinysrgb&w=2000&q=85";
const ATELIER_IMG =
  "https://images.pexels.com/photos/28028334/pexels-photo-28028334.jpeg?auto=compress&cs=tinysrgb&w=2000&q=85";

const VALUES = [
  {
    icon: Award,
    title: "Craftsmanship",
    body: "Every piece is finished by hand. No shortcuts, no compromises.",
  },
  {
    icon: Feather,
    title: "Restraint",
    body: "We remove the unnecessary. What remains, endures.",
  },
  {
    icon: Compass,
    title: "Intentional",
    body: "Materials, hardware and stitching chosen with purpose.",
  },
  {
    icon: Hammer,
    title: "Made in India",
    body: "Designed and hand-assembled in our Bengaluru atelier.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <Header variant="light" />

      <section className="relative overflow-hidden bg-black text-white">
        <img
          src={STORY_IMG}
          alt="Inclex atelier"
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/20" />
        <div className="container-editorial relative z-10 py-24 md:py-32">
          <div className="eyebrow flex items-center gap-3">
            <span className="hairline" />
            Our Story
          </div>
          <h1 className="mt-4 max-w-3xl font-serif text-4xl sm:text-5xl md:text-6xl lg:text-7xl leading-[1.05] break-words">
            Small objects,
            <br />
            lasting <span className="italic text-[#C9A227]">impressions.</span>
          </h1>
          <p className="mt-6 max-w-xl text-white/70">
            Inclex was born from a simple question — why should the smallest
            thing you carry every day feel disposable? We believe it shouldn’t.
          </p>
        </div>
      </section>
<section
  id="story"
  className="container-editorial grid grid-cols-1 lg:grid-cols-12 items-center gap-10 py-16 md:py-24"
>
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
         className="lg:col-span-6"
        >
          <img
            src={CRAFT_IMG}
            alt="Craft"
            className="aspect-[4/5] w-full object-cover rounded-sm"
          />
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8, delay: 0.1 }}
          className="lg:col-span-6"
        >
          <div className="eyebrow flex items-center gap-3">
            <span className="hairline" />
            Philosophy
          </div>
          <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
            A quiet kind of luxury.
          </h2>
          <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-neutral-700">
            <p>
              We believe true luxury isn’t loud. It reveals itself in the weight
              of the leather, the finish of the steel, the way a keychain feels
              in your palm after a long day.
            </p>
            <p>
              Every Inclex piece is built from the inside out — full-grain
              vegetable-tanned leather, aerospace carbon, 316L stainless. Then
              it’s finished by hand, one at a time.
            </p>
            <p>We only launch a piece when it’s worthy of your name.</p>
          </div>
          <div className="mt-8 flex flex-wrap gap-6 border-t border-black/10 pt-8">
            <Stat n="12k+" label="Pieces crafted" />
            <Stat n="4.8★" label="Rated by customers" />
            <Stat n="14+" label="Cities delivered" />
          </div>
        </motion.div>
      </section>

      <section className="bg-white py-24">
        <div className="container-editorial">
          <div className="eyebrow flex items-center gap-3">
            <span className="hairline" />
            What we believe
          </div>
          <h2 className="mt-4 max-w-2xl font-serif text-4xl md:text-5xl">
            Four principles guide everything we make.
          </h2>
          <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title}>
                <span className="grid h-12 w-12 place-items-center rounded-sm border border-black/10 text-[#C9A227]">
                  <v.icon className="h-5 w-5" />
                </span>
                <div className="mt-5 font-serif text-2xl">{v.title}</div>
                <p className="mt-2 text-sm text-neutral-600">{v.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative overflow-hidden bg-black text-white">
        <img
          src={ATELIER_IMG}
          alt="Atelier"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />
        <div className="container-editorial relative z-10 py-24 md:py-32 text-center">
          <div className="eyebrow flex items-center justify-center gap-3">
            <span className="hairline" />
            The Atelier
          </div>
       <h2 className="mt-4 mx-auto max-w-3xl font-serif text-3xl sm:text-4xl md:text-5xl lg:text-6xl leading-tight break-words">
            Bengaluru, India — where every Inclex is finished by hand.
          </h2>
          <div className="mt-10">
            <Link href="/shop" className="btn-gold">
              Explore the Collection <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function Stat({ n, label }) {
  return (
    <div>
      <div className="font-serif text-3xl">{n}</div>
      <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </div>
    </div>
  );
}
