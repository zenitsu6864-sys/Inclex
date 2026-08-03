'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Mail, Lock, ArrowRight, User, Phone, Eye, EyeOff, Check } from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import { useUser } from '@/components/site/UserContext';

const HERO_IMG = 'https://images.pexels.com/photos/33242820/pexels-photo-33242820.jpeg?auto=compress&cs=tinysrgb&w=1800&q=85';

export default function SignupPage() {
  const router = useRouter();
  const params = useSearchParams();
  const redirect = params.get('redirect') || '/account';
  const { refresh } = useUser();

  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '' });
  const [showPw, setShowPw] = useState(false);
  const [loading, setLoading] = useState(false);

  const set = (k) => (e) => setForm(f => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch('/api/auth/signup', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await r.json();
      if (r.ok && data.ok) { toast.success('Welcome to Inclex', { description: `Hi ${data.user.name} — your studio is ready.` }); await refresh(); router.replace(redirect); }
      else toast.error(data.error || 'Sign-up failed');
    } catch { toast.error('Network error'); }
    finally { setLoading(false); }
  }

  const strength = form.password.length === 0 ? 0 : form.password.length < 6 ? 1 : form.password.length < 10 ? 2 : 3;

  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <Header variant="light" />
      <section className="container-editorial grid min-h-[calc(100vh-9rem)] grid-cols-1 items-center gap-14 py-12 lg:grid-cols-2 lg:py-20">
        <div className="mx-auto w-full max-w-md order-2 lg:order-1">
          <div className="eyebrow flex items-center gap-3"><span className="hairline" />Create Account</div>
          <h1 className="mt-4 font-serif text-5xl leading-tight">Join Inclex.</h1>
          <p className="mt-2 text-neutral-500">Save designs, track orders, and unlock member offers.</p>

          <form onSubmit={submit} className="mt-8 space-y-4">
            <label className="block">
              <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">Full name</span>
              <div className="relative mt-2">
                <User className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input required value={form.name} onChange={set('name')} placeholder="Aditya Sharma" className="w-full rounded-sm border border-black/10 bg-white pl-10 pr-4 py-3 focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25" />
              </div>
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">Email</span>
              <div className="relative mt-2">
                <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input type="email" required value={form.email} onChange={set('email')} placeholder="you@domain.com" className="w-full rounded-sm border border-black/10 bg-white pl-10 pr-4 py-3 focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25" />
              </div>
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">Phone (optional)</span>
              <div className="relative mt-2">
                <Phone className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input value={form.phone} onChange={set('phone')} placeholder="+91 …" className="w-full rounded-sm border border-black/10 bg-white pl-10 pr-4 py-3 focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25" />
              </div>
            </label>
            <label className="block">
              <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">Password</span>
              <div className="relative mt-2">
                <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                <input type={showPw ? 'text' : 'password'} required minLength={6} value={form.password} onChange={set('password')} placeholder="At least 6 characters" className="w-full rounded-sm border border-black/10 bg-white pl-10 pr-10 py-3 focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25" />
                <button type="button" onClick={() => setShowPw(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1.5 text-neutral-400 hover:text-black">{showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
              </div>
              <div className="mt-2 flex gap-1">
                {[1, 2, 3].map(i => (<span key={i} className={`h-1 flex-1 rounded-full ${strength >= i ? (strength === 1 ? 'bg-red-400' : strength === 2 ? 'bg-amber-400' : 'bg-emerald-500') : 'bg-black/10'}`} />))}
              </div>
            </label>

            <button disabled={loading} type="submit" className="btn-dark w-full">{loading ? 'Creating…' : 'Create Account'} <ArrowRight className="h-4 w-4" /></button>
          </form>

          <p className="mt-6 text-center text-sm text-neutral-600">Already have an account? <Link href={`/login${redirect !== '/account' ? `?redirect=${encodeURIComponent(redirect)}` : ''}`} className="font-semibold text-black hover:text-[#C9A227]">Sign in</Link></p>
          <p className="mt-8 text-[11px] leading-relaxed text-neutral-500">By creating an account, you agree to our <Link href="/policy/terms" className="underline">Terms</Link> and <Link href="/policy/privacy" className="underline">Privacy Policy</Link>.</p>
        </div>

        <div className="relative hidden aspect-[4/5] overflow-hidden rounded-sm bg-black lg:block lg:order-2">
          <img src={HERO_IMG} alt="" className="absolute inset-0 h-full w-full object-cover opacity-70" />
          <div className="absolute inset-0 bg-gradient-to-br from-black/70 via-black/20 to-black/60" />
          <div className="relative z-10 flex h-full flex-col justify-between p-10 text-white">
            <div className="eyebrow flex items-center gap-3"><span className="hairline" />Members enjoy</div>
            <div>
              <ul className="space-y-4">
                {['Save your bespoke designs', 'Faster checkout & tracked orders', 'Early access to new collections', 'Exclusive member offers'].map(p => (
                  <li key={p} className="flex items-center gap-3"><span className="grid h-6 w-6 place-items-center rounded-full bg-[#C9A227] text-black"><Check className="h-3.5 w-3.5" /></span>{p}</li>
                ))}
              </ul>
            </div>
            <div className="text-[11px] uppercase tracking-[0.24em] text-white/50">Free — forever</div>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
