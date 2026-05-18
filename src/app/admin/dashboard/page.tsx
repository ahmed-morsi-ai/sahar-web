import Link from "next/link";
import { Banknote, CheckCircle2, Clock, PackageCheck, Percent, ShoppingBag, TrendingUp, Wallet, XCircle } from "lucide-react";
import { AdminHeader } from "@/components/admin/AdminHeader";
import { AdminStatCard } from "@/components/admin/AdminStatCard";
import { OrdersTable } from "@/components/admin/OrdersTable";
import { getDashboardStats, getRecentOrders } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  try {
    const [stats, recentOrders] = await Promise.all([getDashboardStats(), getRecentOrders(6)]);

    return (
      <div className="min-w-0">
        <AdminHeader
          title="Dashboard"
          copy="A private command room for Sahar orders, revenue, and fulfillment status."
        />

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <AdminStatCard label="Total Sales / Revenue" value={stats.totalRevenue} icon={Banknote} currency />
          <AdminStatCard label="Total Product Cost" value={stats.totalProductCost} icon={Wallet} currency />
          <AdminStatCard label="Net Profit" value={stats.netProfit} icon={TrendingUp} currency />
          <AdminStatCard label="Profit Margin" value={stats.profitMargin} icon={Percent} suffix="%" />
          <AdminStatCard label="Today Revenue" value={stats.todayRevenue} icon={TrendingUp} currency />
          <AdminStatCard label="Today Net Profit" value={stats.todayNetProfit} icon={Wallet} currency />
          <AdminStatCard label="Average Order Value" value={stats.averageOrderValue} icon={Banknote} currency />
          <AdminStatCard label="Total Orders" value={stats.totalOrders} icon={ShoppingBag} />
          <AdminStatCard label="Pending Orders" value={stats.pendingOrders} icon={Clock} />
          <AdminStatCard label="Confirmed Orders" value={stats.confirmedOrders} icon={CheckCircle2} />
          <AdminStatCard label="Delivered Orders" value={stats.deliveredOrders} icon={PackageCheck} />
          <AdminStatCard label="Cancelled Orders" value={stats.cancelledOrders} icon={XCircle} />
        </div>

        <div className="mt-8 grid min-w-0 gap-6 2xl:grid-cols-[minmax(0,1fr)_340px]">
          <section className="min-w-0">
            <div className="mb-4 flex items-center justify-between">
              <h2 className="font-serif text-3xl text-ivory">Recent Orders</h2>
            </div>
            <OrdersTable orders={recentOrders} />
          </section>

          <aside className="h-fit min-w-0 rounded-2xl border border-gold/15 bg-white/[0.045] p-5 backdrop-blur-2xl">
            <h2 className="font-serif text-3xl text-ivory">Quick Actions</h2>
            <div className="mt-5 grid gap-3">
              <Link href="/admin/orders?status=PENDING" className="rounded-2xl border border-gold/15 px-4 py-3 text-sm text-ivory/70 transition hover:border-gold/35 hover:text-gold">
                Review pending orders
              </Link>
              <Link href="/admin/orders?status=CONFIRMED" className="rounded-2xl border border-gold/15 px-4 py-3 text-sm text-ivory/70 transition hover:border-gold/35 hover:text-gold">
                Prepare confirmed orders
              </Link>
              <Link href="/shop" className="rounded-2xl border border-gold/15 px-4 py-3 text-sm text-ivory/70 transition hover:border-gold/35 hover:text-gold">
                View public store
              </Link>
              <Link href="/admin/analytics" className="rounded-2xl border border-gold/15 px-4 py-3 text-sm text-ivory/70 transition hover:border-gold/35 hover:text-gold">
                View real analytics
              </Link>
            </div>
          </aside>
        </div>
      </div>
    );
  } catch {
    return (
      <div>
        <AdminHeader title="Dashboard" copy="The admin dashboard could not load its data right now." />
        <div className="rounded-2xl border border-red-400/25 bg-red-500/10 p-6 text-red-100 backdrop-blur-2xl">
          <p className="font-serif text-3xl text-ivory">Dashboard unavailable</p>
          <p className="mt-3 max-w-2xl text-sm leading-6 text-red-100/75">
            The database or admin API did not respond. Check that `DATABASE_URL` is set to `file:./dev.db`, then restart
            the dev server on your current port.
          </p>
        </div>
      </div>
    );
  }
}
