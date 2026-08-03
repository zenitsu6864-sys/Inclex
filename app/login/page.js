'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight, Eye, EyeOff } from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import { useUser } from '@/components/site/UserContext';

const HERO_IMG = 'https://images.unsplash.com/photo-1676276550349-580c49631496?auto=format&fit=crop&w=1800&q=90';

export default function LoginPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get('redirect') || '/account';
  const { refresh } = useUser();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch('/api/auth/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await r.json();
      if (r.ok && data.ok) { toast.success('Welcome back', { description: data.user.name }); await refresh(); router.replace(redirect); }
      else toast.error(data.error || 'Sign-in failed');
    } catch { toast.error('Network error'); }
    finally { setLoading(false); }
  }

  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <Header variant="light" />
      <section className="container-editorial grid min-h-[calc(100vh-9rem)] grid-cols-1 items-center gap-14 py-12 lg:grid-cols-2 lg:py-20">
        <div className="relative hidden aspect-[4/5] overflow-hidden rounded-sm bg-black lg:block">
          <img src={HERO_IMG} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/20 to-black/70" />
          <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
            <div className="eyebrow flex items-center gap-3"><span className="hairline" />Welcome back</div>
            <div>
              <h2 className="font-serif text-5xl leading-tight">Your studio,<br />ready when you are.</h2>
              <p className="mt-4 max-w-sm text-white/70">Track orders, save designs, and pick up right where you left off.</p>
            </div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-white/50">Est. Bengaluru — India</div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="eyebrow flex items-center gap-3"><span className="hairline" />Sign in</div>
          <h1 className="mt-4 font-serif text-5xl leading-tight">Welcome back.</h1>
          <p className="mt-2 text-neutral-500">Enter your details to continue.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">Email</span>
              <div className="relative mt-2">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@domain.com" className="w-full rounded-sm border border-black/10 bg-white pl-10 pr-4 py-3 focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25" />
              </div>
            </label>
            <label className="block">
              <span className="flex items-center justify-between text-xs uppercase tracking-[0.18em] text-neutral-500">Password <Link href="/forgot-password" className="text-[10px] tracking-[0.14em] normal-case text-neutral-500 hover:text-black">Forgot?</Link></span>
              <div className="relative mt-2">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input type={showPw ? 'text' : 'password'} required value={password} onChange={e => setPassword(e.target.value)} placeholder="••••••••" className="w-full rounded-sm border border-black/10 bg-white pl-10 pr-10 py-3 focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25" />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1.5 text-neutral-400 hover:text-black" aria-label="Toggle password">{showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>
            </label>
            <button disabled={loading} type="submit" className="btn-dark w-full">{loading ? 'Signing in…' : 'Sign In'} <ArrowRight className="h-4 w-4" /></button>
          </form>

          <div className="my-8 flex items-center gap-4 text-xs uppercase tracking-[0.18em] text-neutral-400"><span className="h-px flex-1 bg-black/10" /> or <span className="h-px flex-1 bg-black/10" /></div>
          <p className="text-center text-sm text-neutral-600">Don’t have an account? <Link href={`/signup${redirect !== '/account' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} className="font-semibold text-black hover:text-[#C9A227]">Create one</Link></p>

          <p className="mt-8 text-[11px] leading-relaxed text-neutral-500">By continuing, you agree to our <Link href="/policy/terms" className="underline">Terms</Link> and <Link href="/policy/privacy" className="underline">Privacy Policy</Link>.</p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
