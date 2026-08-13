"use client";

import { useState } from "react";
import Link from "next/link";
import {
  CheckCircle2,
  Droplets,
  Briefcase,
  ShieldCheck,
  Sparkles,
  ArrowRight,
} from "lucide-react";

const IMAGES = [
  "/uploads/images/1785871863078-9jsnapnecpt.jpeg",
  "/uploads/images/1785871879166-lp5g5c1kbni.jpeg",
  "/uploads/images/1785871893742-0tiubsbqkvyl.jpeg",
  "/uploads/images/1785871914300-hyq8behhkkw.jpeg",
];

export default function ProductOverview() {
  const [active, setActive] = useState(0);

  return (
    <section className="bg-white py-24">
      <div className="container-editorial">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-start">
          {/* LEFT SIDE */}
          <div className="flex gap-5">
            {/* Thumbnails */}
            <div className="flex flex-col gap-4">
              {IMAGES.map((img, index) => (
                <button
                  key={img}
                  onClick={() => setActive(index)}
                  className={`overflow-hidden rounded-xl border-2 transition ${
                    active === index ? "border-[#C9A227]" : "border-black/10"
                  }`}
                >
                  <img src={img} alt="" className="h-24 w-24 object-cover" />
                </button>
              ))}
            </div>

            {/* Main Image */}
            <div className="flex-1 overflow-hidden rounded-2xl bg-[#F8F7F4] shadow-lg">
              <img
                src={IMAGES[active]}
                alt="Keyfume"
                className="w-full object-cover"
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div>
            <div className="eyebrow flex items-center gap-3">
              <span className="hairline" />
              Product Overview
            </div>

            <h2 className="mt-5 font-serif text-5xl">Keyfume by INCLEX</h2>

            <p className="mt-6 text-neutral-600 leading-8">
              Keyfume is a premium refillable perfume keychain designed to keep
              your favorite fragrance with you wherever you go. Simply refill it
              with any perfume you love and enjoy the freedom of carrying your
              signature scent without the bulk of a traditional perfume bottle.
              Compact, elegant, and crafted for everyday convenience, Keyfume
              ensures you're always ready to refresh—whether you're at work,
              traveling, driving, or heading to a special occasion. Refill.
              Carry. Refresh. Anytime. Anywhere.
            </p>

            {/* Feature Grid */}
            <div className="mt-10 grid grid-cols-2 gap-6">
              <Feature icon={<Droplets />} title="Refillable" />
              <Feature icon={<Briefcase />} title="Pocket Friendly" />
              <Feature icon={<ShieldCheck />} title="Leak Proof" />
              <Feature icon={<Sparkles />} title="Premium Finish" />
            </div>

            {/* Specs */}
            <div className="mt-10 space-y-4 border-t pt-8">
              <Spec title="Capacity" value=" 50 sprays" />
              <Spec title="Weight" value="30 g" />
              <Spec title="Compatibility" value="Liquid Based Perfumes" />
            </div>

            {/* Buttons */}
            <div className="mt-10 flex gap-4">
              <Link href="/shop/keyfume-by-inclex" className="btn-dark">
                Buy Now
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/shop"
                className="rounded-sm border border-black px-6 py-3 hover:bg-black hover:text-white transition"
              >
                Shop
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function Feature({ icon, title }) {
  return (
    <div className="flex items-center gap-3">
      <div className="grid h-12 w-12 place-items-center rounded-full bg-[#C9A227]/10 text-[#C9A227]">
        {icon}
      </div>

      <div>
        <div className="font-medium">{title}</div>
      </div>
    </div>
  );
}

function Spec({ title, value }) {
  return (
    <div className="flex justify-between border-b border-black/10 pb-3">
      <span className="text-neutral-500">{title}</span>
      <span className="font-medium">{value}</span>
    </div>
  );
}
