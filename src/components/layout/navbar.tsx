"use client";

import Image from "next/image";
import Link from "next/link";
import { Menu, ShoppingBag, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { useCart } from "@/lib/cart";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { brandLogo } from "@/lib/media";
import { usePrefersReducedMotion } from "@/lib/use-media-query";

const links = [
  { href: "/", label: "Home" },
  { href: "/shop", label: "Shop" },
  { href: "/shop#collection", label: "Collection" },
  { href: "/story", label: "Story" },
  { href: "/#reviews", label: "Reviews" },
  { href: "/contact", label: "Contact" }
];

export function Navbar() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [logoFailed, setLogoFailed] = useState(false);
  const { itemCount, openDrawer } = useCart();
  const prefersReducedMotion = usePrefersReducedMotion();

  if (pathname.startsWith("/admin")) return null;

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-gold/10 bg-night/80 backdrop-blur-xl sm:bg-night/70 sm:backdrop-blur-2xl">
      <nav className="luxury-container flex h-16 items-center justify-between gap-2 sm:h-20">
        <Link href="/" className="flex min-w-0 items-center gap-2.5 sm:gap-3.5" aria-label="Sahar home">
          <span className="relative grid h-10 w-10 shrink-0 place-items-center overflow-hidden rounded-full border border-gold/30 bg-[#06150f]/80 shadow-[0_0_18px_rgba(47,196,141,0.18)] sm:h-16 sm:w-16 sm:shadow-[0_0_28px_rgba(47,196,141,0.2)]">
            <span className="pointer-events-none absolute inset-1 rounded-full bg-emerald/12 blur-md" />
            {logoFailed ? (
              <span className="relative font-serif text-xl text-gold sm:text-4xl">س</span>
            ) : (
              <Image
                src={brandLogo}
                alt="Sahar logo"
                fill
                sizes="64px"
                className="rounded-full object-contain p-0.5"
                onError={() => setLogoFailed(true)}
              />
            )}
          </span>
          <span className="block min-w-0">
            <span className="block truncate font-serif text-lg font-semibold tracking-[0.14em] text-ivory sm:text-2xl sm:tracking-[0.22em]">
              SAHAR
            </span>
            <span className="block whitespace-nowrap text-[7px] uppercase tracking-[0.14em] text-gold/70 sm:text-[10px] sm:tracking-[0.34em]">
              Essence of Night
            </span>
          </span>
        </Link>

        <div className="hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <Link key={link.href} href={link.href} className="text-sm text-ivory/68 transition hover:text-gold">
              {link.label}
            </Link>
          ))}
        </div>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={openDrawer}
            className="relative grid h-10 w-10 place-items-center rounded-full border border-gold/15 bg-white/[0.04] text-ivory transition hover:border-gold/45 sm:h-11 sm:w-11"
            aria-label="Open cart"
          >
            <ShoppingBag className="h-5 w-5" />
            {itemCount > 0 ? (
              <span className="absolute -right-1 -top-1 grid h-5 min-w-5 place-items-center rounded-full bg-gold px-1 text-[11px] font-bold text-night">
                {itemCount}
              </span>
            ) : null}
          </button>
          <div className="hidden sm:block">
            <LuxuryButton href="/shop" className="min-h-11 px-5 text-xs">
              Shop Now
            </LuxuryButton>
          </div>
          <button
            type="button"
            className="grid h-10 w-10 place-items-center rounded-full border border-gold/15 text-ivory lg:hidden sm:h-11 sm:w-11"
            onClick={() => setOpen((value) => !value)}
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={prefersReducedMotion ? false : { opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: -10 }}
            transition={{ duration: prefersReducedMotion ? 0.01 : 0.2 }}
            className="max-h-[calc(100dvh-4rem)] overflow-y-auto border-t border-gold/10 bg-night/95 px-4 py-4 backdrop-blur-xl sm:max-h-[calc(100dvh-5rem)] sm:px-5 sm:py-6 sm:backdrop-blur-2xl lg:hidden"
          >
            <div className="flex flex-col gap-3 sm:gap-4">
              {links.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-full border border-gold/10 px-4 py-3 text-sm text-ivory/75"
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
