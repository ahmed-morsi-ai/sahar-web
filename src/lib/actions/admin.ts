import { prisma } from "@/lib/prisma";
import type { OrderStatusValue, PaymentMethodValue } from "@/types/order";

const revenueStatuses: OrderStatusValue[] = ["CONFIRMED", "DELIVERED"];

export async function getDashboardStats() {
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [totalOrders, pendingOrders, confirmedOrders, deliveredOrders, cancelledOrders, revenueOrders, todayOrders] =
    await Promise.all([
      prisma.order.count(),
      prisma.order.count({ where: { status: "PENDING" } }),
      prisma.order.count({ where: { status: "CONFIRMED" } }),
      prisma.order.count({ where: { status: "DELIVERED" } }),
      prisma.order.count({ where: { status: "CANCELLED" } }),
      prisma.order.findMany({
        // Revenue is recognized only after an order is confirmed or delivered.
        // Pending, processing, shipped, and cancelled orders are excluded from final revenue.
        where: { status: { in: revenueStatuses } },
        include: { items: true }
      }),
      prisma.order.findMany({
        where: {
          // Today revenue follows the same recognition rule as total revenue.
          status: { in: revenueStatuses },
          createdAt: { gte: today }
        },
        include: { items: true }
      })
    ]);

  const getOrderProductRevenue = (order: (typeof revenueOrders)[number]) =>
    order.items.reduce((sum, item) => sum + (item.unitPrice || item.price) * item.quantity, 0) || order.subtotal;
  const getOrderProductCost = (order: (typeof revenueOrders)[number]) =>
    order.items.reduce((sum, item) => sum + item.unitCost * item.quantity, 0);
  const getOrderProfit = (order: (typeof revenueOrders)[number]) =>
    order.items.reduce((sum, item) => sum + item.profit, 0);

  // Dashboard profit is product-only. Shipping is not counted as product revenue
  // or product cost, and cancelled/pending orders are excluded from recognized figures.
  const totalRevenue = revenueOrders.reduce((sum, order) => sum + getOrderProductRevenue(order), 0);
  const totalProductCost = revenueOrders.reduce((sum, order) => sum + getOrderProductCost(order), 0);
  const netProfit = revenueOrders.reduce((sum, order) => sum + getOrderProfit(order), 0);
  const todayRevenue = todayOrders.reduce((sum, order) => sum + getOrderProductRevenue(order), 0);
  const todayNetProfit = todayOrders.reduce((sum, order) => sum + getOrderProfit(order), 0);
  const profitMargin = totalRevenue ? Math.round((netProfit / totalRevenue) * 100) : 0;

  return {
    totalOrders,
    pendingOrders,
    confirmedOrders,
    deliveredOrders,
    cancelledOrders,
    totalRevenue,
    totalProductCost,
    netProfit,
    profitMargin,
    todayRevenue,
    todayNetProfit,
    averageOrderValue: revenueOrders.length ? Math.round(totalRevenue / revenueOrders.length) : 0
  };
}

export async function getRecentOrders(limit = 8) {
  return prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    take: limit,
    include: {
      items: true
    }
  });
}

export async function getOrders({
  query,
  status,
  paymentMethod
}: {
  query?: string;
  status?: OrderStatusValue | "ALL";
  paymentMethod?: PaymentMethodValue | "ALL";
}) {
  const search = query?.trim();

  return prisma.order.findMany({
    where: {
      ...(status && status !== "ALL" ? { status } : {}),
      ...(paymentMethod && paymentMethod !== "ALL" ? { paymentMethod } : {}),
      ...(search
        ? {
            OR: [
              { orderNumber: { contains: search } },
              { customerName: { contains: search } },
              { customerPhone: { contains: search } }
            ]
          }
        : {})
    },
    orderBy: { createdAt: "desc" },
    include: {
      items: true
    }
  });
}

export async function getOrderById(id: string) {
  return prisma.order.findUnique({
    where: { id },
    include: {
      items: true
    }
  });
}
