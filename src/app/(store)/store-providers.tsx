"use client";

import dynamic from "next/dynamic";
import { CartProvider } from "@/lib/cart";

const CartDrawer = dynamic(
  () => import("@/components/cart/cart-drawer").then((mod) => mod.CartDrawer),
  { ssr: false }
);

const MouseGlow = dynamic(
  () => import("@/components/ui/mouse-glow").then((mod) => mod.MouseGlow),
  { ssr: false }
);

const BackToTop = dynamic(
  () => import("@/components/ui/back-to-top").then((mod) => mod.BackToTop),
  { ssr: false }
);

export function StoreProviders({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <MouseGlow />
      {children}
      <CartDrawer />
      <BackToTop />
    </CartProvider>
  );
}
