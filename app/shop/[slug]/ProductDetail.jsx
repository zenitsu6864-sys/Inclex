"use client";

import Link from "next/link";
import { useState } from "react";
import { motion } from "framer-motion";
import {
  Heart,
  Minus,
  Plus,
  ShieldCheck,
  Truck,
  RefreshCw,
  Sparkles,
  ChevronRight,
  Star,
} from "lucide-react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { useCart } from "@/components/site/CartContext";
import WishlistButton from "@/components/site/WishlistButton";

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

export default function ProductDetail({ product, related }) {
  const [active, setActive] = useState(0);
  const [color, setColor] = useState(product.colors[0]);
  const [qty, setQty] = useState(1);
  const [engraving, setEngraving] = useState("");
  const { add } = useCart();

  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <Header variant="light" />

      <div className="container-editorial pt-8 text-xs text-neutral-500">
        <Link href="/" className="hover:text-black">
          Home
        </Link>
        <ChevronRight className="mx-1 inline h-3 w-3" />
        <Link href="/shop" className="hover:text-black">
          Shop
        </Link>
        <ChevronRight className="mx-1 inline h-3 w-3" />
        <span className="text-black">{product.name}</span>
      </div>

      <section className="container-editorial grid grid-cols-1 lg:grid-cols-2 gap-12 xl:gap-20 items-start pt-10 pb-20">
        {/* Gallery */}
        <div className="relative lg:sticky lg:top-24">
          <div className="mx-auto w-full max-w-[540px]">
            <div className="relative w-full aspect-[4/5] overflow-hidden rounded-2xl bg-[#EFEDE7] shadow-lg">
              <img
                src={product.images[active]}
                alt={product.name}
                className="h-full w-full object-cover"
              />
              <div className="absolute left-3 top-3 flex flex-wrap gap-1">
                {product.badges.map((b, i) => (
                  <span
                    key={b}
                    className={`rounded-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${i === 0 ? "bg-black text-white" : "bg-[#C9A227] text-black"}`}
                  >
                    {b}
                  </span>
                ))}
              </div>
            </div>
          </div>
          <div className="mt-5 flex gap-3 justify-center">
            {product.images.map((src, i) => (
              <button
                key={src}
                onClick={() => setActive(i)}
                className={`relative h-20 w-20 overflow-hidden rounded-xl border-2 transition ${
                  active === i
                    ? "border-[#C9A227]"
                    : "border-black/10 hover:border-[#C9A227]"
                }`}
              >
                <img src={src} alt="" className="h-full w-full object-cover" />
              </button>
            ))}
          </div>
        </div>

        {/* Buy panel */}
        <div className="relative self-start lg:sticky lg:top-24 xl:pl-8">
          <div className="eyebrow flex items-center gap-3">
            <span className="hairline" />
            Signature Collection
          </div>
          <h1 className="mt-4 font-serif text-4xl xl:text-6xl leading-tight">
            {product.name}
          </h1>
          <p className="mt-2 text-sm text-neutral-500">{product.subtitle}</p>

          <div className="mt-4 flex items-center gap-2 text-sm">
            <span className="inline-flex items-center gap-0.5 text-[#C9A227]">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star
                  key={i}
                  className={`h-4 w-4 ${i < Math.floor(product.rating) ? "fill-current" : ""}`}
                />
              ))}
            </span>
            <span className="text-neutral-500">
              {product.rating} · {product.reviews} reviews
            </span>
          </div>

          <div className="mt-6 flex items-baseline gap-3">
            <div className="font-serif text-3xl">₹{fmt(product.price)}</div>
            {product.compareAt && (
              <div className="text-sm text-neutral-400 line-through">
                ₹{fmt(product.compareAt)}
              </div>
            )}
            {product.compareAt && (
              <span className="rounded-sm bg-[#C9A227]/15 px-2 py-0.5 text-[11px] font-semibold text-[#8B6E12]">
                Save ₹{fmt(product.compareAt - product.price)}
              </span>
            )}
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Inclusive of all taxes. Free shipping above ₹499.
          </p>

          <p className="mt-6 text-base leading-8 text-neutral-700">
            {product.description}
          </p>

          {/* Color */}
          <div className="mt-7">
            <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
              Color — <span className="text-black">{color}</span>
            </div>
            <div className="mt-3 flex flex-wrap gap-2">
              {product.colors.map((c) => (
                <button
                  key={c}
                  onClick={() => setColor(c)}
                  className={`inline-flex items-center gap-2 rounded-sm border px-3 py-2 text-xs uppercase tracking-[0.14em] transition ${color === c ? "border-black bg-black text-white" : "border-black/15 hover:border-black"}`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>

          {/* Engraving */}
          <div className="mt-6">
            <div className="flex items-center justify-between">
              <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">
                Personalize (optional)
              </div>
              <span className="text-[11px] text-neutral-400">
                {engraving.length}/16
              </span>
            </div>
            <input
              value={engraving}
              maxLength={16}
              onChange={(e) => setEngraving(e.target.value)}
              placeholder="Engrave your name or initials"
              className="mt-2 w-full rounded-sm border border-black/10 bg-white px-4 py-3 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25"
            />
          </div>

          {/* Qty + Add */}
          <div className="mt-8 flex gap-4">
            <div className="inline-flex items-center rounded-sm border border-black/10 bg-white">
              <button
                onClick={() => setQty((q) => Math.max(1, q - 1))}
                className="px-3 py-3"
              >
                <Minus className="h-4 w-4" />
              </button>
              <span className="min-w-[2rem] text-center text-sm font-medium">
                {qty}
              </span>
              <button
                onClick={() => setQty((q) => q + 1)}
                className="px-3 py-3"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
            <button
              onClick={() => add(product, { color, engraving, qty })}
              className="btn-dark flex-1 h-14 text-sm uppercase tracking-[0.18em]"
            >
              Add to Bag — ₹{fmt(product.price * qty)}
            </button>
            <WishlistButton product={product} variant="hero" />
          </div>

          {/* Perks */}
          <div className="mt-10 grid grid-cols-3 gap-6 border-t border-black/10 pt-6 text-xs">
            <div className="flex items-start gap-2">
              <Truck className="h-4 w-4 text-[#C9A227]" />
              <span>
                Free shipping
                <br />
                <span className="text-neutral-500">Above ₹299</span>
              </span>
            </div>
            {/* <div className="flex items-start gap-2">
              <RefreshCw className="h-4 w-4 text-[#C9A227]" />
              <span>
                Easy returns
                <br />
                <span className="text-neutral-500">14 days</span>
              </span>
            </div>
            <div className="flex items-start gap-2">
              <ShieldCheck className="h-4 w-4 text-[#C9A227]" />
              <span>
                Lifetime finish
                <br />
                <span className="text-neutral-500">Guaranteed</span>
              </span>
            </div> */}
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="bg-white py-16 md:py-24">
        <div className="container-editorial">
          <div className="eyebrow flex items-center gap-3">
            <span className="hairline" />
            Product Details
          </div>
          <h2 className="mt-4 max-w-2xl font-serif text-3xl leading-tight md:text-4xl">
            Every detail, engineered with intention.
          </h2>
          <div className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-4">
            {product.highlights.map((h) => (
              <div key={h.title}>
                <span className="grid h-10 w-10 place-items-center rounded-sm border border-black/10 text-[#C9A227]">
                  <Sparkles className="h-4 w-4" />
                </span>
                <div className="mt-4 font-serif text-xl">{h.title}</div>
                <p className="mt-1.5 text-sm text-neutral-600">{h.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Related */}
      <section className="bg-[#F8F7F4] py-16 md:py-24">
        <div className="container-editorial">
          <div className="flex items-end justify-between">
            <div>
              <div className="eyebrow flex items-center gap-3">
                <span className="hairline" />
                You may also love
              </div>
              <h2 className="mt-3 font-serif text-3xl md:text-4xl">
                More from the collection
              </h2>
            </div>
            <Link
              href="/shop"
              className="hidden md:inline-flex text-sm font-semibold uppercase tracking-[0.16em] hover:text-[#C9A227]"
            >
              Shop all <ChevronRight className="ml-1 inline h-4 w-4" />
            </Link>
          </div>
          <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {related.map((p) => (
              <Link
                key={p.id}
                href={`/shop/${p.slug}`}
                className="group overflow-hidden rounded-sm border border-black/[0.06] bg-white"
              >
                <div className="aspect-[4/5] overflow-hidden bg-[#EFEDE7]">
                  <img
                    src={p.images[0]}
                    alt={p.name}
                    className="h-full w-full object-cover transition-transform duration-1000 group-hover:scale-105"
                  />
                </div>
                <div className="p-5">
                  <div className="font-serif text-xl">{p.name}</div>
                  <div className="text-xs text-neutral-500">{p.subtitle}</div>
                  <div className="mt-2 font-serif text-lg">₹{fmt(p.price)}</div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
