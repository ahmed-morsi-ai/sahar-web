import {
  Activity,
  BarChart3,
  Clock3,
  Contact,
  Eye,
  MousePointerClick,
  PackageSearch,
  ShoppingBag,
  Target,
  Users
} from "lucide-react";
import Link from "next/link";
import { AdminHeader } from "@/components/admin/AdminHeader";
import {
  analyticsPeriods,
  getAnalyticsSummary,
  normalizeAnalyticsPeriod,
  type AnalyticsPeriod
} from "@/lib/analytics";

export const dynamic = "force-dynamic";

const numberFormatter = new Intl.NumberFormat("en-US");

function formatNumber(value: number) {
  return numberFormatter.format(value);
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = seconds % 60;

  if (minutes <= 0) return `${remainingSeconds}s`;
  return `${minutes}m ${remainingSeconds.toString().padStart(2, "0")}s`;
}

const periodLabels: Record<AnalyticsPeriod, string> = {
  today: "Today",
  "7d": "Last 7 days",
  "30d": "Last 30 days",
  all: "All time"
};

function PeriodFilter({ activePeriod }: { activePeriod: AnalyticsPeriod }) {
  return (
    <div className="mb-6 flex flex-wrap gap-2">
      {analyticsPeriods.map((period) => {
        const active = period === activePeriod;

        return (
          <Link
            key={period}
            href={`/admin/analytics?period=${period}`}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
              active
                ? "border-gold bg-gold text-night"
                : "border-gold/15 bg-white/[0.035] text-ivory/58 hover:border-gold/40 hover:text-gold"
            }`}
          >
            {periodLabels[period]}
          </Link>
        );
      })}
    </div>
  );
}

function AnalyticsCard({
  label,
  value,
  icon: Icon,
  helper
}: {
  label: string;
  value: string | number;
  icon: typeof Users;
  helper?: string;
}) {
  return (
    <div className="rounded-2xl border border-gold/15 bg-white/[0.045] p-5 shadow-glow backdrop-blur-2xl">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-ivory/58">{label}</p>
        <span className="grid h-10 w-10 place-items-center rounded-full border border-gold/20 bg-emerald/10 text-gold">
          <Icon className="h-4 w-4" />
        </span>
      </div>
      <p className="mt-4 font-serif text-3xl text-ivory">{typeof value === "number" ? formatNumber(value) : value}</p>
      {helper ? <p className="mt-2 text-xs text-ivory/42">{helper}</p> : null}
    </div>
  );
}

function EmptyState() {
  return (
    <div className="rounded-2xl border border-gold/15 bg-white/[0.045] p-8 text-center shadow-glow backdrop-blur-2xl">
      <BarChart3 className="mx-auto h-8 w-8 text-gold" />
      <p className="mt-4 font-serif text-3xl text-ivory">No analytics collected yet</p>
      <p className="mx-auto mt-3 max-w-xl text-sm leading-6 text-ivory/55">
        Open the public site, visit product pages, and interact with the shop. This dashboard will show real database
        events as soon as they are recorded.
      </p>
    </div>
  );
}

function DailyVisitorsChart({ data }: { data: { date: string; visitors: number }[] }) {
  const maxVisitors = Math.max(1, ...data.map((item) => item.visitors));

  return (
    <section className="rounded-2xl border border-gold/15 bg-white/[0.045] p-5 shadow-glow backdrop-blur-2xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-gold/70">Last 14 Days</p>
          <h2 className="mt-2 font-serif text-3xl text-ivory">Daily Visitors</h2>
        </div>
        <Activity className="h-5 w-5 text-gold" />
      </div>
      <div className="flex h-64 items-end gap-2">
        {data.map((item) => {
          const height = Math.max(4, Math.round((item.visitors / maxVisitors) * 100));
          const label = item.date.slice(5).replace("-", "/");

          return (
            <div key={item.date} className="flex min-w-0 flex-1 flex-col items-center gap-2">
              <div className="flex h-48 w-full items-end rounded-full bg-night/55 p-1">
                <div
                  className="w-full rounded-full bg-gradient-to-t from-emerald to-gold"
                  style={{ height: `${height}%` }}
                  title={`${item.date}: ${item.visitors} visitors`}
                />
              </div>
              <span className="text-[10px] text-ivory/42">{label}</span>
            </div>
          );
        })}
      </div>
    </section>
  );
}

function ProductTable({
  title,
  rows,
  emptyLabel
}: {
  title: string;
  rows: { productSlug: string; productName: string; count: number }[];
  emptyLabel: string;
}) {
  return (
    <section className="rounded-2xl border border-gold/15 bg-white/[0.045] p-5 shadow-glow backdrop-blur-2xl">
      <h2 className="font-serif text-3xl text-ivory">{title}</h2>
      {rows.length ? (
        <div className="mt-5 divide-y divide-gold/10">
          {rows.map((row, index) => (
            <div key={`${row.productSlug}-${index}`} className="grid grid-cols-[1fr_auto] gap-4 py-4">
              <div className="min-w-0">
                <p className="truncate font-semibold text-ivory">{row.productName}</p>
                <p className="mt-1 truncate text-xs text-ivory/42">{row.productSlug}</p>
              </div>
              <p className="font-serif text-2xl text-gold">{formatNumber(row.count)}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="mt-5 rounded-2xl border border-gold/10 bg-night/45 p-5 text-sm text-ivory/55">{emptyLabel}</p>
      )}
    </section>
  );
}

function ConversionFunnel({ funnel }: { funnel: Record<string, number> }) {
  const steps = [
    ["Visitors", funnel.visitors],
    ["Shop", funnel.shop_view],
    ["Product", funnel.product_view],
    ["Details", funnel.view_details],
    ["Cart", funnel.add_to_cart],
    ["Contact", funnel.contact_click]
  ] as const;
  const max = Math.max(1, ...steps.map(([, value]) => value));

  return (
    <section className="rounded-2xl border border-gold/15 bg-white/[0.045] p-5 shadow-glow backdrop-blur-2xl">
      <div className="mb-5 flex items-center justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.24em] text-gold/70">Conversion Funnel</p>
          <h2 className="mt-2 font-serif text-3xl text-ivory">Visitor Journey</h2>
        </div>
        <Target className="h-5 w-5 text-gold" />
      </div>
      <div className="space-y-4">
        {steps.map(([label, value]) => (
          <div key={label}>
            <div className="mb-2 flex items-center justify-between gap-4 text-sm">
              <span className="text-ivory/62">{label}</span>
              <span className="font-semibold text-gold">{formatNumber(value)}</span>
            </div>
            <div className="h-3 overflow-hidden rounded-full bg-night/65">
              <div className="h-full rounded-full bg-gradient-to-r from-emerald to-gold" style={{ width: `${Math.round((value / max) * 100)}%` }} />
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

export default async function AdminAnalyticsPage({
  searchParams
}: {
  searchParams: Promise<{ period?: string | string[] }>;
}) {
  const params = await searchParams;
  const periodValue = Array.isArray(params.period) ? params.period[0] : params.period;
  const period = normalizeAnalyticsPeriod(periodValue);
  let summary: Awaited<ReturnType<typeof getAnalyticsSummary>>;

  try {
    summary = await getAnalyticsSummary(period);
  } catch {
    return (
      <div>
        <AdminHeader title="Analytics" copy="Real visitor analytics from the Sahar database." />
        <PeriodFilter activePeriod={period} />
        <div className="rounded-2xl border border-red-400/25 bg-red-500/10 p-6 text-red-100 backdrop-blur-2xl">
          Analytics could not be loaded. Check the database connection and Prisma migration.
        </div>
      </div>
    );
  }

  const hasData = summary.uniqueVisitors > 0 || summary.sessions > 0 || summary.pageViews > 0;

  return (
    <div>
      <AdminHeader
        title="Analytics"
        copy={`Real visitor, session, product, cart, and contact behavior stored in the database. Showing ${periodLabels[period]}.`}
      />
      <PeriodFilter activePeriod={period} />

      {!hasData ? <EmptyState /> : null}

      <div className="mt-6 grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <AnalyticsCard label="Unique Visitors" value={summary.uniqueVisitors} icon={Users} helper="Distinct visitorId in this period" />
        <AnalyticsCard label="Sessions" value={summary.sessions} icon={Activity} helper="Distinct sessionId in this period" />
        <AnalyticsCard label="Page Views" value={summary.pageViews} icon={Eye} helper="page_view events" />
        <AnalyticsCard label="Engaged Visitors" value={summary.engagedVisitors} icon={Target} helper="Distinct visitors with engaged event" />
        <AnalyticsCard label="Product Viewers" value={summary.productViewers} icon={PackageSearch} helper="Distinct visitors on product pages" />
        <AnalyticsCard label="Product Views" value={summary.productViews} icon={PackageSearch} helper="product_view events" />
        <AnalyticsCard label="Product Detail Views" value={summary.productDetailViews} icon={MousePointerClick} helper="View Details clicks" />
        <AnalyticsCard label="Shop Visitors" value={summary.shopVisitors} icon={ShoppingBag} helper="Distinct visitors with shop_view" />
        <AnalyticsCard label="Avg. Session" value={formatDuration(summary.averageSessionDuration)} icon={Clock3} />
        <AnalyticsCard label="Active Today" value={summary.activeVisitorsToday} icon={MousePointerClick} helper="Always based on today's events" />
        <AnalyticsCard label="Visitors Last 7 Days" value={summary.visitorsLast7Days} icon={Users} />
        <AnalyticsCard label="Visitors Last 30 Days" value={summary.visitorsLast30Days} icon={Users} />
        <AnalyticsCard label="Add To Cart" value={summary.addToCartCount} icon={ShoppingBag} />
        <AnalyticsCard label="Contact Clicks" value={summary.contactClicks} icon={Contact} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-[1.1fr_.9fr]">
        <DailyVisitorsChart data={summary.dailyVisitorsChart} />
        <ConversionFunnel funnel={summary.conversionFunnel} />
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-2">
        <ProductTable
          title="Top Products By Views"
          rows={summary.topProductsByViews}
          emptyLabel="No product views recorded yet."
        />
        <ProductTable
          title="Top Products By Add To Cart"
          rows={summary.topProductsByAddToCart}
          emptyLabel="No add-to-cart events recorded yet."
        />
      </div>
    </div>
  );
}
