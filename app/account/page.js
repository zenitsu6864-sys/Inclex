'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Save, ArrowRight, Package, Heart, Sparkles } from 'lucide-react';
import { useUser } from '@/components/site/UserContext';
import { useWishlist } from '@/components/site/WishlistContext';

const fmt = (n) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n || 0);

export default function AccountOverview() {
  const { user, refresh } = useUser();
  const { count: wishlistCount } = useWishlist();
  const [form, setForm] = useState({ name: '', phone: '' });
  const [pw, setPw] = useState({ currentPassword: '', newPassword: '' });
  const [saving, setSaving] = useState(false);
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    if (user) setForm({ name: user.name || '', phone: user.phone || '' });
  }, [user]);
  useEffect(() => { (async () => { const r = await fetch('/api/account/orders'); const j = await r.json(); setOrders(j.orders || []); })(); }, []);

  async function saveProfile(e) {
    e.preventDefault();
    setSaving(true);
    const r = await fetch('/api/auth/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
    const j = await r.json();
    setSaving(false);
    if (r.ok) { toast.success('Profile updated'); refresh(); } else toast.error(j.error || 'Update failed');
  }

  async function savePassword(e) {
    e.preventDefault();
    if (!pw.currentPassword || !pw.newPassword) return toast.error('Fill in both password fields');
    setSaving(true);
    const r = await fetch('/api/auth/update', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(pw) });
    const j = await r.json();
    setSaving(false);
    if (r.ok) { toast.success('Password changed'); setPw({ currentPassword: '', newPassword: '' }); } else toast.error(j.error || 'Change failed');
  }

  const totalSpent = orders.reduce((s, o) => s + (o.total || 0), 0);

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard icon={Package} label="Orders placed" value={orders.length} />
        {/* <StatCard icon={Sparkles} label="Lifetime spent" value={`₹${fmt(totalSpent)}`} /> */}
        <StatCard icon={Heart} label="Wishlist" value={wishlistCount} href="/account/wishlist" />
      </div>

      {/* Latest orders */}
      <div className="rounded-sm border border-black/10 bg-white">
        <div className="flex items-center justify-between border-b border-black/[0.06] p-5">
          <div className="font-serif text-xl">Latest Orders</div>
          <Link href="/account/orders" className="text-xs uppercase tracking-[0.16em] text-neutral-600 hover:text-black">View all →</Link>
        </div>
        {orders.length === 0 ? (
          <div className="grid place-items-center p-10 text-center">
            <div className="grid h-14 w-14 place-items-center rounded-full bg-[#F8F7F4] text-[#C9A227]"><Package className="h-5 w-5" /></div>
            <p className="mt-4 font-serif text-2xl">No orders yet</p>
            <p className="mt-1 max-w-sm text-sm text-neutral-500">Start with our signature collection — crafted to last.</p>
            <Link href="/shop" className="btn-dark mt-6">Shop the Collection <ArrowRight className="h-4 w-4" /></Link>
          </div>
        ) : (
          <ul className="divide-y divide-black/[0.06]">
            {orders.slice(0, 4).map(o => (
              <li key={o.id} className="flex items-center justify-between p-5">
                <div>
                  <div className="font-mono text-xs text-neutral-500">{o.orderNumber}</div>
                  <div className="mt-1 text-sm">{o.items?.length} item{o.items?.length === 1 ? '' : 's'} • {new Date(o.createdAt).toLocaleDateString()}</div>
                </div>
                <div className="flex items-center gap-4">
                  <span className="rounded-sm bg-[#F8F7F4] px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.14em]">{o.status || 'placed'}</span>
                  <span className="font-serif text-lg">₹{fmt(o.total)}</span>
                </div>
              </li>
            ))}
          </ul>
        )}
      </div>

      {/* Profile form */}
      <form onSubmit={saveProfile} className="rounded-sm border border-black/10 bg-white p-6 md:p-8">
        <div className="font-serif text-xl">Profile</div>
        <p className="text-xs text-neutral-500">Update your name and phone number.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <F label="Full name" value={form.name} onChange={(v) => setForm(f => ({ ...f, name: v }))} />
          <F label="Phone" value={form.phone} onChange={(v) => setForm(f => ({ ...f, phone: v }))} />
          <F label="Email (read-only)" value={user?.email || ''} disabled />
        </div>
        <div className="mt-6"><button disabled={saving} className="btn-dark"><Save className="h-4 w-4" /> {saving ? 'Saving…' : 'Save Profile'}</button></div>
      </form>

      {/* Password */}
      <form onSubmit={savePassword} className="rounded-sm border border-black/10 bg-white p-6 md:p-8">
        <div className="font-serif text-xl">Change Password</div>
        <p className="text-xs text-neutral-500">Use at least 6 characters.</p>
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <F label="Current password" type="password" value={pw.currentPassword} onChange={(v) => setPw(p => ({ ...p, currentPassword: v }))} />
          <F label="New password" type="password" value={pw.newPassword} onChange={(v) => setPw(p => ({ ...p, newPassword: v }))} />
        </div>
        <div className="mt-6"><button disabled={saving} className="btn-dark"><Save className="h-4 w-4" /> {saving ? 'Updating…' : 'Update Password'}</button></div>
      </form>
    </div>
  );
}

function StatCard({ icon: Icon, label, value, soon, href }) {
  const inner = (
    <div className={`rounded-sm border border-black/10 bg-white p-5 transition ${soon ? 'opacity-60' : href ? 'hover:border-[#C9A227]' : ''}`}>
      <div className="flex items-center justify-between">
        <span className="text-xs uppercase tracking-[0.16em] text-neutral-500">{label}</span>
        <span className="grid h-8 w-8 place-items-center rounded-sm bg-[#F8F7F4] text-[#C9A227]"><Icon className="h-4 w-4" /></span>
      </div>
      <div className="mt-3 font-serif text-3xl">{value}{soon && <span className="ml-2 text-[10px] uppercase tracking-widest text-neutral-400">Soon</span>}</div>
    </div>
  );
  if (href) {
    const Link = require('next/link').default;
    return <Link href={href}>{inner}</Link>;
  }
  return inner;
}

function F({ label, value, onChange, type = 'text', disabled }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">{label}</span>
      <input type={type} value={value ?? ''} disabled={disabled} onChange={(e) => onChange?.(e.target.value)} className={`mt-2 w-full rounded-sm border border-black/10 bg-white px-4 py-3 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25 ${disabled ? 'bg-neutral-50 text-neutral-500' : ''}`} />
    </label>
  );
}
