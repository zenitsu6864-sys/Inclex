"use client";

import Link from "next/link";
import { ArrowRight, ShoppingBag } from "lucide-react";
import { motion } from "framer-motion";

export default function ProductCTA() {
  return (
    <section className="relative overflow-hidden bg-black text-white">
      {/* Background Overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage:
            "url('/uploads/images/keyfume-banner.jpg')",
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      />

      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/80 to-black" />

      <div className="container-editorial relative z-10 py-28">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mx-auto max-w-4xl text-center"
        >
          <div className="eyebrow flex items-center justify-center gap-3">
            <span className="hairline" />
            INCLEX COLLECTION
          </div>

          <h2 className="mt-6 font-serif text-5xl leading-tight md:text-6xl">
            Carry Your Signature
            <br />
            Fragrance Everywhere
          </h2>

          <p className="mx-auto mt-8 max-w-2xl text-lg leading-8 text-white/70">
            Designed for modern lifestyles, Keyfume combines premium
            craftsmanship, portability and elegance in one compact accessory.
          </p>

          <div className="mt-12 flex flex-col justify-center gap-5 sm:flex-row">
            <Link
              href="/shop/keyfume-by-inclex"
              className="btn-gold"
            >
              <ShoppingBag className="h-5 w-5" />
              Buy Keyfume
            </Link>

            <Link
              href="/shop"
              className="btn-ghost-light"
            >
              Explore Collection
              <ArrowRight className="h-5 w-5" />
            </Link>
          </div>
        </motion.div>
      </div>
    </section>
  );
}