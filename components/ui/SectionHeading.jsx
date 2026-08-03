import Eyebrow from './Eyebrow';

// Standard editorial section heading — Eyebrow + Playfair headline + optional lead paragraph.
export default function SectionHeading({ eyebrow, title, description, className = '', center }) {
  return (
    <header className={`${center ? 'text-center mx-auto max-w-3xl' : ''} ${className}`}>
      {eyebrow && <Eyebrow className={center ? 'justify-center' : ''}>{eyebrow}</Eyebrow>}
      {title && <h2 className="mt-4 font-serif text-4xl leading-tight md:text-5xl">{title}</h2>}
      {description && <p className="mt-3 max-w-2xl text-neutral-600">{description}</p>}
    </header>
  );
}
