"use client";

import Link from "next/link";
import { Eye, Plus, Star } from "lucide-react";
import { memo, useCallback } from "react";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { SafeImage } from "@/components/media/safe-image";
import { resolveProductImage } from "@/lib/media-utils";
import { useAnalytics } from "@/components/analytics/AnalyticsTracker";

function ProductCardMedia({ product }: { product: Product }) {
  const imageSrc = resolveProductImage(product.imageUrl || product.image);

  return (
    <SafeImage
      src={imageSrc}
      alt={`${product.name} bottle`}
      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      className="object-contain p-6 transition duration-500 sm:p-8 sm:duration-700 sm:group-hover:scale-105"
    />
  );
}

export const ProductCard = memo(function ProductCard({ product, onQuickView }: { product: Product; onQuickView?: (product: Product) => void }) {
  const { addItem } = useCart();
  const { track } = useAnalytics();

  const trackViewDetails = useCallback((source: string) => {
    track({
      type: "view_details",
      productSlug: product.slug,
      productName: product.name,
      metadata: { source }
    });
  }, [product.name, product.slug, track]);

  const addProductToCart = useCallback(() => {
    track({
      type: "add_to_cart",
      productSlug: product.slug,
      productName: product.name,
      metadata: { source: "product_card" }
    });
    addItem(product);
  }, [addItem, product, track]);

  return (
    <article className="group animated-border rounded-[1.2rem] bg-night/80 p-px shadow-xl transition duration-300 sm:rounded-[1.35rem] sm:shadow-2xl sm:hover:-translate-y-2 sm:hover:shadow-glow">
      <div className="h-full overflow-hidden rounded-[1.15rem] border border-gold/10 bg-white/[0.045] backdrop-blur-xl sm:rounded-[1.3rem] sm:backdrop-blur-2xl">
        <Link
          href={`/product/${product.slug}`}
          onClick={() => trackViewDetails("product_card_media")}
          className="relative block h-[270px] overflow-hidden bg-luxury-radial sm:aspect-[4/5] sm:h-auto"
        >
          <ProductCardMedia product={product} />
          <div className="absolute inset-0 bg-gradient-to-t from-night via-transparent to-transparent" />
          <div className="absolute left-4 top-4 flex gap-2">
            {product.isBestSeller ? (
              <span className="rounded-full bg-gold px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-night">
                Best
              </span>
            ) : null}
            {product.isNew ? (
              <span className="rounded-full border border-emerald/35 bg-emerald/15 px-3 py-1 text-[10px] font-bold uppercase tracking-[0.18em] text-emerald">
                New
              </span>
            ) : null}
          </div>
        </Link>
        <div className="p-4 sm:p-5">
          <div className="mb-2 flex items-start justify-between gap-3">
            <h3 className="min-w-0 font-serif text-[1.45rem] font-semibold leading-tight text-ivory sm:text-2xl">{product.name}</h3>
            <span className="flex items-center gap-1 text-xs text-gold">
              <Star className="h-3.5 w-3.5 fill-gold" /> {product.rating}
            </span>
          </div>
          <p className="text-sm leading-relaxed text-ivory/60 sm:min-h-12 sm:leading-6">{product.description}</p>
          <p className="mt-4 text-[11px] uppercase tracking-[0.16em] text-emerald/80 sm:text-xs sm:tracking-[0.22em]">{product.notes.join(" / ")}</p>
          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="font-serif text-2xl text-gold">{formatPrice(product.price)}</p>
              {product.oldPrice ? <p className="text-xs text-ivory/35 line-through">{formatPrice(product.oldPrice)}</p> : null}
            </div>
            <div className="hidden gap-2 sm:flex">
              {onQuickView ? (
                <button
                  type="button"
                  onClick={() => onQuickView(product)}
                  aria-label={`Quick view ${product.name}`}
                  className="grid h-11 w-11 place-items-center rounded-full border border-gold/15 text-ivory transition hover:border-gold/50"
                >
                  <Eye className="h-4 w-4" />
                </button>
              ) : null}
              <button
                type="button"
                onClick={addProductToCart}
                aria-label={`Add ${product.name} to cart`}
                className="grid h-11 w-11 place-items-center rounded-full bg-gold text-night transition hover:bg-[#f4d8aa]"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </div>
          <div className="mt-4 grid gap-2 sm:hidden">
            <button
              type="button"
              onClick={addProductToCart}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full bg-gold px-4 text-xs font-bold uppercase tracking-[0.16em] text-night"
            >
              <Plus className="h-4 w-4" />
              Add to Cart
            </button>
            <Link
              href={`/product/${product.slug}`}
              onClick={() => trackViewDetails("product_card_link_mobile")}
              className="inline-flex min-h-11 w-full items-center justify-center gap-2 rounded-full border border-gold/20 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-ivory/75"
            >
              <Eye className="h-4 w-4" />
              View Details
            </Link>
            {onQuickView ? (
              <button
                type="button"
                onClick={() => onQuickView(product)}
                className="inline-flex min-h-11 w-full items-center justify-center rounded-full border border-gold/12 px-4 text-xs font-semibold uppercase tracking-[0.16em] text-ivory/55"
              >
                Quick View
              </button>
            ) : null}
          </div>
          <Link
            href={`/product/${product.slug}`}
            onClick={() => trackViewDetails("product_card_link")}
            className="mt-4 hidden text-xs font-semibold uppercase tracking-[0.22em] text-ivory/60 transition hover:text-gold sm:inline-flex"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
});
