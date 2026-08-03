'use client';
// Editorial panel — used across admin editors and settings pages.
export default function Panel({ title, number, children, className = '', actions }) {
  return (
    <section className={`rounded-sm border border-black/10 bg-white p-6 ${className}`}>
      <header className="mb-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          {number && <span className="text-xs font-semibold tracking-[0.24em] text-[#C9A227]">{number}</span>}
          {title && <h3 className="text-xs font-semibold uppercase tracking-[0.18em]">{title}</h3>}
        </div>
        {actions}
      </header>
      <div className="space-y-4">{children}</div>
    </section>
  );
}
