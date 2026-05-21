"use client";

import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "@/types/cart";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { getCartItemUnitPrice } from "@/lib/whatsapp";
import { SafeImage } from "@/components/media/safe-image";
import { resolveProductImage } from "@/lib/media-utils";

export function CartLineItem({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();
  const productImage = resolveProductImage(item.product.imageUrl || item.product.image);

  return (
    <div className="grid grid-cols-[72px_1fr] gap-3 rounded-xl border border-gold/12 bg-white/[0.035] p-3 sm:grid-cols-[86px_1fr] sm:gap-4 sm:rounded-2xl">
      <Link href={`/product/${item.product.slug}`} className="relative aspect-square overflow-hidden rounded-xl bg-luxury-radial">
        <SafeImage
          src={productImage}
          alt={item.product.name}
          sizes="(min-width: 640px) 86px, 72px"
          className="object-contain p-2 sm:p-3"
        />
      </Link>
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/product/${item.product.slug}`} className="font-serif text-lg leading-tight text-ivory hover:text-gold sm:text-xl">
              {item.product.name}
            </Link>
            <p className="text-[11px] uppercase tracking-[0.16em] text-ivory/40 sm:text-xs sm:tracking-[0.2em]">{item.size}</p>
          </div>
          <button
            type="button"
            aria-label={`Remove ${item.product.name}`}
            onClick={() => removeItem(item.product.id, item.size)}
            className="text-ivory/40 hover:text-gold"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-4 flex flex-wrap items-center justify-between gap-2">
          <div className="flex items-center rounded-full border border-gold/15">
            <button
              type="button"
              aria-label="Decrease quantity"
              onClick={() => updateQuantity(item.product.id, item.size, item.quantity - 1)}
              className="grid h-9 w-9 place-items-center text-ivory/65 hover:text-gold"
            >
              <Minus className="h-3.5 w-3.5" />
            </button>
            <span className="min-w-8 text-center text-sm">{item.quantity}</span>
            <button
              type="button"
              aria-label="Increase quantity"
              onClick={() => updateQuantity(item.product.id, item.size, item.quantity + 1)}
              className="grid h-9 w-9 place-items-center text-ivory/65 hover:text-gold"
            >
              <Plus className="h-3.5 w-3.5" />
            </button>
          </div>
          <p className="font-semibold text-gold">{formatPrice(getCartItemUnitPrice(item) * item.quantity)}</p>
        </div>
      </div>
    </div>
  );
}
