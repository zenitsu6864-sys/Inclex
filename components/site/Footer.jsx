import Link from 'next/link';
import { Instagram, Facebook, Youtube } from 'lucide-react';

const COLS = [
  { title: 'Shop', links: [
    { label: 'All Collections', href: '/shop' },
    { label: 'Customize', href: '/customize' },
    { label: 'Corporate Orders', href: '/corporate-orders' },
    { label: 'Gift Cards', href: '/shop' },
  ]},
  { title: 'Help', links: [
    { label: 'Track Order', href: '/contact' },
    { label: 'Shipping Policy', href: '/policy/shipping' },
    { label: 'Returns & Refunds', href: '/policy/returns' },
    { label: 'FAQ', href: '/faq' },
  ]},
  { title: 'About', links: [
    { label: 'About Us', href: '/about' },
    { label: 'Our Story', href: '/about#story' },
    { label: 'Blog', href: '/about#story' },
    { label: 'Contact Us', href: '/contact' },
  ]},
  { title: 'Legal', links: [
    { label: 'Privacy Policy', href: '/policy/privacy' },
    { label: 'Terms & Conditions', href: '/policy/terms' },
  ]},
];

export default function Footer() {
  return (
    <footer className="bg-[#0B0B0B] text-white">
      <div className="container-editorial grid grid-cols-12 gap-10 py-16">
        <div className="col-span-12 md:col-span-4">
          <div className="font-sans text-[24px] font-light tracking-[0.42em] text-[#C9A227]">INCLEX</div>
          <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">Crafted to last.<br />Designed to be remembered.</p>
          <div className="mt-8 flex items-center gap-3">
            {[Instagram, Facebook, Youtube].map((I, i) => (
              <a key={i} href="#" aria-label="social" className="grid h-9 w-9 place-items-center rounded-full border border-white/15 text-white/80 transition hover:border-[#C9A227] hover:text-[#C9A227]"><I className="h-4 w-4" /></a>
            ))}
          </div>
        </div>
        {COLS.map((c) => (
          <div key={c.title} className="col-span-6 md:col-span-2">
            <div className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">{c.title}</div>
            <ul className="mt-5 space-y-3 text-sm text-white/80">
              {c.links.map((l) => (
                <li key={l.label}><Link href={l.href} className="transition hover:text-[#C9A227]">{l.label}</Link></li>
              ))}
            </ul>
          </div>
        ))}
      </div>
      <div className="border-t border-white/10">
        <div className="container-editorial flex flex-col items-center justify-between gap-3 py-6 text-xs text-white/50 md:flex-row">
          <span>© {new Date().getFullYear()} Inclex. All rights reserved.</span>
          <span className="inline-flex items-center gap-2">Made in India <span className="text-[#C9A227]">♥</span></span>
        </div>
      </div>
    </footer>
  );
}
