'use client';
import { Toaster } from 'sonner';
import { CartProvider } from '@/components/site/CartContext';
import CartDrawer from '@/components/site/CartDrawer';
import { UserProvider } from '@/components/site/UserContext';
import { WishlistProvider } from '@/components/site/WishlistContext';

export function Providers({ children }) {
  return (
    <UserProvider>
      <WishlistProvider>
        <CartProvider>
          {children}
          <CartDrawer />
          <Toaster position="bottom-right" theme="light" richColors closeButton />
        </CartProvider>
      </WishlistProvider>
    </UserProvider>
  );
}
