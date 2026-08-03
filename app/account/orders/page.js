'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Package, ArrowRight } from 'lucide-react';

const fmt = (n) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n || 0);

export default function OrdersPage() {
  const [orders, setOrders] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { const r = await fetch('/api/account/orders'); const j = await r.json(); setOrders(j.orders || []); setLoading(false); })(); }, []);

  if (loading) return <div className="text-sm text-neutral-500">Loading…</div>;

  if (orders.length === 0) {
    return (
      <div className="grid place-items-center rounded-sm border border-dashed border-black/10 bg-white p-16 text-center">
        <div className="grid h-16 w-16 place-items-center rounded-full bg-[#F8F7F4] text-[#C9A227]"><Package className="h-6 w-6" /></div>
        <p className="mt-6 font-serif text-3xl">No orders yet</p>
        <p className="mt-2 max-w-md text-sm text-neutral-500">Once you place your first order, it’ll show up here — with live tracking updates.</p>
        <Link href="/shop" className="btn-dark mt-8">Shop the Collection <ArrowRight className="h-4 w-4" /></Link>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {orders.map(o => (
        <div key={o.id} className="rounded-sm border border-black/10 bg-white">
          <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] p-5">
            <div>
              <div className="font-mono text-xs text-neutral-500">Order</div>
              <div className="mt-1 font-serif text-xl">{o.orderNumber}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.16em] text-neutral-500">Placed</div>
              <div className="mt-1 text-sm">{new Date(o.createdAt).toLocaleDateString()}</div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.16em] text-neutral-500">Status</div>
              <div className="mt-1"><StatusPill status={o.status || 'placed'} /></div>
            </div>
            <div>
              <div className="text-xs uppercase tracking-[0.16em] text-neutral-500">Total</div>
              <div className="mt-1 font-serif text-xl">₹{fmt(o.total)}</div>
            </div>
          </div>
          <ul className="divide-y divide-black/[0.06]">
            {(o.items || []).map(it => (
              <li key={it.key || it.id} className="flex items-center gap-4 p-5">
                <img src={it.image} alt="" className="h-16 w-16 rounded-sm object-cover" />
                <div className="flex-1"><div className="font-serif text-lg leading-tight">{it.name}</div><div className="text-xs text-neutral-500">{it.color}{it.engraving ? ` • “${it.engraving}”` : ''} × {it.qty}</div></div>
                <div className="font-semibold">₹{fmt(it.price * it.qty)}</div>
              </li>
            ))}
          </ul>
          <div className="flex items-center justify-between border-t border-black/[0.06] p-4">
            <div className="text-xs text-neutral-500">Payment — {o.payment?.toUpperCase()}</div>
            <Link href="/contact" className="text-xs uppercase tracking-[0.16em] text-neutral-600 hover:text-black">Need help? Contact us →</Link>
          </div>
        </div>
      ))}
    </div>
  );
}

function StatusPill({ status }) {
  const map = { placed: 'bg-blue-50 text-blue-700', confirmed: 'bg-indigo-50 text-indigo-700', packed: 'bg-purple-50 text-purple-700', shipped: 'bg-amber-50 text-amber-700', delivered: 'bg-emerald-50 text-emerald-700', cancelled: 'bg-neutral-100 text-neutral-600', returned: 'bg-rose-50 text-rose-700', refunded: 'bg-rose-50 text-rose-700' };
  return <span className={`inline-flex rounded-sm px-2 py-1 text-[10px] font-semibold uppercase tracking-[0.12em] ${map[status] || 'bg-neutral-100 text-neutral-700'}`}>{status}</span>;
}
