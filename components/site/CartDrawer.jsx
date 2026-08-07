"use client";
import { useCart } from "./CartContext";
import { X, Minus, Plus, ShoppingBag, ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";

const fmt = (n) =>
  new Intl.NumberFormat("en-IN", { maximumFractionDigits: 0 }).format(n);

export default function CartDrawer() {
  const { open, setOpen, items, remove, setQty, subtotal, count } = useCart();

  return (
    <div
      className={`fixed inset-0 z-[60] pointer-events-none ${open ? "" : ""}`}
      aria-hidden={!open}
    >
      <div
        className={`absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity duration-300 ${open ? "opacity-100 pointer-events-auto" : "opacity-0"}`}
        onClick={() => setOpen(false)}
      />
      <aside
        className={`absolute right-0 top-0 h-full w-full max-w-md bg-[#F8F7F4] shadow-2xl transition-transform duration-500 ease-out ${open ? "translate-x-0 pointer-events-auto" : "translate-x-full"}`}
        role="dialog"
        aria-label="Shopping bag"
      >
        <div className="flex items-center justify-between border-b border-black/10 px-6 py-5">
          <div className="flex items-center gap-3">
            <ShoppingBag className="h-5 w-5" />
            <span className="font-serif text-xl">Your Bag</span>
            <span className="text-xs text-neutral-500">({count})</span>
          </div>
          <button onClick={() => setOpen(false)} aria-label="Close bag">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="h-[calc(100%-11rem)] overflow-y-auto px-6 py-6">
          {items.length === 0 ? (
            <div className="flex h-full flex-col items-center justify-center text-center">
              <div className="grid h-16 w-16 place-items-center rounded-full border border-black/10 bg-white text-[#C9A227]">
                <ShoppingBag className="h-6 w-6" />
              </div>
              <p className="mt-5 font-serif text-2xl">Your bag is empty</p>
              <p className="mt-2 max-w-xs text-sm text-neutral-500">
                Discover our premium keychains crafted for those who carry more
                than keys.
              </p>
              <Link
                href="/shop"
                onClick={() => setOpen(false)}
                className="btn-dark mt-8"
              >
                Shop Collection <ArrowRight className="h-4 w-4" />
              </Link>
            </div>
          ) : (
            <ul className="divide-y divide-black/10">
              {items.map((it) => (
                <li key={it.key} className="flex gap-4 py-5">
                  <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-sm bg-white">
                    <img
                      src={it.image}
                      alt={it.name}
                      className="h-full w-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <div className="font-serif text-lg leading-tight">
                          {it.name}
                        </div>
                        <div className="mt-0.5 text-xs text-neutral-500">
                          {it.subtitle}
                          {it.color ? ` • ${it.color}` : ""}
                        </div>
                        {it.engraving && (
                          <div className="mt-1 text-xs italic text-[#C9A227]">
                            Engraving: “{it.engraving}”
                          </div>
                        )}
                      </div>
                      <button
                        onClick={() => remove(it.key)}
                        aria-label="Remove"
                        className="text-neutral-400 hover:text-black"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                    <div className="mt-3 flex items-center justify-between">
                      <div className="inline-flex items-center rounded-sm border border-black/10 bg-white">
                        <button
                          onClick={() => setQty(it.key, it.qty - 1)}
                          className="px-3 py-1.5"
                        >
                          <Minus className="h-3 w-3" />
                        </button>
                        <span className="px-3 text-sm font-medium">
                          {it.qty}
                        </span>
                        <button
                          onClick={() => setQty(it.key, it.qty + 1)}
                          className="px-3 py-1.5"
                        >
                          <Plus className="h-3 w-3" />
                        </button>
                      </div>
                      <div className="text-sm font-semibold">
                        ₹{fmt(it.price * it.qty)}
                      </div>
                    </div>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 border-t border-black/10 bg-white px-6 py-5">
          <div className="flex items-center justify-between text-sm">
            <span className="text-neutral-500">Subtotal</span>
            <span className="font-serif text-2xl">₹{fmt(subtotal)}</span>
          </div>
          <p className="mt-1 text-xs text-neutral-500">
            Shipping and taxes calculated at checkout.
          </p>
          <Link
            href="/checkout"
            onClick={() => setOpen(false)}
            className={`btn-dark mt-4 w-full ${items.length === 0 ? "pointer-events-none opacity-40" : ""}`}
          >
            Checkout <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </aside>
    </div>
  );
}
