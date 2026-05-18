import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAnalyticsSummary, normalizeAnalyticsPeriod } from "@/lib/analytics";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user.role === "ADMIN";
}

export async function GET(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const period = normalizeAnalyticsPeriod(new URL(request.url).searchParams.get("period"));
    const summary = await getAnalyticsSummary(period);
    return NextResponse.json(summary);
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[analytics:summary:error]", error);
    }

    return NextResponse.json({ error: "Could not load analytics summary." }, { status: 500 });
  }
}
