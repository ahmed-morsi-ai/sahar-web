"use client";

import { Instagram, Mail, MapPin, MessageCircle, type LucideIcon } from "lucide-react";
import { SectionHeader } from "@/components/ui/section-header";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { buildWhatsAppUrl } from "@/lib/whatsapp";
import { useAnalytics } from "@/components/analytics/AnalyticsTracker";

export default function ContactPage() {
  const { track } = useAnalytics();
  const cards: [LucideIcon, string, string][] = [
    [Mail, "Email", "ahmed11morsi11@gmail.com"],
    [MessageCircle, "WhatsApp", "01017082286"],
    [Instagram, "Instagram", "@sahar.perfume"],
    [MapPin, "Location", "Egypt"]
  ];

  return (
    <section className="min-h-screen pt-24 pb-14 sm:pt-32 sm:pb-24">
      <div className="luxury-container">
        <SectionHeader
          eyebrow="Contact"
          title="Speak with Sahar"
          copy="For orders, private releases, gifting, and delivery questions across Egypt."
        />
        <div className="grid gap-8 lg:grid-cols-[.9fr_1.1fr]">
          <div className="grid gap-4">
            {cards.map(([Icon, title, value]) => (
              <div key={title} className="rounded-xl border border-gold/15 bg-white/[0.045] p-4 sm:rounded-2xl sm:p-5">
                <Icon className="mb-4 h-5 w-5 text-gold" />
                <p className="font-serif text-xl text-ivory sm:text-2xl">{title}</p>
                <p className="mt-1 break-words text-sm text-ivory/60 sm:text-base">{value}</p>
              </div>
            ))}
            <LuxuryButton
              className="w-full"
              onClick={() => {
                track({ type: "contact_click", metadata: { source: "contact_whatsapp" } });
                window.open(buildWhatsAppUrl("Hello Sahar, I want to ask about your perfumes."), "_blank");
              }}
            >
              WhatsApp Sahar
            </LuxuryButton>
          </div>
          <form
            onSubmit={(event) => event.preventDefault()}
            className="rounded-[1.25rem] border border-gold/15 bg-white/[0.045] p-4 backdrop-blur-xl sm:rounded-[1.5rem] sm:p-6 sm:backdrop-blur-2xl"
          >
            <p className="mb-5 font-serif text-2xl text-ivory sm:mb-6 sm:text-3xl">Contact Form</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <input placeholder="Full name" className="h-12 rounded-full border-gold/15 bg-night/65 px-4 text-ivory placeholder:text-ivory/35 focus:border-gold/50 focus:ring-gold/20" />
              <input placeholder="Phone" className="h-12 rounded-full border-gold/15 bg-night/65 px-4 text-ivory placeholder:text-ivory/35 focus:border-gold/50 focus:ring-gold/20" />
              <input placeholder="Email" className="h-12 rounded-full border-gold/15 bg-night/65 px-4 text-ivory placeholder:text-ivory/35 focus:border-gold/50 focus:ring-gold/20 sm:col-span-2" />
              <textarea rows={5} placeholder="Message" className="rounded-2xl border-gold/15 bg-night/65 px-4 py-3 text-ivory placeholder:text-ivory/35 focus:border-gold/50 focus:ring-gold/20 sm:col-span-2" />
            </div>
            <LuxuryButton
              type="submit"
              className="mt-6 w-full sm:w-auto"
              onClick={() => track({ type: "contact_click", metadata: { source: "contact_form_submit" } })}
            >
              Send Message
            </LuxuryButton>
          </form>
        </div>
        <div className="mt-8 grid min-h-60 place-items-center rounded-[1.25rem] border border-gold/15 bg-luxury-radial px-4 text-center sm:min-h-72 sm:rounded-[1.5rem]">
          <div>
            <MapPin className="mx-auto mb-4 h-7 w-7 text-gold" />
            <p className="font-serif text-3xl text-ivory sm:text-4xl">Egypt Delivery Map</p>
            <p className="mt-2 text-sm leading-relaxed text-ivory/55 sm:text-base">Replace this premium placeholder with an embedded map when ready.</p>
          </div>
        </div>
      </div>
    </section>
  );
}
