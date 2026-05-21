import { NextResponse } from "next/server";
import { mkdir, writeFile } from "fs/promises";
import path from "path";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { isRecoverablePrismaReadError } from "@/lib/prisma-errors";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const maxFileSize = 80 * 1024 * 1024;
const allowedTypes = new Map([
  ["image/png", "png"],
  ["image/jpeg", "jpg"],
  ["image/jpg", "jpg"],
  ["image/webp", "webp"],
  ["video/mp4", "mp4"],
  ["video/quicktime", "mov"]
]);

function safeFileName(name: string) {
  const extension = path.extname(name).toLowerCase();
  const baseName = path
    .basename(name, extension)
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");

  return `${baseName || "media"}-${Date.now()}${extension}`;
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    if (session?.user.role !== "ADMIN") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    if (process.env.VERCEL) {
      return NextResponse.json(
        { error: "Runtime uploads need persistent object storage in production." },
        { status: 501 }
      );
    }

    const formData = await req.formData();
    const file = formData.get("file");

    if (!(file instanceof File)) {
      return NextResponse.json({ error: "No file" }, { status: 400 });
    }

    const extension = allowedTypes.get(file.type);
    if (!extension) {
      return NextResponse.json({ error: "Unsupported media type." }, { status: 400 });
    }

    if (file.size > maxFileSize) {
      return NextResponse.json({ error: "File is too large." }, { status: 400 });
    }

    const buffer = Buffer.from(await file.arrayBuffer());
    const fileName = safeFileName(file.name).replace(/\.[^.]+$/, `.${extension}`);
    const mediaType = file.type.startsWith("video") ? "video" : "image";
    const uploadDir = path.join(process.cwd(), "public", "media", "original");
    const uploadPath = path.join(uploadDir, fileName);
    const originalUrl = `/media/original/${fileName}`;

    await mkdir(uploadDir, { recursive: true });
    await writeFile(uploadPath, buffer);

    const media = await prisma.mediaAsset.create({
      data: {
        type: mediaType,
        originalUrl,
        optimizedUrl: originalUrl,
        size: file.size
      }
    }).catch((error: unknown) => {
      if (isRecoverablePrismaReadError(error)) {
        return null;
      }
      throw error;
    });

    return NextResponse.json({
      success: true,
      media,
      path: originalUrl
    });
  } catch {
    return NextResponse.json({ error: "Could not upload media." }, { status: 500 });
  }
}
