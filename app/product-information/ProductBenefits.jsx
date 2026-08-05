"use client";

import {
  Sparkles,
  ShieldCheck,
  Briefcase,
  Droplets,
  Plane,
  Gift,
} from "lucide-react";

const BENEFITS = [
  {
    icon: Sparkles,
    title: "Luxury Design",
    description: "Minimal premium finish for everyday elegance.",
  },
  {
    icon: ShieldCheck,
    title: "Leak-Proof",
    description: "Secure sealing prevents accidental leakage.",
  },
  {
    icon: Briefcase,
    title: "Everyday Carry",
    description: "Compact enough for your pocket or keychain.",
  },
  {
    icon: Droplets,
    title: "Refillable",
    description: "Easy refill system designed for repeated use.",
  },
  {
    icon: Plane,
    title: "Travel Ready",
    description: "Ideal for travel, office and daily commuting.",
  },
  {
    icon: Gift,
    title: "Perfect Gift",
    description: "Premium packaging for every occasion.",
  },
];

export default function ProductBenefits() {
  return (
    <section className="bg-[#F8F7F4] py-16">
      <div className="container-editorial">
        {/* Heading */}
        <div className="text-center">
          <div className="eyebrow flex items-center justify-center gap-3">
            <span className="hairline" />
            Why Choose INCLEX
          </div>

          <h2 className="mt-4 font-serif text-4xl">
            Crafted for Everyday Luxury
          </h2>

          <p className="mx-auto mt-3 max-w-2xl text-neutral-600 leading-7">
            Premium craftsmanship combined with portability and everyday
            practicality.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {BENEFITS.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-xl border border-black/5 bg-white p-6 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#C9A227]/10">
                  <Icon className="h-5 w-5 text-[#C9A227]" />
                </div>

                <h3 className="mt-4 font-serif text-2xl">
                  {item.title}
                </h3>

                <p className="mt-2 text-sm leading-7 text-neutral-600">
                  {item.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}