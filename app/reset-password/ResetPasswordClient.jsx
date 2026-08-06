'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Lock, ArrowRight, Eye, EyeOff, Check } from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';

export default function ResetPasswordClient() {
  const router = useRouter();
  const params = useSearchParams();
  const token = params.get('token') || '';
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  async function submit(e) {
    e.preventDefault();
    if (password !== confirm) return toast.error('Passwords do not match');
    setLoading(true);
    try {
      const r = await fetch('/api/auth/reset', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token, password }) });
      const data = await r.json();
      if (r.ok && data.ok) { setDone(true); toast.success('Password updated', { description: 'Sign in with your new password.' }); setTimeout(() => router.push('/login'), 2200); }
      else toast.error(data.error || 'Reset failed');
    } catch { toast.error('Network error'); }
    finally { setLoading(false); }
  }

  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <Header variant="light" />
      <section className="container-editorial grid min-h-[calc(100vh-9rem)] place-items-center py-16">
        <div className="w-full max-w-md rounded-sm border border-black/10 bg-white p-8 md:p-10">
          {!token ? (
            <>
              <div className="eyebrow flex items-center gap-3"><span className="hairline" />Missing Token</div>
              <h1 className="mt-4 font-serif text-3xl">Invalid link</h1>
              <p className="mt-2 text-sm text-neutral-500">This reset link is missing or malformed. Request a new one.</p>
              <Link href="/forgot-password" className="btn-dark mt-6">Request Reset Link <ArrowRight className="h-4 w-4" /></Link>
            </>
          ) : done ? (
            <div>
              <div className="grid h-14 w-14 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check className="h-6 w-6" /></div>
              <h1 className="mt-4 font-serif text-3xl">Password updated</h1>
              <p className="mt-2 text-sm text-neutral-500">Redirecting to sign in…</p>
            </div>
          ) : (
            <>
              <div className="eyebrow flex items-center gap-3"><span className="hairline" />Set New Password</div>
              <h1 className="mt-4 font-serif text-4xl leading-tight">Almost there.</h1>
              <p className="mt-2 text-sm text-neutral-500">Choose a strong new password (at least 6 characters).</p>
              <form onSubmit={submit} className="mt-8 space-y-4">
                <label className="block">
                  <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">New password</span>
                  <div className="relative mt-2">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <input type={show ? 'text' : 'password'} required minLength={6} value={password} onChange={e => setPassword(e.target.value)} className="w-full rounded-sm border border-black/10 bg-white pl-10 pr-10 py-3 focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25" />
                    <button type="button" onClick={() => setShow(v => !v)} className="absolute right-2 top-1/2 -translate-y-1/2 rounded-sm p-1.5 text-neutral-400 hover:text-black">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
                  </div>
                </label>
                <label className="block">
                  <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">Confirm password</span>
                  <div className="relative mt-2">
                    <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                    <input type={show ? 'text' : 'password'} required minLength={6} value={confirm} onChange={e => setConfirm(e.target.value)} className="w-full rounded-sm border border-black/10 bg-white pl-10 pr-4 py-3 focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25" />
                  </div>
                </label>
                <button disabled={loading} className="btn-dark w-full">{loading ? 'Updating…' : 'Update Password'} <ArrowRight className="h-4 w-4" /></button>
              </form>
            </>
          )}
        </div>
      </section>
      <Footer />
    </main>
  );
}
