// Editorial empty-state card used across account/admin lists.
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

export default function EmptyState({
  icon: Icon, title, description, ctaLabel, ctaHref, children,
  bordered = true,
}) {
  return (
    <div className={`grid place-items-center px-6 py-16 text-center bg-white ${bordered ? 'rounded-sm border border-dashed border-black/10' : ''}`}>
      {Icon && (
        <div className="grid h-16 w-16 place-items-center rounded-full bg-[#F8F7F4] text-[#C9A227]">
          <Icon className="h-6 w-6" />
        </div>
      )}
      {title && <p className="mt-6 font-serif text-3xl">{title}</p>}
      {description && <p className="mt-2 max-w-md text-sm text-neutral-500">{description}</p>}
      {ctaLabel && ctaHref && (
        <Link href={ctaHref} className="btn-dark mt-8">{ctaLabel} <ArrowRight className="h-4 w-4" /></Link>
      )}
      {children}
    </div>
  );
}
