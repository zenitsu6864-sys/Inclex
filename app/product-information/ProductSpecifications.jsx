"use client";

import {
  Ruler,
  Weight,
  Package,
  Droplets,
  ShieldCheck,
  Sparkles,
  Box,
  BadgeCheck,
} from "lucide-react";

const SPECIFICATIONS = [
  {
    icon: Ruler,
    title: "Dimensions",
    value: "5.5 × 2.5 × 2.5 mm",
  },
  {
    icon: Weight,
    title: "Weight",
    value: "30 g",
  },
  {
    icon: Droplets,
    title: "Capacity",
    value: "50 Refills",
  },
  {
    icon: ShieldCheck,
    title: "Material",
    value: "Premium POM",
  },
  {
    icon: Sparkles,
    title: "Finish",
    value: "Luxury Matte Finish",
  },
  {
    icon: Package,
    title: "Usage",
    value: "Daily Carry",
  },
  {
    icon: Box,
    title: "Package",
    value: "Premium Gift Box",
  },
  {
    icon: BadgeCheck,
    title: "Warranty",
    value: "Manufacturing Warranty",
  },
];

export default function ProductSpecifications() {
  return (
    <section className="bg-white py-16">
      <div className="container-editorial">
        {/* Heading */}
        <div className="text-center">
          <div className="eyebrow flex items-center justify-center gap-3">
            <span className="hairline" />
            Specifications
          </div>

          <h2 className="mt-4 font-serif text-4xl">Technical Details</h2>

          <p className="mx-auto mt-3 max-w-2xl text-neutral-600 leading-7">
            Every Keyfume is engineered using premium materials for durability,
            portability and everyday luxury.
          </p>
        </div>

        {/* Cards */}
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SPECIFICATIONS.map((item) => {
            const Icon = item.icon;

            return (
              <div
                key={item.title}
                className="rounded-xl border border-black/5 bg-[#F8F7F4] p-5 transition hover:-translate-y-1 hover:shadow-md"
              >
                <div className="grid h-10 w-10 place-items-center rounded-full bg-[#C9A227]/10">
                  <Icon className="h-5 w-5 text-[#C9A227]" />
                </div>

                <div className="mt-4 text-[11px] uppercase tracking-[0.18em] text-neutral-500">
                  {item.title}
                </div>

                <div className="mt-2 font-serif text-xl leading-snug">
                  {item.value}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
