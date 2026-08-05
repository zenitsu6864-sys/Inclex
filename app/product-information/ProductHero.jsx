// ProductHero.jsx
"use client";

import Link from "next/link";
import { ArrowRight, ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductHero() {
  return (
    <section className="bg-[#F8F7F4] border-b border-black/10">
      <div className="container-editorial py-12">

        {/* Breadcrumb */}
        <div className="flex items-center gap-2 text-xs text-neutral-500 uppercase tracking-[0.18em]">
          <Link href="/" className="hover:text-black">
            Home
          </Link>

          <ChevronRight className="h-3 w-3" />

          <span className="text-black">
            Product Information
          </span>
        </div>

        <div className="mt-12 grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">

          {/* Left */}
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="eyebrow flex items-center gap-3">
              <span className="hairline" />
              Premium Collection
            </div>

            <h1 className="mt-6 font-serif text-5xl md:text-6xl lg:text-7xl leading-none">
              Product
              <br />
              Information
            </h1>

            <p className="mt-6 max-w-xl text-neutral-600 leading-8 text-lg">
              Everything you need to know about the
              INCLEX Keyfume refillable perfume
              keychain.
              Learn its features, refill process,
              specifications and care instructions.
            </p>

            <div className="mt-10 flex gap-4">

              <Link
                href="/shop/keyfume-by-inclex"
                className="btn-dark"
              >
                Buy Now
                <ArrowRight className="h-4 w-4" />
              </Link>

              <Link
                href="/shop"
                className="rounded-sm border border-black px-6 py-3 font-medium hover:bg-black hover:text-white transition"
              >
                Shop Collection
              </Link>

            </div>

          </motion.div>

          {/* Right */}

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="rounded-2xl overflow-hidden bg-white shadow-xl">

              <img
                src="/uploads/images/1785871914300-hyq8behhkkw.jpeg"
                alt="Keyfume"
                className="w-full object-cover"
              />

            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}