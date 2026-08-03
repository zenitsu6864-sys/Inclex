'use client';
import { useEffect, useState } from 'react';
import { Activity as ActivityIcon } from 'lucide-react';
import AdminShell from '@/components/admin/AdminShell';

export default function ActivityPage() {
  const [logs, setLogs] = useState([]); const [loading, setLoading] = useState(true);
  useEffect(() => { (async () => { const r = await fetch('/api/admin/activity'); const j = await r.json(); setLogs(j.activity || []); setLoading(false); })(); }, []);
  return (
    <AdminShell title="Activity Log" subtitle={`${logs.length} events`}>
      <div className="rounded-sm border border-black/10 bg-white">
        {loading && <div className="p-10 text-center text-sm text-neutral-500">Loading…</div>}
        {!loading && logs.length === 0 && <div className="p-10 text-center text-sm text-neutral-500">No activity yet.</div>}
        <ul className="divide-y divide-black/[0.06]">
          {logs.map(l => (
            <li key={l.id} className="flex items-start gap-4 p-5">
              <span className="mt-1 grid h-8 w-8 place-items-center rounded-full bg-[#C9A227]/15 text-[#8B6E12]"><ActivityIcon className="h-3.5 w-3.5" /></span>
              <div className="flex-1">
                <div className="text-sm font-medium">{l.action}</div>
                {l.meta && Object.keys(l.meta).length > 0 && (<pre className="mt-1 text-xs text-neutral-500">{JSON.stringify(l.meta)}</pre>)}
              </div>
              <div className="text-xs text-neutral-500 whitespace-nowrap">{new Date(l.at).toLocaleString()}</div>
            </li>
          ))}
        </ul>
      </div>
    </AdminShell>
  );
}
