'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Script from 'next/script';
import { toast } from 'sonner';
import { Check, Truck, ShieldCheck, ArrowRight, LogIn, CreditCard } from 'lucide-react';
import Header from '@/components/site/Header';
import Footer from '@/components/site/Footer';
import { useCart } from '@/components/site/CartContext';
import { useUser } from '@/components/site/UserContext';

const fmt = (n) => new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n);

function loadRazorpay() {
  return new Promise((resolve) => {
    if (typeof window === 'undefined') return resolve(false);
    if (window.Razorpay) return resolve(true);
    const s = document.createElement('script');
    s.src = 'https://checkout.razorpay.com/v1/checkout.js';
    s.onload = () => resolve(true);
    s.onerror = () => resolve(false);
    document.body.appendChild(s);
  });
}

export default function CheckoutPage() {
  const { items, subtotal, clear } = useCart();
  const { user } = useUser();
  const [customer, setCustomer] = useState({ name: '', email: '', phone: '', address: '', city: '', state: '', pincode: '' });
  const [payment, setPayment] = useState('cod');
  const [placing, setPlacing] = useState(false);
  const [order, setOrder] = useState(null);

  // Pre-fill from signed-in user
  useEffect(() => {
    if (user) {
      setCustomer((c) => ({
        ...c,
        name: c.name || user.name || '',
        email: c.email || user.email || '',
        phone: c.phone || user.phone || '',
        ...(user.address || {}),
      }));
    }
  }, [user]);

  const shipping = subtotal >= 499 || subtotal === 0 ? 0 : 49;
  const total = subtotal + shipping;

  const update = (k) => (e) => setCustomer((c) => ({ ...c, [k]: e.target.value }));

  async function place(e) {
    e.preventDefault();
    if (items.length === 0) return toast.error('Your bag is empty');
    setPlacing(true);
    try {
      const r = await fetch('/api/checkout', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ items, customer, subtotal, shipping, total, payment }),
      });
      const data = await r.json();
      if (!r.ok || !data.ok) {
        toast.error(data.error || 'Could not place order');
        setPlacing(false);
        return;
      }

      // COD → confirmation immediately
      if (data.gateway === 'cod') {
        setOrder(data); clear();
        toast.success('Order placed!', { description: data.orderNumber });
        setPlacing(false);
        return;
      }

      // Razorpay → open modal
      if (data.gateway === 'razorpay') {
        const ok = await loadRazorpay();
        if (!ok) { toast.error('Payment SDK failed to load'); setPlacing(false); return; }
        const rzp = new window.Razorpay({
          key: data.keyId,
          amount: data.amount,
          currency: data.currency,
          name: 'Inclex',
          description: `Order ${data.orderNumber}`,
          order_id: data.razorpayOrderId,
          prefill: { name: customer.name, email: customer.email, contact: customer.phone },
          theme: { color: '#111111' },
          image: undefined,
          modal: { ondismiss: () => { setPlacing(false); toast('Payment cancelled', { description: 'Your order is on hold. Retry anytime.' }); } },
          handler: async (resp) => {
            try {
              const v = await fetch('/api/checkout/verify', {
                method: 'POST', headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ orderId: data.orderId, ...resp }),
              });
              const vj = await v.json();
              if (v.ok && vj.ok) {
                setOrder({ ok: true, id: data.orderId, orderNumber: data.orderNumber, paid: true });
                clear();
                toast.success('Payment successful', { description: data.orderNumber });
              } else toast.error(vj.error || 'Payment verification failed');
            } catch { toast.error('Payment verification failed'); }
            finally { setPlacing(false); }
          },
        });
        rzp.open();
        return;
      }
    } catch { toast.error('Network error'); setPlacing(false); }
  }

  if (order) {
    return (
      <main className="min-h-screen bg-[#F8F7F4]">
        <Header variant="light" />
        <section className="container-editorial grid place-items-center py-32 text-center">
          <div className="grid h-20 w-20 place-items-center rounded-full bg-[#C9A227]/15 text-[#C9A227]"><Check className="h-9 w-9" /></div>
          <h1 className="mt-8 font-serif text-5xl">Thank you.</h1>
          <p className="mt-3 max-w-md text-neutral-600">Your order <b className="text-black">{order.orderNumber}</b> has been placed. A confirmation has been sent to your email with the tracking link.</p>
          <div className="mt-10 flex gap-3">
            <Link href="/shop" className="btn-dark">Continue Shopping <ArrowRight className="h-4 w-4" /></Link>
            <Link href="/" className="inline-flex items-center gap-2 rounded-sm border border-black/10 bg-white px-6 py-3.5 text-sm font-semibold">Back to Home</Link>
          </div>
        </section>
        <Footer />
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-[#F8F7F4]">
      <Header variant="light" />

      <section className="container-editorial py-12 md:py-16">
        <h1 className="font-serif text-4xl md:text-5xl">Checkout</h1>
        <p className="mt-2 text-sm text-neutral-500">Free shipping on orders above ₹499 • Secure checkout</p>

        <form onSubmit={place} className="mt-10 grid grid-cols-12 gap-8">
          <div className="col-span-12 lg:col-span-7 space-y-8">
            {!user && (
              <div className="flex flex-wrap items-center justify-between gap-3 rounded-sm border border-black/10 bg-white p-4">
                <div className="flex items-center gap-3">
                  <span className="grid h-9 w-9 place-items-center rounded-sm bg-[#F8F7F4] text-[#C9A227]"><LogIn className="h-4 w-4" /></span>
                  <div><div className="text-sm font-semibold">Have an account?</div><div className="text-xs text-neutral-500">Sign in for faster checkout and to save this order to your profile.</div></div>
                </div>
                <Link href="/login?redirect=%2Fcheckout" className="inline-flex items-center gap-2 rounded-sm border border-black/10 bg-white px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] hover:border-black">Sign in <ArrowRight className="h-3.5 w-3.5" /></Link>
              </div>
            )}
            {user && (
              <div className="flex items-center gap-3 rounded-sm border border-emerald-100 bg-emerald-50/50 p-4">
                <span className="grid h-9 w-9 place-items-center rounded-sm bg-emerald-100 text-emerald-700"><Check className="h-4 w-4" /></span>
                <div className="text-sm">Signed in as <b>{user.name}</b> ({user.email}) — this order will be saved to your account.</div>
              </div>
            )}
            <Panel title="Contact" number="01">
              <div className="grid grid-cols-2 gap-4">
                <Field label="Full name" value={customer.name} onChange={update('name')} required />
                <Field label="Email" type="email" value={customer.email} onChange={update('email')} required />
                <Field label="Phone" value={customer.phone} onChange={update('phone')} required />
              </div>
            </Panel>
            <Panel title="Shipping Address" number="02">
              <Field label="Address" value={customer.address} onChange={update('address')} required />
              <div className="grid grid-cols-3 gap-4 mt-4">
                <Field label="City" value={customer.city} onChange={update('city')} required />
                <Field label="State" value={customer.state} onChange={update('state')} required />
                <Field label="Pincode" value={customer.pincode} onChange={update('pincode')} required />
              </div>
            </Panel>
            <Panel title="Payment" number="03">
              <div className="grid gap-2">
                {[
                  { id: 'razorpay', label: 'UPI / Cards / Netbanking / Wallet', hint: 'Secure payment via Razorpay — instant confirmation' },
                  { id: 'cod', label: 'Cash on Delivery', hint: 'Pay when your order arrives' },
                ].map(p => (
                  <label key={p.id} className={`flex items-center justify-between rounded-sm border px-4 py-3 cursor-pointer transition ${payment === p.id ? 'border-black bg-black text-white' : 'border-black/10 bg-white hover:border-black'}`}>
                    <div>
                      <div className="text-sm font-semibold inline-flex items-center gap-2">{p.id === 'razorpay' && <CreditCard className="h-4 w-4" />} {p.label}</div>
                      <div className="text-xs opacity-70">{p.hint}</div>
                    </div>
                    <input type="radio" name="pay" checked={payment === p.id} onChange={() => setPayment(p.id)} className="accent-[#C9A227]" />
                  </label>
                ))}
              </div>
            </Panel>
          </div>

          <aside className="col-span-12 lg:col-span-5">
            <div className="sticky top-28 rounded-sm border border-black/10 bg-white p-6">
              <div className="text-xs uppercase tracking-[0.2em] text-neutral-500">Order Summary</div>

              {items.length === 0 ? (
                <div className="py-10 text-center text-sm text-neutral-500">
                  Your bag is empty. <Link href="/shop" className="underline">Shop the collection</Link>
                </div>
              ) : (
                <ul className="mt-4 divide-y divide-black/10">
                  {items.map(it => (
                    <li key={it.key} className="flex gap-3 py-3">
                      <img src={it.image} alt={it.name} className="h-16 w-16 rounded-sm object-cover" />
                      <div className="flex-1">
                        <div className="font-serif text-base leading-tight">{it.name}</div>
                        <div className="text-[11px] text-neutral-500">{it.color}{it.engraving ? ` • “${it.engraving}”` : ''} × {it.qty}</div>
                      </div>
                      <div className="text-sm font-semibold">₹{fmt(it.price * it.qty)}</div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-5 space-y-2 text-sm">
                <Row label="Subtotal" value={`₹${fmt(subtotal)}`} />
                <Row label="Shipping" value={shipping === 0 ? 'Free' : `₹${fmt(shipping)}`} />
                <div className="mt-2 flex items-center justify-between border-t border-black/10 pt-3">
                  <span className="font-serif text-lg">Total</span>
                  <span className="font-serif text-2xl">₹{fmt(total)}</span>
                </div>
              </div>

              <button disabled={placing || items.length === 0} className="btn-dark mt-6 w-full">{placing ? 'Placing…' : 'Place Order'} <ArrowRight className="h-4 w-4" /></button>

              <div className="mt-5 grid grid-cols-2 gap-3 text-[11px]">
                <div className="flex items-start gap-2"><Truck className="h-4 w-4 text-[#C9A227]" /><span>Free shipping above ₹499</span></div>
                <div className="flex items-start gap-2"><ShieldCheck className="h-4 w-4 text-[#C9A227]" /><span>Secure checkout</span></div>
              </div>
            </div>
          </aside>
        </form>
      </section>

      <Footer />
    </main>
  );
}

function Panel({ number, title, children }) {
  return (
    <div className="rounded-sm border border-black/10 bg-white p-6 md:p-8">
      <div className="flex items-center gap-3">
        <span className="text-xs font-semibold tracking-[0.24em] text-[#C9A227]">{number}</span>
        <span className="font-serif text-xl">{title}</span>
      </div>
      <div className="mt-5">{children}</div>
    </div>
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

function Row({ label, value }) {
  return (
    <div className="flex items-center justify-between text-neutral-600"><span>{label}</span><span className="font-medium text-black">{value}</span></div>
  );
}
