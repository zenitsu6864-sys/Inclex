"use client";
import Image from "next/image";
import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  Grid,
  List,
  ChevronDown,
  Sparkles,
  ShieldCheck,
  Diamond,
  SlidersHorizontal,
} from "lucide-react";
import Header from "@/components/site/Header";
import Footer from "@/components/site/Footer";
import { useCart } from "@/components/site/CartContext";
import WishlistButton from "@/components/site/WishlistButton";

const SHOP_HERO = "/uploads/images/1785865585721-f3z0pntb28l.jpeg";

const COLORS = [
  { name: "Black", hex: "#111111" },
  { name: "Cognac", hex: "#7A3B18" },
  { name: "Espresso", hex: "#3E2416" },
  { name: "Tan", hex: "#B0824E" },
  { name: "Silver", hex: "#C0C4C8" },
  { name: "Gunmetal", hex: "#4B4F54" },
];

const SORTS = [
  { id: "newest", label: "Newest" },
  { id: "price_asc", label: "Price: Low to High" },
  { id: "price_desc", label: "Price: High to Low" },
  { id: "rating", label: "Highest Rated" },
];

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", {
    maximumFractionDigits: 0,
  }).format(n);

export default function ShopPage() {
  const [priceRange, setPriceRange] = useState("all");
  const [colorSel, setColorSel] = useState({});
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [view, setView] = useState("grid");
  const [sort, setSort] = useState("newest");

  const { add } = useCart();
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function loadProducts() {
      try {
        const res = await fetch("/api/products", {
          cache: "force-cache",
        });

        const data = await res.json();

        setProducts(data.products || []);
      } catch (err) {
        console.error(err);
      }
    }

    loadProducts();
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];

    // Price Filter
    if (priceRange === "under_500") {
      list = list.filter((p) => p.price < 500);
    }

    if (priceRange === "500_1000") {
      list = list.filter((p) => p.price >= 500 && p.price <= 1000);
    }

    if (priceRange === "above_1000") {
      list = list.filter((p) => p.price > 1000);
    }

    // Color Filter
    const activeColors = Object.keys(colorSel).filter((k) => colorSel[k]);

    if (activeColors.length) {
      list = list.filter((p) =>
        p.colors?.some((c) => activeColors.includes(c)),
      );
    }

    // Sorting
    if (sort === "price_asc") {
      list.sort((a, b) => a.price - b.price);
    }

    if (sort === "price_desc") {
      list.sort((a, b) => b.price - a.price);
    }

    if (sort === "rating") {
      list.sort((a, b) => b.rating - a.rating);
    }

    return list;
  }, [products, priceRange, colorSel, sort]);

  const clearAll = () => {
    setPriceRange("all");
    setColorSel({});
  };

  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <Header variant="light" />

      {/* Hero banner */}
      <section className="relative overflow-hidden bg-black text-white">
        <Image
          src={SHOP_HERO}
          alt="Shop Inclex"
          fill
          priority
          sizes="100vw"
          className="object-cover opacity-60"
        />

        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black/10" />

        {/* Hero height reduced by approximately 30% */}
        <div className="container-editorial relative z-10 py-14 md:py-[67px]">
          <h1 className="font-serif text-5xl leading-tight md:text-6xl">
            Shop
          </h1>

          <p className="mt-3 max-w-md text-white/70">
            Minimal. Premium. Built to last.
          </p>

          <div className="mt-4 text-xs text-white/60">
            <Link href="/" className="hover:text-white">
              Home
            </Link>
            <span className="mx-2">›</span>
            Shop
          </div>
        </div>
      </section>

      {/* Shop Content */}
      <section className="container-editorial py-10 md:py-12">
        <div className="grid grid-cols-12">
          {/* Filters + Products */}
          <div className="col-span-12">
            {/* Top Controls */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-black/10 pb-4">
              {/* Filters Button */}
              <button
                onClick={() => setFiltersOpen((v) => !v)}
                className={`inline-flex items-center gap-2 rounded-sm border px-5 py-2.5 text-sm font-medium uppercase tracking-[0.12em] transition ${
                  filtersOpen
                    ? "border-black bg-black text-white"
                    : "border-black/15 bg-white text-black hover:border-black"
                }`}
              >
                <SlidersHorizontal className="h-4 w-4" />

                <span>Filters</span>

                <span className="ml-1 text-lg leading-none">
                  {filtersOpen ? "−" : "+"}
                </span>
              </button>

              {/* Product Count + Sort + View */}
              <div className="flex flex-wrap items-center gap-3">
                <span className="mr-2 text-sm text-neutral-600">
                  Showing <b className="text-black">{filtered.length}</b>{" "}
                  product
                  {filtered.length === 1 ? "" : "s"}
                </span>

                {/* Sort */}
                <div className="relative">
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="appearance-none rounded-sm border border-black/10 bg-white px-4 py-2.5 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25"
                  >
                    {SORTS.map((s) => (
                      <option key={s.id} value={s.id}>
                        Sort by: {s.label}
                      </option>
                    ))}
                  </select>

                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                </div>

                {/* Grid / List */}
                <div className="inline-flex overflow-hidden rounded-sm border border-black/10 bg-white">
                  <button
                    onClick={() => setView("grid")}
                    aria-label="Grid view"
                    className={`px-3 py-2 ${
                      view === "grid" ? "bg-black text-white" : ""
                    }`}
                  >
                    <Grid className="h-4 w-4" />
                  </button>

                  <button
                    onClick={() => setView("list")}
                    aria-label="List view"
                    className={`px-3 py-2 ${
                      view === "list" ? "bg-black text-white" : ""
                    }`}
                  >
                    <List className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Filter Panel */}
            {filtersOpen && (
              <motion.div
                initial={{
                  opacity: 0,
                  height: 0,
                }}
                animate={{
                  opacity: 1,
                  height: "auto",
                }}
                exit={{
                  opacity: 0,
                  height: 0,
                }}
                transition={{
                  duration: 0.25,
                }}
                className="mt-6 overflow-hidden rounded-sm border border-black/10 bg-white"
              >
                {/* Filter Header */}
                <div className="flex items-center justify-between border-b border-black/10 px-5 py-4">
                  <span className="font-serif text-lg">Filter Products</span>

                  <button
                    onClick={clearAll}
                    className="text-xs uppercase tracking-[0.18em] text-neutral-500 transition hover:text-black"
                  >
                    Clear All
                  </button>
                </div>

                {/* Filter Sections */}
                <div className="grid grid-cols-1 gap-x-8 px-5 md:grid-cols-2">
                  {/* Price */}
                  <FilterSection title="Price">
                    <ul className="space-y-2 text-sm">
                      {[
                        {
                          id: "all",
                          label: "All",
                        },
                        {
                          id: "under_500",
                          label: "Under ₹500",
                        },
                        {
                          id: "500_1000",
                          label: "₹500 – ₹1,000",
                        },
                        {
                          id: "above_1000",
                          label: "Above ₹1,000",
                        },
                      ].map((o) => (
                        <li key={o.id}>
                          <label className="flex cursor-pointer items-center gap-2">
                            <input
                              type="radio"
                              name="price"
                              checked={priceRange === o.id}
                              onChange={() => setPriceRange(o.id)}
                              className="h-4 w-4 border-black/20 accent-[#C9A227]"
                            />

                            <span>{o.label}</span>
                          </label>
                        </li>
                      ))}
                    </ul>
                  </FilterSection>

                  {/* Color */}
                  <FilterSection title="Color">
                    <div className="flex flex-wrap gap-3 pb-5">
                      {COLORS.map((c) => (
                        <button
                          key={c.name}
                          title={c.name}
                          aria-label={c.name}
                          onClick={() =>
                            setColorSel((s) => ({
                              ...s,
                              [c.name]: !s[c.name],
                            }))
                          }
                          className={`h-8 w-8 rounded-full border transition ${
                            colorSel[c.name]
                              ? "border-black ring-2 ring-[#C9A227] ring-offset-2"
                              : "border-black/20"
                          }`}
                          style={{
                            backgroundColor: c.hex,
                          }}
                        />
                      ))}
                    </div>
                  </FilterSection>
                </div>
              </motion.div>
            )}

            {/* Products */}
            <div
              className={`mt-8 grid gap-8 ${
                view === "grid"
                  ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4"
                  : "grid-cols-1"
              }`}
            >
              {filtered.map((p) => (
                <motion.article
                  key={p.id}
                  initial={{
                    opacity: 0,
                    y: 20,
                  }}
                  whileInView={{
                    opacity: 1,
                    y: 0,
                  }}
                  viewport={{
                    once: true,
                  }}
                  transition={{
                    duration: 0.6,
                  }}
                  className={`group overflow-hidden rounded-sm border border-black/[0.06] bg-white transition hover:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)] ${
                    view === "list" ? "flex" : ""
                  }`}
                >
                  {/* Product Image */}
                  <Link
                    href={`/shop/${p.slug}`}
                    className={`relative block overflow-hidden bg-[#EFEDE7] ${
                      view === "list" ? "w-72 shrink-0" : "aspect-[4/5]"
                    }`}
                  >
                    <Image
                      src={p.images[0]}
                      alt={p.name}
                      fill
                      sizes={
                        view === "list"
                          ? "288px"
                          : "(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      }
                      className="object-cover transition-transform duration-[1200ms] group-hover:scale-105"
                    />

                    {/* Badges */}
                    <div className="absolute left-3 top-3 flex flex-wrap gap-1">
                      {p.badges?.map((b, i) => (
                        <span
                          key={b}
                          className={`rounded-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${
                            i === 0
                              ? "bg-black text-white"
                              : "bg-[#C9A227] text-black"
                          }`}
                        >
                          {b}
                        </span>
                      ))}
                    </div>

                    {/* Wishlist */}
                    <div
                      className="absolute right-3 top-3"
                      onClick={(e) => {
                        e.preventDefault();
                        e.stopPropagation();
                      }}
                    >
                      <WishlistButton product={p} />
                    </div>
                  </Link>

                  {/* Product Info */}
                  <div className="flex-1 p-5">
                    <Link href={`/shop/${p.slug}`}>
                      <h3 className="font-serif text-xl leading-tight">
                        {p.name}
                      </h3>
                    </Link>

                    <div className="mt-0.5 text-xs text-neutral-500">
                      {p.subtitle}
                    </div>

                    <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
                      <span className="text-[#C9A227]">★★★★☆</span>

                      {p.rating}

                      <span className="text-neutral-400">({p.reviews})</span>
                    </div>

                    <div className="mt-2 flex items-baseline gap-2">
                      <div className="font-serif text-xl">₹{fmt(p.price)}</div>

                      {p.compareAt && (
                        <div className="text-xs text-neutral-400 line-through">
                          ₹{fmt(p.compareAt)}
                        </div>
                      )}
                    </div>

                    {/* Features */}
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-neutral-600">
                      {p.features?.slice(0, 3).map((f, i) => (
                        <span
                          key={f}
                          className="inline-flex items-center gap-1"
                        >
                          {i === 0 ? (
                            <Diamond className="h-3 w-3 text-[#C9A227]" />
                          ) : i === 1 ? (
                            <ShieldCheck className="h-3 w-3 text-[#C9A227]" />
                          ) : (
                            <Sparkles className="h-3 w-3 text-[#C9A227]" />
                          )}

                          {f}
                        </span>
                      ))}
                    </div>

                    {/* Buttons */}
                    <div className="mt-4 flex gap-2">
                      <Link
                        href={`/shop/${p.slug}`}
                        className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm bg-black px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-neutral-900"
                      >
                        View Details
                      </Link>

                      <button
                        onClick={() => add(p)}
                        className="inline-flex items-center justify-center rounded-sm border border-black/10 bg-white px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition hover:border-[#C9A227] hover:text-[#C9A227]"
                      >
                        Add
                      </button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {/* No Products */}
            {filtered.length === 0 && (
              <div className="mt-16 rounded-sm border border-dashed border-black/10 bg-white py-16 text-center">
                <p className="font-serif text-2xl">
                  No products match your filters
                </p>

                <p className="mt-1 text-sm text-neutral-500">
                  Try clearing filters or exploring a different category.
                </p>

                <button onClick={clearAll} className="btn-dark mt-6">
                  Clear All Filters
                </button>
              </div>
            )}

            {/* Upcoming Product */}
            <section className="mt-16 overflow-hidden rounded-sm bg-black text-white">
              <div className="grid grid-cols-1 items-center lg:grid-cols-2">
                {/* Left */}
                <div className="px-8 py-10 md:px-14 md:py-16">
                  <div className="flex items-center gap-3">
                    <span className="h-px w-12 bg-[#C9A227]" />

                    <span className="text-xs font-semibold uppercase tracking-[0.25em] text-[#C9A227]">
                      Upcoming Product
                    </span>
                  </div>

                  <h2 className="mt-6 font-serif text-4xl leading-tight md:text-5xl">
                    INCLEX Pocket Perfume
                  </h2>

                  <p className="mt-5 max-w-md text-white/70">
                    Two Vibes. One Luxury. Already prefilled. Ready when you
                    are.
                  </p>

                  <div className="mt-8">
                    <Link
                      href="/contact"
                      className="inline-flex items-center gap-2 rounded-sm bg-[#C9A227] px-7 py-3 text-sm font-semibold text-black transition hover:opacity-90"
                    >
                      Notify Me →
                    </Link>
                  </div>
                </div>

                {/* Right */}
                <div className="relative h-full min-h-[400px]">
                  <Image
                    src="/uploads/images/1786063669904-civ60p69a1r.jpeg"
                    alt="INCLEX Pocket Perfume"
                    fill
                    sizes="(max-width: 1024px) 100vw, 50vw"
                    className="object-cover"
                  />
                </div>
              </div>
            </section>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

/* ---------------------------------------
   Filter Section
--------------------------------------- */

function FilterSection({ title, children }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="border-b border-black/10 py-5">
      <button
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between"
      >
        <span className="text-xs font-semibold uppercase tracking-[0.18em]">
          {title}
        </span>

        <span className="text-lg text-neutral-500">{open ? "−" : "+"}</span>
      </button>

      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}
