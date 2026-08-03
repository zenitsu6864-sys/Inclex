// Order/product/content status pill. Consistent colors across the app.
const STYLES = {
  // Orders
  placed:    'bg-blue-50 text-blue-700',
  confirmed: 'bg-indigo-50 text-indigo-700',
  packed:    'bg-purple-50 text-purple-700',
  shipped:   'bg-amber-50 text-amber-700',
  delivered: 'bg-emerald-50 text-emerald-700',
  cancelled: 'bg-neutral-100 text-neutral-600',
  returned:  'bg-rose-50 text-rose-700',
  refunded:  'bg-rose-50 text-rose-700',
  // Products / CMS
  published: 'bg-emerald-50 text-emerald-700',
  draft:     'bg-amber-50 text-amber-700',
  archived:  'bg-neutral-100 text-neutral-600',
  paid:      'bg-emerald-50 text-emerald-700',
  created:   'bg-blue-50 text-blue-700',
  pending_cod: 'bg-amber-50 text-amber-700',
};

export default function StatusBadge({ status, className = '' }) {
  const style = STYLES[status] || 'bg-neutral-100 text-neutral-700';
  return (
    <span className={`inline-flex rounded-sm px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.12em] ${style} ${className}`}>
      {String(status || '').replace(/_/g, ' ')}
    </span>
  );
}
