import { Prisma } from "@prisma/client";

const recoverablePrismaCodes = new Set([
  "P1001",
  "P1002",
  "P1003",
  "P1017",
  "P2021",
  "P2022"
]);

export function isRecoverablePrismaReadError(error: unknown) {
  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    return recoverablePrismaCodes.has(error.code);
  }

  if (error instanceof Prisma.PrismaClientInitializationError) {
    return true;
  }

  return false;
}
