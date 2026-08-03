'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import { useUser } from '@/components/site/UserContext';
import { User, Package, LogOut, Settings, Heart, MapPin } from 'lucide-react';

const NAV = [
  { href: '/account',        label: 'Overview',       icon: User },
  { href: '/account/orders', label: 'Orders',         icon: Package },
  { href: '/account/addresses', label: 'Addresses',    icon: MapPin, soon: true },
  { href: '/account/wishlist',  label: 'Wishlist',     icon: Heart },
];

export default function AccountLayout({ children }) {
  const { user, ready, logout } = useUser();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => { if (ready && !user) router.replace(`/login?redirect=${encodeURIComponent(pathname)}`); }, [ready, user, router, pathname]);

  if (!ready) {
    return <main className="grid min-h-screen place-items-center bg-[#F8F7F4]"><div className="text-xs uppercase tracking-[0.3em] text-neutral-500">Loading…</div></main>;
  }
  if (!user) return null;

  const initial = (user.name || user.email || 'U').trim().charAt(0).toUpperCase();

  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <Header variant="light" />
      <section className="container-editorial py-12 md:py-16">
        <div className="eyebrow flex items-center gap-3"><span className="hairline" />My Account</div>
        <h1 className="mt-4 font-serif text-5xl leading-tight md:text-6xl">Hello, {(user.name || 'Friend').split(' ')[0]}.</h1>
        <p className="mt-2 text-neutral-500">Manage your profile, orders and preferences.</p>

        <div className="mt-10 grid grid-cols-12 gap-8">
          <aside className="col-span-12 md:col-span-3">
            <div className="rounded-sm border border-black/10 bg-white p-5">
              <div className="flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-[#C9A227] font-serif text-lg font-semibold text-black">{initial}</span>
                <div><div className="font-serif text-lg leading-tight">{user.name}</div><div className="text-xs text-neutral-500">{user.email}</div></div>
              </div>
            </div>
            <nav className="mt-4 rounded-sm border border-black/10 bg-white p-2">
              {NAV.map((n) => {
                const active = pathname === n.href;
                return (
                  <Link key={n.href} href={n.soon ? '#' : n.href} className={`flex items-center justify-between rounded-sm px-3 py-2.5 text-sm transition ${active ? 'bg-black text-white' : 'text-neutral-700 hover:bg-black/5'}`}>
                    <span className="inline-flex items-center gap-3"><n.icon className={`h-4 w-4 ${active ? 'text-[#C9A227]' : 'text-neutral-500'}`} /> {n.label}</span>
                    {n.soon && <span className={`rounded-sm px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest ${active ? 'bg-white/15 text-white/70' : 'bg-black/5 text-neutral-500'}`}>Soon</span>}
                  </Link>
                );
              })}
              <button onClick={logout} className="mt-1 flex w-full items-center gap-3 rounded-sm px-3 py-2.5 text-sm text-neutral-700 hover:bg-black/5"><LogOut className="h-4 w-4 text-neutral-500" /> Sign out</button>
            </nav>
          </aside>
          <div className="col-span-12 md:col-span-9">{children}</div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
