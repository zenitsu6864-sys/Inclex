'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Lock, Mail, ArrowRight } from 'lucide-react';
import { toast } from 'sonner';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('admin@inclex.com');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    (async () => {
      const r = await fetch('/api/admin/me');
      if (r.ok) router.replace('/admin');
    })();
  }, [router]);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch('/api/admin/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await r.json();
      if (r.ok && data.ok) {
        toast.success('Welcome back', { description: 'Signed in as ' + email });
        router.replace('/admin');
      } else toast.error(data.error || 'Invalid credentials');
    } catch { toast.error('Network error'); }
    finally { setLoading(false); }
  }

  return (
    <main className="grid min-h-screen grid-cols-1 lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-black text-white lg:block">
        <img src="https://images.pexels.com/photos/33242820/pexels-photo-33242820.jpeg?auto=compress&cs=tinysrgb&w=2000&q=85" alt="" className="absolute inset-0 h-full w-full object-cover opacity-60" />
        <div className="absolute inset-0 bg-gradient-to-br from-black/80 via-black/50 to-black/70" />
        <div className="relative z-10 flex h-full flex-col justify-between p-12">
          <Link href="/" className="inline-flex items-baseline gap-2 font-sans text-[22px] font-light tracking-[0.4em]">INCLEX <span className="rounded-sm bg-[#C9A227] px-2 py-0.5 text-[10px] font-bold tracking-widest text-black">ADMIN</span></Link>
          <div>
            <div className="eyebrow flex items-center gap-3"><span className="hairline" />Command Center</div>
            <h1 className="mt-4 max-w-md font-serif text-5xl leading-[1.05]">The atelier, at your fingertips.</h1>
            <p className="mt-4 max-w-md text-white/70">Manage products, launches, campaigns and everything customers see — without touching code.</p>
          </div>
          <div className="text-[11px] uppercase tracking-[0.24em] text-white/50">© {new Date().getFullYear()} Inclex • All rights reserved</div>
        </div>
      </div>

      <div className="flex items-center justify-center bg-[#F8F7F4] px-6 py-16">
        <form onSubmit={submit} className="w-full max-w-sm">
          <div className="eyebrow flex items-center gap-3"><span className="hairline" />Sign in</div>
          <h2 className="mt-4 font-serif text-4xl">Welcome back.</h2>
          <p className="mt-2 text-sm text-neutral-500">Enter your credentials to access the dashboard.</p>

          <div className="mt-8 space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">Email</span>
              <div className="relative mt-2">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} className="w-full rounded-sm border border-black/10 bg-white pl-10 pr-4 py-3 focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25" />
              </div>
            </label>

            <label className="block">
              <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">Password</span>
              <div className="relative mt-2">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input type="password" required value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-sm border border-black/10 bg-white pl-10 pr-4 py-3 focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25" />
              </div>
            </label>
          </div>

          <button disabled={loading} className="btn-dark mt-8 w-full">{loading ? 'Signing in…' : 'Sign In'} <ArrowRight className="h-4 w-4" /></button>

          <div className="mt-6 rounded-sm border border-dashed border-black/10 bg-white/60 p-3 text-[11px] text-neutral-500">
            <b className="text-neutral-700">Demo credentials:</b><br />
            admin@inclex.com · inclex2025
          </div>
        </form>
      </div>
    </main>
  );
}
