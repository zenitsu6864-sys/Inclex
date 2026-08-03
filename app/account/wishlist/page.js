'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { Heart, ArrowRight, ShoppingBag } from 'lucide-react';
import { useWishlist } from '@/components/site/WishlistContext';
import { useCart } from '@/components/site/CartContext';
import WishlistButton from '@/components/site/WishlistButton';

const fmt = (n) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n || 0);

export default function WishlistPage() {
  const { items, loading, refresh, count } = useWishlist();
  const { add } = useCart();
  useEffect(() => { refresh(); }, [refresh]);

  if (loading) return <div className="text-sm text-neutral-500">Loading wishlist…</div>;

  if (count === 0) {
    return (
      <div className="grid place-items-center rounded-sm border border-dashed border-black/10 bg-white p-16 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-[#F8F7F4] text-[#C9A227]"><Heart className="h-6 w-6" /></div>
        <p className="mt-6 font-serif text-3xl">Your wishlist is empty</p>
        <p className="mt-2 max-w-md text-sm text-neutral-500">Tap the heart on any piece you love and it’ll wait here for you.</p>
        <Link href="/shop" className="btn-dark mt-8">Explore the Collection <ArrowRight className="h-4 w-4" /></Link>
      </div>
    );
  }

  return (
    <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
      {items.map(p => (
        <article key={p.id} className="group overflow-hidden rounded-sm border border-black/10 bg-white">
          <Link href={`/shop/${p.slug}`} className="relative block overflow-hidden bg-[#EFEDE7] aspect-[4/5]">
            <img src={p.images?.[0]} alt={p.name} className="h-full w-full object-cover transition-transform duration-[1200ms] group-hover:scale-105" />
            <div className="absolute right-3 top-3"><WishlistButton product={p} /></div>
          </Link>
          <div className="p-5">
            <Link href={`/shop/${p.slug}`}>
              <div className="font-serif text-xl leading-tight">{p.name}</div>
            </Link>
            <div className="mt-0.5 text-xs text-neutral-500">{p.subtitle}</div>
            <div className="mt-3 flex items-center justify-between">
              <div className="font-serif text-lg">₹{fmt(p.price)}</div>
              <button onClick={() => add(p)} className="inline-flex items-center gap-2 rounded-sm bg-black px-3 py-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-white transition hover:bg-neutral-900">
                <ShoppingBag className="h-3.5 w-3.5" /> Add to Bag
              </button>
            </div>
          </div>
        </article>
      ))}
    </div>
  );
}
