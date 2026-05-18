"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import type { Product } from "@/types/product";
import type { CartItem } from "@/types/cart";
import { getCartItemUnitPrice } from "@/lib/whatsapp";

type CartContextValue = {
  items: CartItem[];
  isHydrated: boolean;
  isDrawerOpen: boolean;
  addItem: (product: Product, quantity?: number, size?: Product["sizes"][number]["label"]) => void;
  removeItem: (productId: string, size: string) => void;
  updateQuantity: (productId: string, size: string, quantity: number) => void;
  clearCart: () => void;
  openDrawer: () => void;
  closeDrawer: () => void;
  itemCount: number;
  subtotal: number;
};

const CartContext = createContext<CartContextValue | null>(null);
const storageKey = "sahar-cart";

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [isHydrated, setIsHydrated] = useState(false);

  useEffect(() => {
    const stored = window.localStorage.getItem(storageKey);
    if (stored) {
      try {
        setItems(JSON.parse(stored) as CartItem[]);
      } catch {
        window.localStorage.removeItem(storageKey);
      }
    }
    setIsHydrated(true);
  }, []);

  useEffect(() => {
    if (!isHydrated) return;
    window.localStorage.setItem(storageKey, JSON.stringify(items));
  }, [isHydrated, items]);

  const value = useMemo<CartContextValue>(() => {
    const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);
    const subtotal = items.reduce((sum, item) => sum + getCartItemUnitPrice(item) * item.quantity, 0);

    return {
      items,
      isHydrated,
      isDrawerOpen,
      addItem(product, quantity = 1, size = product.sizes[0].label) {
        setItems((current) => {
          const existing = current.find((item) => item.product.id === product.id && item.size === size);
          if (existing) {
            return current.map((item) =>
              item.product.id === product.id && item.size === size
                ? { ...item, quantity: item.quantity + quantity }
                : item
            );
          }
          return [...current, { product, quantity, size }];
        });
        setIsDrawerOpen(true);
      },
      removeItem(productId, size) {
        setItems((current) => current.filter((item) => !(item.product.id === productId && item.size === size)));
      },
      updateQuantity(productId, size, quantity) {
        if (quantity < 1) {
          setItems((current) => current.filter((item) => !(item.product.id === productId && item.size === size)));
          return;
        }
        setItems((current) =>
          current.map((item) =>
            item.product.id === productId && item.size === size ? { ...item, quantity } : item
          )
        );
      },
      clearCart() {
        setItems([]);
      },
      openDrawer() {
        setIsDrawerOpen(true);
      },
      closeDrawer() {
        setIsDrawerOpen(false);
      },
      itemCount,
      subtotal
    };
  }, [isHydrated, items, isDrawerOpen]);

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const context = useContext(CartContext);
  if (!context) throw new Error("useCart must be used within CartProvider");
  return context;
}
