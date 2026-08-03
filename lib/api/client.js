'use client';
// Central fetch wrapper for the client side. Handles JSON, errors, and empty bodies.
import { toast } from 'sonner';

async function request(method, path, body, opts = {}) {
  try {
    const init = { method, headers: { 'Content-Type': 'application/json' }, cache: 'no-store', ...opts };
    if (body !== undefined) init.body = JSON.stringify(body);
    const res = await fetch(path, init);
    const contentType = res.headers.get('content-type') || '';
    const data = contentType.includes('application/json') ? await res.json() : await res.text();
    if (!res.ok) throw new APIError(data?.error || res.statusText, res.status, data);
    return data;
  } catch (e) {
    if (e instanceof APIError) throw e;
    throw new APIError(e.message || 'Network error', 0);
  }
}

export class APIError extends Error {
  constructor(message, status, data) {
    super(message); this.status = status; this.data = data;
  }
}

export const api = {
  get:    (path, opts)       => request('GET', path, undefined, opts),
  post:   (path, body, opts) => request('POST', path, body, opts),
  put:    (path, body, opts) => request('PUT', path, body, opts),
  del:    (path, opts)       => request('DELETE', path, undefined, opts),

  // Wrapper that shows a toast on failure and returns null.
  safe: async (fn, errorLabel = 'Something went wrong') => {
    try { return await fn; }
    catch (e) { toast.error(errorLabel, { description: e.message }); return null; }
  },
};
