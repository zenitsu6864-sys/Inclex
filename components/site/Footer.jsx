import Link from "next/link";
import { Instagram, Facebook, Youtube } from "lucide-react";

const COLS = [
  {
    title: "Shop",
    links: [
      { label: "All Collections", href: "/shop" },
      { label: "Customize", href: "/customize" },
     { label: "Product Information", href: "/product-information" },
      { label: "Gift Cards", href: "/shop" },
    ],
  },
  {
    title: "Help",
    links: [
      { label: "Track Order", href: "/contact" },
      { label: "Shipping Policy", href: "/policy/shipping" },
      { label: "Returns & Refunds", href: "/policy/returns" },
      { label: "FAQ", href: "/faq" },
    ],
  },
  {
    title: "About",
    links: [
      { label: "About Us", href: "/about" },
      { label: "Our Story", href: "/about#story" },
      { label: "Blog", href: "/about#story" },
      { label: "Contact Us", href: "/contact" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy Policy", href: "/policy/privacy" },
      { label: "Terms & Conditions", href: "/policy/terms" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0B0B0B] text-white">
      <div className="container-editorial py-16">
        <div className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-12">
          {/* Brand */}
          <div className="lg:col-span-4">
            <div className="font-sans text-[20px] sm:text-[24px] font-light tracking-[0.35em] text-[#C9A227]">
              INCLEX
            </div>

            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              Crafted to last.
              <br />
              Designed to be remembered.
            </p>

            <div className="mt-8 flex flex-wrap gap-3">
              {[Instagram, Facebook, Youtube].map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/15 text-white/80 transition hover:border-[#C9A227] hover:text-[#C9A227]"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Footer Columns */}
          {COLS.map((col) => (
            <div
              key={col.title}
              className="sm:col-span-1 lg:col-span-2"
            >
              <h3 className="text-xs font-semibold uppercase tracking-[0.22em] text-white/50">
                {col.title}
              </h3>

              <ul className="mt-5 space-y-3">
                {col.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="block text-sm text-white/80 break-words transition hover:text-[#C9A227]"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom */}
      <div className="border-t border-white/10">
        <div className="container-editorial flex flex-col items-center gap-3 py-6 text-center text-xs text-white/50 md:flex-row md:justify-between md:text-left">
          <span>
            © {new Date().getFullYear()} Inclex. All rights reserved.
          </span>

          <span className="inline-flex items-center gap-2">
            Made in India
            <span className="text-[#C9A227]">♥</span>
          </span>
        </div>
      </div>
    </footer>
  );
}