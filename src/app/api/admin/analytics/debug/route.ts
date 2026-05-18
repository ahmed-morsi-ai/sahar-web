import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getAnalyticsDebugEvents } from "@/lib/analytics";

export const dynamic = "force-dynamic";

async function requireAdmin() {
  const session = await getServerSession(authOptions);
  return session?.user.role === "ADMIN";
}

export async function GET() {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const events = await getAnalyticsDebugEvents();
    return NextResponse.json({ events });
  } catch (error) {
    if (process.env.NODE_ENV !== "production") {
      console.error("[analytics:debug:error]", error);
    }

    return NextResponse.json({ error: "Could not load analytics debug events." }, { status: 500 });
  }
}
