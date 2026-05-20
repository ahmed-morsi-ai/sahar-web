"use client";

import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
import { X } from "lucide-react";
import type { Product } from "@/types/product";
import { useCart } from "@/lib/cart";
import { formatPrice } from "@/lib/utils";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { MediaRenderer } from "@/components/product/media-renderer";
import { resolveProductImage } from "@/lib/media-utils";
import { useAnalytics } from "@/components/analytics/AnalyticsTracker";
import { usePrefersReducedMotion } from "@/lib/use-media-query";

export function QuickViewModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { addItem } = useCart();
  const { track } = useAnalytics();
  const imageSrc = resolveProductImage(product?.imageUrl || product?.image);
  const prefersReducedMotion = usePrefersReducedMotion();

  return (
    <AnimatePresence>
      {product ? (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-3 backdrop-blur-lg sm:p-4 sm:backdrop-blur-xl"
          initial={prefersReducedMotion ? false : { opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
          onClick={onClose}
        >
          <motion.div
            initial={prefersReducedMotion ? false : { scale: 0.98, y: 14 }}
            animate={{ scale: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { scale: 0.98, y: 14 }}
            onClick={(event) => event.stopPropagation()}
            className="grid max-h-[92dvh] w-full max-w-4xl overflow-y-auto rounded-[1.25rem] border border-gold/20 bg-night p-3 shadow-2xl sm:rounded-[1.6rem] sm:p-5 md:grid-cols-2"
          >
            <div className="relative aspect-square max-h-[300px] overflow-hidden rounded-[1rem] bg-luxury-radial sm:max-h-none sm:rounded-[1.2rem]">
              <MediaRenderer
                src={imageSrc}
                alt={product.name}
                fallbackLabel={product.name}
                className="h-full w-full"
                mediaClassName="h-full w-full object-cover"
                imageClassName="object-contain p-7 sm:p-10"
                preload="metadata"
              />
            </div>
            <div className="p-2 pt-4 sm:p-5">
              <button
                type="button"
                aria-label="Close quick view"
                onClick={onClose}
                className="ml-auto grid h-10 w-10 place-items-center rounded-full border border-gold/15 text-ivory"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="text-xs uppercase tracking-[0.22em] text-gold sm:tracking-[0.28em]">Quick View</p>
              <h3 className="mt-3 font-serif text-3xl leading-tight text-ivory sm:text-4xl">{product.name}</h3>
              <p className="mt-3 text-2xl font-semibold text-gold">{formatPrice(product.price)}</p>
              <p className="mt-4 text-sm leading-relaxed text-ivory/65 sm:mt-5 sm:text-base sm:leading-7">{product.longDescription}</p>
              <p className="mt-5 text-xs uppercase tracking-[0.16em] text-emerald/80 sm:text-sm sm:tracking-[0.22em]">{product.notes.join(" / ")}</p>
              <div className="mt-7 flex flex-col gap-3 sm:mt-8 sm:flex-row sm:flex-wrap">
                <LuxuryButton
                  className="w-full sm:w-auto"
                  onClick={() => {
                    track({
                      type: "add_to_cart",
                      productSlug: product.slug,
                      productName: product.name,
                      metadata: { source: "quick_view" }
                    });
                    addItem(product);
                  }}
                >
                  Add to Cart
                </LuxuryButton>
                <LuxuryButton
                  href={`/product/${product.slug}`}
                  variant="secondary"
                  className="w-full sm:w-auto"
                  onClick={() =>
                    track({
                      type: "view_details",
                      productSlug: product.slug,
                      productName: product.name,
                      metadata: { source: "quick_view" }
                    })
                  }
                >
                  Full Ritual
                </LuxuryButton>
              </div>
              <Link href="/checkout" className="mt-5 inline-block text-sm text-ivory/50 hover:text-gold">
                Checkout after adding to cart
              </Link>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
