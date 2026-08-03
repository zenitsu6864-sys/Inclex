'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard, Package, ShoppingCart, Users, Ticket, Megaphone, Image as ImageIcon,
  Newspaper, MessagesSquare, Mail, Star, Rocket, BarChart3, FileText, Search,
  Bell, Shield, Settings, Activity, ChevronDown, LogOut, Home, PanelsTopLeft, Menu,
  X, Sparkles, Layers, MessageSquare,
} from 'lucide-react';
import { useState } from 'react';

export const NAV = [
  { section: 'Overview', items: [
    { href: '/admin', label: 'Dashboard', icon: LayoutDashboard },
    { href: '/admin/activity', label: 'Activity Log', icon: Activity },
  ]},
  { section: 'Catalog', items: [
    { href: '/admin/products', label: 'Products', icon: Package },
    { href: '/admin/inventory', label: 'Inventory', icon: Layers, soon: true },
    { href: '/admin/reviews', label: 'Reviews', icon: Star, soon: true },
  ]},
  { section: 'Sales', items: [
    { href: '/admin/orders', label: 'Orders', icon: ShoppingCart },
    { href: '/admin/customers', label: 'Customers', icon: Users },
    { href: '/admin/coupons', label: 'Coupons', icon: Ticket },
  ]},
  { section: 'Marketing', items: [
    { href: '/admin/launch-control', label: 'Launch Control', icon: Rocket, soon: true },
    { href: '/admin/banners', label: 'Banners', icon: PanelsTopLeft, soon: true },
    { href: '/admin/campaigns', label: 'Campaigns', icon: Megaphone, soon: true },
    { href: '/admin/notifications', label: 'Notifications', icon: Bell, soon: true },
  ]},
  { section: 'Content (CMS)', items: [
    { href: '/admin/cms/homepage', label: 'Homepage', icon: Home },
    { href: '/admin/cms/navigation', label: 'Navigation', icon: PanelsTopLeft, soon: true },
    { href: '/admin/cms/footer', label: 'Footer', icon: PanelsTopLeft, soon: true },
    { href: '/admin/cms/blog', label: 'Blog', icon: Newspaper, soon: true },
    { href: '/admin/cms/pages', label: 'Pages & Policies', icon: FileText, soon: true },
  ]},
  { section: 'Communication', items: [
    { href: '/admin/inquiries', label: 'Inquiries', icon: MessagesSquare },
    { href: '/admin/newsletter', label: 'Newsletter', icon: Mail },
  ]},
  { section: 'Insights', items: [
    { href: '/admin/analytics', label: 'Analytics', icon: BarChart3, soon: true },
    { href: '/admin/reports', label: 'Reports', icon: FileText, soon: true },
    { href: '/admin/seo', label: 'SEO Manager', icon: Search, soon: true },
  ]},
  { section: 'System', items: [
    { href: '/admin/media', label: 'Media Library', icon: ImageIcon },
    { href: '/admin/staff', label: 'Staff & Roles', icon: Shield, soon: true },
    { href: '/admin/settings', label: 'Settings', icon: Settings },
  ]},
];

export default function Sidebar({ open, onClose }) {
  const pathname = usePathname();
  const router = useRouter();
  async function logout() {
    await fetch('/api/admin/logout', { method: 'POST' });
    router.push('/admin/login');
  }
  return (
    <>
      {open && <div className="fixed inset-0 z-30 bg-black/50 backdrop-blur-sm md:hidden" onClick={onClose} />}
      <aside className={`fixed inset-y-0 left-0 z-40 flex w-72 flex-col border-r border-black/[0.08] bg-white transition-transform duration-300 md:sticky md:top-0 md:h-screen md:translate-x-0 ${open ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex h-16 items-center justify-between border-b border-black/[0.06] px-5">
          <Link href="/admin" className="inline-flex items-center gap-2 font-sans text-[16px] font-light tracking-[0.4em] text-black">INCLEX <span className="rounded-sm bg-[#C9A227] px-2 py-0.5 text-[9px] font-bold tracking-widest text-black">ADMIN</span></Link>
          <button className="md:hidden" onClick={onClose} aria-label="Close"><X className="h-5 w-5" /></button>
        </div>

        <nav className="flex-1 overflow-y-auto px-3 py-4 no-scrollbar">
          {NAV.map((g) => (
            <div key={g.section} className="mb-5">
              <div className="px-3 mb-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-neutral-400">{g.section}</div>
              <ul className="space-y-0.5">
                {g.items.map((it) => {
                  const active = pathname === it.href || (it.href !== '/admin' && pathname?.startsWith(it.href));
                  const Icon = it.icon;
                  return (
                    <li key={it.href}>
                      <Link href={it.href} onClick={onClose} className={`group flex items-center justify-between rounded-sm px-3 py-2 text-sm transition ${active ? 'bg-black text-white' : 'text-neutral-700 hover:bg-black/5'}`}>
                        <span className="inline-flex items-center gap-3">
                          <Icon className={`h-4 w-4 ${active ? 'text-[#C9A227]' : 'text-neutral-500 group-hover:text-black'}`} />
                          {it.label}
                        </span>
                        {it.soon && <span className={`rounded-sm px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-widest ${active ? 'bg-white/15 text-white/70' : 'bg-black/5 text-neutral-500'}`}>Soon</span>}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        <div className="border-t border-black/[0.06] p-3">
          <button onClick={logout} className="flex w-full items-center gap-3 rounded-sm px-3 py-2 text-sm text-neutral-700 transition hover:bg-black/5">
            <LogOut className="h-4 w-4 text-neutral-500" />
            Sign out
          </button>
        </div>
      </aside>
    </>
  );
}

export function AdminTopbar({ onMenu, title, subtitle, actions }) {
  return (
    <div className="sticky top-0 z-20 border-b border-black/[0.06] bg-[#F8F7F4]/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-5 lg:px-8">
        <div className="flex items-center gap-3">
          <button onClick={onMenu} className="md:hidden -ml-2 rounded-sm p-2 hover:bg-black/5" aria-label="Menu"><Menu className="h-5 w-5" /></button>
          <div>
            <div className="font-serif text-2xl leading-tight">{title}</div>
            {subtitle && <div className="text-xs text-neutral-500">{subtitle}</div>}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {actions}
          <Link href="/" className="hidden md:inline-flex items-center gap-2 rounded-sm border border-black/10 bg-white px-3 py-1.5 text-xs"><Home className="h-3.5 w-3.5" /> View Site</Link>
        </div>
      </div>
    </div>
  );
}
