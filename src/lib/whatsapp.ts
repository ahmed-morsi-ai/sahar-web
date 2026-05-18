import type { CartItem, CheckoutCustomer } from "@/types/cart";
import { shippingFee } from "@/lib/money";
import { paymentMethodLabels, type PaymentMethodValue } from "@/types/order";

export const whatsappNumber = process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? "201017082286";

export function buildWhatsAppUrl(message: string, phone = whatsappNumber) {
  return `https://wa.me/${phone}?text=${encodeURIComponent(message)}`;
}

export function buildProductWhatsAppMessage(productName: string, size: string, quantity = 1) {
  return `Hello Sahar, I want to order ${quantity} x ${productName} (${size}).`;
}

export function getCartItemUnitPrice(item: Pick<CartItem, "product" | "size">) {
  const selectedSize = item.product.sizes.find((size) => size.label === item.size);
  return item.product.price + (selectedSize?.priceModifier ?? 0);
}

export function buildCheckoutWhatsAppMessage(customer: CheckoutCustomer, items: CartItem[]) {
  const subtotal = items.reduce((sum, item) => sum + getCartItemUnitPrice(item) * item.quantity, 0);
  const total = subtotal + shippingFee;
  const products = items
    .map((item) => {
      const unitPrice = getCartItemUnitPrice(item);
      return `- ${item.product.name} (${item.size}) x ${item.quantity} = ${unitPrice * item.quantity} EGP`;
    })
    .join("\n");

  return [
    "New Sahar Order",
    "",
    `Customer: ${customer.fullName}`,
    `Phone: ${customer.phone}`,
    `Email: ${customer.email || "Not provided"}`,
    `City: ${customer.city}`,
    `Address: ${customer.address}`,
    `Payment: ${customer.paymentMethod}`,
    "",
    "Products:",
    products,
    "",
    `Subtotal: ${subtotal} EGP`,
    `Shipping: ${shippingFee} EGP`,
    `Total: ${total} EGP`,
    "",
    `Notes: ${customer.notes || "No notes"}`
  ].join("\n");
}

export function buildSavedOrderWhatsAppMessage({
  orderNumber,
  customerName,
  customerPhone,
  customerEmail,
  city,
  address,
  notes,
  paymentMethod,
  items,
  subtotal,
  shipping,
  total
}: {
  orderNumber: string;
  customerName: string;
  customerPhone: string;
  customerEmail?: string | null;
  city: string;
  address: string;
  notes?: string | null;
  paymentMethod: PaymentMethodValue;
  items: Array<{ productName: string; size: string; quantity: number; price: number }>;
  subtotal: number;
  shipping: number;
  total: number;
}) {
  const orderItems = items
    .map(
      (item, index) =>
        `${index + 1}. ${item.productName} - ${item.size} x ${item.quantity} - ${item.price * item.quantity} EGP`
    )
    .join("\n");

  return [
    "New Sahar Order",
    `Order Number: ${orderNumber}`,
    "",
    "Customer:",
    `Name: ${customerName}`,
    `Phone: ${customerPhone}`,
    `Email: ${customerEmail || "Not provided"}`,
    `City: ${city}`,
    `Address: ${address}`,
    "",
    "Items:",
    orderItems,
    "",
    "Payment:",
    `Method: ${paymentMethodLabels[paymentMethod]}`,
    `Subtotal: ${subtotal} EGP`,
    `Shipping: ${shipping} EGP`,
    `Total: ${total} EGP`,
    "",
    `Notes: ${notes || "No notes"}`
  ].join("\n");
}
