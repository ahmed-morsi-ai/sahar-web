"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Instagram, Mail, MessageCircle, MapPin } from "lucide-react";
import { NewsletterForm } from "@/components/ui/newsletter-form";
import { SaharLogo } from "@/components/ui/sahar-logo";

const quickLinks = [
  ["Shop", "/shop"],
  ["Story", "/story"],
  ["FAQ", "/faq"],
  ["Contact", "/contact"],
  ["Shipping", "/shipping-returns"],
  ["Privacy", "/privacy"],
  ["Terms", "/terms"]
];

export function Footer() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <footer className="border-t border-gold/10 bg-black/30 py-14">
      <div className="luxury-container grid gap-10 lg:grid-cols-[1.2fr_.8fr_1fr]">
        <div>
          <div className="mb-5 flex items-center gap-3">
            <SaharLogo className="h-20 w-36 rounded-2xl p-2" imageClassName="p-0" fallbackClassName="text-2xl" />
            <div>
              <p className="font-serif text-3xl tracking-[0.22em]">SAHAR</p>
              <p className="text-xs uppercase tracking-[0.34em] text-gold/70">Essence of Night</p>
            </div>
          </div>
          <p className="max-w-md leading-7 text-ivory/60">
            Luxury Arabic-English perfumery built for evenings, memory, and a presence that stays after the room
            changes.
          </p>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-gold">Quick Links</p>
          <div className="grid grid-cols-2 gap-3">
            {quickLinks.map(([label, href]) => (
              <Link key={href} href={href} className="text-sm text-ivory/62 transition hover:text-gold">
                {label}
              </Link>
            ))}
          </div>
        </div>

        <div>
          <p className="mb-4 text-sm font-semibold uppercase tracking-[0.25em] text-gold">Private Releases</p>
          <NewsletterForm />
          <div className="mt-6 grid gap-3 text-sm text-ivory/62">
            <span className="flex items-center gap-3">
              <Mail className="h-4 w-4 text-gold" /> ahmed11morsi11@gmail.com
            </span>
            <span className="flex items-center gap-3">
              <MessageCircle className="h-4 w-4 text-gold" /> 01017082286
            </span>
            <span className="flex items-center gap-3">
              <MapPin className="h-4 w-4 text-gold" /> Egypt
            </span>
            <span className="flex items-center gap-3">
              <Instagram className="h-4 w-4 text-gold" /> @sahar.perfume
            </span>
          </div>
        </div>
      </div>
      <div className="luxury-container mt-10 border-t border-gold/10 pt-6 text-sm text-ivory/45">
        Copyright {new Date().getFullYear()} Sahar. All rights reserved.
      </div>
    </footer>
  );
}
