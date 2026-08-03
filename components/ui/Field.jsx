'use client';
// Labeled input — the single Field pattern used across every form on the site.
export default function Field({
  label, value, onChange, type = 'text',
  placeholder, required, disabled, minLength, maxLength, min, max, name,
  className = '', inputClassName = '',
  icon: Icon, hint, error,
}) {
  const handle = (e) => {
    if (!onChange) return;
    // Accept both plain values and event objects
    onChange(e?.target ? e.target.value : e);
  };
  return (
    <label className={`block ${className}`}>
      {label && <span className="text-xs uppercase tracking-[0.18em] text-neutral-500">{label}</span>}
      <div className={`relative ${label ? 'mt-2' : ''}`}>
        {Icon && <Icon className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />}
        <input
          name={name} type={type} value={value ?? ''} onChange={handle}
          placeholder={placeholder} required={required} disabled={disabled}
          minLength={minLength} maxLength={maxLength} min={min} max={max}
          className={`w-full rounded-sm border border-black/10 bg-white ${Icon ? 'pl-10' : 'pl-4'} pr-4 py-3 text-sm focus:border-[#C9A227] focus:outline-none focus:ring-2 focus:ring-[#C9A227]/25 ${disabled ? 'bg-neutral-50 text-neutral-500' : ''} ${inputClassName}`}
        />
      </div>
      {hint && !error && <p className="mt-1 text-[11px] text-neutral-500">{hint}</p>}
      {error && <p className="mt-1 text-[11px] text-red-600">{error}</p>}
    </label>
  );
}
