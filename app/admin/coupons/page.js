'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Plus, Trash2, Copy } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';

const BLANK = { code: '', type: 'percent', value: 10, active: true, minOrder: 0, maxDiscount: 0, maxUses: 0, perCustomer: 0, appliesTo: 'all', description: '' };

export default function CouponsPage() {
  const [coupons, setCoupons] = useState([]); const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(null);
  const load = async () => { setLoading(true); const r = await fetch('/api/admin/coupons'); const j = await r.json(); setCoupons(j.coupons || []); setLoading(false); };
  useEffect(() => { load(); }, []);

  async function save() {
    const r = await fetch('/api/admin/coupons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(editing) });
    const j = await r.json();
    if (r.ok) { toast.success('Saved'); setEditing(null); load(); }
    else toast.error(j.error);
  }
  async function del(id) { if (!confirm('Delete coupon?')) return; await fetch(`/api/admin/coupons/${id}`, { method: 'DELETE' }); load(); toast.success('Deleted'); }
  async function toggle(c) {
    await fetch('/api/admin/coupons', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ ...c, active: !c.active }) });
    load();
  }

  return (
    <AdminShell title="Coupons" subtitle={`${coupons.length} total`}
      actions={<button onClick={() => setEditing({ ...BLANK, id: undefined })} className="btn-dark !py-2 !px-4 text-xs"><Plus className="h-4 w-4" /> New Coupon</button>}>
      <div className="rounded-sm border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[#F8F7F4] text-[10px] uppercase tracking-[0.14em] text-neutral-500"><tr><th className="px-4 py-3 text-left">Code</th><th className="px-4 py-3 text-left">Type</th><th className="px-4 py-3 text-right">Value</th><th className="px-4 py-3 text-right">Min. Order</th><th className="px-4 py-3 text-left">Active</th><th className="px-4 py-3 text-right"></th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan="6" className="px-4 py-10 text-center text-neutral-500">Loading…</td></tr>}
            {!loading && coupons.length === 0 && <tr><td colSpan="6" className="px-4 py-10 text-center text-neutral-500">No coupons. Create your first one →</td></tr>}
            {coupons.map(c => (
              <tr key={c.id} className="border-t border-black/[0.06]">
                <td className="px-4 py-3 font-mono font-semibold text-[#C9A227]">{c.code}</td>
                <td className="px-4 py-3 capitalize">{c.type}</td>
                <td className="px-4 py-3 text-right">{c.type === 'percent' ? `${c.value}%` : `₹${c.value}`}</td>
                <td className="px-4 py-3 text-right">{c.minOrder ? `₹${c.minOrder}` : '—'}</td>
                <td className="px-4 py-3"><label className="inline-flex items-center gap-2"><input type="checkbox" checked={c.active} onChange={() => toggle(c)} className="h-4 w-4 accent-[#C9A227]" /><span className={c.active ? 'text-emerald-600 text-xs' : 'text-neutral-500 text-xs'}>{c.active ? 'Active' : 'Inactive'}</span></label></td>
                <td className="px-4 py-3 text-right">
                  <button onClick={() => setEditing(c)} className="inline-flex items-center gap-1 rounded-sm border border-black/10 bg-white px-2 py-1 text-xs mr-1">Edit</button>
                  <button onClick={() => navigator.clipboard.writeText(c.code)} className="grid inline-block h-8 w-8 place-items-center rounded-sm hover:bg-black/5"><Copy className="h-3.5 w-3.5" /></button>
                  <button onClick={() => del(c.id)} className="grid inline-block h-8 w-8 place-items-center rounded-sm text-red-600 hover:bg-red-50"><Trash2 className="h-3.5 w-3.5" /></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {editing && (
        <div className="fixed inset-0 z-50 flex" onClick={() => setEditing(null)}>
          <div className="flex-1 bg-black/50" />
          <aside className="w-full max-w-md overflow-y-auto bg-white p-8 shadow-2xl" onClick={e => e.stopPropagation()}>
            <div className="font-serif text-2xl">{editing.id ? 'Edit Coupon' : 'New Coupon'}</div>
            <div className="mt-6 space-y-4">
              <F label="Code" value={editing.code} onChange={v => setEditing({ ...editing, code: v.toUpperCase() })} placeholder="WELCOME10" />
              <div className="grid grid-cols-2 gap-4">
                <label className="block">
                  <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">Type</span>
                  <select value={editing.type} onChange={e => setEditing({ ...editing, type: e.target.value })} className="mt-2 w-full rounded-sm border border-black/10 bg-white px-4 py-3 text-sm">
                    <option value="percent">Percentage</option><option value="flat">Flat</option><option value="shipping">Free Shipping</option><option value="bxgy">Buy X Get Y</option>
                  </select>
                </label>
                <F label="Value" type="number" value={editing.value} onChange={v => setEditing({ ...editing, value: Number(v) })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <F label="Min. Order (₹)" type="number" value={editing.minOrder} onChange={v => setEditing({ ...editing, minOrder: Number(v) })} />
                <F label="Max. Discount (₹)" type="number" value={editing.maxDiscount} onChange={v => setEditing({ ...editing, maxDiscount: Number(v) })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <F label="Max. Uses" type="number" value={editing.maxUses} onChange={v => setEditing({ ...editing, maxUses: Number(v) })} />
                <F label="Per Customer" type="number" value={editing.perCustomer} onChange={v => setEditing({ ...editing, perCustomer: Number(v) })} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <F label="Starts" type="date" value={(editing.startsAt || '').slice(0, 10)} onChange={v => setEditing({ ...editing, startsAt: v })} />
                <F label="Ends" type="date" value={(editing.endsAt || '').slice(0, 10)} onChange={v => setEditing({ ...editing, endsAt: v })} />
              </div>
              <label className="block">
                <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">Description</span>
                <textarea rows={3} value={editing.description} onChange={e => setEditing({ ...editing, description: e.target.value })} className="mt-2 w-full rounded-sm border border-black/10 bg-white px-4 py-3 text-sm" />
              </label>
              <label className="flex items-center gap-2">
                <input type="checkbox" checked={editing.active} onChange={e => setEditing({ ...editing, active: e.target.checked })} className="h-4 w-4 accent-[#C9A227]" />
                <span className="text-sm">Active</span>
              </label>
            </div>
            <div className="mt-8 flex gap-2">
              <button onClick={save} className="btn-dark flex-1">Save Coupon</button>
              <button onClick={() => setEditing(null)} className="inline-flex items-center rounded-sm border border-black/10 bg-white px-4 py-3 text-sm">Cancel</button>
            </div>
          </aside>
        </div>
      )}
    </AdminShell>
  );
}
function F({ label, value, onChange, type = 'text', placeholder }) { return (<label className="block"><span className="text-xs uppercase tracking-[0.18em] text-neutral-500">{label}</span><input type={type} value={value ?? ''} placeholder={placeholder} onChange={e => onChange(e.target.value)} className="mt-2 w-full rounded-sm border border-black/10 bg-white px-4 py-3 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25" /></label>); }
