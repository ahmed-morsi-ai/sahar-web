"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef } from "react";
import { usePathname } from "next/navigation";

type AnalyticsEventType =
  | "page_view"
  | "product_view"
  | "engaged"
  | "shop_view"
  | "add_to_cart"
  | "view_details"
  | "shop_now_click"
  | "story_click"
  | "contact_click"
  | "session_ping";

type TrackEventInput = {
  type: AnalyticsEventType;
  path?: string;
  productSlug?: string;
  productName?: string;
  referrer?: string;
  metadata?: Record<string, unknown>;
};

type AnalyticsContextValue = {
  track: (event: TrackEventInput) => void;
};

const visitorStorageKey = "sahar_visitor_id";
const sessionStorageKey = "sahar_session_id";
const lastActivityStorageKey = "sahar_last_activity_at";
const engagedSessionStorageKey = "sahar_engaged_session_id";
const legacyVisitorStorageKey = "sahar-analytics-visitor-id";
const legacySessionStorageKey = "sahar-analytics-session-id";
const sessionTimeoutMs = 30 * 60 * 1000;
const AnalyticsContext = createContext<AnalyticsContextValue>({ track: () => undefined });

function createAnalyticsId(prefix: string) {
  const random = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;

  return `${prefix}_${random}`;
}

function isExcludedPath(path: string) {
  return path === "/admin" || path.startsWith("/admin/") || path.startsWith("/api");
}

function getCurrentPath() {
  return `${window.location.pathname}${window.location.search}`;
}

function getStoredIds() {
  const now = Date.now();
  let visitorId = window.localStorage.getItem(visitorStorageKey) ?? window.localStorage.getItem(legacyVisitorStorageKey);
  let sessionId = window.sessionStorage.getItem(sessionStorageKey) ?? window.sessionStorage.getItem(legacySessionStorageKey);
  const lastActivityAt = Number(window.localStorage.getItem(lastActivityStorageKey) ?? 0);

  if (!visitorId) {
    visitorId = createAnalyticsId("visitor");
  }

  window.localStorage.setItem(visitorStorageKey, visitorId);

  if (!sessionId || !lastActivityAt || now - lastActivityAt > sessionTimeoutMs) {
    sessionId = createAnalyticsId("session");
    window.sessionStorage.setItem(sessionStorageKey, sessionId);
    window.sessionStorage.removeItem(engagedSessionStorageKey);
  }

  window.sessionStorage.setItem(sessionStorageKey, sessionId);
  window.localStorage.setItem(lastActivityStorageKey, String(now));

  return { visitorId, sessionId };
}

function sendPayload(payload: Record<string, unknown>, useBeacon = false) {
  const body = JSON.stringify(payload);

  if (useBeacon && "sendBeacon" in navigator) {
    const blob = new Blob([body], { type: "application/json" });
    navigator.sendBeacon("/api/analytics/track", blob);
    return;
  }

  void fetch("/api/analytics/track", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    keepalive: true
  }).catch((error) => {
    if (process.env.NODE_ENV !== "production") {
      console.debug("[analytics:client:error]", error);
    }
  });
}

function shouldMarkEngaged(type: AnalyticsEventType) {
  return ["add_to_cart", "view_details", "shop_now_click", "story_click", "contact_click"].includes(type);
}

export function AnalyticsTracker({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const lastPageViewPathRef = useRef("");

  const sendEngaged = useCallback((
    ids: { visitorId: string; sessionId: string },
    path: string,
    reason: string,
    metadata?: Record<string, unknown>,
    beacon = false
  ) => {
    if (window.sessionStorage.getItem(engagedSessionStorageKey) === ids.sessionId) return;

    window.sessionStorage.setItem(engagedSessionStorageKey, ids.sessionId);
    sendPayload({
      ...ids,
      type: "engaged",
      path,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      metadata: {
        ...metadata,
        reason,
        visibilityState: document.visibilityState
      }
    }, beacon);
  }, []);

  const track = useCallback((event: TrackEventInput, options?: { beacon?: boolean }) => {
    if (typeof window === "undefined") return;

    const path = event.path ?? getCurrentPath();
    if (isExcludedPath(path)) return;

    const ids = getStoredIds();
    if (shouldMarkEngaged(event.type)) {
      sendEngaged(ids, path, `button:${event.type}`, event.metadata, options?.beacon);
    }

    const payload = {
      ...ids,
      type: event.type,
      path,
      productSlug: event.productSlug,
      productName: event.productName,
      referrer: event.referrer ?? (event.type === "page_view" ? document.referrer : undefined),
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      metadata: {
        ...event.metadata,
        visibilityState: document.visibilityState
      }
    };

    if (process.env.NODE_ENV !== "production") {
      console.debug("[analytics:client]", payload);
    }

    sendPayload(payload, options?.beacon);
  }, [sendEngaged]);

  const contextValue = useMemo<AnalyticsContextValue>(() => ({ track }), [track]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const path = getCurrentPath();
    if (isExcludedPath(path)) return;
    if (lastPageViewPathRef.current === path) return;
    lastPageViewPathRef.current = path;

    track({
      type: "page_view",
      path,
      referrer: document.referrer,
      metadata: {
        referrer: document.referrer,
        title: document.title,
        userAgent: navigator.userAgent
      }
    });
  }, [pathname, track]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const path = getCurrentPath();
    if (isExcludedPath(path)) return;

    const sendPing = (metadata?: Record<string, unknown>, beacon = false) => {
      track({
        type: "session_ping",
        path: getCurrentPath(),
        metadata
      }, { beacon });
    };

    const markCurrentSessionEngaged = (reason: string, beacon = false) => {
      const currentPath = getCurrentPath();
      if (isExcludedPath(currentPath)) return;
      sendEngaged(getStoredIds(), currentPath, reason, undefined, beacon);
    };

    const engagedTimer = window.setTimeout(() => {
      markCurrentSessionEngaged("time_15s");
    }, 15_000);

    const interval = window.setInterval(() => {
      if (document.visibilityState === "visible") {
        sendPing({ lifecycle: "interval" });
      }
    }, 15_000);

    const onScroll = () => {
      const scrollableHeight = document.documentElement.scrollHeight - window.innerHeight;
      if (scrollableHeight <= 0) return;

      const scrollDepth = window.scrollY / scrollableHeight;
      if (scrollDepth >= 0.4) {
        markCurrentSessionEngaged("scroll_40_percent");
      }
    };
    const onClick = (event: MouseEvent) => {
      const target = event.target instanceof Element ? event.target : null;

      if (target?.closest("button,a,[role='button']")) {
        markCurrentSessionEngaged("click");
      }
    };
    const onVisibilityChange = () => {
      sendPing({ lifecycle: document.visibilityState === "hidden" ? "visibility_hidden" : "visibility_visible" }, document.visibilityState === "hidden");
    };
    const onBeforeUnload = () => {
      sendPing({ lifecycle: "beforeunload", ended: true }, true);
    };
    const onPageHide = () => {
      sendPing({ lifecycle: "pagehide", ended: true }, true);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("click", onClick);
    document.addEventListener("visibilitychange", onVisibilityChange);
    window.addEventListener("beforeunload", onBeforeUnload);
    window.addEventListener("pagehide", onPageHide);

    return () => {
      window.clearTimeout(engagedTimer);
      window.clearInterval(interval);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("click", onClick);
      document.removeEventListener("visibilitychange", onVisibilityChange);
      window.removeEventListener("beforeunload", onBeforeUnload);
      window.removeEventListener("pagehide", onPageHide);
    };
  }, [pathname, sendEngaged, track]);

  return <AnalyticsContext.Provider value={contextValue}>{children}</AnalyticsContext.Provider>;
}

export function useAnalytics() {
  return useContext(AnalyticsContext);
}
