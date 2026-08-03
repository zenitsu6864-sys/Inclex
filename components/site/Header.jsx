'use client';
import Link from 'next/link';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, Truck, Sparkles, ShieldCheck } from 'lucide-react';
import { useCart } from './CartContext';
import UserMenu from './UserMenu';
import { DEFAULT_HOMEPAGE, fetchHomepage } from '@/lib/data/content';

function TopBar({ announcement, coupon }) {
  return (
    <div className="hidden md:block border-b border-black/[0.06] bg-[#F8F7F4] text-[12px] text-neutral-600">
      <div className="container-editorial flex h-9 items-center justify-between">
        <span className="inline-flex items-center gap-2"><Truck className="h-3.5 w-3.5 text-[#C9A227]" />{announcement}</span>
        <span className="hidden lg:inline-flex items-center gap-2"><Sparkles className="h-3.5 w-3.5 text-[#C9A227]" />{coupon}</span>
        <span className="inline-flex items-center gap-2"><ShieldCheck className="h-3.5 w-3.5 text-[#C9A227]" />Cash on Delivery Available</span>
      </div>
    </div>
  );
}

const LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Shop', href: '/shop' },
  { label: 'Customize', href: '/customize' },
  { label: 'Corporate Orders', href: '/corporate-orders' },
  { label: 'About Us', href: '/about' },
  { label: 'Contact', href: '/contact' },
];

export default function Header({ variant = 'light', overlay = false }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cms, setCms] = useState(DEFAULT_HOMEPAGE);
  const pathname = usePathname();
  const { count, setOpen: setCartOpen } = useCart();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    fetchHomepage().then(setCms);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const isDark = variant === 'dark' && !scrolled;
  const solid = !overlay || scrolled;

  return (
    <header
      className={`${overlay ? 'fixed' : 'sticky'} inset-x-0 top-0 z-40 transition-colors duration-300 ${
        solid ? 'bg-[#F8F7F4]/95 backdrop-blur-md border-b border-black/[0.06]' : 'bg-transparent'
      } ${isDark ? 'text-white' : 'text-black'}`}
    >
      {!overlay || scrolled ? <TopBar announcement={cms.announcementBar} coupon={cms.couponBanner} /> : null}
      <div className="container-editorial flex h-20 items-center justify-between md:h-20">
        <Link href="/" className={`inline-flex select-none items-baseline font-sans text-[22px] font-light tracking-[0.42em] md:text-[24px] ${isDark ? 'text-white' : 'text-black'}`} aria-label="Inclex home">
          INCLEX
        </Link>

        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {LINKS.map((l) => {
            const active = pathname === l.href || (l.href !== '/' && pathname?.startsWith(l.href));
            return (
              <Link key={l.href} href={l.href} className={`${isDark ? 'nav-link-dark' : 'nav-link'} ${active ? 'after:w-6 !text-current' : ''}`}>
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-5">
          <button aria-label="Search" className="opacity-90 hover:opacity-100 transition"><Search className="h-5 w-5" /></button>
          <UserMenu dark={isDark} />
          <button aria-label="Cart" onClick={() => setCartOpen(true)} className="relative opacity-90 hover:opacity-100 transition">
            <ShoppingBag className="h-5 w-5" />
            <span className="absolute -right-2 -top-2 grid h-4 w-4 place-items-center rounded-full bg-[#C9A227] text-[10px] font-bold text-black">{count}</span>
          </button>
          <button className="md:hidden" aria-label="Menu" onClick={() => setOpen(true)}><Menu className="h-6 w-6" /></button>
        </div>
      </div>

      {open && (
        <div className="fixed inset-0 z-50 bg-black/95 text-white md:hidden">
          <div className="flex items-center justify-between px-6 h-20">
            <span className="font-sans text-[22px] font-light tracking-[0.42em] text-white">INCLEX</span>
            <button onClick={() => setOpen(false)} aria-label="Close menu"><X className="h-6 w-6" /></button>
          </div>
          <nav className="mt-8 flex flex-col gap-6 px-8 font-serif text-2xl">
            {LINKS.map((l) => (
              <Link key={l.href} href={l.href} onClick={() => setOpen(false)}>{l.label}</Link>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
