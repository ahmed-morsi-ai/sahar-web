"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2 } from "lucide-react";
import type { CartItem } from "@/types/cart";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { getCartItemUnitPrice } from "@/lib/whatsapp";
import { resolveProductImage } from "@/lib/media-utils";

export function CartLineItem({ item }: { item: CartItem }) {
  const { updateQuantity, removeItem } = useCart();
  const productImage = resolveProductImage(item.product.image);

  return (
    <div className="grid grid-cols-[86px_1fr] gap-4 rounded-2xl border border-gold/12 bg-white/[0.035] p-3">
      <Link href={`/product/${item.product.slug}`} className="relative aspect-square overflow-hidden rounded-xl bg-luxury-radial">
        <Image src={productImage} alt={item.product.name} fill className="object-contain p-3" />
      </Link>
      <div>
        <div className="flex items-start justify-between gap-3">
          <div>
            <Link href={`/product/${item.product.slug}`} className="font-serif text-xl text-ivory hover:text-gold">
              {item.product.name}
            </Link>
            <p className="text-xs uppercase tracking-[0.2em] text-ivory/40">{item.size}</p>
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
        <div className="mt-4 flex items-center justify-between">
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
