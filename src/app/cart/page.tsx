"use client";

import Link from "next/link";
import { useCart } from "@/lib/cart";
import { formatPrice, shippingFee } from "@/lib/utils";
import { CartLineItem } from "@/components/cart/cart-line-item";
import { LuxuryButton } from "@/components/ui/luxury-button";

export default function CartPage() {
  const { items, subtotal, clearCart } = useCart();

  return (
    <section className="min-h-screen pt-32 pb-24">
      <div className="luxury-container">
        <h1 className="font-serif text-6xl text-ivory">Cart</h1>
        {items.length ? (
          <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_390px]">
            <div className="space-y-4">
              {items.map((item) => (
                <CartLineItem key={`${item.product.id}-${item.size}`} item={item} />
              ))}
              <button type="button" onClick={clearCart} className="text-sm text-ivory/45 hover:text-gold">
                Clear cart
              </button>
            </div>
            <aside className="h-fit rounded-[1.5rem] border border-gold/15 bg-white/[0.045] p-6 lg:sticky lg:top-28">
              <p className="font-serif text-3xl">Order Total</p>
              <div className="mt-6 space-y-3 text-ivory/65">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{formatPrice(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{formatPrice(shippingFee)}</span>
                </div>
                <div className="flex justify-between pt-4 font-serif text-3xl text-ivory">
                  <span>Total</span>
                  <span>{formatPrice(subtotal + shippingFee)}</span>
                </div>
              </div>
              <LuxuryButton href="/checkout" className="mt-7 w-full">
                Checkout
              </LuxuryButton>
            </aside>
          </div>
        ) : (
          <div className="mt-10 rounded-[1.5rem] border border-gold/15 bg-white/[0.04] p-12 text-center">
            <p className="font-serif text-4xl text-ivory">Your cart is empty.</p>
            <p className="mt-3 text-ivory/55">Begin with Ombre Mystique or explore the full collection.</p>
            <Link href="/shop" className="mt-8 inline-flex rounded-full bg-gold px-7 py-4 font-semibold uppercase tracking-[0.16em] text-night">
              Shop Collection
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
