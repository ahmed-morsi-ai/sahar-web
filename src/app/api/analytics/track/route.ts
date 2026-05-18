import { NextResponse } from "next/server";
import { z } from "zod";
import { analyticsEventTypes, recordAnalyticsEvent } from "@/lib/analytics";

export const dynamic = "force-dynamic";

const trackSchema = z.object({
  visitorId: z.string().trim().min(8).max(160),
  sessionId: z.string().trim().min(8).max(160),
  type: z.enum(analyticsEventTypes),
  path: z.string().trim().min(1).max(500),
  productSlug: z.string().trim().max(180).optional(),
  productName: z.string().trim().max(180).optional(),
  referrer: z.string().trim().max(500).optional(),
  userAgent: z.string().trim().max(500).optional(),
  timestamp: z.string().trim().max(80).optional(),
  metadata: z.record(z.string(), z.unknown()).optional()
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = trackSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid analytics event." }, { status: 400 });
    }

    const result = await recordAnalyticsEvent(parsed.data, request.headers);

    if (process.env.NODE_ENV !== "production" && !result.ignored) {
      console.debug("[analytics:track]", {
        type: parsed.data.type,
        path: parsed.data.path,
        productSlug: parsed.data.productSlug
      });
    }

    return NextResponse.json(result);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[analytics:track:error]", error);
    }

    return NextResponse.json({ error: "Could not record analytics event." }, { status: 500 });
  }
}
