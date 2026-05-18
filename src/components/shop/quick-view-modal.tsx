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

export function QuickViewModal({ product, onClose }: { product: Product | null; onClose: () => void }) {
  const { addItem } = useCart();
  const { track } = useAnalytics();
  const imageSrc = resolveProductImage(product?.imageUrl || product?.image);

  return (
    <AnimatePresence>
      {product ? (
        <motion.div
          className="fixed inset-0 z-[70] grid place-items-center bg-black/70 p-4 backdrop-blur-xl"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.96, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.96, y: 20 }}
            onClick={(event) => event.stopPropagation()}
            className="grid max-h-[90vh] w-full max-w-4xl overflow-y-auto rounded-[1.6rem] border border-gold/20 bg-night p-5 shadow-2xl md:grid-cols-2"
          >
            <div className="relative aspect-square overflow-hidden rounded-[1.2rem] bg-luxury-radial">
              <MediaRenderer
                src={imageSrc}
                alt={product.name}
                fallbackLabel={product.name}
                className="h-full w-full"
                mediaClassName="h-full w-full object-cover"
                imageClassName="object-contain p-10"
                preload="metadata"
              />
            </div>
            <div className="p-5">
              <button
                type="button"
                aria-label="Close quick view"
                onClick={onClose}
                className="ml-auto grid h-10 w-10 place-items-center rounded-full border border-gold/15 text-ivory"
              >
                <X className="h-4 w-4" />
              </button>
              <p className="text-xs uppercase tracking-[0.28em] text-gold">Quick View</p>
              <h3 className="mt-3 font-serif text-4xl text-ivory">{product.name}</h3>
              <p className="mt-3 text-2xl font-semibold text-gold">{formatPrice(product.price)}</p>
              <p className="mt-5 leading-7 text-ivory/65">{product.longDescription}</p>
              <p className="mt-5 text-sm uppercase tracking-[0.22em] text-emerald/80">{product.notes.join(" / ")}</p>
              <div className="mt-8 flex flex-wrap gap-3">
                <LuxuryButton
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
