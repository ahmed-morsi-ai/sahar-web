"use client";

import Image from "next/image";
import { useState } from "react";
import { Gem, Moon, ShieldCheck, Sparkles, Stars, Wand2, type LucideIcon } from "lucide-react";
import type { Product } from "@/types/product";
import { reviews } from "@/data/reviews";
import { faqs } from "@/data/faqs";
import { HeroSection } from "@/components/home/hero-section";
import { ProductCard } from "@/components/product/product-card";
import { SectionHeader } from "@/components/ui/section-header";
import { Reveal } from "@/components/ui/reveal";
import { ScentPyramid } from "@/components/product/scent-pyramid";
import { VideoCard } from "@/components/home/video-card";
import { ReviewCard } from "@/components/home/review-card";
import { FAQAccordion } from "@/components/ui/faq-accordion";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { MediaRenderer } from "@/components/product/media-renderer";
import { useCart } from "@/lib/cart";
import { brandLogo } from "@/lib/media";
import { buildProductWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import { resolveProductImage, resolveProductVideo } from "@/lib/media-utils";
import { useAnalytics } from "@/components/analytics/AnalyticsTracker";

function ProductFeatureVideo({ fallbackImage, videoSrc, name }: { fallbackImage: string; videoSrc?: string; name: string }) {
  return (
    <MediaRenderer
      src={videoSrc || fallbackImage}
      fallbackSrc={videoSrc ? fallbackImage : undefined}
      alt={`${name} bottle`}
      fallbackLabel={name}
      className="relative h-full min-h-[520px] w-full rounded-[inherit]"
      mediaClassName="relative h-full min-h-[520px] w-full rounded-[inherit] object-cover"
      imageClassName="object-contain p-12 sm:p-16"
      priority
      preload="metadata"
    />
  );
}

function BrandStoryLogo() {
  const [logoFailed, setLogoFailed] = useState(false);

  return (
    <div className="relative min-h-72 overflow-hidden rounded-[1.4rem] border border-gold/15 bg-luxury-radial p-6 shadow-glow sm:p-8">
      <div className="pointer-events-none absolute inset-x-8 top-8 h-32 rounded-full bg-emerald/20 blur-3xl" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/55 via-black/5 to-transparent" />
      <div className="relative grid h-full min-h-60 place-items-center">
        {logoFailed ? (
          <div className="text-center">
            <div className="mx-auto grid h-24 w-24 place-items-center rounded-full border border-gold/30 bg-black/30 font-serif text-6xl text-gold shadow-gold">
              س
            </div>
            <p className="mt-5 font-serif text-4xl tracking-[0.28em] text-ivory">SAHAR</p>
            <p className="mt-2 text-[10px] uppercase tracking-[0.34em] text-gold/70">Essence of Night</p>
          </div>
        ) : (
          <Image
            src={brandLogo}
            alt="Sahar brand logo"
            fill
            sizes="(min-width: 768px) 420px, 100vw"
            className="object-contain p-4 drop-shadow-[0_0_34px_rgba(231,197,141,0.22)]"
            onError={() => setLogoFailed(true)}
          />
        )}
      </div>
      <div className="pointer-events-none absolute inset-0 rounded-[1.4rem] ring-1 ring-inset ring-gold/10" />
    </div>
  );
}

export function HomePageClient({ products }: { products: Product[] }) {
  const { addItem } = useCart();
  const { track } = useAnalytics();
  const [firstProduct] = products;
  const signature = products.find((product) => product.slug === "ombre-mystique") ?? firstProduct;
  const signatureImage = resolveProductImage(signature?.imageUrl || signature?.image);
  const signatureVideo = signature ? resolveProductVideo(signature.slug, signature.videoUrl || signature.video) : undefined;
  const reasons: [LucideIcon, string][] = [
    [Moon, "Long-lasting performance"],
    [Sparkles, "Premium oil concentration"],
    [Gem, "Elegant bottle design"],
    [Stars, "Inspired by Arabic night luxury"],
    [ShieldCheck, "Perfect for evening presence"]
  ];

  return (
    <>
      <HeroSection featured={signature} />

      <section id="collection" className="py-24">
        <div className="luxury-container">
          <SectionHeader
            eyebrow="Prestige Collection"
            title="Fragrances made for after dark"
            copy="Every active Sahar fragrance currently available in the shop, pulled from the live product catalog."
          />
          {products.length ? (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="rounded-[1.5rem] border border-gold/15 bg-white/[0.04] p-12 text-center">
              <p className="font-serif text-3xl text-ivory">No active fragrances yet.</p>
              <p className="mt-3 text-ivory/55">Activate products in the Sahar admin panel to show them here.</p>
            </div>
          )}
        </div>
      </section>

      {signature ? (
        <section className="py-24">
          <div className="luxury-container grid items-center gap-10 lg:grid-cols-[.95fr_1.05fr]">
            <Reveal className="relative min-h-[520px] overflow-hidden rounded-[2rem] border border-gold/15 bg-luxury-radial shadow-glow">
              <div className="absolute inset-x-16 top-16 h-80 rounded-full bg-emerald/20 blur-3xl" />
              <ProductFeatureVideo fallbackImage={signatureImage} videoSrc={signatureVideo} name={signature.name} />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />
            </Reveal>
            <Reveal delay={0.1}>
              <p className="text-xs uppercase tracking-[0.32em] text-gold">Signature Product</p>
              <h2 className="mt-4 font-serif text-5xl leading-none text-ivory sm:text-6xl">{signature.name}</h2>
              <p className="mt-6 max-w-xl text-lg leading-8 text-ivory/65">{signature.longDescription}</p>
              <ScentPyramid
                className="mt-8"
                top={signature.topNotes}
                heart={signature.heartNotes}
                base={signature.baseNotes}
              />
              <div className="mt-8 flex flex-wrap gap-3">
                <LuxuryButton
                  onClick={() => {
                    track({
                      type: "add_to_cart",
                      productSlug: signature.slug,
                      productName: signature.name,
                      metadata: { source: "home_signature" }
                    });
                    addItem(signature);
                  }}
                >
                  Add to Cart
                </LuxuryButton>
                <LuxuryButton
                  href={`/product/${signature.slug}`}
                  variant="secondary"
                  onClick={() =>
                    track({
                      type: "view_details",
                      productSlug: signature.slug,
                      productName: signature.name,
                      metadata: { source: "home_signature" }
                    })
                  }
                >
                  View Ritual
                </LuxuryButton>
              </div>
            </Reveal>
          </div>
        </section>
      ) : null}

      <section className="py-24">
        <div className="luxury-container">
          <SectionHeader
            eyebrow="Visual Campaign"
            title="Three moments of night"
            copy="Cinematic campaign panels are ready for your launch videos. Place MP4 files in public/videos and pass their paths here."
          />
          <div className="grid gap-6 md:grid-cols-3">
            <VideoCard title="The First Spray" src="/videos/campaign-first-spray.mp4" />
            <VideoCard title="Midnight Bottle" src="/videos/campaign-midnight-bottle.mp4" />
            <VideoCard title="The Lasting Trail" src="/videos/products/amber-silk.mp4" />
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="luxury-container">
          <Reveal className="grid gap-8 rounded-[2rem] border border-gold/15 bg-white/[0.045] p-8 backdrop-blur-2xl md:grid-cols-[.7fr_1.3fr] md:p-12">
            <BrandStoryLogo />
            <div>
              <p className="text-xs uppercase tracking-[0.32em] text-gold">Brand Story</p>
              <h2 className="mt-4 font-serif text-5xl text-ivory">Night, bottled with intention.</h2>
              <p className="mt-6 text-lg leading-8 text-ivory/66">
                Sahar is built around the Arabic feeling of staying awake into a beautiful night: the confidence before
                entering, the memory after leaving, and the elegance that sits between silence and attention.
              </p>
              <LuxuryButton href="/story" variant="secondary" className="mt-8">
                Read The Story
              </LuxuryButton>
            </div>
          </Reveal>
        </div>
      </section>

      <section className="py-24">
        <div className="luxury-container">
          <SectionHeader eyebrow="Why Sahar" title="Built for presence" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {reasons.map(([Icon, title]) => (
              <Reveal key={title} className="rounded-[1.25rem] border border-gold/15 bg-white/[0.04] p-6">
                <Icon className="mb-6 h-6 w-6 text-gold" />
                <p className="font-serif text-2xl text-ivory">{title}</p>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="luxury-container">
          <SectionHeader eyebrow="Scent Profile" title="A pyramid of shadow and gold" />
          <ScentPyramid top={["Saffron Glow"]} heart={["Oud Wood"]} base={["Amber Silk"]} className="mx-auto max-w-4xl" />
        </div>
      </section>

      <section id="reviews" className="py-24">
        <div className="luxury-container">
          <SectionHeader eyebrow="Reviews" title="What the night remembers" />
          <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-5">
            {reviews.map((review) => (
              <ReviewCard key={review.name} review={review} />
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="luxury-container grid gap-10 lg:grid-cols-[.8fr_1.2fr]">
          <SectionHeader align="left" eyebrow="FAQ" title="Before the first spray" />
          <FAQAccordion items={faqs.slice(0, 5)} />
        </div>
      </section>

      <section className="py-24">
        <div className="luxury-container">
          <Reveal className="relative overflow-hidden rounded-[2rem] border border-gold/15 bg-luxury-radial p-8 text-center shadow-glow sm:p-14">
            <Wand2 className="mx-auto mb-6 h-8 w-8 text-gold" />
            <h2 className="mx-auto max-w-3xl font-serif text-5xl leading-none text-ivory sm:text-6xl">
              Own the fragrance that arrives before you speak.
            </h2>
            <div className="mt-9 flex flex-col justify-center gap-3 sm:flex-row">
              <LuxuryButton
                href="/shop"
                onClick={() => track({ type: "shop_now_click", metadata: { source: "home_final_cta" } })}
              >
                Shop Now
              </LuxuryButton>
              <LuxuryButton
                variant="secondary"
                onClick={() => {
                  track({
                    type: "contact_click",
                    productSlug: signature?.slug,
                    productName: signature?.name,
                    metadata: { source: "home_final_whatsapp" }
                  });
                  window.open(buildWhatsAppUrl(buildProductWhatsAppMessage(signature?.name ?? "Ombre Mystique", "50ml")), "_blank");
                }}
              >
                Order on WhatsApp
              </LuxuryButton>
            </div>
          </Reveal>
        </div>
      </section>
    </>
  );
}
