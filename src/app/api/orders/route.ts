import { NextResponse } from "next/server";
import { createOrder } from "@/lib/actions/orders";
import { createOrderSchema } from "@/lib/validations/order";

export const dynamic = "force-dynamic";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = createOrderSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.issues[0]?.message ?? "Please check your order details." },
        { status: 400 }
      );
    }

    const result = await createOrder(parsed.data);

    if (!result.ok) {
      return NextResponse.json({ error: result.message }, { status: 400 });
    }

    return NextResponse.json(result, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create the order.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
