'use client';

import { useState } from 'react';
import Link from 'next/link';
import { toast } from 'sonner';
import { Mail, ArrowRight, Check } from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [devUrl, setDevUrl] = useState('');

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    try {
      const r = await fetch('/api/auth/forgot', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email }) });
      const data = await r.json();
      if (r.ok && data.ok) {
        setSent(true);
        setDevUrl(data.devResetUrl || '');
        toast.success('Check your email', { description: 'If an account exists we’ve sent a reset link.' });
      } else toast.error(data.error || 'Something went wrong');
    } catch { toast.error('Network error'); }
    finally { setLoading(false); }
  }

  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <Header variant="light" />
      <section className="container-editorial grid min-h-[calc(100vh-9rem)] place-items-center py-16">
        <div className="w-full max-w-md rounded-sm border border-black/10 bg-white p-8 md:p-10">
          <div className="eyebrow flex items-center gap-3"><span className="hairline" />Reset Password</div>
          <h1 className="mt-4 font-serif text-4xl leading-tight">Forgot your password?</h1>
          <p className="mt-2 text-sm text-neutral-500">Enter your email and we’ll send you a link to set a new one.</p>

          {!sent ? (
            <form onSubmit={submit} className="mt-8 space-y-4">
              <label className="block">
                <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">Email</span>
                <div className="relative mt-2">
                  <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} placeholder="you@domain.com" className="w-full rounded-sm border border-black/10 bg-white pl-10 pr-4 py-3 focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25" />
                </div>
              </label>
              <button disabled={loading} className="btn-dark w-full">{loading ? 'Sending…' : 'Send Reset Link'} <ArrowRight className="h-4 w-4" /></button>
            </form>
          ) : (
            <div className="mt-8 rounded-sm border border-emerald-100 bg-emerald-50/50 p-5">
              <div className="flex items-center gap-3"><span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-100 text-emerald-700"><Check className="h-4 w-4" /></span><div className="font-serif text-lg">Check your inbox</div></div>
              <p className="mt-3 text-sm text-neutral-600">If an account with <b className="text-black">{email}</b> exists, a reset link has been sent. It’s valid for 30 minutes.</p>
              {devUrl && (<div className="mt-4 rounded-sm border border-dashed border-black/10 bg-white/60 p-3 text-[11px] text-neutral-500"><b>DEV mode</b> (email service not configured): <a className="break-all text-black underline" href={devUrl}>{devUrl}</a></div>)}
            </div>
          )}

          <p className="mt-8 text-center text-sm text-neutral-600">Remembered it? <Link href="/login" className="font-semibold text-black hover:text-[#C9A227]">Sign in</Link></p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
