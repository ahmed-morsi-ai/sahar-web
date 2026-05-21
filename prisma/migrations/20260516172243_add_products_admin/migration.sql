-- AlterTable
ALTER TABLE "Product"
ADD COLUMN "notes" TEXT NOT NULL DEFAULT '[]',
ADD COLUMN "sizes" TEXT NOT NULL DEFAULT '[{"label":"50ml","priceModifier":0},{"label":"100ml","priceModifier":500}]',
ADD COLUMN "video" TEXT,
ADD COLUMN "metaTitle" TEXT,
ADD COLUMN "metaDescription" TEXT;
