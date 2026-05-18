import { prisma } from "@/lib/prisma";

export async function generateOrderNumber() {
  const year = new Date().getFullYear();
  const prefix = `SAHAR-${year}-`;

  const count = await prisma.order.count({
    where: {
      orderNumber: {
        startsWith: prefix
      }
    }
  });

  return `${prefix}${String(count + 1).padStart(4, "0")}`;
}
