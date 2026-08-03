'use client';
import { createContext, useContext, useEffect, useMemo, useState, useCallback } from 'react';
import { toast } from 'sonner';

const CartCtx = createContext(null);
const KEY = 'inclex.cart.v1';

export function CartProvider({ children }) {
  const [items, setItems] = useState([]);
  const [open, setOpen] = useState(false);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setItems(JSON.parse(raw));
    } catch {}
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    try { localStorage.setItem(KEY, JSON.stringify(items)); } catch {}
  }, [items, ready]);

  const add = useCallback((product, opts = {}) => {
    setItems((prev) => {
      const key = `${product.id}|${opts.color || ''}|${opts.engraving || ''}`;
      const found = prev.find((p) => p.key === key);
      if (found) return prev.map((p) => (p.key === key ? { ...p, qty: p.qty + (opts.qty || 1) } : p));
      return [
        ...prev,
        {
          key,
          id: product.id,
          slug: product.slug,
          name: product.name,
          subtitle: product.subtitle,
          price: product.price,
          image: product.images?.[0],
          color: opts.color || product.colors?.[0] || '',
          engraving: opts.engraving || '',
          qty: opts.qty || 1,
        },
      ];
    });
    toast.success('Added to bag', { description: product.name });
    setOpen(true);
  }, []);

  const remove = useCallback((key) => {
    setItems((prev) => prev.filter((p) => p.key !== key));
  }, []);

  const setQty = useCallback((key, qty) => {
    setItems((prev) => prev.map((p) => (p.key === key ? { ...p, qty: Math.max(1, qty) } : p)));
  }, []);

  const clear = useCallback(() => setItems([]), []);

  const value = useMemo(() => {
    const count = items.reduce((n, p) => n + p.qty, 0);
    const subtotal = items.reduce((n, p) => n + p.qty * p.price, 0);
    return { items, count, subtotal, add, remove, setQty, clear, open, setOpen };
  }, [items, add, remove, setQty, clear, open]);

  return <CartCtx.Provider value={value}>{children}</CartCtx.Provider>;
}

export function useCart() {
  const ctx = useContext(CartCtx);
  if (!ctx) throw new Error('useCart must be used inside CartProvider');
  return ctx;
}
