"use client";

import Image from "next/image";
import Link from "next/link";
import { Eye, Plus, Star } from "lucide-react";
import { useEffect, useState } from "react";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { PRODUCT_IMAGE_PLACEHOLDER, resolveProductImage } from "@/lib/media-utils";
import { useAnalytics } from "@/components/analytics/AnalyticsTracker";

function ProductCardMedia({ product }: { product: Product }) {
  const imageSrc = resolveProductImage(product.imageUrl || product.image);
  const [activeSrc, setActiveSrc] = useState(imageSrc);

  useEffect(() => {
    setActiveSrc(imageSrc);
  }, [imageSrc]);

  useEffect(() => {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[product-card:media]", {
        slug: product.slug,
        image: imageSrc,
        rawImage: product.image,
        video: product.video
      });
    }
  }, [imageSrc, product.image, product.slug, product.video]);

  return (
    <Image
      src={activeSrc}
      alt={`${product.name} bottle`}
      fill
      sizes="(min-width: 1280px) 25vw, (min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
      className="object-contain p-8 transition duration-700 group-hover:scale-105"
      onError={() => {
        if (activeSrc !== PRODUCT_IMAGE_PLACEHOLDER) {
          setActiveSrc(PRODUCT_IMAGE_PLACEHOLDER);
        }
      }}
    />
  );
}

export function ProductCard({ product, onQuickView }: { product: Product; onQuickView?: (product: Product) => void }) {
  const { addItem } = useCart();
  const { track } = useAnalytics();

  function trackViewDetails(source: string) {
    track({
      type: "view_details",
      productSlug: product.slug,
      productName: product.name,
      metadata: { source }
    });
  }

  function addProductToCart() {
    track({
      type: "add_to_cart",
      productSlug: product.slug,
      productName: product.name,
      metadata: { source: "product_card" }
    });
    addItem(product);
  }

  return (
    <article className="group animated-border rounded-[1.35rem] bg-night/80 p-px shadow-2xl transition duration-500 hover:-translate-y-2 hover:shadow-glow">
      <div className="h-full overflow-hidden rounded-[1.3rem] border border-gold/10 bg-white/[0.045] backdrop-blur-2xl">
        <Link
          href={`/product/${product.slug}`}
          onClick={() => trackViewDetails("product_card_media")}
          className="relative block aspect-[4/5] overflow-hidden bg-luxury-radial"
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
        <div className="p-5">
          <div className="mb-2 flex items-center justify-between gap-3">
            <h3 className="font-serif text-2xl font-semibold text-ivory">{product.name}</h3>
            <span className="flex items-center gap-1 text-xs text-gold">
              <Star className="h-3.5 w-3.5 fill-gold" /> {product.rating}
            </span>
          </div>
          <p className="min-h-12 text-sm leading-6 text-ivory/60">{product.description}</p>
          <p className="mt-4 text-xs uppercase tracking-[0.22em] text-emerald/80">{product.notes.join(" / ")}</p>
          <div className="mt-5 flex items-center justify-between">
            <div>
              <p className="font-serif text-2xl text-gold">{formatPrice(product.price)}</p>
              {product.oldPrice ? <p className="text-xs text-ivory/35 line-through">{formatPrice(product.oldPrice)}</p> : null}
            </div>
            <div className="flex gap-2">
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
          <Link
            href={`/product/${product.slug}`}
            onClick={() => trackViewDetails("product_card_link")}
            className="mt-4 inline-flex text-xs font-semibold uppercase tracking-[0.22em] text-ivory/60 transition hover:text-gold"
          >
            View Details
          </Link>
        </div>
      </div>
    </article>
  );
}
