"use client";

import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { resolveProductImage } from "@/lib/media-utils";
import { useAnalytics } from "@/components/analytics/AnalyticsTracker";
import type { Product } from "@/types/product";

const heroVideo = "/videos/sahar-hero.mp4";

const fallbackFeaturedProduct = {
  name: "Ombre Mystique",
  image: "/images/products/ombre-mystique-1778964643092.png"
};

export function HeroSection({ featured }: { featured?: Product }) {
  const { track } = useAnalytics();
  const featuredProduct = featured
    ? {
        name: featured.name,
        image: resolveProductImage(featured.imageUrl || featured.image)
      }
    : fallbackFeaturedProduct;

  return (
    <section className="relative min-h-screen overflow-hidden pt-28">
      <div className="absolute inset-0 -z-10 bg-luxury-radial" />
      <div className="absolute inset-x-0 bottom-0 -z-10 h-48 bg-gradient-to-t from-night to-transparent" />
      <div className="luxury-container grid min-h-[calc(100vh-7rem)] items-center gap-12 py-16 lg:grid-cols-[1fr_.9fr]">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
        >
          <p className="mb-5 inline-flex items-center gap-2 rounded-full border border-gold/20 bg-white/[0.04] px-4 py-2 text-xs uppercase tracking-[0.28em] text-gold backdrop-blur-xl">
            <Sparkles className="h-3.5 w-3.5" /> Limited Evening Release
          </p>
          <h1 className="font-serif text-7xl font-semibold leading-[0.82] text-ivory sm:text-8xl lg:text-[9.5rem]">
            SAHAR
            <span className="mt-5 block text-4xl font-medium leading-none text-gold sm:text-5xl lg:text-6xl">
              Essence of Night
            </span>
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-ivory/68 sm:text-xl">
            A cinematic fragrance experience crafted for evenings that feel expensive, mysterious, and unforgettable.
          </p>
          <div className="mt-9 flex flex-col gap-3 sm:flex-row">
            <LuxuryButton
              href="/shop"
              onClick={() => track({ type: "shop_now_click", metadata: { source: "hero_shop_collection" } })}
            >
              Shop Collection <ArrowRight className="h-4 w-4" />
            </LuxuryButton>
            <LuxuryButton
              href="/story"
              variant="secondary"
              onClick={() => track({ type: "story_click", metadata: { source: "hero_discover_story" } })}
            >
              Discover The Story
            </LuxuryButton>
          </div>
          <div className="mt-12 grid max-w-2xl grid-cols-3 gap-3">
            {[
              ["18h", "Long Lasting"],
              ["3", "Luxury Layers"],
              ["01", "Signature Bottle"]
            ].map(([value, label]) => (
              <div key={label} className="rounded-2xl border border-gold/12 bg-white/[0.035] p-4 backdrop-blur-xl">
                <p className="font-serif text-3xl text-gold">{value}</p>
                <p className="mt-1 text-xs uppercase tracking-[0.18em] text-ivory/45">{label}</p>
              </div>
            ))}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1.1, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="relative mx-auto w-full max-w-lg"
        >
          <div className="animated-border relative aspect-[4/5] overflow-hidden rounded-[2rem] bg-night p-px shadow-glow">
            <div className="relative h-full overflow-hidden rounded-[1.95rem] bg-luxury-radial">
              <div className="absolute inset-x-10 top-12 h-72 rounded-full bg-emerald/20 blur-3xl" />
              <video
                className="relative h-full w-full object-cover"
                autoPlay
                muted
                playsInline
                preload="auto"
                poster={featuredProduct.image}
                aria-label="Sahar Ombre Mystique perfume campaign video"
              >
                <source src={heroVideo} type="video/mp4" />
              </video>
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent" />
            </div>
          </div>
          <div className="absolute -bottom-5 left-5 right-5 rounded-2xl border border-gold/20 bg-night/70 p-4 shadow-2xl backdrop-blur-2xl">
            <p className="text-xs uppercase tracking-[0.25em] text-gold/75">Featured Scent</p>
            <p className="mt-1 font-serif text-3xl text-ivory">{featuredProduct.name}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
