'use client';

import Link from 'next/link';
import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { Heart, Grid, List, ChevronDown, Sparkles, ShieldCheck, Diamond } from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import { PRODUCTS, CATEGORIES, MATERIALS, FEATURES_FILTER } from '@/lib/data/products';
import { useCart } from '@/components/site/CartContext';
import WishlistButton from '@/components/site/WishlistButton';

const SHOP_HERO =
  'https://images.pexels.com/photos/33242820/pexels-photo-33242820.jpeg?auto=compress&cs=tinysrgb&w=2400&q=85';

const COLORS = [
  { name: 'Black', hex: '#111111' },
  { name: 'Cognac', hex: '#7A3B18' },
  { name: 'Espresso', hex: '#3E2416' },
  { name: 'Tan', hex: '#B0824E' },
  { name: 'Silver', hex: '#C0C4C8' },
  { name: 'Gunmetal', hex: '#4B4F54' },
];

const SORTS = [
  { id: 'newest', label: 'Newest' },
  { id: 'price_asc', label: 'Price: Low to High' },
  { id: 'price_desc', label: 'Price: High to Low' },
  { id: 'rating', label: 'Highest Rated' },
];

const fmt = (n) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);

export default function ShopPage() {
  const [category, setCategory] = useState('All Products');
  const [materialSel, setMaterialSel] = useState({});
  const [priceRange, setPriceRange] = useState('all');
  const [featureSel, setFeatureSel] = useState({});
  const [colorSel, setColorSel] = useState({});
  const [view, setView] = useState('grid');
  const [sort, setSort] = useState('newest');
  const { add } = useCart();

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];
    if (category !== 'All Products') {
      if (category === 'Personalized')
        list = list.filter((p) => p.features.some((f) => /personal/i.test(f)));
      else list = list.filter((p) => p.material === category);
    }
    const activeMats = Object.keys(materialSel).filter((k) => materialSel[k]);
    if (activeMats.length) list = list.filter((p) => activeMats.includes(p.material) || (p.material === 'Metal' && activeMats.includes('Stainless Steel')));
    if (priceRange === 'under_500') list = list.filter((p) => p.price < 500);
    if (priceRange === '500_1000') list = list.filter((p) => p.price >= 500 && p.price <= 1000);
    if (priceRange === 'above_1000') list = list.filter((p) => p.price > 1000);
    const activeFeats = Object.keys(featureSel).filter((k) => featureSel[k]);
    if (activeFeats.length) list = list.filter((p) => activeFeats.every((f) => p.badges.includes(f) || p.features.some((x) => x.includes(f.replace('able', ''))) || (f === 'Personalizable' && p.features.some((x) => /personal/i.test(x)))));
    const activeColors = Object.keys(colorSel).filter((k) => colorSel[k]);
    if (activeColors.length) list = list.filter((p) => p.colors.some((c) => activeColors.includes(c)));
    if (sort === 'price_asc') list.sort((a, b) => a.price - b.price);
    if (sort === 'price_desc') list.sort((a, b) => b.price - a.price);
    if (sort === 'rating') list.sort((a, b) => b.rating - a.rating);
    return list;
  }, [category, materialSel, priceRange, featureSel, colorSel, sort]);

  const clearAll = () => {
    setCategory('All Products'); setMaterialSel({}); setPriceRange('all');
    setFeatureSel({}); setColorSel({});
  };

  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <Header variant="light" />

      {/* Hero banner */}
      <section className="relative overflow-hidden bg-black text-white">
        <img src={SHOP_HERO} alt="Shop Inclex" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-black/10" />
        <div className="container-editorial relative z-10 py-20 md:py-24">
          <h1 className="font-serif text-5xl leading-tight md:text-6xl">Shop</h1>
          <p className="mt-3 max-w-md text-white/70">Minimal. Premium. Built to last.</p>
          <div className="mt-4 text-xs text-white/60">
            <Link href="/" className="hover:text-white">Home</Link> <span className="mx-2">›</span> Shop
          </div>
        </div>
      </section>

      <section className="container-editorial py-12 md:py-16">
        <div className="grid grid-cols-12 gap-8">
          {/* Sidebar */}
          <aside className="col-span-12 md:col-span-3">
            <div className="flex items-center justify-between border-b border-black/10 pb-3">
              <span className="font-serif text-lg">Filters</span>
              <button onClick={clearAll} className="text-xs uppercase tracking-[0.18em] text-neutral-500 hover:text-black">Clear All</button>
            </div>

            <FilterSection title="Categories">
              <ul className="space-y-2 text-sm">
                {CATEGORIES.map((c) => (
                  <li key={c}>
                    <button onClick={() => setCategory(c)} className={`flex w-full items-center justify-between py-1 text-left transition ${category === c ? 'text-black font-semibold' : 'text-neutral-600 hover:text-black'}`}>
                      <span>{c}</span>
                      <span className="text-xs text-neutral-400">{c === 'All Products' ? PRODUCTS.length : (c === 'Personalized' ? PRODUCTS.filter(p => p.features.some(f => /personal/i.test(f))).length : PRODUCTS.filter(p => p.material === c).length)}</span>
                    </button>
                  </li>
                ))}
              </ul>
            </FilterSection>

            <FilterSection title="Material">
              <ul className="space-y-2 text-sm">
                {MATERIALS.map((m) => (
                  <li key={m} className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={!!materialSel[m]} onChange={(e) => setMaterialSel(s => ({ ...s, [m]: e.target.checked }))} className="h-4 w-4 rounded-sm border-black/20 accent-[#C9A227]" />
                      <span>{m}</span>
                    </label>
                    <span className="text-xs text-neutral-400">({PRODUCTS.filter(p => p.material === m || (m === 'Stainless Steel' && p.material === 'Metal')).length})</span>
                  </li>
                ))}
              </ul>
            </FilterSection>

            <FilterSection title="Price">
              <ul className="space-y-2 text-sm">
                {[
                  { id: 'all', label: 'All' },
                  { id: 'under_500', label: 'Under ₹500' },
                  { id: '500_1000', label: '₹500 – ₹1,000' },
                  { id: 'above_1000', label: 'Above ₹1,000' },
                ].map(o => (
                  <li key={o.id} className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="radio" name="price" checked={priceRange === o.id} onChange={() => setPriceRange(o.id)} className="h-4 w-4 border-black/20 accent-[#C9A227]" />
                      <span>{o.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </FilterSection>

            <FilterSection title="Color">
              <div className="flex flex-wrap gap-2">
                {COLORS.map(c => (
                  <button key={c.name} onClick={() => setColorSel(s => ({ ...s, [c.name]: !s[c.name] }))} title={c.name}
                    className={`h-7 w-7 rounded-full border transition ${colorSel[c.name] ? 'border-black ring-2 ring-offset-2 ring-[#C9A227]' : 'border-black/20'}`}
                    style={{ backgroundColor: c.hex }} />
                ))}
              </div>
            </FilterSection>

            <FilterSection title="Features">
              <ul className="space-y-2 text-sm">
                {FEATURES_FILTER.map(f => (
                  <li key={f} className="flex items-center justify-between">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input type="checkbox" checked={!!featureSel[f]} onChange={(e) => setFeatureSel(s => ({ ...s, [f]: e.target.checked }))} className="h-4 w-4 rounded-sm border-black/20 accent-[#C9A227]" />
                      <span>{f}</span>
                    </label>
                  </li>
                ))}
              </ul>
            </FilterSection>
          </aside>

          {/* Grid */}
          <div className="col-span-12 md:col-span-9">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm text-neutral-600">Showing <b className="text-black">{filtered.length}</b> product{filtered.length === 1 ? '' : 's'}</span>
              <div className="flex items-center gap-3">
                <div className="relative">
                  <select value={sort} onChange={(e) => setSort(e.target.value)} className="appearance-none rounded-sm border border-black/10 bg-white px-4 py-2 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25">
                    {SORTS.map(s => <option key={s.id} value={s.id}>Sort by: {s.label}</option>)}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-500" />
                </div>
                <div className="inline-flex overflow-hidden rounded-sm border border-black/10 bg-white">
                  <button onClick={() => setView('grid')} aria-label="Grid view" className={`px-3 py-2 ${view === 'grid' ? 'bg-black text-white' : ''}`}><Grid className="h-4 w-4" /></button>
                  <button onClick={() => setView('list')} aria-label="List view" className={`px-3 py-2 ${view === 'list' ? 'bg-black text-white' : ''}`}><List className="h-4 w-4" /></button>
                </div>
              </div>
            </div>

            <div className={`mt-8 grid gap-8 ${view === 'grid' ? 'grid-cols-1 sm:grid-cols-2 xl:grid-cols-3' : 'grid-cols-1'}`}>
              {filtered.map((p) => (
                <motion.article key={p.id} initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.6 }}
                  className={`group overflow-hidden rounded-sm border border-black/[0.06] bg-white transition hover:shadow-[0_20px_60px_-30px_rgba(0,0,0,0.25)] ${view === 'list' ? 'flex' : ''}`}>
                  <Link href={`/shop/${p.slug}`} className={`relative block overflow-hidden bg-[#EFEDE7] ${view === 'list' ? 'w-72 shrink-0' : 'aspect-[4/5]'}`}>
                    <img src={p.images[0]} alt={p.name} className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
                    <div className="absolute left-3 top-3 flex flex-wrap gap-1">
                      {p.badges.map((b, i) => (
                        <span key={b} className={`rounded-sm px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.14em] ${i === 0 ? 'bg-black text-white' : 'bg-[#C9A227] text-black'}`}>{b}</span>
                      ))}
                    </div>
                    <button aria-label="Wishlist" className="absolute right-3 top-3" onClick={(e) => e.preventDefault()}>
                      <span onClick={(e) => e.stopPropagation()}>
                        <WishlistButton product={p} />
                      </span>
                    </button>
                  </Link>
                  <div className="p-5 flex-1">
                    <Link href={`/shop/${p.slug}`}>
                      <h3 className="font-serif text-xl leading-tight">{p.name}</h3>
                    </Link>
                    <div className="mt-0.5 text-xs text-neutral-500">{p.subtitle}</div>
                    <div className="mt-2 flex items-center gap-2 text-xs text-neutral-500">
                      <span className="text-[#C9A227]">★★★★☆</span> {p.rating} <span className="text-neutral-400">({p.reviews})</span>
                    </div>
                    <div className="mt-2 flex items-baseline gap-2">
                      <div className="font-serif text-xl">₹{fmt(p.price)}</div>
                      {p.compareAt && <div className="text-xs text-neutral-400 line-through">₹{fmt(p.compareAt)}</div>}
                    </div>
                    <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-[11px] text-neutral-600">
                      {p.features.slice(0, 3).map((f, i) => (
                        <span key={f} className="inline-flex items-center gap-1">
                          {i === 0 ? <Diamond className="h-3 w-3 text-[#C9A227]" /> : i === 1 ? <ShieldCheck className="h-3 w-3 text-[#C9A227]" /> : <Sparkles className="h-3 w-3 text-[#C9A227]" />}
                          {f}
                        </span>
                      ))}
                    </div>
                    <div className="mt-4 flex gap-2">
                      <Link href={`/shop/${p.slug}`} className="inline-flex flex-1 items-center justify-center gap-2 rounded-sm bg-black px-4 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-neutral-900">View Details</Link>
                      <button onClick={() => add(p)} className="inline-flex items-center justify-center rounded-sm border border-black/10 bg-white px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.14em] transition hover:border-[#C9A227] hover:text-[#C9A227]">Add</button>
                    </div>
                  </div>
                </motion.article>
              ))}
            </div>

            {filtered.length === 0 && (
              <div className="mt-16 rounded-sm border border-dashed border-black/10 bg-white py-16 text-center">
                <p className="font-serif text-2xl">No products match your filters</p>
                <p className="mt-1 text-sm text-neutral-500">Try clearing filters or exploring a different category.</p>
                <button onClick={clearAll} className="btn-dark mt-6">Clear All Filters</button>
              </div>
            )}

            {/* Coming soon banner */}
            <div className="mt-12 grid grid-cols-12 items-center gap-6 rounded-sm bg-white p-6 md:p-8">
              <div className="col-span-12 md:col-span-7">
                <div className="flex items-center gap-3">
                  <span className="grid h-10 w-10 place-items-center rounded-full bg-[#F8F7F4] text-[#C9A227]"><Sparkles className="h-5 w-5" /></span>
                  <div>
                    <div className="font-serif text-xl md:text-2xl leading-snug">More premium pieces<br />coming your way.</div>
                  </div>
                </div>
                <p className="mt-3 max-w-lg text-sm text-neutral-500">We’re crafting new designs and collections that you’ll love.</p>
              </div>
              <div className="col-span-12 md:col-span-5">
                <img src="https://images.pexels.com/photos/28028334/pexels-photo-28028334.jpeg?auto=compress&cs=tinysrgb&w=1200&q=85" alt="Coming soon" className="h-40 w-full rounded-sm object-cover md:h-32" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
// I added new line 
function FilterSection({ title, children }) {
  const [open, setOpen] = useState(true);
  return (
    <div className="border-b border-black/10 py-5">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-[0.18em]">{title}</span>
        <span className="text-lg text-neutral-500">{open ? '−' : '+'}</span>
      </button>
      {open && <div className="mt-4">{children}</div>}
    </div>
  );
}
