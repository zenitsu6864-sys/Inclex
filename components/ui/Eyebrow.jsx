// Editorial eyebrow — small uppercase caption with a gold hairline.
export default function Eyebrow({ children, className = '' }) {
  return (
    <div className={`eyebrow flex items-center gap-3 ${className}`}>
      <span className="hairline" />
      {children}
    </div>
  );
}
