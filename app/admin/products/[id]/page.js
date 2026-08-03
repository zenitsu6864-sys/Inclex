'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { ArrowLeft, Save, Trash2, Plus, X, Image as ImageIcon } from 'lucide-react';
import Link from 'next/link';
import AdminShell from '@/components/admin/AdminShell';

const BLANK = {
  name: '', subtitle: '', price: 899, compareAt: 0, material: 'Leather', status: 'draft', featured: false, stock: 50, sku: '',
  description: '', badges: [], colors: ['Black'], features: [], images: [], slug: '', seoTitle: '', seoDescription: '', highlights: [],
};

export default function ProductEditor() {
  const params = useParams();
  const router = useRouter();
  const isNew = params.id === 'new';
  const [p, setP] = useState(BLANK);
  const [loading, setLoading] = useState(!isNew);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (isNew) return;
    (async () => {
      const r = await fetch(`/api/admin/products/${params.id}`);
      const j = await r.json();
      if (j.product) setP(j.product);
      setLoading(false);
    })();
  }, [params.id, isNew]);

  const set = (k) => (v) => setP((x) => ({ ...x, [k]: v }));

  async function save() {
    setSaving(true);
    const r = await fetch('/api/admin/products', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(p) });
    const j = await r.json();
    setSaving(false);
    if (r.ok) { toast.success('Saved'); if (isNew) router.replace(`/admin/products/${j.product.id}`); }
    else toast.error(j.error || 'Save failed');
  }

  async function del() {
    if (!confirm('Delete this product?')) return;
    await fetch(`/api/admin/products/${p.id}`, { method: 'DELETE' });
    toast.success('Deleted');
    router.replace('/admin/products');
  }

  if (loading) return <AdminShell title="…"><div className="text-sm text-neutral-500">Loading…</div></AdminShell>;

  return (
    <AdminShell title={isNew ? 'New Product' : p.name || 'Edit Product'} subtitle={p.subtitle}
      actions={
        <div className="flex items-center gap-2">
          {!isNew && <button onClick={del} className="inline-flex items-center gap-2 rounded-sm border border-red-200 bg-red-50 px-3 py-1.5 text-xs text-red-700"><Trash2 className="h-3.5 w-3.5" /> Delete</button>}
          <Link href="/admin/products" className="inline-flex items-center gap-2 rounded-sm border border-black/10 bg-white px-3 py-1.5 text-xs"><ArrowLeft className="h-3.5 w-3.5" /> Back</Link>
          <button onClick={save} disabled={saving} className="btn-dark !py-2 !px-4 text-xs"><Save className="h-3.5 w-3.5" /> {saving ? 'Saving…' : 'Save'}</button>
        </div>
      }>
      <div className="grid gap-6 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Panel title="Basic Info">
            <div className="grid gap-4 sm:grid-cols-2">
              <F label="Name" value={p.name} onChange={set('name')} />
              <F label="Slug" value={p.slug} onChange={set('slug')} placeholder="auto-generated if empty" />
              <F label="Subtitle" value={p.subtitle} onChange={set('subtitle')} />
              <F label="SKU" value={p.sku} onChange={set('sku')} />
              <F label="Material" value={p.material} onChange={set('material')} placeholder="Leather / Metal / Carbon Fiber" />
              <F label="Badges (comma separated)" value={(p.badges || []).join(', ')} onChange={(v) => set('badges')(v.split(',').map(s => s.trim()).filter(Boolean))} placeholder="Best Seller, New" />
            </div>
            <label className="mt-4 block">
              <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">Description</span>
              <textarea value={p.description} onChange={(e) => set('description')(e.target.value)} rows={4} className="mt-2 w-full rounded-sm border border-black/10 bg-white px-4 py-3 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25" />
            </label>
          </Panel>

          <Panel title="Media">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">Image URLs (one per line)</span>
              <textarea value={(p.images || []).join('\n')} onChange={(e) => set('images')(e.target.value.split('\n').map(s => s.trim()).filter(Boolean))} rows={4} className="mt-2 w-full rounded-sm border border-black/10 bg-white px-4 py-3 text-sm font-mono focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25" placeholder="https://images.unsplash.com/photo-…" />
            </label>
            <div className="mt-4 grid grid-cols-4 gap-3">
              {(p.images || []).map((src, i) => (
                <div key={i} className="relative aspect-square overflow-hidden rounded-sm bg-[#EFEDE7]">
                  <img src={src} alt="" className="h-full w-full object-cover" />
                  <button onClick={() => set('images')((p.images || []).filter((_, idx) => idx !== i))} className="absolute right-1 top-1 grid h-6 w-6 place-items-center rounded-sm bg-black/70 text-white"><X className="h-3 w-3" /></button>
                </div>
              ))}
              {(p.images || []).length === 0 && <div className="col-span-4 grid h-32 place-items-center rounded-sm border border-dashed border-black/10 text-sm text-neutral-500"><ImageIcon className="h-6 w-6" /></div>}
            </div>
          </Panel>

          <Panel title="Attributes">
            <div className="grid gap-4 sm:grid-cols-2">
              <F label="Colors (comma separated)" value={(p.colors || []).join(', ')} onChange={(v) => set('colors')(v.split(',').map(s => s.trim()).filter(Boolean))} />
              <F label="Features (comma separated)" value={(p.features || []).join(', ')} onChange={(v) => set('features')(v.split(',').map(s => s.trim()).filter(Boolean))} />
            </div>
          </Panel>

          <Panel title="SEO">
            <div className="grid gap-4">
              <F label="Meta Title" value={p.seoTitle} onChange={set('seoTitle')} />
              <label className="block">
                <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">Meta Description</span>
                <textarea value={p.seoDescription} onChange={(e) => set('seoDescription')(e.target.value)} rows={2} className="mt-2 w-full rounded-sm border border-black/10 bg-white px-4 py-3 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25" />
              </label>
            </div>
          </Panel>
        </div>

        <div className="space-y-6">
          <Panel title="Pricing & Stock">
            <div className="grid gap-4">
              <F label="Price (₹)" type="number" value={p.price} onChange={(v) => set('price')(Number(v))} />
              <F label="Compare-at Price (₹)" type="number" value={p.compareAt || ''} onChange={(v) => set('compareAt')(Number(v || 0))} />
              <F label="Stock" type="number" value={p.stock ?? 42} onChange={(v) => set('stock')(Number(v))} />
            </div>
          </Panel>

          <Panel title="Publish">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">Status</span>
              <select value={p.status || 'draft'} onChange={(e) => set('status')(e.target.value)} className="mt-2 w-full rounded-sm border border-black/10 bg-white px-4 py-3 text-sm">
                <option value="published">Published</option><option value="draft">Draft</option><option value="archived">Archived</option>
              </select>
            </label>
            <label className="mt-4 flex items-center gap-2">
              <input type="checkbox" checked={!!p.featured} onChange={(e) => set('featured')(e.target.checked)} className="h-4 w-4 accent-[#C9A227]" />
              <span className="text-sm">Feature on homepage</span>
            </label>
          </Panel>
        </div>
      </div>
    </AdminShell>
  );
}

function Panel({ title, children }) {
  return (
    <div className="rounded-sm border border-black/10 bg-white p-6">
      <div className="mb-4 text-xs font-semibold uppercase tracking-[0.18em]">{title}</div>
      {children}
    </div>
  );
}

function F({ label, value, onChange, type = 'text', placeholder }) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">{label}</span>
      <input type={type} value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="mt-2 w-full rounded-sm border border-black/10 bg-white px-4 py-3 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25" />
    </label>
  );
}
