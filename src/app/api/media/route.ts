import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isRecoverablePrismaReadError } from "@/lib/prisma-errors";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export async function GET() {
  try {
    const assets = await prisma.mediaAsset.findMany({
      orderBy: { createdAt: "desc" },
      take: 100
    });

    return NextResponse.json({ assets });
  } catch (error) {
    if (isRecoverablePrismaReadError(error)) {
      return NextResponse.json({ assets: [], warning: "Media asset table is not available." });
    }

    return NextResponse.json({ error: "Could not load media assets." }, { status: 500 });
  }
}
