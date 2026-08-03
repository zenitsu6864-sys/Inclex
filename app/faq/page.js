'use client';

import { useState } from 'react';
import { ChevronDown, Search } from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';

const FAQS = [
  { q: 'How long does personalization take?', a: 'Personalized orders ship within 3–5 business days from our Bengaluru atelier. Non-personalized pieces ship same or next business day.' },
  { q: 'What is your return policy?', a: 'Non-personalized items can be returned within 14 days in unused, original condition. Personalized and engraved pieces are final sale.' },
  { q: 'Is Cash on Delivery available?', a: 'Yes. COD is available on orders below ₹5,000 across serviceable pincodes in India.' },
  { q: 'How do I track my order?', a: 'You’ll receive an email and SMS with a live tracking link within 24 hours of dispatch.' },
  { q: 'Do you ship internationally?', a: 'International retail shipping is coming soon. For corporate orders, international logistics can be arranged today — contact us for a quote.' },
  { q: 'What materials do you use?', a: 'Full-grain vegetable-tanned Italian leather, 316L stainless steel, aerospace-grade carbon fiber and Grade-5 titanium hardware.' },
  { q: 'How do I care for my leather keychain?', a: 'Wipe with a dry, soft cloth. Avoid prolonged water exposure. Leather develops a natural patina over time — this is a feature, not a flaw.' },
  { q: 'Can I engrave a logo?', a: 'Yes. Upload a vector (.svg/.pdf) via the corporate form. Our design team will confirm placement before production.' },
];

export default function FaqPage() {
  const [q, setQ] = useState('');
  const [open, setOpen] = useState(0);
  const filtered = FAQS.filter(f => (f.q + ' ' + f.a).toLowerCase().includes(q.toLowerCase()));

  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <Header variant="light" />

      <section className="container-editorial py-16 md:py-24">
        <div className="mx-auto max-w-3xl text-center">
          <div className="eyebrow inline-flex items-center gap-3 justify-center"><span className="hairline" />Frequently Asked</div>
          <h1 className="mt-4 font-serif text-5xl md:text-6xl">Questions, answered.</h1>
          <p className="mt-4 text-neutral-600">Can’t find what you’re looking for? Reach us at support@inclex.com</p>

          <div className="relative mx-auto mt-8 max-w-lg">
            <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
            <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search questions…"
              className="w-full rounded-sm border border-black/10 bg-white pl-11 pr-4 py-3.5 focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25" />
          </div>
        </div>

        <div className="mx-auto mt-14 max-w-3xl divide-y divide-black/10 rounded-sm border border-black/10 bg-white">
          {filtered.map((f, i) => (
            <button key={f.q} onClick={() => setOpen(open === i ? -1 : i)} className="w-full text-left">
              <div className="flex items-start justify-between gap-4 px-6 py-5">
                <span className="font-serif text-lg md:text-xl">{f.q}</span>
                <ChevronDown className={`h-5 w-5 flex-shrink-0 text-neutral-500 transition-transform ${open === i ? 'rotate-180 text-[#C9A227]' : ''}`} />
              </div>
              {open === i && (
                <div className="px-6 pb-6 -mt-1 text-sm leading-relaxed text-neutral-600">{f.a}</div>
              )}
            </button>
          ))}
          {filtered.length === 0 && (
            <div className="px-6 py-10 text-center text-sm text-neutral-500">No results. Try a different keyword.</div>
          )}
        </div>
      </section>

      <Footer />
    </main>
  );
}
