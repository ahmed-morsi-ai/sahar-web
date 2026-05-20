"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCart } from "@/lib/cart";
import type { CheckoutCustomer } from "@/types/cart";
import { getCartItemUnitPrice } from "@/lib/whatsapp";
import { formatPrice, shippingFee } from "@/lib/utils";
import { LuxuryButton } from "@/components/ui/luxury-button";
import { createOrderSchema } from "@/lib/validations/order";
import type { PaymentMethodValue } from "@/types/order";
import { resolveProductImage } from "@/lib/media-utils";

const initialForm: CheckoutCustomer = {
  fullName: "",
  phone: "",
  email: "",
  city: "",
  address: "",
  notes: "",
  paymentMethod: "Cash on delivery"
};

export function CheckoutForm() {
  const router = useRouter();
  const { items, isHydrated, subtotal, clearCart } = useCart();
  const [form, setForm] = useState(initialForm);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const orderShipping = items.length ? shippingFee : 0;
  const orderTotal = items.length ? subtotal + orderShipping : 0;

  function update<K extends keyof CheckoutCustomer>(key: K, value: CheckoutCustomer[K]) {
    setForm((current) => ({ ...current, [key]: value }));
  }

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!items.length) {
      setError("Your cart is empty.");
      return;
    }
    if (!form.fullName.trim() || !form.phone.trim() || !form.city.trim() || !form.address.trim()) {
      setError("Please complete your name, phone, city, and address.");
      return;
    }
    const payload = {
      customerName: form.fullName,
      customerPhone: form.phone,
      customerEmail: form.email,
      city: form.city,
      address: form.address,
      notes: form.notes,
      paymentMethod: toPaymentMethodValue(form.paymentMethod),
      items: items.map((item) => ({
        productId: item.product.id,
        productSlug: item.product.slug,
        productName: item.product.name,
        productImage: resolveProductImage(item.product.image),
        size: item.size,
        quantity: item.quantity
      }))
    };

    const parsed = createOrderSchema.safeParse(payload);
    if (!parsed.success) {
      setError(parsed.error.issues[0]?.message ?? "Please check your order details.");
      return;
    }

    setError("");
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(parsed.data)
      });
      const result = (await response.json()) as { orderNumber?: string; whatsappUrl?: string; error?: string };

      if (!response.ok || !result.orderNumber || !result.whatsappUrl) {
        setError(result.error ?? "We could not save your order. Please try again.");
        return;
      }

      clearCart();
      window.open(result.whatsappUrl, "_blank", "noopener,noreferrer");
      const successParams = new URLSearchParams({ orderNumber: result.orderNumber });
      router.push(`/order-success?${successParams.toString()}`);
    } catch {
      setError("We could not reach the order server. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  }

  if (!isHydrated) {
    return (
      <div className="rounded-[1.25rem] border border-gold/15 bg-white/[0.045] p-6 text-center backdrop-blur-xl sm:rounded-[1.5rem] sm:p-8 sm:backdrop-blur-2xl">
        <p className="font-serif text-2xl text-ivory sm:text-3xl">Preparing your cart...</p>
        <p className="mt-3 text-sm text-ivory/55">Your Sahar order summary is loading.</p>
      </div>
    );
  }

  if (!items.length) {
    return (
      <div className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_380px]">
        <div className="rounded-[1.25rem] border border-gold/15 bg-white/[0.045] p-6 text-center backdrop-blur-xl sm:rounded-[1.5rem] sm:p-8 sm:backdrop-blur-2xl">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full border border-gold/30 bg-emerald/10 font-serif text-3xl text-gold sm:h-16 sm:w-16 sm:text-4xl">
            س
          </div>
          <p className="mt-6 font-serif text-3xl text-ivory sm:text-4xl">Your cart is empty.</p>
          <p className="mx-auto mt-3 max-w-lg text-ivory/60">
            Add a fragrance before confirming your order.
          </p>
          <Link
            href="/shop"
            className="mt-8 inline-flex h-12 w-full items-center justify-center rounded-full bg-gold px-7 text-sm font-semibold uppercase tracking-[0.16em] text-night transition hover:bg-ivory sm:w-auto"
          >
            Shop Collection
          </Link>
        </div>
        <aside className="h-fit rounded-[1.25rem] border border-gold/15 bg-white/[0.045] p-5 backdrop-blur-xl sm:rounded-[1.5rem] sm:p-7 sm:backdrop-blur-2xl">
          <p className="font-serif text-2xl text-ivory sm:text-3xl">Order Summary</p>
          <div className="mt-6 space-y-2 text-sm text-ivory/65">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(0)}</span>
            </div>
            <div className="flex justify-between">
              <span>Shipping</span>
              <span>{formatPrice(0)}</span>
            </div>
            <div className="flex justify-between pt-3 font-serif text-2xl text-ivory sm:text-3xl">
              <span>Total</span>
              <span>{formatPrice(0)}</span>
            </div>
          </div>
        </aside>
      </div>
    );
  }

  return (
    <form onSubmit={submit} className="grid gap-6 sm:gap-8 lg:grid-cols-[1fr_420px]">
      <div className="rounded-[1.25rem] border border-gold/15 bg-white/[0.045] p-4 backdrop-blur-xl sm:rounded-[1.5rem] sm:p-7 sm:backdrop-blur-2xl">
        <p className="mb-5 font-serif text-2xl text-ivory sm:mb-6 sm:text-3xl">Customer Information</p>
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full name" value={form.fullName} onChange={(value) => update("fullName", value)} required />
          <Field label="Phone number" value={form.phone} onChange={(value) => update("phone", value)} required />
          <Field label="Email" value={form.email} onChange={(value) => update("email", value)} type="email" />
          <Field label="City" value={form.city} onChange={(value) => update("city", value)} required />
          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm text-ivory/65">Address</span>
            <textarea
              required
              value={form.address}
              onChange={(event) => update("address", event.target.value)}
              rows={4}
              className="w-full rounded-2xl border border-gold/15 bg-night/65 px-4 py-3 text-ivory placeholder:text-ivory/35 focus:border-gold/50 focus:ring-gold/20"
            />
          </label>
          <label className="sm:col-span-2">
            <span className="mb-2 block text-sm text-ivory/65">Notes</span>
            <textarea
              value={form.notes}
              onChange={(event) => update("notes", event.target.value)}
              rows={3}
              className="w-full rounded-2xl border border-gold/15 bg-night/65 px-4 py-3 text-ivory placeholder:text-ivory/35 focus:border-gold/50 focus:ring-gold/20"
            />
          </label>
        </div>

        <div className="mt-8">
          <p className="mb-4 font-serif text-xl text-ivory sm:text-2xl">Payment Method</p>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-3">
            {(["Cash on delivery", "Vodafone Cash", "InstaPay"] as const).map((method) => (
              <label
                key={method}
                className={`cursor-pointer rounded-2xl border p-4 text-sm transition ${
                  form.paymentMethod === method
                    ? "border-gold bg-gold/10 text-gold"
                    : "border-gold/15 bg-white/[0.03] text-ivory/65"
                }`}
              >
                <input
                  type="radio"
                  name="payment"
                  value={method}
                  checked={form.paymentMethod === method}
                  onChange={() => update("paymentMethod", method)}
                  className="sr-only"
                />
                {method}
              </label>
            ))}
          </div>
        </div>
      </div>

      <aside className="h-fit rounded-[1.25rem] border border-gold/15 bg-white/[0.045] p-5 backdrop-blur-xl sm:rounded-[1.5rem] sm:p-7 sm:backdrop-blur-2xl lg:sticky lg:top-28">
        <p className="font-serif text-2xl text-ivory sm:text-3xl">Order Summary</p>
        <div className="mt-6 space-y-4">
          {items.map((item) => (
            <div key={`${item.product.id}-${item.size}`} className="flex justify-between gap-4 border-b border-gold/10 pb-4">
              <div>
                <p className="text-ivory">{item.product.name}</p>
                <p className="text-xs uppercase tracking-[0.18em] text-ivory/40">
                  {item.size} x {item.quantity}
                </p>
              </div>
              <p className="text-gold">{formatPrice(getCartItemUnitPrice(item) * item.quantity)}</p>
            </div>
          ))}
        </div>
        <div className="mt-6 space-y-2 text-sm text-ivory/65">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatPrice(subtotal)}</span>
          </div>
          <div className="flex justify-between">
            <span>Shipping</span>
            <span>{formatPrice(orderShipping)}</span>
          </div>
          <div className="flex justify-between pt-3 font-serif text-2xl text-ivory sm:text-3xl">
            <span>Total</span>
            <span>{formatPrice(orderTotal)}</span>
          </div>
        </div>
        {error ? <p className="mt-4 rounded-xl border border-red-400/30 bg-red-500/10 p-3 text-sm text-red-200">{error}</p> : null}
        <LuxuryButton type="submit" className="mt-6 w-full" disabled={!items.length || isSubmitting}>
          {isSubmitting ? "Saving Order..." : "Save Order & Open WhatsApp"}
        </LuxuryButton>
      </aside>
    </form>
  );
}

function toPaymentMethodValue(method: CheckoutCustomer["paymentMethod"]): PaymentMethodValue {
  if (method === "Vodafone Cash") return "VODAFONE_CASH";
  if (method === "InstaPay") return "INSTAPAY";
  return "CASH_ON_DELIVERY";
}

function Field({
  label,
  value,
  onChange,
  type = "text",
  required
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  required?: boolean;
}) {
  return (
    <label>
      <span className="mb-2 block text-sm text-ivory/65">{label}</span>
      <input
        type={type}
        required={required}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="h-12 w-full rounded-full border border-gold/15 bg-night/65 px-4 text-ivory placeholder:text-ivory/35 focus:border-gold/50 focus:ring-gold/20"
      />
    </label>
  );
}
