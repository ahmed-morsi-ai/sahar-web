import Link from "next/link";
import type { Order, OrderItem } from "@prisma/client";
import { formatPrice } from "@/lib/money";
import { paymentMethodLabels, type OrderStatusValue, type PaymentMethodValue } from "@/types/order";
import { OrderStatusBadge } from "@/components/admin/OrderStatusBadge";

type OrderWithItems = Order & { items: OrderItem[] };

function getOrderProfit(order: OrderWithItems) {
  return order.items.reduce((sum, item) => sum + item.profit, 0);
}

export function OrdersTable({ orders }: { orders: OrderWithItems[] }) {
  if (!orders.length) {
    return (
      <div className="rounded-2xl border border-gold/15 bg-white/[0.045] p-10 text-center text-ivory/62">
        No orders found.
      </div>
    );
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-gold/15 bg-white/[0.045] backdrop-blur-2xl">
      <div className="hidden overflow-x-auto lg:block">
        <table className="w-full text-left text-sm">
          <thead className="border-b border-gold/10 text-xs uppercase tracking-[0.2em] text-gold/65">
            <tr>
              <th className="px-5 py-4">Order Number</th>
              <th className="px-5 py-4">Customer</th>
              <th className="px-5 py-4">Phone</th>
              <th className="px-5 py-4">City</th>
              <th className="px-5 py-4">Total</th>
              <th className="px-5 py-4">Profit</th>
              <th className="px-5 py-4">Payment</th>
              <th className="px-5 py-4">Status</th>
              <th className="px-5 py-4">Date</th>
              <th className="px-5 py-4" />
            </tr>
          </thead>
          <tbody className="divide-y divide-gold/10">
            {orders.map((order) => (
              <tr key={order.id} className="text-ivory/72">
                <td className="px-5 py-4 font-semibold text-ivory">{order.orderNumber}</td>
                <td className="px-5 py-4">{order.customerName}</td>
                <td className="px-5 py-4">{order.customerPhone}</td>
                <td className="px-5 py-4">{order.city}</td>
                <td className="px-5 py-4 text-gold">{formatPrice(order.total)}</td>
                <td className="px-5 py-4 text-emerald">{formatPrice(getOrderProfit(order))}</td>
                <td className="px-5 py-4">{paymentMethodLabels[order.paymentMethod as PaymentMethodValue]}</td>
                <td className="px-5 py-4">
                  <OrderStatusBadge status={order.status as OrderStatusValue} />
                </td>
                <td className="px-5 py-4">{order.createdAt.toLocaleDateString("en-GB")}</td>
                <td className="px-5 py-4">
                  <Link href={`/admin/orders/${order.id}`} className="text-gold transition hover:text-ivory">
                    View
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="grid gap-3 p-4 lg:hidden">
        {orders.map((order) => (
          <Link key={order.id} href={`/admin/orders/${order.id}`} className="rounded-2xl border border-gold/10 p-4">
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="font-semibold text-ivory">{order.orderNumber}</p>
                <p className="mt-1 text-sm text-ivory/58">{order.customerName}</p>
              </div>
              <OrderStatusBadge status={order.status as OrderStatusValue} />
            </div>
            <div className="mt-4 flex justify-between text-sm text-ivory/58">
              <span>{order.city}</span>
              <span className="text-gold">{formatPrice(order.total)}</span>
            </div>
            <div className="mt-2 flex justify-between text-sm text-ivory/58">
              <span>Profit</span>
              <span className="text-emerald">{formatPrice(getOrderProfit(order))}</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
