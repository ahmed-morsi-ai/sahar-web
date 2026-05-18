import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { getOrders } from "@/lib/actions/admin";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const url = new URL(request.url);
    const orders = await getOrders({
      query: url.searchParams.get("q") ?? undefined,
      status: (url.searchParams.get("status") ?? "ALL") as never,
      paymentMethod: (url.searchParams.get("paymentMethod") ?? "ALL") as never
    });

    return NextResponse.json({ orders });
  } catch {
    return NextResponse.json({ error: "Could not load orders." }, { status: 500 });
  }
}
