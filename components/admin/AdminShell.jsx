'use client';

import { useEffect, useState } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import Sidebar, { AdminTopbar } from './Sidebar';

export default function AdminShell({ children, title, subtitle, actions }) {
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);
  const [authed, setAuthed] = useState(false);
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    (async () => {
      try {
        const r = await fetch('/api/admin/me', { cache: 'no-store' });
        if (r.ok) setAuthed(true);
        else if (pathname !== '/admin/login') router.replace('/admin/login');
      } catch {
        if (pathname !== '/admin/login') router.replace('/admin/login');
      } finally {
        setReady(true);
      }
    })();
  }, [pathname, router]);

  if (!ready) {
    return (
      <div className="grid min-h-screen place-items-center bg-[#F8F7F4]">
        <div className="flex flex-col items-center gap-4">
          <div className="h-[1px] w-24 overflow-hidden bg-black/10">
            <div className="h-full w-1/2 animate-[marquee_1.4s_linear_infinite] bg-[#C9A227]" />
          </div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-500">Loading Admin</span>
        </div>
      </div>
    );
  }

  if (!authed) return null;

  return (
    <div className="min-h-screen bg-[#F8F7F4]">
      <div className="flex">
        <Sidebar open={open} onClose={() => setOpen(false)} />
        <main className="flex-1 min-w-0">
          <AdminTopbar onMenu={() => setOpen(true)} title={title} subtitle={subtitle} actions={actions} />
          <div className="px-5 py-6 lg:px-8 lg:py-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
