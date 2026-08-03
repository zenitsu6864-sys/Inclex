'use client';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { UploadCloud, Trash2, Copy, ImageIcon } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';

export default function MediaPage() {
  const [media, setMedia] = useState([]); const [loading, setLoading] = useState(true);
  const [url, setUrl] = useState(''); const [name, setName] = useState('');

  const load = async () => { setLoading(true); const r = await fetch('/api/admin/media'); const j = await r.json(); setMedia(j.media || []); setLoading(false); };
  useEffect(() => { load(); }, []);

  async function add() {
    if (!url) return toast.error('Enter a media URL');
    const r = await fetch('/api/admin/media', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ url, name: name || url.split('/').pop(), kind: /\.(mp4|mov|webm)$/i.test(url) ? 'video' : 'image' }) });
    if (r.ok) { toast.success('Added'); setUrl(''); setName(''); load(); }
  }
  async function del(id) { if (!confirm('Delete?')) return; await fetch(`/api/admin/media/${id}`, { method: 'DELETE' }); load(); }

  return (
    <AdminShell title="Media Library" subtitle={`${media.length} items`}>
      <div className="mb-6 rounded-sm border border-black/10 bg-white p-6">
        <div className="flex flex-wrap items-end gap-3">
          <label className="flex-1 min-w-[240px]">
            <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">Media URL</span>
            <input value={url} onChange={e => setUrl(e.target.value)} placeholder="https://… image or video URL" className="mt-2 w-full rounded-sm border border-black/10 bg-white px-4 py-2.5 text-sm" />
          </label>
          <label className="w-56">
            <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">Name</span>
            <input value={name} onChange={e => setName(e.target.value)} placeholder="Hero image" className="mt-2 w-full rounded-sm border border-black/10 bg-white px-4 py-2.5 text-sm" />
          </label>
          <button onClick={add} className="btn-dark !py-2.5 text-xs"><UploadCloud className="h-4 w-4" /> Add to Library</button>
        </div>
        <p className="mt-3 text-xs text-neutral-500">Paste any public CDN URL (Unsplash / Pexels / Mixkit / Cloudinary etc.). Native uploads coming soon.</p>
      </div>

      {loading && <div className="text-sm text-neutral-500">Loading…</div>}
      {!loading && media.length === 0 && (
        <div className="grid place-items-center rounded-sm border border-dashed border-black/10 bg-white p-16 text-center">
          <ImageIcon className="h-8 w-8 text-neutral-400" />
          <p className="mt-3 font-serif text-2xl">Your library is empty</p>
          <p className="mt-1 text-sm text-neutral-500">Add your first image or video URL above.</p>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
        {media.map(m => (
          <div key={m.id} className="group overflow-hidden rounded-sm border border-black/10 bg-white">
            <div className="aspect-video overflow-hidden bg-[#EFEDE7]">
              {m.kind === 'video' ? (<video src={m.url} className="h-full w-full object-cover" muted playsInline preload="metadata" />) : (<img src={m.url} alt={m.name} className="h-full w-full object-cover" />)}
            </div>
            <div className="p-3">
              <div className="truncate text-sm font-medium" title={m.name}>{m.name}</div>
              <div className="text-[11px] uppercase tracking-[0.14em] text-neutral-500">{m.kind}</div>
              <div className="mt-3 flex items-center justify-between">
                <button onClick={() => { navigator.clipboard.writeText(m.url); toast.success('URL copied'); }} className="inline-flex items-center gap-1 text-xs text-neutral-600 hover:text-black"><Copy className="h-3.5 w-3.5" /> Copy URL</button>
                <button onClick={() => del(m.id)} className="text-red-600 hover:text-red-800"><Trash2 className="h-4 w-4" /></button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AdminShell>
  );
}
