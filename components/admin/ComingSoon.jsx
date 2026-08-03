'use client';
import AdminShell from '@/components/admin/AdminShell';
import { usePathname } from 'next/navigation';
import { Sparkles, Rocket, BarChart3, FileText, Search, Bell, PanelsTopLeft, Newspaper, Star, Layers, Shield, Megaphone } from 'lucide-react';

const META = {
  '/admin/inventory':       { title: 'Inventory',       icon: Layers,           desc: 'Track stock, warehouses, reservations and low-stock alerts across every SKU.' },
  '/admin/reviews':         { title: 'Reviews',         icon: Star,             desc: 'Approve, reply to, feature or reject customer reviews.' },
  '/admin/launch-control':  { title: 'Launch Control',  icon: Rocket,           desc: 'Schedule launches, banners, campaigns, coupons with auto-publish and countdown timers.' },
  '/admin/banners':         { title: 'Banners',         icon: PanelsTopLeft,    desc: 'Manage homepage, shop, popup, exit and announcement banners with priority + expiry.' },
  '/admin/campaigns':       { title: 'Campaigns',       icon: Megaphone,        desc: 'Flash sales, festival campaigns, product launches and email blasts.' },
  '/admin/notifications':   { title: 'Notifications',   icon: Bell,             desc: 'Email, order, WhatsApp and push notification triggers.' },
  '/admin/cms/navigation':  { title: 'Navigation CMS',  icon: PanelsTopLeft,    desc: 'Add, edit, reorder or hide menu items and dropdowns.' },
  '/admin/cms/footer':      { title: 'Footer CMS',      icon: PanelsTopLeft,    desc: 'Edit footer logo, columns, social links, payment icons and copyright.' },
  '/admin/cms/blog':        { title: 'Blog CMS',        icon: Newspaper,        desc: 'Write posts with categories, tags, featured images and scheduling.' },
  '/admin/cms/pages':       { title: 'Pages & Policies',icon: FileText,         desc: 'Edit Privacy, Terms, Shipping, Returns, FAQ and standalone pages.' },
  '/admin/analytics':       { title: 'Analytics',       icon: BarChart3,        desc: 'Revenue, orders, traffic, conversion, devices and country analytics.' },
  '/admin/reports':         { title: 'Reports',         icon: FileText,         desc: 'Export sales, product, customer and inventory reports as CSV/Excel/PDF.' },
  '/admin/seo':             { title: 'SEO Manager',     icon: Search,           desc: 'Manage meta, OG, Twitter, robots.txt, sitemap and JSON-LD across every page.' },
  '/admin/staff':           { title: 'Staff & Roles',   icon: Shield,           desc: 'Invite staff, assign roles (Super Admin, Editor, Support) and permissions.' },
};

export default function ComingSoon() {
  const pathname = usePathname();
  const meta = META[pathname] || { title: 'Module', icon: Sparkles, desc: 'This module is on the roadmap.' };
  const Icon = meta.icon;
  return (
    <AdminShell title={meta.title} subtitle="Coming next">
      <div className="grid place-items-center rounded-sm border border-dashed border-black/10 bg-white p-16 text-center">
        <span className="grid h-16 w-16 place-items-center rounded-sm bg-[#F8F7F4] text-[#C9A227]"><Icon className="h-7 w-7" /></span>
        <div className="mt-6 inline-flex items-center gap-2 rounded-sm bg-[#C9A227]/15 px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.24em] text-[#8B6E12]"><Sparkles className="h-3 w-3" /> On the roadmap</div>
        <h2 className="mt-4 font-serif text-4xl">{meta.title}</h2>
        <p className="mt-3 max-w-md text-neutral-600">{meta.desc}</p>
        <p className="mt-6 text-xs text-neutral-500">The core data model, permissions and API surface are ready — the UI is being crafted next.</p>
      </div>
    </AdminShell>
  );
}
