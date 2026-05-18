import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { createProduct, getAdminProducts, type ProductStatusFilter } from "@/lib/actions/products";
import { productWriteSchema } from "@/lib/validations/product";

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

    const url = new URL(request.url);
    const products = await getAdminProducts({
      query: url.searchParams.get("q") ?? undefined,
      status: (url.searchParams.get("status") ?? "ALL") as ProductStatusFilter,
      category: url.searchParams.get("category") ?? undefined
    });

    return NextResponse.json({ products });
  } catch {
    return NextResponse.json({ error: "Could not load products." }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    if (!(await requireAdmin())) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const parsed = productWriteSchema.safeParse(body);

    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.issues[0]?.message ?? "Invalid product data." }, { status: 400 });
    }

    const product = await createProduct(parsed.data);
    return NextResponse.json({ product }, { status: 201 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create product.";
    const status = message.includes("slug") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
