import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { cancelOrder, deleteOrder, updateOrderStatus } from "@/lib/actions/orders";
import { getOrderById } from "@/lib/actions/admin";
import { updateOrderStatusSchema } from "@/lib/validations/order";

export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const order = await getOrderById(id);
    if (!order) return NextResponse.json({ error: "Order not found" }, { status: 404 });

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Could not load order." }, { status: 500 });
  }
}

export async function PATCH(request: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const body = await request.json();
    const parsed = updateOrderStatusSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid status" }, { status: 400 });
    }

    const order = await updateOrderStatus(id, parsed.data);
    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Could not update order status." }, { status: 500 });
  }
}

export async function DELETE(request: Request, context: RouteContext) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const { id } = await context.params;
    const url = new URL(request.url);
    const hardDelete = url.searchParams.get("hard") === "true";
    const order = hardDelete ? await deleteOrder(id) : await cancelOrder(id);

    return NextResponse.json({ order });
  } catch {
    return NextResponse.json({ error: "Could not cancel order." }, { status: 500 });
  }
}
