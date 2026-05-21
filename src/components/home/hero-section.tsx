"use client";

import { m } from "@/lib/motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { resolveProductImage } from "@/lib/media-utils";
import { useAnalytics } from "@/components/analytics/AnalyticsTracker";
import { useIsMobile, usePrefersReducedMotion } from "@/lib/use-media-query";
import { MediaRenderer } from "@/components/product/media-renderer";
import type { Product } from "@/types/product";

const heroVideo = "/videos/sahar-hero.mp4";

const fallbackFeaturedProduct = {
  name: "Ombre Mystique",
  image: "/images/products/ombre-mystique-1778964643092.png"
};

export function HeroSection({ featured }: { featured?: Product }) {
  const { track } = useAnalytics();
  const isMobile = useIsMobile();
  const prefersReducedMotion = usePrefersReducedMotion();
  const reduceHeroMotion = isMobile || prefersReducedMotion;
  const featuredProduct = featured
    ? {
        name: featured.name,
        image: resolveProductImage(featured.imageUrl || featured.image)
      }
    : fallbackFeaturedProduct;

  return (
    <section className="relative min-h-[100svh] overflow-hidden pt-20 sm:pt-24 lg:min-h-screen lg:pt-28">
      <div className="absolute inset-0 -z-10 bg-luxury-radial" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-night to-transparent" />
      <div className="luxury-container grid min-h-[calc(100svh-5rem)] items-center gap-8 py-8 sm:gap-10 sm:py-12 lg:min-h-[calc(100vh-7rem)] lg:grid-cols-[1fr_.9fr] lg:gap-12 lg:py-16">
        <m.div
          initial={prefersReducedMotion ? false : { opacity: 0, y: reduceHeroMotion ? 12 : 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: reduceHeroMotion ? 0.45 : 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-4 inline-flex max-w-full items-center gap-2 rounded-full border border-gold/20 bg-white/[0.04] px-3 py-2 text-[10px] uppercase tracking-[0.18em] text-gold backdrop-blur-xl sm:mb-5 sm:px-4 sm:text-xs sm:tracking-[0.28em]">
            <Sparkles className="h-3.5 w-3.5" /> Limited Evening Release
          </p>
          <h1 className="font-serif text-5xl font-semibold leading-[0.88] text-ivory sm:text-8xl sm:leading-[0.82] lg:text-[9.5rem]">
            SAHAR
            <span className="mt-3 block text-3xl font-medium leading-none text-gold sm:mt-5 sm:text-5xl lg:text-6xl">
              Essence of Night
            </span>
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-relaxed text-ivory/68 sm:mt-8 sm:text-xl sm:leading-8">
            A cinematic fragrance experience crafted for evenings that feel expensive, mysterious, and unforgettable.
          </p>
          <div className="mt-7 flex flex-col gap-3 sm:mt-9 sm:flex-row">
            <LuxuryButton
              href="/shop"
              className="w-full sm:w-auto"
              onClick={() => track({ type: "shop_now_click", metadata: { source: "hero_shop_collection" } })}
            >
              Shop Collection <ArrowRight className="h-4 w-4" />
            </LuxuryButton>
            <LuxuryButton
              href="/story"
              variant="secondary"
              className="w-full sm:w-auto"
              onClick={() => track({ type: "story_click", metadata: { source: "hero_discover_story" } })}
            >
              Discover The Story
            </LuxuryButton>
          </div>
          <div className="mt-8 grid max-w-2xl grid-cols-2 gap-3 sm:mt-12 sm:grid-cols-3">
            {[
              ["18h", "Long Lasting"],
              ["3", "Luxury Layers"],
              ["01", "Signature Bottle"]
            ].map(([value, label], index) => (
              <div
                key={label}
                className={`rounded-2xl border border-gold/12 bg-white/[0.035] p-3 backdrop-blur-xl sm:p-4 ${
                  index === 2 ? "col-span-2 sm:col-span-1" : ""
                }`}
              >
                <p className="font-serif text-2xl text-gold sm:text-3xl">{value}</p>
                <p className="mt-1 text-[10px] uppercase tracking-[0.14em] text-ivory/45 sm:text-xs sm:tracking-[0.18em]">{label}</p>
              </div>
            ))}
          </div>
        </m.div>

        <m.div
          initial={prefersReducedMotion ? false : { opacity: 0, scale: reduceHeroMotion ? 0.98 : 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: reduceHeroMotion ? 0.45 : 1.1, delay: reduceHeroMotion ? 0.05 : 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-md sm:max-w-lg"
        >
          <div className="animated-border relative h-[340px] overflow-hidden rounded-[1.4rem] bg-night p-px shadow-gold sm:aspect-[4/5] sm:h-auto sm:rounded-[2rem] sm:shadow-glow">
            <div className="relative h-full overflow-hidden rounded-[1.35rem] bg-luxury-radial sm:rounded-[1.95rem]">
              <div className="absolute inset-x-10 top-12 hidden h-72 rounded-full bg-emerald/20 blur-3xl sm:block" />
              <MediaRenderer
                src={heroVideo}
                fallbackSrc={featuredProduct.image}
                alt="Sahar Ombre Mystique perfume campaign video"
                fallbackLabel={featuredProduct.name}
                className="relative h-full w-full"
                mediaClassName="h-full w-full object-cover"
                imageClassName="object-contain p-8 sm:p-12"
                sizes="(min-width: 1024px) 44vw, (min-width: 640px) 520px, 100vw"
                priority
                lazyVideo
                preload="none"
                disableVideoOnMobile
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>
          </div>
          <div className="absolute -bottom-4 left-4 right-4 rounded-2xl border border-gold/20 bg-night/75 p-3 shadow-xl backdrop-blur-xl sm:-bottom-5 sm:left-5 sm:right-5 sm:p-4 sm:shadow-2xl sm:backdrop-blur-2xl">
            <p className="text-[10px] uppercase tracking-[0.2em] text-gold/75 sm:text-xs sm:tracking-[0.25em]">Featured Scent</p>
            <p className="mt-1 font-serif text-2xl text-ivory sm:text-3xl">{featuredProduct.name}</p>
          </div>
        </m.div>
      </div>
    </section>
  );
}
