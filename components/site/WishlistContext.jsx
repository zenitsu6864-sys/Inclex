'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';
import { useUser } from './UserContext';

const WishCtx = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useUser();
  const router = useRouter();
  const [ids, setIds] = useState([]);
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const refresh = useCallback(async () => {
    if (!user) { setIds([]); setItems([]); return; }
    setLoading(true);
    try {
      const r = await fetch('/api/wishlist', { cache: 'no-store' });
      const j = await r.json();
      setIds(j.ids || []);
      setItems(j.items || []);
    } catch {}
    finally { setLoading(false); }
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  const has = useCallback((productId) => ids.includes(productId), [ids]);

  const toggle = useCallback(async (product) => {
    if (!user) {
      toast('Sign in to save to wishlist', { description: 'It only takes a moment.' });
      router.push('/login?redirect=' + encodeURIComponent(window.location.pathname));
      return;
    }
    // Optimistic
    const currentlyIn = ids.includes(product.id);
    setIds(prev => currentlyIn ? prev.filter(x => x !== product.id) : [product.id, ...prev]);
    setItems(prev => currentlyIn ? prev.filter(p => p.id !== product.id) : [product, ...prev]);
    try {
      const r = await fetch('/api/wishlist/toggle', {
        method: 'POST', headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ productId: product.id }),
      });
      const j = await r.json();
      if (!r.ok) throw new Error(j.error);
      toast[j.added ? 'success' : 'message'](j.added ? 'Added to wishlist' : 'Removed from wishlist', { description: product.name });
      refresh();
    } catch (e) {
      // Revert
      refresh();
      toast.error(e.message || 'Could not update wishlist');
    }
  }, [user, ids, refresh, router]);

  return (
    <WishCtx.Provider value={{ ids, items, count: ids.length, loading, has, toggle, refresh }}>
      {children}
    </WishCtx.Provider>
  );
}

export function useWishlist() {
  const ctx = useContext(WishCtx);
  if (!ctx) throw new Error('useWishlist must be inside WishlistProvider');
  return ctx;
}
