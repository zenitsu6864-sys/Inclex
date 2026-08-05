"use client";

import {
  Droplets,
  Briefcase,
  Plane,
  ShieldCheck,
  Sparkles,
  Recycle,
} from "lucide-react";

const FEATURES = [
  {
    icon: Droplets,
    title: "Refillable",
    subtitle: "Easy to refill",
  },
  {
    icon: Recycle,
    title: "Eco Friendly",
    subtitle: "Reusable for years",
  },
  {
    icon: Briefcase,
    title: "Pocket Size",
    subtitle: "Carry anywhere",
  },
  {
    icon: Plane,
    title: "Travel Friendly",
    subtitle: "Perfect for trips",
  },
  {
    icon: ShieldCheck,
    title: "Leak Proof",
    subtitle: "Secure locking system",
  },
  {
    icon: Sparkles,
    title: "Premium Finish",
    subtitle: "Luxury matte coating",
  },
];

export default function ProductFeatures() {
  return (
    <section className="bg-black py-8">
      <div className="container-editorial">
        <div className="mx-auto grid max-w-6xl grid-cols-2 gap-6 md:grid-cols-3 xl:grid-cols-6">
          {FEATURES.map((feature) => {
            const Icon = feature.icon;

            return (
              <div
                key={feature.title}
                className="group mx-auto w-full max-w-[150px] text-center"
              >
                <div className="mx-auto grid h-12 w-12 place-items-center rounded-full border border-white/15 bg-white/5 transition duration-300 group-hover:border-[#C9A227] group-hover:bg-[#C9A227]/10">
                 <Icon className="h-5 w-5 text-[#C9A227]" />
                </div>

                <h3 className="mt-3 text-sm font-semibold text-white">
                  {feature.title}
                </h3>

                <p className="mt-1 text-xs text-neutral-400">
                  {feature.subtitle}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
