"use client";
import Link from "next/link";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { usePathname } from "next/navigation";
import {
  Search,
  ShoppingBag,
  Menu,
  X,
  Truck,
  Sparkles,
  ShieldCheck,
} from "lucide-react";
import { useCart } from "./CartContext";
import UserMenu from "./UserMenu";
import { DEFAULT_HOMEPAGE } from "@/lib/data/content";

function TopBar({ announcement, coupon }) {
  return (
    <div className="hidden md:block border-b border-black/[0.06] bg-[#F8F7F4] text-[12px] text-neutral-600">
      <div className="container-editorial flex h-9 items-center justify-between">
        <span className="inline-flex items-center gap-2">
          <Truck className="h-3.5 w-3.5 text-[#C9A227]" />
          {announcement}
        </span>
        <span className="hidden lg:inline-flex items-center gap-2">
          <Sparkles className="h-3.5 w-3.5 text-[#C9A227]" />
          {coupon}
        </span>
        <span className="inline-flex items-center gap-2">
          <ShieldCheck className="h-3.5 w-3.5 text-[#C9A227]" />
          Cash on Delivery Available
        </span>
      </div>
    </div>
  );
}

const LINKS = [
  { label: "Home", href: "/" },
  { label: "Shop", href: "/shop" },
  { label: "Product Info", href: "/product-information" },
  { label: "About Us", href: "/about" },
  { label: "Contact", href: "/contact" },
];

export default function Header({ variant = "light", overlay = false }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [cms, setCms] = useState(DEFAULT_HOMEPAGE);
  const pathname = usePathname();
  const { count, setOpen: setCartOpen } = useCart();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 30);

    onScroll();

    window.addEventListener("scroll", onScroll, {
      passive: true,
    });

    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const isDark = variant === "dark" && !scrolled;
  const solid = !overlay || scrolled;

  return (
    <header
      className={`${overlay ? "fixed" : "sticky"} inset-x-0 top-0 z-40 transition-colors duration-300 ${
        solid
          ? "bg-[#F8F7F4]/95 backdrop-blur-md border-b border-black/[0.06]"
          : "bg-transparent"
      } ${isDark ? "text-white" : "text-black"}`}
    >
      {!overlay || scrolled ? (
        <TopBar announcement={cms.announcementBar} coupon={cms.couponBanner} />
      ) : null}
      <div className="container-editorial flex h-16 md:h-20 items-center justify-between">
        <Link
          href="/"
          className={`inline-flex select-none items-baseline font-sans
text-[18px] sm:text-[20px] md:text-[24px]
font-light tracking-[0.28em] md:tracking-[0.42em]
${isDark ? "text-white" : "text-black"}`}
          aria-label="Inclex home"
        >
          INCLEX
        </Link>

        <nav className="hidden md:flex items-center gap-8 lg:gap-10">
          {LINKS.map((l) => {
            const active =
              pathname === l.href ||
              (l.href !== "/" && pathname?.startsWith(l.href));
            return (
              <Link
                key={l.href}
                href={l.href}
                className={`${isDark ? "nav-link-dark" : "nav-link"} ${active ? "after:w-6 !text-current" : ""}`}
              >
                {l.label}
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-3 md:gap-5">
          <button
            aria-label="Search"
            className="hidden sm:block opacity-90 hover:opacity-100 transition"
          >
            <Search className="h-5 w-5" />
          </button>
          <UserMenu dark={isDark} />
          <button
            aria-label="Cart"
            onClick={() => setCartOpen(true)}
            className="relative opacity-90 hover:opacity-100 transition"
          >
            <ShoppingBag className="h-5 w-5" />
            <span
              className="absolute -right-1.5 -top-1.5
grid h-4 w-4 md:h-5 md:w-5
place-items-center
rounded-full
bg-[#C9A227]
text-[9px] md:text-[10px]
font-bold text-black"
            >
              {count}
            </span>
          </button>
          <button
            className="md:hidden"
            aria-label="Menu"
            onClick={() => setOpen(true)}
          >
            <Menu className="h-6 w-6" />
          </button>
        </div>
      </div>

      {typeof window !== "undefined" &&
        open &&
        createPortal(
          <div className="fixed inset-0 z-[99999] bg-black text-white md:hidden">
            <div className="flex items-center justify-between px-6 h-20 border-b border-white/10">
              <span className="font-sans text-[22px] font-light tracking-[0.42em]">
                INCLEX
              </span>

              <button onClick={() => setOpen(false)}>
                <X className="h-6 w-6" />
              </button>
            </div>

            <nav className="flex flex-col gap-7 px-8 pt-12 font-serif text-[32px] leading-[1.15] tracking-[-0.015em]">
              {LINKS.map((l) => {
                const active =
                  pathname === l.href ||
                  (l.href !== "/" && pathname?.startsWith(l.href));

                return (
                  <Link
                    key={l.href}
                    href={l.href}
                    onClick={() => setOpen(false)}
                    className={`w-fit transition-colors duration-200 ${
                      active
                        ? "text-[#C9A227]"
                        : "text-white hover:text-[#C9A227]"
                    }`}
                  >
                    {l.label}
                  </Link>
                );
              })}
            </nav>
          </div>,
          document.body,
        )}
    </header>
  );
}
