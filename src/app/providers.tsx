"use client";

import { CartProvider } from "@/lib/cart";
import { MouseGlow } from "@/components/ui/mouse-glow";
import { BackToTop } from "@/components/ui/back-to-top";
import { CartDrawer } from "@/components/cart/cart-drawer";

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <CartProvider>
      <MouseGlow />
      {children}
      <CartDrawer />
      <BackToTop />
    </CartProvider>
  );
}
