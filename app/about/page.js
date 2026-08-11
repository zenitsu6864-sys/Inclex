"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowRight, Award, Compass, Feather, Hammer } from "lucide-react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";

const STORY_IMG =
  "https://images.unsplash.com/photo-1676276550349-580c49631496?auto=format&fit=crop&w=2000&q=90";

const CRAFT_IMG =
  "/uploads/images/1786448895725-promg8cw51s.jpeg";

const ATELIER_IMG =
  "/uploads/images/1786065479515-nzvkcbai3dk.jpeg";

const VALUES = [
  {
    icon: Award,
    title: "Design",
    body: "Thoughtfully designed products that bring together premium aesthetics and everyday convenience.",
  },
  {
    icon: Feather,
    title: "Functionality",
    body: "Every product should have a purpose and fit naturally into the way people live.",
  },
  {
    icon: Compass,
    title: "Portability",
    body: "Compact, convenient products designed to become a natural part of your everyday carry.",
  },
  {
    icon: Hammer,
    title: "Quality",
    body: "We pay attention to materials, functionality, details, and the overall experience.",
  },
];

export default function AboutPage() {
  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <Header variant="light" />

      {/* HERO / ABOUT INCLEX */}
      <section className="relative overflow-hidden bg-black text-white">
        <img
          src={STORY_IMG}
          alt="INCLEX"
          className="absolute inset-0 h-full w-full object-cover opacity-55"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/50 to-black/20" />

        <div className="container-editorial relative z-10 py-24 md:py-32">
          <div className="eyebrow flex items-center gap-3">
            <span className="hairline" />
            About INCLEX
          </div>

          <h1 className="mt-4 max-w-3xl font-serif text-4xl leading-[1.05] sm:text-5xl md:text-6xl lg:text-7xl">
            Designed to Be{" "}
            <span className="italic text-[#C9A227]">More.</span>
          </h1>

          <p className="mt-6 max-w-xl text-white/70">
            At INCLEX, we believe everyday products can be more than what they
            are expected to be. We create thoughtfully designed products that
            bring together functionality, premium aesthetics, portability, and
            everyday convenience.
          </p>
        </div>
      </section>

      {/* OUR BEGINNING */}
      <section
        id="story"
        className="container-editorial grid grid-cols-1 items-center gap-10 py-16 md:py-24 lg:grid-cols-12"
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
            alt="INCLEX product design"
            className="aspect-[4/5] w-full rounded-sm object-cover"
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
            Our Beginning
          </div>

          <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">
            Products designed for everyday life.
          </h2>

          <div className="mt-6 space-y-5 text-[15px] leading-relaxed text-neutral-700">
            <p>
              INCLEX was born from a desire to create products that feel
              different—not simply because of how they look, but because of how
              they fit into everyday life.
            </p>

            <p>
              We saw an opportunity to bring together the things people value:
              practicality, quality, design, and convenience. That idea became
              the foundation of INCLEX.
            </p>

            <p>
              Since then, our focus has remained on creating products that are
              thoughtfully designed, easy to carry, and genuinely enjoyable to
              use.
            </p>
          </div>

          <div className="mt-8 flex flex-wrap gap-6 border-t border-black/10 pt-8">
            <Stat n="Design" label="Thoughtfully considered" />
            <Stat n="Utility" label="Built for everyday life" />
            <Stat n="Quality" label="Made with purpose" />
          </div>
        </motion.div>
      </section>

      {/* WHAT WE BELIEVE */}
      <section className="bg-white py-24">
        <div className="container-editorial">
          <div className="eyebrow flex items-center gap-3">
            <span className="hairline" />
            What We Believe
          </div>

          <h2 className="mt-4 max-w-2xl font-serif text-4xl md:text-5xl">
            Good design should have a purpose.
          </h2>

          <div className="mt-14 grid gap-10 md:grid-cols-2 lg:grid-cols-4">
            {VALUES.map((v) => (
              <div key={v.title}>
                <span className="grid h-12 w-12 place-items-center rounded-sm border border-black/10 text-[#C9A227]">
                  <v.icon className="h-5 w-5" />
                </span>

                <div className="mt-5 font-serif text-2xl">
                  {v.title}
                </div>

                <p className="mt-2 text-sm text-neutral-600">
                  {v.body}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* COMMITMENT / LOOKING AHEAD */}
      <section className="relative overflow-hidden bg-black text-white">
        <img
          src={ATELIER_IMG}
          alt="INCLEX products"
          className="absolute inset-0 h-full w-full object-cover opacity-40"
        />

        <div className="absolute inset-0 bg-gradient-to-b from-black/70 via-black/40 to-black/80" />

        <div className="container-editorial relative z-10 py-24 text-center md:py-32">
          <div className="eyebrow flex items-center justify-center gap-3">
            <span className="hairline" />
            Looking Ahead
          </div>

          <h2 className="mx-auto mt-4 max-w-3xl font-serif text-3xl leading-tight sm:text-4xl md:text-5xl lg:text-6xl">
            Thoughtful Design.
            <br />
            Everyday Utility.
            <br />
            <span className="italic text-[#C9A227]">
              Premium Experience.
            </span>
          </h2>

          <p className="mx-auto mt-6 max-w-2xl text-white/70">
            INCLEX is at the beginning of its journey. As we continue to grow,
            we remain focused on creating better everyday experiences through
            thoughtful products and design.
          </p>

          <p className="mx-auto mt-4 max-w-2xl text-white/70">
            There is much more to come, but we believe the best way to build a
            meaningful brand is to let the products speak for themselves.
          </p>

          <div className="mt-10">
            <Link href="/shop" className="btn-gold">
              Explore Keyfume
              <ArrowRight className="h-4 w-4" />
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
      <div className="font-serif text-2xl md:text-3xl">
        {n}
      </div>

      <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
        {label}
      </div>
    </div>
  );
}