'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Building2, Users, Package, Send, Award } from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';

const BENEFITS = [
  { icon: Award, title: 'Custom Engraving', body: 'Logos, employee names or serial numbers laser-engraved on every piece.' },
  { icon: Package, title: 'Premium Packaging', body: 'Bespoke gift boxes and personalized inserts included with every unit.' },
  { icon: Users, title: 'Dedicated Manager', body: 'A single point of contact from artwork approval through delivery.' },
  { icon: Building2, title: 'Volume Pricing', body: 'Tiered pricing from 25 pieces onwards. Enterprise contracts available.' },
];

const PRICE_TIERS = [
  { qty: '25–99', price: '₹799 / piece' },
  { qty: '100–499', price: '₹649 / piece' },
  { qty: '500+', price: 'Custom quote' },
];

export default function CorporatePage() {
  const [form, setForm] = useState({ company: '', name: '', email: '', phone: '', quantity: 100, notes: '' });
  const [sending, setSending] = useState(false);

  const update = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  async function submit(e) {
    e.preventDefault();
    setSending(true);
    try {
      const r = await fetch('/api/corporate', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(form) });
      const data = await r.json();
      if (data.ok) {
        toast.success('Inquiry received', { description: 'Your account manager will reach out shortly.' });
        setForm({ company: '', name: '', email: '', phone: '', quantity: 100, notes: '' });
      } else toast.error(data.error || 'Please check the form');
    } catch { toast.error('Network error'); }
    finally { setSending(false); }
  }

  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <Header variant="light" />

      <section className="container-editorial pt-16 pb-8 md:pt-24">
        <div className="eyebrow flex items-center gap-3"><span className="hairline" />Corporate & Gifting</div>
        <h1 className="mt-4 max-w-3xl font-serif text-5xl leading-[1.05] md:text-7xl">Give something they’ll actually keep.</h1>
        <p className="mt-5 max-w-xl text-neutral-600">Client gifts, employee onboarding, milestone celebrations — corporate Inclex orders come personalized, gift-boxed and delivered on time.</p>
      </section>

      <section className="container-editorial pb-16">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {BENEFITS.map((b) => (
            <div key={b.title} className="rounded-sm border border-black/[0.06] bg-white p-6">
              <span className="grid h-11 w-11 place-items-center rounded-sm border border-black/10 text-[#C9A227]"><b.icon className="h-5 w-5" /></span>
              <div className="mt-4 font-serif text-xl">{b.title}</div>
              <p className="mt-1 text-sm text-neutral-600">{b.body}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container-editorial grid grid-cols-12 gap-10 pb-24">
        <div className="col-span-12 md:col-span-5">
          <div className="rounded-sm border border-black/10 bg-white p-6">
            <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Volume Pricing</div>
            <ul className="mt-4 divide-y divide-black/10">
              {PRICE_TIERS.map((t) => (
                <li key={t.qty} className="flex items-center justify-between py-3">
                  <span className="text-sm text-neutral-600">{t.qty} pieces</span>
                  <span className="font-serif text-lg">{t.price}</span>
                </li>
              ))}
            </ul>
            <p className="mt-5 text-xs text-neutral-500">Prices exclusive of taxes. Turnaround typically 2–4 weeks depending on quantity and personalization complexity.</p>
          </div>

          <div className="mt-6 rounded-sm bg-black p-6 text-white">
            <div className="font-serif text-2xl">Trusted by teams at</div>
            <p className="mt-2 text-sm text-white/70">Startups, agencies, hospitality groups and design studios across India.</p>
            <div className="mt-5 grid grid-cols-3 gap-3 text-center text-[11px] uppercase tracking-[0.18em] text-white/60">
              {['Atrium', 'Halcyon', 'Northlight', 'Quire', 'Studio Ora', 'Verve'].map(x => <div key={x} className="rounded-sm border border-white/10 py-2">{x}</div>)}
            </div>
          </div>
        </div>

        <form onSubmit={submit} className="col-span-12 md:col-span-7 rounded-sm border border-black/10 bg-white p-8 md:p-10">
          <div className="eyebrow flex items-center gap-3"><span className="hairline" />Get a quote</div>
          <h2 className="mt-3 font-serif text-3xl">Tell us about your order</h2>

          <div className="mt-6 grid grid-cols-2 gap-5">
            <Field label="Company" value={form.company} onChange={update('company')} required />
            <Field label="Your Name" value={form.name} onChange={update('name')} />
            <Field label="Work Email" type="email" value={form.email} onChange={update('email')} required />
            <Field label="Phone" value={form.phone} onChange={update('phone')} />
            <Field label="Quantity" type="number" min={25} value={form.quantity} onChange={update('quantity')} />
            <Field label="Timeline" value={form.timeline} onChange={update('timeline')} placeholder="e.g. 4 weeks" />
          </div>

          <div className="mt-5">
            <label className="text-xs uppercase tracking-[0.18em] text-neutral-500">Notes</label>
            <textarea rows={5} value={form.notes} onChange={update('notes')} placeholder="Personalization details, budget, event context…"
              className="mt-2 w-full rounded-sm border border-black/10 bg-white px-4 py-3 focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25" />
          </div>

          <button disabled={sending} className="btn-dark mt-6 w-full md:w-auto">{sending ? 'Sending…' : 'Request Quote'} <Send className="h-4 w-4" /></button>
        </form>
      </section>

      <Footer />
    </main>
  );
}

function Field({ label, ...props }) {
  return (
    <label className="flex flex-col">
      <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">{label}</span>
      <input {...props} className="mt-2 rounded-sm border border-black/10 bg-white px-4 py-3 focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25" />
    </label>
  );
}
