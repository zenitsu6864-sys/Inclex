'use client';
import { useEffect, useState } from 'react';
import AdminShell from '@/components/admin/AdminShell';

export default function InquiriesPage() {
  const [data, setData] = useState({ contacts: [], corporate: [], customizations: [] });
  const [tab, setTab] = useState('contact');
  const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { const r = await fetch('/api/admin/inquiries'); const j = await r.json(); setData(j); setLoading(false); })(); }, []);

  const tabs = [
    { id: 'contact', label: 'Contact', data: data.contacts },
    { id: 'corporate', label: 'Corporate', data: data.corporate },
    { id: 'customize', label: 'Customizations', data: data.customizations },
  ];
  const active = tabs.find(t => t.id === tab);

  return (
    <AdminShell title="Inquiries" subtitle={`${data.contacts.length + data.corporate.length + data.customizations.length} messages`}>
      <div className="mb-4 inline-flex overflow-hidden rounded-sm border border-black/10 bg-white">
        {tabs.map(t => <button key={t.id} onClick={() => setTab(t.id)} className={`px-4 py-2 text-xs uppercase tracking-[0.14em] ${tab === t.id ? 'bg-black text-white' : ''}`}>{t.label} ({t.data.length})</button>)}
      </div>

      <div className="rounded-sm border border-black/10 bg-white">
        {loading ? <div className="p-10 text-center text-sm text-neutral-500">Loading…</div> : (
          <>
            {tab === 'contact' && <ContactTable rows={data.contacts} />}
            {tab === 'corporate' && <CorporateTable rows={data.corporate} />}
            {tab === 'customize' && <CustomizationsTable rows={data.customizations} />}
          </>
        )}
      </div>
    </AdminShell>
  );
}

function ContactTable({ rows }) {
  if (rows.length === 0) return <div className="p-10 text-center text-sm text-neutral-500">No contact messages yet</div>;
  return (<table className="w-full text-sm"><thead className="bg-[#F8F7F4] text-[10px] uppercase tracking-[0.14em] text-neutral-500"><tr><th className="px-4 py-3 text-left">Received</th><th className="px-4 py-3 text-left">From</th><th className="px-4 py-3 text-left">Subject</th><th className="px-4 py-3 text-left">Message</th></tr></thead><tbody>{rows.map(r => (<tr key={r.id} className="border-t border-black/[0.06] align-top"><td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{new Date(r.createdAt).toLocaleString()}</td><td className="px-4 py-3"><div className="font-medium">{r.name}</div><div className="text-xs text-neutral-500">{r.email}</div></td><td className="px-4 py-3">{r.subject || '—'}</td><td className="px-4 py-3 max-w-md text-neutral-600">{r.message}</td></tr>))}</tbody></table>);
}
function CorporateTable({ rows }) {
  if (rows.length === 0) return <div className="p-10 text-center text-sm text-neutral-500">No corporate inquiries yet</div>;
  return (<table className="w-full text-sm"><thead className="bg-[#F8F7F4] text-[10px] uppercase tracking-[0.14em] text-neutral-500"><tr><th className="px-4 py-3 text-left">Received</th><th className="px-4 py-3 text-left">Company</th><th className="px-4 py-3 text-left">Contact</th><th className="px-4 py-3 text-right">Qty</th><th className="px-4 py-3 text-left">Notes</th></tr></thead><tbody>{rows.map(r => (<tr key={r.id} className="border-t border-black/[0.06] align-top"><td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{new Date(r.createdAt).toLocaleString()}</td><td className="px-4 py-3"><div className="font-medium">{r.company}</div></td><td className="px-4 py-3"><div>{r.name}</div><div className="text-xs text-neutral-500">{r.email} • {r.phone}</div></td><td className="px-4 py-3 text-right">{r.quantity}</td><td className="px-4 py-3 max-w-md text-neutral-600">{r.notes}</td></tr>))}</tbody></table>);
}
function CustomizationsTable({ rows }) {
  if (rows.length === 0) return <div className="p-10 text-center text-sm text-neutral-500">No customizations yet</div>;
  return (<table className="w-full text-sm"><thead className="bg-[#F8F7F4] text-[10px] uppercase tracking-[0.14em] text-neutral-500"><tr><th className="px-4 py-3 text-left">Created</th><th className="px-4 py-3 text-left">Engraving</th><th className="px-4 py-3 text-left">Material</th><th className="px-4 py-3 text-left">Color</th><th className="px-4 py-3 text-left">Finish</th></tr></thead><tbody>{rows.map(r => (<tr key={r.id} className="border-t border-black/[0.06]"><td className="px-4 py-3 text-neutral-500 whitespace-nowrap">{new Date(r.createdAt).toLocaleString()}</td><td className="px-4 py-3 font-serif italic text-[#C9A227]">“{r.engraving}”</td><td className="px-4 py-3">{r.material}</td><td className="px-4 py-3">{r.color}</td><td className="px-4 py-3">{r.finish}</td></tr>))}</tbody></table>);
}
