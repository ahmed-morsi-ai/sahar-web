import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const maxFileSize = 5 * 1024 * 1024;
const allowedTypes = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/jpg", "jpg"],
  ["image/webp", "webp"]
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

    const formData = await request.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Choose an image file to upload." }, { status: 400 });
    }

    const extension = allowedTypes.get(file.type);
    if (!extension) {
      return NextResponse.json({ error: "Only PNG, JPG, JPEG, and WEBP images are allowed." }, { status: 400 });
    }

    if (file.size > maxFileSize) {
      return NextResponse.json({ error: "Image must be 5MB or smaller." }, { status: 400 });
    }

    const slug = safeSlug(formData.get("slug"));
    const fileName = `${slug}-${Date.now()}.${extension}`;
    const uploadDir = path.join(process.cwd(), "public", "images", "products");
    const destination = path.join(uploadDir, fileName);
    const bytes = Buffer.from(await file.arrayBuffer());

    // Local uploads are convenient for development. On Vercel/serverless,
    // uploaded files are not persistent; move this to Supabase Storage,
    // Cloudinary, or similar object storage before production.
    await mkdir(uploadDir, { recursive: true });
    await writeFile(destination, bytes);

    return NextResponse.json({
      success: true,
      path: `/images/products/${fileName}`
    });
  } catch {
    return NextResponse.json({ error: "Could not upload product image." }, { status: 500 });
  }
}
