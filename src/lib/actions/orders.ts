import { prisma } from "@/lib/prisma";
import { shippingFee } from "@/lib/money";
import { generateOrderNumber } from "@/lib/order-number";
import { getOrderableProduct } from "@/lib/products";
import { createOrderSchema, updateOrderStatusSchema, type CreateOrderInput } from "@/lib/validations/order";
import { buildSavedOrderWhatsAppMessage, buildWhatsAppUrl } from "@/lib/whatsapp";
import type { OrderStatusValue } from "@/types/order";

function cleanOptional(value?: string | null) {
  const trimmed = value?.trim();
  return trimmed ? trimmed : null;
}

export async function createOrder(input: CreateOrderInput) {
  const parsed = createOrderSchema.safeParse(input);
  if (!parsed.success) {
    return {
      ok: false as const,
      message: parsed.error.issues[0]?.message ?? "Please check your order details."
    };
  }

  const data = parsed.data;
  const normalizedItems = await Promise.all(data.items.map(async (item) => {
    const product = await getOrderableProduct(item.productSlug, item.productId);
    if (!product) {
      throw new Error(`Product ${item.productName} is no longer available.`);
    }

    const size = product.sizes.find((entry) => entry.label === item.size);
    if (!size) {
      throw new Error(`${product.name} is not available in ${item.size}.`);
    }

    const price = product.price + size.priceModifier;
    const unitCost = product.costPrice;
    const profit = (price - unitCost) * item.quantity;

    return {
      productId: product.id,
      productName: product.name,
      productSlug: product.slug,
      productImage: product.image,
      size: size.label,
      price,
      unitCost,
      unitPrice: price,
      quantity: item.quantity,
      total: price * item.quantity,
      profit
    };
  }));

  const subtotal = normalizedItems.reduce((sum, item) => sum + item.total, 0);
  const shipping = shippingFee;
  const total = subtotal + shipping;
  const orderNumber = await generateOrderNumber();

  const whatsappMessage = buildSavedOrderWhatsAppMessage({
    orderNumber,
    customerName: data.customerName,
    customerPhone: data.customerPhone,
    customerEmail: cleanOptional(data.customerEmail),
    city: data.city,
    address: data.address,
    notes: cleanOptional(data.notes),
    paymentMethod: data.paymentMethod,
    items: normalizedItems,
    subtotal,
    shipping,
    total
  });

  const productRecords = await prisma.product.findMany({
    where: {
      slug: {
        in: normalizedItems.map((item) => item.productSlug)
      }
    },
    select: {
      id: true,
      slug: true
    }
  });
  const productIdBySlug = new Map(productRecords.map((product) => [product.slug, product.id]));

  const order = await prisma.order.create({
    data: {
      orderNumber,
      customerName: data.customerName,
      customerPhone: data.customerPhone,
      customerEmail: cleanOptional(data.customerEmail),
      city: data.city,
      address: data.address,
      notes: cleanOptional(data.notes),
      paymentMethod: data.paymentMethod,
      subtotal,
      shipping,
      total,
      whatsappMessage,
      items: {
        create: normalizedItems.map((item) => ({
          productId: productIdBySlug.get(item.productSlug),
          productName: item.productName,
          productSlug: item.productSlug,
          productImage: item.productImage,
          size: item.size,
          price: item.price,
          unitPrice: item.unitPrice,
          unitCost: item.unitCost,
          profit: item.profit,
          quantity: item.quantity,
          total: item.total
        }))
      }
    },
    include: {
      items: true
    }
  });

  return {
    ok: true as const,
    orderNumber: order.orderNumber,
    whatsappUrl: buildWhatsAppUrl(whatsappMessage),
    whatsappMessage
  };
}

export async function updateOrderStatus(orderId: string, input: { status: OrderStatusValue }) {
  const parsed = updateOrderStatusSchema.safeParse(input);
  if (!parsed.success) {
    throw new Error(parsed.error.issues[0]?.message ?? "Invalid order status.");
  }

  return prisma.order.update({
    where: { id: orderId },
    data: { status: parsed.data.status }
  });
}

export async function cancelOrder(orderId: string) {
  return prisma.order.update({
    where: { id: orderId },
    data: { status: "CANCELLED" }
  });
}

export async function deleteOrder(orderId: string) {
  return prisma.order.delete({
    where: { id: orderId }
  });
}
