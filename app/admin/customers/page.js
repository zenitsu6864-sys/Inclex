'use client';
import { useEffect, useState } from 'react';
import { Search } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';

const fmt = (n) => new Intl.NumberFormat('en-IN').format(n || 0);

export default function CustomersPage() {
  const [rows, setRows] = useState([]); const [loading, setLoading] = useState(true); const [q, setQ] = useState('');
  useEffect(() => { (async () => { const r = await fetch('/api/admin/customers'); const j = await r.json(); setRows(j.customers || []); setLoading(false); })(); }, []);
  const filtered = rows.filter(r => (r.name + ' ' + r.email + ' ' + r.phone).toLowerCase().includes(q.toLowerCase()));
  return (
    <AdminShell title="Customers" subtitle={`${rows.length} total`}>
      <div className="rounded-sm border border-black/10 bg-white">
        <div className="border-b border-black/[0.06] p-4">
          <div className="relative max-w-md">
            <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search customer…" className="w-full rounded-sm border border-black/10 bg-white pl-10 pr-4 py-2 text-sm" />
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-[#F8F7F4] text-[10px] uppercase tracking-[0.14em] text-neutral-500"><tr><th className="px-4 py-3 text-left">Customer</th><th className="px-4 py-3 text-left">Phone</th><th className="px-4 py-3 text-right">Orders</th><th className="px-4 py-3 text-right">Lifetime Value</th><th className="px-4 py-3 text-left">Last Order</th></tr></thead>
            <tbody>
              {loading && <tr><td colSpan="5" className="px-4 py-10 text-center text-neutral-500">Loading…</td></tr>}
              {!loading && filtered.length === 0 && <tr><td colSpan="5" className="px-4 py-10 text-center text-neutral-500">No customers yet</td></tr>}
              {filtered.map(c => (
                <tr key={c.email} className="border-t border-black/[0.06]">
                  <td className="px-4 py-3"><div className="font-medium">{c.name || '—'}</div><div className="text-xs text-neutral-500">{c.email}</div></td>
                  <td className="px-4 py-3 text-neutral-600">{c.phone || '—'}</td>
                  <td className="px-4 py-3 text-right">{c.orders}</td>
                  <td className="px-4 py-3 text-right font-medium">₹{fmt(c.spent)}</td>
                  <td className="px-4 py-3 text-neutral-600">{c.lastAt ? new Date(c.lastAt).toLocaleDateString() : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </AdminShell>
  );
}
