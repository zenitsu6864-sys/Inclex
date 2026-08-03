'use client';
import { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { User, LogOut, Package, Settings, ChevronDown } from 'lucide-react';
import { useUser } from './UserContext';

export default function UserMenu({ dark }) {
  const { user, logout } = useUser();
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    function onClick(e) { if (ref.current && !ref.current.contains(e.target)) setOpen(false); }
    document.addEventListener('mousedown', onClick);
    return () => document.removeEventListener('mousedown', onClick);
  }, []);

  if (!user) {
    return <Link href="/login" aria-label="Sign in" className="opacity-90 hover:opacity-100 transition"><User className="h-5 w-5" /></Link>;
  }

  const initial = (user.name || user.email || 'U').trim().charAt(0).toUpperCase();

  return (
    <div ref={ref} className="relative">
      <button onClick={() => setOpen(v => !v)} aria-label="Account" className="flex items-center gap-2">
        <span className="grid h-8 w-8 place-items-center rounded-full bg-[#C9A227] font-serif text-sm font-semibold text-black">{initial}</span>
        <ChevronDown className={`h-3.5 w-3.5 transition ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="absolute right-0 mt-3 w-64 overflow-hidden rounded-sm border border-black/10 bg-white text-black shadow-[0_20px_50px_-20px_rgba(0,0,0,0.25)]">
          <div className="border-b border-black/[0.06] p-4">
            <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">Signed in as</div>
            <div className="mt-1 font-serif text-lg leading-tight">{user.name || 'Customer'}</div>
            <div className="text-xs text-neutral-500">{user.email}</div>
          </div>
          <ul className="py-2">
            <li><Link href="/account" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#F8F7F4]"><User className="h-4 w-4 text-[#C9A227]" /> Profile</Link></li>
            <li><Link href="/account/orders" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#F8F7F4]"><Package className="h-4 w-4 text-[#C9A227]" /> My Orders</Link></li>
            <li><Link href="/account" onClick={() => setOpen(false)} className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-[#F8F7F4]"><Settings className="h-4 w-4 text-[#C9A227]" /> Settings</Link></li>
          </ul>
          <button onClick={() => { logout(); setOpen(false); }} className="flex w-full items-center gap-3 border-t border-black/[0.06] px-4 py-3 text-sm text-neutral-700 hover:bg-[#F8F7F4]">
            <LogOut className="h-4 w-4" /> Sign out
          </button>
        </div>
      )}
    </div>
  );
}
