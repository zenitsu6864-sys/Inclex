'use client';
import { createContext, useCallback, useContext, useEffect, useState } from 'react';

const UserCtx = createContext(null);

export function UserProvider({ children }) {
  const [user, setUser] = useState(null);
  const [ready, setReady] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const r = await fetch('/api/auth/me', { cache: 'no-store' });
      const j = await r.json();
      setUser(j.user || null);
    } catch { setUser(null); }
    finally { setReady(true); }
  }, []);

  useEffect(() => { refresh(); }, [refresh]);

  async function logout() {
    await fetch('/api/auth/logout', { method: 'POST' });
    setUser(null);
  }

  return <UserCtx.Provider value={{ user, ready, refresh, setUser, logout }}>{children}</UserCtx.Provider>;
}

export function useUser() {
  const ctx = useContext(UserCtx);
  if (!ctx) throw new Error('useUser must be inside UserProvider');
  return ctx;
}
