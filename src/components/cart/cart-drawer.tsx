"use client";

import { AnimatePresence, m } from "@/lib/motion";
import { X } from "lucide-react";
import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice, shippingFee } from "@/lib/utils";
import { CartLineItem } from "./cart-line-item";
import { LuxuryButton } from "@/components/ui/luxury-button";

export function CartDrawer() {
  const { items, isDrawerOpen, closeDrawer, subtotal, clearCart } = useCart();

  return (
    <AnimatePresence>
      {isDrawerOpen ? (
        <>
          <m.div
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeDrawer}
          />
          <m.aside
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 220 }}
            className="fixed right-0 top-0 z-[61] flex h-dvh w-full max-w-md flex-col border-l border-gold/15 bg-night/95 p-5 shadow-2xl backdrop-blur-2xl"
          >
            <div className="flex items-center justify-between border-b border-gold/10 pb-5">
              <div>
                <p className="text-xs uppercase tracking-[0.28em] text-gold">Sahar Cart</p>
                <h2 className="font-serif text-3xl text-ivory">Evening Order</h2>
              </div>
              <button
                type="button"
                aria-label="Close cart"
                onClick={closeDrawer}
                className="grid h-10 w-10 place-items-center rounded-full border border-gold/15"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="flex-1 space-y-3 overflow-y-auto py-5">
              {items.length ? (
                items.map((item) => <CartLineItem key={`${item.product.id}-${item.size}`} item={item} />)
              ) : (
                <div className="grid h-full place-items-center text-center">
                  <div>
                    <p className="font-serif text-3xl text-ivory">Your cart is quiet.</p>
                    <p className="mt-2 text-ivory/55">Add a Sahar bottle to begin the ritual.</p>
                    <LuxuryButton href="/shop" className="mt-6" onClick={closeDrawer}>
                      Shop Collection
                    </LuxuryButton>
                  </div>
                </div>
              )}
            </div>

            {items.length ? (
              <div className="border-t border-gold/10 pt-5">
                <div className="space-y-2 text-sm text-ivory/65">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>{formatPrice(subtotal)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Shipping</span>
                    <span>{formatPrice(shippingFee)}</span>
                  </div>
                  <div className="flex justify-between font-serif text-2xl text-ivory">
                    <span>Total</span>
                    <span>{formatPrice(subtotal + shippingFee)}</span>
                  </div>
                </div>
                <div className="mt-5 grid grid-cols-2 gap-3">
                  <Link
                    href="/cart"
                    onClick={closeDrawer}
                    className="inline-flex min-h-12 items-center justify-center rounded-full border border-gold/20 text-sm font-semibold uppercase tracking-[0.16em] text-ivory"
                  >
                    Cart
                  </Link>
                  <Link
                    href="/checkout"
                    onClick={closeDrawer}
                    className="inline-flex min-h-12 items-center justify-center rounded-full bg-gold text-sm font-semibold uppercase tracking-[0.16em] text-night"
                  >
                    Checkout
                  </Link>
                </div>
                <button type="button" onClick={clearCart} className="mt-4 text-sm text-ivory/40 hover:text-gold">
                  Clear cart
                </button>
              </div>
            ) : null}
          </m.aside>
        </>
      ) : null}
    </AnimatePresence>
  );
}
