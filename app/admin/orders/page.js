'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Search, Eye, ArrowRight } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';

const fmt = (n) => new Intl.NumberFormat('en-IN').format(n || 0);
const STATUSES = ['placed', 'confirmed', 'packed', 'shipped', 'delivered', 'cancelled', 'returned', 'refunded'];

export default function OrdersPage() {
  const [orders, setOrders] = useState([]);
  const [active, setActive] = useState(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState('');
  const [filter, setFilter] = useState('all');

  const load = async () => { setLoading(true); const r = await fetch('/api/admin/orders'); const j = await r.json(); setOrders(j.orders || []); setLoading(false); };
  useEffect(() => { load(); }, []);

  async function updateStatus(id, status) {
    const r = await fetch(`/api/admin/orders/${id}/status`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ status }) });
    if (r.ok) { toast.success(`Status → ${status}`); load(); }
  }

  const filtered = orders.filter(o => (o.orderNumber + ' ' + (o.customer?.email || '') + ' ' + (o.customer?.name || '')).toLowerCase().includes(q.toLowerCase()) && (filter === 'all' || o.status === filter));

  return (
    <AdminShell title="Orders" subtitle={`${orders.length} total`}>
      <div className="rounded-sm border border-black/10 bg-white">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-black/[0.06] p-4">
          <div className="relative flex-1 min-w-[200px]">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search order # or customer…" className="w-full rounded-sm border border-black/10 bg-white pl-10 pr-4 py-2 text-sm" />
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {['all', ...STATUSES].map(s => (
              <button key={s} onClick={() => setFilter(s)} className={`rounded-sm px-3 py-1.5 text-xs uppercase tracking-[0.14em] ${filter === s ? 'bg-black text-white' : 'border border-black/10 bg-white'}`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F8F7F4] text-[10px] uppercase tracking-[0.14em] text-neutral-500">
              <tr><th className="px-4 py-3 text-left">Order</th><th className="px-4 py-3 text-left">Date</th><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Payment</th><th className="px-4 py-3 text-right">Total</th><th className="px-4 py-3 text-left">Status</th><th className="px-4 py-3 text-right"></th></tr>
            </thead>
            <tbody>
              {loading && <tr><td colSpan="7" className="px-4 py-10 text-center text-neutral-500">Loading…</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan="7" className="px-4 py-10 text-center text-neutral-500">No orders</td></tr>}
              {filtered.map(o => (
                <tr key={o.id} className="border-t border-black/[0.06]">
                  <td className="px-4 py-3 font-mono text-xs">{o.orderNumber}</td>
                  <td className="px-4 py-3 text-neutral-600">{new Date(o.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><div className="font-medium">{o.customer?.name}</div><div className="text-xs text-neutral-500">{o.customer?.email}</div></td>
                  <td className="px-4 py-3 uppercase text-xs">{o.payment}</td>
                  <td className="px-4 py-3 text-right font-medium">₹{fmt(o.total)}</td>
                  <td className="px-4 py-3">
                    <select value={o.status} onChange={(e) => updateStatus(o.id, e.target.value)} className="rounded-sm border border-black/10 bg-white px-2 py-1 text-xs">
                      {STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </td>
                  <td className="px-4 py-3 text-right"><button onClick={() => setActive(o)} className="grid h-8 w-8 place-items-center rounded-sm hover:bg-black/5" title="View"><Eye className="h-4 w-4" /></button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Detail drawer */}
      {active && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setActive(null)}>
          <div className="flex-1 bg-black/50" />
          <aside className="w-full max-w-lg overflow-y-auto bg-white p-8 shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Order</div>
                <div className="font-serif text-2xl">{active.orderNumber}</div>
              </div>
              <button onClick={() => setActive(null)} className="text-neutral-400">Close</button>
            </div>

            <div className="mt-6 rounded-sm border border-black/10 p-4">
              <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">Customer</div>
              <div className="mt-2 text-sm"><b>{active.customer?.name}</b><br />{active.customer?.email}<br />{active.customer?.phone}<br />{active.customer?.address}, {active.customer?.city} {active.customer?.pincode}, {active.customer?.state}</div>
            </div>

            <div className="mt-4 rounded-sm border border-black/10">
              <div className="border-b border-black/[0.06] p-4 text-xs uppercase tracking-[0.18em] text-neutral-500">Items</div>
              <ul className="divide-y divide-black/[0.06]">
                {(active.items || []).map(it => (
                  <li key={it.key || it.id} className="flex items-center gap-3 p-4">
                    <img src={it.image} alt="" className="h-14 w-14 rounded-sm object-cover" />
                    <div className="flex-1"><div className="text-sm font-medium">{it.name}</div><div className="text-xs text-neutral-500">{it.color}{it.engraving ? ` • “${it.engraving}”` : ''} × {it.qty}</div></div>
                    <div className="text-sm font-medium">₹{fmt(it.price * it.qty)}</div>
                  </li>
                ))}
              </ul>
              <div className="space-y-1 border-t border-black/[0.06] p-4 text-sm">
                <Row label="Subtotal" value={`₹${fmt(active.subtotal)}`} />
                <Row label="Shipping" value={active.shipping ? `₹${fmt(active.shipping)}` : 'Free'} />
                <div className="mt-2 flex items-center justify-between border-t border-black/[0.06] pt-3 text-base"><span className="font-serif">Total</span><span className="font-serif text-xl">₹{fmt(active.total)}</span></div>
              </div>
            </div>

            <div className="mt-6 flex items-center gap-2">
              {['confirmed', 'packed', 'shipped', 'delivered'].map(s => (
                <button key={s} onClick={() => updateStatus(active.id, s)} className="inline-flex items-center gap-1 rounded-sm border border-black/10 bg-white px-3 py-2 text-xs uppercase tracking-[0.14em] hover:border-black">Mark {s} <ArrowRight className="h-3 w-3" /></button>
              ))}
            </div>
          </aside>
        </div>
      )}
    </AdminShell>
  );
}

function Row({ label, value }) { return <div className="flex items-center justify-between"><span className="text-neutral-500">{label}</span><span className="text-neutral-800">{value}</span></div>; }
