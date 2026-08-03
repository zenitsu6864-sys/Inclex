'use client';
import { useEffect, useState } from 'react';
import { Download, Mail } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';

export default function NewsletterPage() {
  const [subs, setSubs] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { const r = await fetch('/api/admin/newsletter'); const j = await r.json(); setSubs(j.subscribers || []); setLoading(false); })(); }, []);

  function download() {
    const csv = 'email,createdAt\n' + subs.map(s => `${s.email},${s.createdAt}`).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const a = document.createElement('a'); a.href = URL.createObjectURL(blob); a.download = 'inclex-newsletter.csv'; a.click();
  }

  return (
    <AdminShell title="Newsletter" subtitle={`${subs.length} subscribers`}
      actions={<button onClick={download} className="inline-flex items-center gap-2 rounded-sm border border-black/10 bg-white px-3 py-1.5 text-xs"><Download className="h-3.5 w-3.5" /> Export CSV</button>}>
      <div className="rounded-sm border border-black/10 bg-white">
        <table className="w-full text-sm">
          <thead className="bg-[#F8F7F4] text-[10px] uppercase tracking-[0.14em] text-neutral-500"><tr><th className="px-4 py-3 text-left">Email</th><th className="px-4 py-3 text-left">Subscribed</th></tr></thead>
          <tbody>
            {loading && <tr><td colSpan="2" className="px-4 py-10 text-center text-neutral-500">Loading…</td></tr>}
            {!loading && subs.length === 0 && <tr><td colSpan="2" className="px-4 py-10 text-center text-neutral-500">No subscribers yet</td></tr>}
            {subs.map(s => (<tr key={s.id} className="border-t border-black/[0.06]"><td className="px-4 py-3"><span className="inline-flex items-center gap-2"><Mail className="h-3.5 w-3.5 text-[#C9A227]" /> {s.email}</span></td><td className="px-4 py-3 text-neutral-600">{new Date(s.createdAt).toLocaleString()}</td></tr>))}
          </tbody>
        </table>
      </div>
    </AdminShell>
  );
}
