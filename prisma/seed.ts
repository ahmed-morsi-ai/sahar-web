import "dotenv/config";
import bcrypt from "bcrypt";
import { readdirSync } from "fs";
import path from "path";
import { PrismaClient } from "@prisma/client";
import { products } from "../src/data/products";

const prisma = new PrismaClient();

const costPriceBySlug: Record<string, number> = {
  "ombre-mystique": 620,
  "rose-nocturne": 540,
  "lumiere-eternelle": 480,
  "amber-silk": 560,
  "desert-noir": 690
};

const videoBySlug: Record<string, string> = {
  "ombre-mystique": "/videos/leslyyyn_pindown.io_1778960192.mp4",
  "rose-nocturne": "/videos/products/rose-nocturne.mp4",
  "lumiere-eternelle": "/videos/products/lumiere-eternelle.mp4",
  "amber-silk": "/videos/products/amber-silk.mp4"
};

function getLatestUploadedImage(slug: string) {
  const productsDir = path.join(process.cwd(), "public", "images", "products");

  try {
    const latest = readdirSync(productsDir)
      .filter((fileName) => new RegExp(`^${slug}-\\d+\\.(png|jpe?g|webp)$`, "i").test(fileName))
      .sort((a, b) => b.localeCompare(a, undefined, { numeric: true }))
      .at(0);

    return latest ? `/images/products/${latest}` : undefined;
  } catch {
    return undefined;
  }
}

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL?.toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD;

  if (!adminEmail || !adminPassword) {
    throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD must be set in .env before seeding.");
  }

  const passwordHash = await bcrypt.hash(adminPassword, 12);

  await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      passwordHash,
      role: "ADMIN"
    },
    create: {
      name: "Sahar Admin",
      email: adminEmail,
      passwordHash,
      role: "ADMIN"
    }
  });

  let createdProducts = 0;

  for (const product of products) {
    const existing = await prisma.product.findUnique({ where: { slug: product.slug } });
    if (existing) continue;

    const costPrice = costPriceBySlug[product.slug] ?? 0;
    const video = videoBySlug[product.slug] ?? product.video ?? null;
    const image = getLatestUploadedImage(product.slug) ?? product.image;
    const gallery = [image];

    await prisma.product.create({
      data: {
        id: product.id,
        slug: product.slug,
        name: product.name,
        price: product.price,
        costPrice,
        oldPrice: product.oldPrice,
        description: product.description,
        longDescription: product.longDescription,
        category: product.category.join(", "),
        tags: JSON.stringify(product.tags),
        notes: JSON.stringify(product.notes),
        topNotes: JSON.stringify(product.topNotes),
        heartNotes: JSON.stringify(product.heartNotes),
        baseNotes: JSON.stringify(product.baseNotes),
        longevity: product.longevity,
        projection: product.projection,
        occasion: product.occasion,
        gender: product.gender,
        sizes: JSON.stringify(product.sizes),
        image,
        gallery: JSON.stringify(gallery),
        video,
        rating: product.rating,
        reviewCount: product.reviewCount,
        isBestSeller: product.isBestSeller,
        isNew: product.isNew,
        stock: 100,
        isActive: true
      }
    });

    createdProducts += 1;
  }

  const productCosts = await prisma.product.findMany({
    select: {
      slug: true,
      costPrice: true
    }
  });
  const costBySlug = new Map(productCosts.map((product) => [product.slug, product.costPrice]));
  const legacyOrderItems = await prisma.orderItem.findMany({
    where: {
      unitPrice: 0,
      unitCost: 0,
      profit: 0
    }
  });

  for (const item of legacyOrderItems) {
    const unitPrice = item.price;
    const unitCost = costBySlug.get(item.productSlug) ?? 0;

    await prisma.orderItem.update({
      where: { id: item.id },
      data: {
        unitPrice,
        unitCost,
        profit: (unitPrice - unitCost) * item.quantity
      }
    });
  }

  console.log(`Seeded admin ${adminEmail}. Created ${createdProducts} fallback products; existing product media was left unchanged.`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
