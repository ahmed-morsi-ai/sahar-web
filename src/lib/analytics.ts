import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";

export const analyticsEventTypes = [
  "page_view",
  "product_view",
  "engaged",
  "shop_view",
  "add_to_cart",
  "view_details",
  "shop_now_click",
  "story_click",
  "contact_click",
  "session_ping"
] as const;

export const analyticsPeriods = ["today", "7d", "30d", "all"] as const;

export type AnalyticsEventType = (typeof analyticsEventTypes)[number];
export type AnalyticsPeriod = (typeof analyticsPeriods)[number];

export type TrackAnalyticsInput = {
  visitorId: string;
  sessionId: string;
  type: AnalyticsEventType;
  path: string;
  productSlug?: string | null;
  productName?: string | null;
  referrer?: string | null;
  userAgent?: string | null;
  timestamp?: string | null;
  metadata?: unknown;
};

export type AnalyticsSummary = Awaited<ReturnType<typeof getAnalyticsSummary>>;

const engagementScoreByType: Record<AnalyticsEventType, number> = {
  page_view: 1,
  shop_view: 2,
  product_view: 4,
  engaged: 10,
  view_details: 5,
  add_to_cart: 10,
  contact_click: 8,
  shop_now_click: 6,
  story_click: 3,
  session_ping: 0
};

function startOfDay(date: Date) {
  const next = new Date(date);
  next.setHours(0, 0, 0, 0);
  return next;
}

function addDays(date: Date, days: number) {
  const next = new Date(date);
  next.setDate(next.getDate() + days);
  return next;
}

function dayKey(date: Date) {
  return startOfDay(date).toISOString().slice(0, 10);
}

export function normalizeAnalyticsPeriod(value?: string | null): AnalyticsPeriod {
  return analyticsPeriods.includes(value as AnalyticsPeriod) ? (value as AnalyticsPeriod) : "all";
}

function periodStart(period: AnalyticsPeriod) {
  const today = startOfDay(new Date());

  if (period === "today") return today;
  if (period === "7d") return addDays(today, -6);
  if (period === "30d") return addDays(today, -29);

  return undefined;
}

function eventWhere(period: AnalyticsPeriod, type?: AnalyticsEventType): Prisma.AnalyticsEventWhereInput {
  const since = periodStart(period);

  return {
    ...(type ? { type } : {}),
    ...(since ? { createdAt: { gte: since } } : {})
  };
}

function sessionWhere(period: AnalyticsPeriod): Prisma.AnalyticsSessionWhereInput {
  const since = periodStart(period);
  return since ? { lastSeenAt: { gte: since } } : {};
}

function metadataToJson(value: unknown): Prisma.InputJsonValue | undefined {
  if (value === undefined) return undefined;

  try {
    return JSON.parse(JSON.stringify(value)) as Prisma.InputJsonValue;
  } catch {
    return { value: String(value) };
  }
}

function safeText(value: unknown, maxLength = 500) {
  return typeof value === "string" && value.trim() ? value.trim().slice(0, maxLength) : undefined;
}

function getMetadataString(metadata: unknown, key: string) {
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return undefined;
  return safeText((metadata as Record<string, unknown>)[key]);
}

function getHeader(headers: Headers, keys: string[]) {
  for (const key of keys) {
    const value = safeText(headers.get(key));
    if (value) return value;
  }

  return undefined;
}

function isExcludedAnalyticsPath(path: string) {
  const pathname = path.split("?")[0] ?? path;
  return pathname === "/admin" || pathname.startsWith("/admin/") || pathname === "/api" || pathname.startsWith("/api/");
}

function shouldEndSession(type: AnalyticsEventType, metadata: unknown) {
  if (type !== "session_ping") return false;
  if (!metadata || typeof metadata !== "object" || Array.isArray(metadata)) return false;

  const record = metadata as Record<string, unknown>;
  return record.ended === true || record.lifecycle === "beforeunload" || record.lifecycle === "pagehide";
}

function buildEventMetadata(input: TrackAnalyticsInput) {
  const base: Record<string, unknown> =
    input.metadata && typeof input.metadata === "object" && !Array.isArray(input.metadata)
      ? { ...(input.metadata as Record<string, unknown>) }
      : {};

  if (input.metadata !== undefined && (typeof input.metadata !== "object" || Array.isArray(input.metadata))) {
    base.value = input.metadata;
  }

  if (input.timestamp) base.timestamp = input.timestamp;
  if (input.referrer) base.referrer = input.referrer;
  if (input.userAgent) base.userAgent = input.userAgent;

  return Object.keys(base).length ? metadataToJson(base) : undefined;
}

export async function recordAnalyticsEvent(input: TrackAnalyticsInput, headers: Headers) {
  if (isExcludedAnalyticsPath(input.path)) {
    return { ok: true, ignored: true };
  }

  const now = new Date();
  const userAgent = safeText(input.userAgent) ?? getHeader(headers, ["user-agent"]);
  const country = getHeader(headers, ["x-vercel-ip-country", "cf-ipcountry"]);
  const city = getHeader(headers, ["x-vercel-ip-city"]);
  const metadata = buildEventMetadata(input);
  const referrer = safeText(input.referrer) ?? getMetadataString(input.metadata, "referrer") ?? getHeader(headers, ["referer"]);
  const score = engagementScoreByType[input.type];
  const pageViewIncrement = input.type === "page_view" ? 1 : 0;
  const productViewIncrement = input.type === "product_view" ? 1 : 0;
  const endedAt = shouldEndSession(input.type, input.metadata) ? now : null;

  await prisma.$transaction(async (tx) => {
    await tx.analyticsVisitor.upsert({
      where: { visitorId: input.visitorId },
      create: {
        visitorId: input.visitorId,
        firstSeenAt: now,
        lastSeenAt: now,
        userAgent,
        country,
        city
      },
      update: {
        lastSeenAt: now,
        userAgent,
        country,
        city
      }
    });

    const existingSession = await tx.analyticsSession.findUnique({
      where: { sessionId: input.sessionId },
      select: { startedAt: true, durationSeconds: true }
    });
    const startedAt = existingSession?.startedAt ?? now;
    const durationSeconds = Math.max(
      existingSession?.durationSeconds ?? 0,
      Math.round((now.getTime() - startedAt.getTime()) / 1000)
    );

    await tx.analyticsSession.upsert({
      where: { sessionId: input.sessionId },
      create: {
        sessionId: input.sessionId,
        visitorId: input.visitorId,
        startedAt,
        lastSeenAt: now,
        endedAt,
        durationSeconds,
        pageViews: pageViewIncrement,
        productViews: productViewIncrement,
        engagementScore: score,
        referrer,
        landingPage: input.path
      },
      update: {
        visitorId: input.visitorId,
        lastSeenAt: now,
        ...(endedAt ? { endedAt } : {}),
        durationSeconds,
        pageViews: { increment: pageViewIncrement },
        productViews: { increment: productViewIncrement },
        engagementScore: { increment: score }
      }
    });

    await tx.analyticsEvent.create({
      data: {
        visitorId: input.visitorId,
        sessionId: input.sessionId,
        type: input.type,
        path: input.path,
        productSlug: input.productSlug ?? null,
        productName: input.productName ?? null,
        metadata,
        createdAt: now
      }
    });
  });

  return { ok: true, ignored: false };
}

async function countDistinctEventVisitors(period: AnalyticsPeriod, type?: AnalyticsEventType) {
  const rows = await prisma.analyticsEvent.findMany({
    where: eventWhere(period, type),
    select: { visitorId: true },
    distinct: ["visitorId"]
  });

  return rows.length;
}

async function countDistinctEventSessions(period: AnalyticsPeriod) {
  const rows = await prisma.analyticsEvent.findMany({
    where: eventWhere(period),
    select: { sessionId: true },
    distinct: ["sessionId"]
  });

  return rows.length;
}

async function topProductsByEvent(type: "product_view" | "add_to_cart", period: AnalyticsPeriod) {
  const rows = await prisma.analyticsEvent.groupBy({
    by: ["productSlug", "productName"],
    where: {
      ...eventWhere(period, type),
      productSlug: { not: null }
    },
    _count: { _all: true }
  });

  return rows
    .map((row) => ({
      productSlug: row.productSlug ?? "unknown",
      productName: row.productName ?? row.productSlug ?? "Unknown product",
      count: row._count._all
    }))
    .sort((a, b) => b.count - a.count)
    .slice(0, 8);
}

export async function getAnalyticsSummary(periodInput: AnalyticsPeriod | string = "all") {
  const period = normalizeAnalyticsPeriod(periodInput);
  const today = startOfDay(new Date());
  const fourteenDaysAgo = addDays(today, -13);

  const [
    uniqueVisitors,
    sessions,
    activeVisitorsToday,
    visitorsLast7Days,
    visitorsLast30Days,
    pageViews,
    productViewers,
    productViews,
    engagedVisitors,
    shopVisitors,
    addToCartCount,
    viewDetailsCount,
    contactClicks,
    averageSessionDurationResult,
    topProductsByViews,
    topProductsByAddToCart,
    recentEvents,
    funnelShop,
    funnelProduct,
    funnelDetails,
    funnelCart,
    funnelContact
  ] = await Promise.all([
    countDistinctEventVisitors(period),
    countDistinctEventSessions(period),
    countDistinctEventVisitors("today"),
    countDistinctEventVisitors("7d"),
    countDistinctEventVisitors("30d"),
    prisma.analyticsEvent.count({ where: eventWhere(period, "page_view") }),
    countDistinctEventVisitors(period, "product_view"),
    prisma.analyticsEvent.count({ where: eventWhere(period, "product_view") }),
    countDistinctEventVisitors(period, "engaged"),
    countDistinctEventVisitors(period, "shop_view"),
    prisma.analyticsEvent.count({ where: eventWhere(period, "add_to_cart") }),
    prisma.analyticsEvent.count({ where: eventWhere(period, "view_details") }),
    prisma.analyticsEvent.count({ where: eventWhere(period, "contact_click") }),
    prisma.analyticsSession.aggregate({ where: sessionWhere(period), _avg: { durationSeconds: true } }),
    topProductsByEvent("product_view", period),
    topProductsByEvent("add_to_cart", period),
    prisma.analyticsEvent.findMany({
      where: { createdAt: { gte: fourteenDaysAgo } },
      select: { visitorId: true, createdAt: true }
    }),
    countDistinctEventVisitors(period, "shop_view"),
    countDistinctEventVisitors(period, "product_view"),
    countDistinctEventVisitors(period, "view_details"),
    countDistinctEventVisitors(period, "add_to_cart"),
    countDistinctEventVisitors(period, "contact_click")
  ]);

  const dailyVisitors = Array.from({ length: 14 }, (_, index) => {
    const date = addDays(fourteenDaysAgo, index);
    return {
      date: dayKey(date),
      visitors: 0
    };
  });
  const dailyVisitorSets = new Map(dailyVisitors.map((item) => [item.date, new Set<string>()]));

  for (const event of recentEvents) {
    dailyVisitorSets.get(dayKey(event.createdAt))?.add(event.visitorId);
  }

  const dailyVisitorsChart = dailyVisitors.map((item) => ({
    date: item.date,
    visitors: dailyVisitorSets.get(item.date)?.size ?? 0
  }));

  return {
    period,
    uniqueVisitors,
    totalVisitors: uniqueVisitors,
    sessions,
    totalSessions: sessions,
    activeVisitorsToday,
    visitorsLast7Days,
    visitorsLast30Days,
    pageViews,
    totalPageViews: pageViews,
    productViewers,
    productViews,
    totalProductViews: productViews,
    productDetailViews: viewDetailsCount,
    shopVisitors,
    engagedVisitors,
    averageSessionDuration: Math.round(averageSessionDurationResult._avg.durationSeconds ?? 0),
    addToCartCount,
    viewDetailsCount,
    contactClicks,
    topProductsByViews,
    topProductsByAddToCart,
    dailyVisitorsChart,
    conversionFunnel: {
      visitors: uniqueVisitors,
      shop_view: funnelShop,
      product_view: funnelProduct,
      view_details: funnelDetails,
      add_to_cart: funnelCart,
      contact_click: funnelContact
    }
  };
}

export async function getAnalyticsDebugEvents() {
  return prisma.analyticsEvent.findMany({
    orderBy: { createdAt: "desc" },
    take: 20,
    select: {
      id: true,
      visitorId: true,
      sessionId: true,
      type: true,
      path: true,
      productSlug: true,
      productName: true,
      metadata: true,
      createdAt: true
    }
  });
}
