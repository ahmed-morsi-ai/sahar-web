import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const maxFileSize = 80 * 1024 * 1024;
const allowedTypes = new Map([
  ["video/mp4", "mp4"]
]);

function safeSlug(value?: FormDataEntryValue | null) {
  const raw = typeof value === "string" ? value : "product";
  const slug = raw
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return slug || "product";
}

export async function POST(request: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (process.env.VERCEL) {
      return NextResponse.json(
        { error: "Product video uploads need persistent object storage in production." },
        { status: 501 }
      );
    }

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Choose a video file to upload." }, { status: 400 });
    }

    const extension = allowedTypes.get(file.type);
    if (!extension) {
      return NextResponse.json({ error: "Only MP4 videos are allowed." }, { status: 400 });
    }

    if (file.size > maxFileSize) {
      return NextResponse.json({ error: "Video must be 80MB or smaller." }, { status: 400 });
    }

    const slug = safeSlug(formData.get("slug"));
    const fileName = `${slug}-${Date.now()}.${extension}`;
    const uploadDir = path.join(process.cwd(), "public", "videos", "products");
    const destination = path.join(uploadDir, fileName);
    const bytes = Buffer.from(await file.arrayBuffer());

    await mkdir(uploadDir, { recursive: true });
    await writeFile(destination, bytes);

    return NextResponse.json({
      success: true,
      path: `/videos/products/${fileName}`
    });
  } catch {
    return NextResponse.json({ error: "Could not upload product video." }, { status: 500 });
  }
}
