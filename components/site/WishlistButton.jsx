'use client';
import { Heart } from 'lucide-react';
import { useWishlist } from './WishlistContext';

export default function WishlistButton({ product, className = '', variant = 'card' }) {
  const { has, toggle } = useWishlist();
  const active = has(product.id);
  const base = 'transition-all duration-200 grid place-items-center';
  const style = variant === 'card'
    ? `${base} h-9 w-9 rounded-full ${active ? 'bg-[#C9A227] text-black' : 'bg-white/90 text-neutral-600 hover:text-[#C9A227]'}`
    : `${base} h-12 w-12 rounded-sm border ${active ? 'border-[#C9A227] bg-[#C9A227]/10 text-[#C9A227]' : 'border-black/10 bg-white text-neutral-600 hover:text-[#C9A227]'}`;
  return (
    <button
      type="button"
      onClick={(e) => { e.preventDefault(); e.stopPropagation(); toggle(product); }}
      aria-label={active ? 'Remove from wishlist' : 'Add to wishlist'}
      title={active ? 'Remove from wishlist' : 'Add to wishlist'}
      className={`${style} ${className}`}
    >
      <Heart className={`h-4 w-4 transition-transform ${active ? 'fill-current scale-110' : ''}`} />
    </button>
  );
}
