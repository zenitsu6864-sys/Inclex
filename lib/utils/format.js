// Format helpers used across the site + admin.
export const fmtINR = (n) =>
  new Intl.NumberFormat('en-IN', { maximumFractionDigits: 0 }).format(n || 0);

export const fmtDate = (iso) => {
  if (!iso) return '';
  try { return new Date(iso).toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' }); }
  catch { return ''; }
};

export const fmtDateTime = (iso) => {
  if (!iso) return '';
  try { return new Date(iso).toLocaleString('en-IN'); }
  catch { return ''; }
};

export const escapeHtml = (s) =>
  String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

export const slugify = (s) =>
  String(s || '').toLowerCase().trim().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

export const initials = (nameOrEmail = '') => (nameOrEmail || 'U').trim().charAt(0).toUpperCase();
