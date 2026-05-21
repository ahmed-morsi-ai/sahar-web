"use client";

import Link from "next/link";
import { Minus, Play, Plus, Star } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { Product } from "@/types/product";
import { formatPrice } from "@/lib/utils";
import { useCart } from "@/lib/cart";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { ScentPyramid } from "@/components/product/scent-pyramid";
import { ProductCard } from "@/components/product/product-card";
import { MediaRenderer } from "@/components/product/media-renderer";
import { buildProductWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { resolveProductGallery, resolveProductImage, resolveProductVideo } from "@/lib/media-utils";
import { useAnalytics } from "@/components/analytics/AnalyticsTracker";

export function ProductDetailClient({ product, related }: { product: Product; related: Product[] }) {
  const { addItem } = useCart();
  const { track } = useAnalytics();
  const productViewTrackedRef = useRef("");
  const productImage = resolveProductImage(product.imageUrl || product.image);
  const productMediaVideo = resolveProductVideo(product.slug, product.videoUrl || product.video);
  const gallery = resolveProductGallery(product.gallery, productImage);
  const detailVideo = productMediaVideo;
  const [activeMedia, setActiveMedia] = useState(productImage);
  const [size, setSize] = useState(product.sizes[0]?.label ?? "50ml");
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    setActiveMedia(productImage);
  }, [product.slug, productImage]);

  const selectedPrice = product.price + (product.sizes.find((item) => item.label === size)?.priceModifier ?? 0);
  const isActiveVideo = Boolean(detailVideo && activeMedia === detailVideo);

  const facts = [
    ["Longevity", product.longevity],
    ["Projection", product.projection],
    ["Occasion", product.occasion],
    ["Gender", product.gender]
  ];

  function selectMedia(media: string) {
    setActiveMedia(media);
  }

  function addProductToCart(source: string) {
    track({
      type: "add_to_cart",
      productSlug: product.slug,
      productName: product.name,
      metadata: { source, size, quantity }
    });
    addItem(product, quantity, size);
  }

  useEffect(() => {
    if (productViewTrackedRef.current === product.slug) return;
    productViewTrackedRef.current = product.slug;

    track({
      type: "product_view",
      productSlug: product.slug,
      productName: product.name,
      metadata: { source: "product_detail" }
    });
  }, [product.name, product.slug, track]);

  return (
    <section className="pt-24 pb-24 sm:pt-32">
      <div className="luxury-container">
        <div className="grid gap-10 lg:grid-cols-[1.02fr_.98fr]">
          <div>
            <div className="relative aspect-square overflow-hidden rounded-[1.4rem] border border-gold/15 bg-luxury-radial shadow-gold sm:rounded-[2rem] sm:shadow-glow">
              <MediaRenderer
                src={activeMedia}
                fallbackSrc={activeMedia === detailVideo ? productImage : undefined}
                alt={product.name}
                fallbackLabel={product.name}
                className="h-full w-full"
                mediaClassName="h-full w-full object-cover"
                imageClassName="object-contain p-8 sm:p-16"
                priority
                lazyVideo={false}
                preload="metadata"
                controlsOnMobile
                allowMobileAutoPlay={false}
              />
            </div>
            <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
              {detailVideo ? (
                <button
                  type="button"
                  onClick={() => selectMedia(detailVideo ?? productImage)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-luxury-radial sm:h-24 sm:w-24 sm:rounded-2xl ${
                    isActiveVideo ? "border-gold" : "border-gold/15"
                  }`}
                  aria-label="Show product video"
                >
                  <MediaRenderer
                    src={productImage}
                    alt=""
                    fallbackLabel={product.name}
                    className="absolute inset-0"
                    mediaClassName="absolute inset-0 h-full w-full object-cover"
                    imageClassName="object-contain p-2 sm:p-3"
                    sizes="(min-width: 640px) 96px, 80px"
                  />
                  <span className="absolute inset-0 grid place-items-center bg-black/35 text-gold">
                    <Play className="h-5 w-5 fill-current" />
                  </span>
                </button>
              ) : null}
              {gallery.map((image) => (
                <button
                  key={image}
                  type="button"
                  onClick={() => selectMedia(image)}
                  className={`relative h-20 w-20 shrink-0 overflow-hidden rounded-xl border bg-luxury-radial sm:h-24 sm:w-24 sm:rounded-2xl ${
                    activeMedia === image ? "border-gold" : "border-gold/15"
                  }`}
                >
                  <MediaRenderer
                    src={image}
                    alt=""
                    fallbackLabel={product.name}
                    className="absolute inset-0"
                    mediaClassName="absolute inset-0 h-full w-full object-cover"
                    imageClassName="object-contain p-2 sm:p-3"
                    sizes="(min-width: 640px) 96px, 80px"
                    preload="metadata"
                  />
                </button>
              ))}
            </div>
          </div>

          <div className="lg:sticky lg:top-28 lg:h-fit">
            <p className="text-xs uppercase tracking-[0.24em] text-gold sm:tracking-[0.32em]">Sahar Fragrance</p>
            <h1 className="mt-4 font-serif text-4xl leading-none text-ivory sm:text-6xl">{product.name}</h1>
            <div className="mt-4 flex items-center gap-3">
              <div className="flex text-gold">
                {Array.from({ length: 5 }).map((_, index) => (
                  <Star key={index} className="h-4 w-4 fill-gold" />
                ))}
              </div>
              <span className="text-sm text-ivory/50">
                {product.rating} from {product.reviewCount} reviews
              </span>
            </div>
            <p className="mt-5 font-serif text-3xl text-gold sm:mt-6 sm:text-4xl">{formatPrice(selectedPrice)}</p>
            <p className="mt-5 text-base leading-relaxed text-ivory/66 sm:mt-6 sm:text-lg sm:leading-8">{product.longDescription}</p>

            <div className="mt-8">
              <p className="mb-3 text-xs uppercase tracking-[0.2em] text-ivory/55 sm:text-sm sm:tracking-[0.24em]">Size</p>
              <div className="flex flex-wrap gap-3">
                {product.sizes.map((option) => (
                  <button
                    key={option.label}
                    type="button"
                    onClick={() => setSize(option.label)}
                    className={`rounded-full border px-4 py-2.5 text-sm font-semibold sm:px-5 sm:py-3 ${
                      size === option.label ? "border-gold bg-gold text-night" : "border-gold/15 text-ivory/65"
                    }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="mt-6 flex flex-wrap items-center gap-4">
              <p className="text-xs uppercase tracking-[0.2em] text-ivory/55 sm:text-sm sm:tracking-[0.24em]">Quantity</p>
              <div className="flex items-center rounded-full border border-gold/15">
                <button type="button" className="grid h-11 w-11 place-items-center" onClick={() => setQuantity(Math.max(1, quantity - 1))}>
                  <Minus className="h-4 w-4" />
                </button>
                <span className="min-w-10 text-center">{quantity}</span>
                <button type="button" className="grid h-11 w-11 place-items-center" onClick={() => setQuantity(quantity + 1)}>
                  <Plus className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="mt-8 hidden gap-3 sm:flex">
              <LuxuryButton onClick={() => addProductToCart("product_detail_desktop")}>Add to Cart</LuxuryButton>
              <LuxuryButton
                variant="secondary"
                onClick={() => {
                  track({
                    type: "contact_click",
                    productSlug: product.slug,
                    productName: product.name,
                    metadata: { source: "product_detail_whatsapp", size, quantity }
                  });
                  window.open(buildWhatsAppUrl(buildProductWhatsAppMessage(product.name, size, quantity)), "_blank");
                }}
              >
                Buy via WhatsApp
              </LuxuryButton>
            </div>

            <div className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {facts.map(([label, value]) => (
                <div key={label} className="rounded-xl border border-gold/15 bg-white/[0.04] p-4 sm:rounded-2xl">
                  <p className="text-[11px] uppercase tracking-[0.18em] text-gold/70 sm:text-xs sm:tracking-[0.22em]">{label}</p>
                  <p className="mt-2 text-sm leading-relaxed text-ivory/75 sm:text-base">{value}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-14 grid gap-6 sm:mt-20 sm:gap-10 lg:grid-cols-2">
          <div className="rounded-[1.25rem] border border-gold/15 bg-white/[0.04] p-5 sm:rounded-[1.5rem] sm:p-6">
            <h2 className="font-serif text-3xl text-ivory sm:text-4xl">Notes Pyramid</h2>
            <ScentPyramid className="mt-8" top={product.topNotes} heart={product.heartNotes} base={product.baseNotes} />
          </div>
          <div className="space-y-5 rounded-[1.25rem] border border-gold/15 bg-white/[0.04] p-5 text-sm leading-relaxed text-ivory/65 sm:rounded-[1.5rem] sm:p-6 sm:text-base sm:leading-7">
            <h2 className="font-serif text-3xl text-ivory sm:text-4xl">Composition & Ritual</h2>
            <p>
              Ingredients / composition: alcohol denat., parfum, premium aromatic compounds, amber accords, wood
              extracts, musk notes, and stabilizing fragrance materials.
            </p>
            <p>How to use: spray on pulse points, clothing from a safe distance, and hair mist lightly for a lasting trail.</p>
            <p>Delivery information: orders are confirmed on WhatsApp and shipped across Egypt after confirmation.</p>
          </div>
        </div>

        {related.length ? (
          <div className="mt-14 sm:mt-20">
            <h2 className="mb-6 font-serif text-4xl text-ivory sm:mb-8 sm:text-5xl">Related Fragrances</h2>
            <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
              {related.map((item) => (
                <ProductCard key={item.id} product={item} />
              ))}
            </div>
          </div>
        ) : null}
      </div>

      <div className="fixed inset-x-0 bottom-0 z-40 border-t border-gold/15 bg-night/90 p-3 backdrop-blur-2xl sm:hidden">
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={() => addProductToCart("product_detail_mobile")}
            className="min-h-12 rounded-full bg-gold text-sm font-bold uppercase tracking-[0.16em] text-night"
          >
            Add to Cart
          </button>
          <Link
            href="/checkout"
            className="inline-flex min-h-12 items-center justify-center rounded-full border border-gold/20 text-sm font-bold uppercase tracking-[0.16em] text-ivory"
          >
            Checkout
          </Link>
        </div>
      </div>
    </section>
  );
}
