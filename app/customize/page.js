'use client';

import { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { ArrowRight, Check, Diamond, Sparkles, ShieldCheck } from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import { useCart } from '@/components/site/CartContext';
import { PRODUCTS } from '@/lib/data/products';

const MATERIALS = [
  { id: 'Leather', label: 'Italian Leather', hint: 'Full-grain, ages beautifully', img: 'https://images.unsplash.com/photo-1676276550349-580c49631496?auto=format&fit=crop&w=800&q=85' },
  { id: 'Carbon Fiber', label: 'Carbon Fiber', hint: 'Aerospace-grade, ultra light', img: 'https://images.pexels.com/photos/28028334/pexels-photo-28028334.jpeg?auto=compress&cs=tinysrgb&w=800&q=85' },
  { id: 'Metal', label: 'Machined Steel', hint: 'CNC billet, hand-finished', img: 'https://images.unsplash.com/photo-1599066852653-42826a50b163?auto=format&fit=crop&w=800&q=85' },
];

const COLORS = {
  Leather: [
    { name: 'Black', hex: '#111' }, { name: 'Cognac', hex: '#7A3B18' }, { name: 'Espresso', hex: '#3E2416' }, { name: 'Tan', hex: '#B0824E' },
  ],
  'Carbon Fiber': [{ name: 'Black', hex: '#0F0F0F' }, { name: 'Gunmetal', hex: '#4B4F54' }],
  Metal: [{ name: 'Silver', hex: '#C0C4C8' }, { name: 'Gunmetal', hex: '#4B4F54' }, { name: 'Gold', hex: '#C9A227' }],
};

const FONTS = [
  { id: 'serif', label: 'Elegant Serif', className: 'font-serif italic' },
  { id: 'sans', label: 'Modern Sans', className: 'font-sans font-light tracking-[0.32em]' },
  { id: 'script', label: 'Signature Script', className: 'font-serif italic tracking-tight' },
];

const FINISHES = [
  { id: 'matte', label: 'Matte' },
  { id: 'satin', label: 'Satin' },
  { id: 'gloss', label: 'Gloss' },
];

export default function CustomizePage() {
  const [material, setMaterial] = useState('Leather');
  const [color, setColor] = useState('Black');
  const [finish, setFinish] = useState('matte');
  const [font, setFont] = useState('serif');
  const [engraving, setEngraving] = useState('Aditya');
  const [saving, setSaving] = useState(false);
  const { add } = useCart();

  const materialData = MATERIALS.find((m) => m.id === material);
  const price = useMemo(() => (material === 'Metal' ? 1499 : material === 'Carbon Fiber' ? 1199 : 899), [material]);

  const fontClass = FONTS.find((f) => f.id === font)?.className || '';

  const targetProduct = PRODUCTS.find((p) => p.material === material) || PRODUCTS[0];

  async function save() {
    setSaving(true);
    try {
      const r = await fetch('/api/customize', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ engraving, material, color, finish, font, productId: targetProduct.id }),
      });
      const data = await r.json();
      if (data.ok) {
        add(targetProduct, { color, engraving, qty: 1 });
      } else toast.error(data.error || 'Could not save');
    } catch { toast.error('Network error'); }
    finally { setSaving(false); }
  }

  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <Header variant="light" />

      {/* Hero */}
      <section className="container-editorial pt-12 pb-8 md:pt-16">
        <div className="eyebrow flex items-center gap-3"><span className="hairline" />Bespoke Studio</div>
        <h1 className="mt-4 max-w-2xl font-serif text-4xl leading-[1.05] tracking-tight md:text-6xl">Design a keychain that’s unmistakably yours.</h1>
        <p className="mt-4 max-w-xl text-neutral-600">Choose material, color, finish and engraving. Preview updates live — crafted and shipped from our atelier in 3–5 business days.</p>
      </section>

      <section className="container-editorial grid grid-cols-12 gap-10 pb-24">
        {/* Preview */}
        <div className="col-span-12 lg:col-span-7">
          <div className="sticky top-28 overflow-hidden rounded-sm bg-black text-white ring-1 ring-white/10 shadow-[0_40px_100px_-40px_rgba(0,0,0,0.5)]">
            <div className="relative aspect-[4/5] w-full overflow-hidden">
              <motion.img key={material} src={materialData?.img} alt={material}
                initial={{ opacity: 0, scale: 1.05 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.8 }}
                className="absolute inset-0 h-full w-full object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              <div className="absolute inset-0 grain" />

              {/* Engraving preview */}
              <div className="absolute inset-x-0 bottom-24 flex justify-center">
                <motion.span key={engraving + font + color}
                  initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}
                  className={`${fontClass} text-3xl md:text-5xl`}
                  style={{ color: COLORS[material].find(c => c.name === color)?.hex === '#0F0F0F' ? '#C9A227' : '#C9A227', textShadow: '0 4px 24px rgba(0,0,0,0.5)' }}>
                  {engraving || 'Your Name'}
                </motion.span>
              </div>

              {/* Meta */}
              <div className="absolute left-6 top-6 rounded-sm bg-black/50 px-3 py-1.5 text-[10px] uppercase tracking-[0.22em] backdrop-blur">Live Preview</div>
              <div className="absolute bottom-6 left-6 text-xs uppercase tracking-[0.22em] text-white/70">
                {material} • {color} • {finish}
              </div>
              <div className="absolute bottom-6 right-6 font-serif text-xl">₹{new Intl.NumberFormat('en-IN').format(price)}</div>
            </div>
          </div>
        </div>

        {/* Options */}
        <div className="col-span-12 lg:col-span-5 space-y-8">
          <StudioSection number="01" title="Material">
            <div className="grid grid-cols-3 gap-3">
              {MATERIALS.map((m) => (
                <button key={m.id} onClick={() => { setMaterial(m.id); setColor(COLORS[m.id][0].name); }} className={`overflow-hidden rounded-sm border text-left transition ${material === m.id ? 'border-black shadow-[0_10px_30px_-10px_rgba(0,0,0,0.25)]' : 'border-black/10 hover:border-black/30'}`}>
                  <div className="aspect-square overflow-hidden bg-[#EFEDE7]"><img src={m.img} alt={m.label} className="h-full w-full object-cover" /></div>
                  <div className="p-3">
                    <div className="text-sm font-semibold">{m.label}</div>
                    <div className="text-[11px] text-neutral-500">{m.hint}</div>
                  </div>
                </button>
              ))}
            </div>
          </StudioSection>

          <StudioSection number="02" title={`Color — ${color}`}>
            <div className="flex flex-wrap gap-2">
              {COLORS[material].map((c) => (
                <button key={c.name} onClick={() => setColor(c.name)} title={c.name}
                  className={`inline-flex items-center gap-2 rounded-sm border px-3 py-2 text-xs uppercase tracking-[0.14em] transition ${color === c.name ? 'border-black bg-black text-white' : 'border-black/15 hover:border-black'}`}>
                  <span className="h-3 w-3 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} /> {c.name}
                </button>
              ))}
            </div>
          </StudioSection>

          <StudioSection number="03" title="Finish">
            <div className="grid grid-cols-3 gap-2">
              {FINISHES.map((f) => (
                <button key={f.id} onClick={() => setFinish(f.id)} className={`rounded-sm border py-3 text-sm uppercase tracking-[0.14em] transition ${finish === f.id ? 'border-black bg-black text-white' : 'border-black/15 hover:border-black'}`}>{f.label}</button>
              ))}
            </div>
          </StudioSection>

          <StudioSection number="04" title="Engraving Font">
            <div className="grid grid-cols-1 gap-2">
              {FONTS.map((f) => (
                <button key={f.id} onClick={() => setFont(f.id)} className={`flex items-center justify-between rounded-sm border px-4 py-3 text-left transition ${font === f.id ? 'border-black bg-black text-white' : 'border-black/15 hover:border-black'}`}>
                  <span className="text-xs uppercase tracking-[0.16em]">{f.label}</span>
                  <span className={`${f.className} text-xl`} style={{ color: font === f.id ? '#C9A227' : '#111' }}>{engraving || 'Aa'}</span>
                </button>
              ))}
            </div>
          </StudioSection>

          <StudioSection number="05" title="Your Text">
            <div className="flex items-center justify-between mb-2">
              <label htmlFor="eng" className="text-xs uppercase tracking-[0.18em] text-neutral-500">Up to 16 characters</label>
              <span className="text-[11px] text-neutral-400">{engraving.length}/16</span>
            </div>
            <input id="eng" value={engraving} maxLength={16} onChange={(e) => setEngraving(e.target.value)}
              placeholder="Your name or initials"
              className="w-full rounded-sm border border-black/10 bg-white px-4 py-3 focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25" />
          </StudioSection>

          <div className="rounded-sm border border-black/10 bg-white p-5">
            <div className="flex items-center justify-between">
              <div>
                <div className="text-xs uppercase tracking-[0.18em] text-neutral-500">Total</div>
                <div className="font-serif text-3xl">₹{new Intl.NumberFormat('en-IN').format(price)}</div>
              </div>
              <ul className="text-xs text-neutral-500 space-y-1">
                <li className="flex items-center gap-1"><Check className="h-3 w-3 text-[#C9A227]" /> Ships in 3–5 days</li>
                <li className="flex items-center gap-1"><Check className="h-3 w-3 text-[#C9A227]" /> Lifetime finish</li>
                <li className="flex items-center gap-1"><Check className="h-3 w-3 text-[#C9A227]" /> Personalized — no returns</li>
              </ul>
            </div>
            <button onClick={save} disabled={saving} className="btn-gold mt-5 w-full">
              {saving ? 'Saving…' : 'Add to Bag'} <ArrowRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}

function StudioSection({ number, title, children }) {
  return (
    <div>
      <div className="mb-3 flex items-center gap-3">
        <span className="text-xs font-semibold tracking-[0.24em] text-[#C9A227]">{number}</span>
        <span className="text-sm font-semibold uppercase tracking-[0.18em]">{title}</span>
      </div>
      {children}
    </div>
  );
}
