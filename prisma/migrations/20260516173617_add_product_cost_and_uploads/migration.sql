-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_OrderItem" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "orderId" TEXT NOT NULL,
    "productId" TEXT,
    "productName" TEXT NOT NULL,
    "productSlug" TEXT NOT NULL,
    "productImage" TEXT,
    "size" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "unitCost" REAL NOT NULL DEFAULT 0,
    "unitPrice" REAL NOT NULL DEFAULT 0,
    "profit" REAL NOT NULL DEFAULT 0,
    "quantity" INTEGER NOT NULL,
    "total" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OrderItem_orderId_fkey" FOREIGN KEY ("orderId") REFERENCES "Order" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "OrderItem_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_OrderItem" ("createdAt", "id", "orderId", "price", "productId", "productImage", "productName", "productSlug", "quantity", "size", "total") SELECT "createdAt", "id", "orderId", "price", "productId", "productImage", "productName", "productSlug", "quantity", "size", "total" FROM "OrderItem";
DROP TABLE "OrderItem";
ALTER TABLE "new_OrderItem" RENAME TO "OrderItem";
CREATE INDEX "OrderItem_orderId_idx" ON "OrderItem"("orderId");
CREATE INDEX "OrderItem_productId_idx" ON "OrderItem"("productId");
CREATE TABLE "new_Product" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "arabicName" TEXT,
    "price" INTEGER NOT NULL,
    "costPrice" REAL NOT NULL DEFAULT 0,
    "oldPrice" INTEGER,
    "description" TEXT NOT NULL,
    "longDescription" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "tags" TEXT NOT NULL,
    "notes" TEXT NOT NULL DEFAULT '[]',
    "topNotes" TEXT NOT NULL,
    "heartNotes" TEXT NOT NULL,
    "baseNotes" TEXT NOT NULL,
    "longevity" TEXT NOT NULL,
    "projection" TEXT NOT NULL,
    "occasion" TEXT NOT NULL,
    "gender" TEXT NOT NULL,
    "sizes" TEXT NOT NULL DEFAULT '[{"label":"50ml","priceModifier":0},{"label":"100ml","priceModifier":500}]',
    "image" TEXT NOT NULL,
    "gallery" TEXT NOT NULL,
    "video" TEXT,
    "metaTitle" TEXT,
    "metaDescription" TEXT,
    "rating" REAL NOT NULL DEFAULT 0,
    "reviewCount" INTEGER NOT NULL DEFAULT 0,
    "isBestSeller" BOOLEAN NOT NULL DEFAULT false,
    "isNew" BOOLEAN NOT NULL DEFAULT false,
    "stock" INTEGER NOT NULL DEFAULT 100,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_Product" ("arabicName", "baseNotes", "category", "createdAt", "description", "gallery", "gender", "heartNotes", "id", "image", "isActive", "isBestSeller", "isNew", "longDescription", "longevity", "metaDescription", "metaTitle", "name", "notes", "occasion", "oldPrice", "price", "projection", "rating", "reviewCount", "sizes", "slug", "stock", "tags", "topNotes", "updatedAt", "video") SELECT "arabicName", "baseNotes", "category", "createdAt", "description", "gallery", "gender", "heartNotes", "id", "image", "isActive", "isBestSeller", "isNew", "longDescription", "longevity", "metaDescription", "metaTitle", "name", "notes", "occasion", "oldPrice", "price", "projection", "rating", "reviewCount", "sizes", "slug", "stock", "tags", "topNotes", "updatedAt", "video" FROM "Product";
DROP TABLE "Product";
ALTER TABLE "new_Product" RENAME TO "Product";
CREATE UNIQUE INDEX "Product_slug_key" ON "Product"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
