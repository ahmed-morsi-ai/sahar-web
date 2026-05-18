import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getDashboardStats, getRecentOrders } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const [stats, recentOrders] = await Promise.all([getDashboardStats(), getRecentOrders()]);
    return NextResponse.json({ stats, recentOrders });
  } catch {
    return NextResponse.json({ error: "Could not load dashboard data." }, { status: 500 });
  }
}
