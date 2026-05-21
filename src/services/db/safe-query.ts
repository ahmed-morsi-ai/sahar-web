import { isRecoverablePrismaReadError } from "@/lib/prisma-errors";

export async function safePrismaRead<T>(operation: () => Promise<T>, fallback: T): Promise<T> {
  try {
    return await operation();
  } catch (error) {
    if (isRecoverablePrismaReadError(error)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[db:safe-read]", error);
      }
      return fallback;
    }

    throw error;
  }
}

export async function safePrismaReadNullable<T>(operation: () => Promise<T>): Promise<T | null> {
  try {
    return await operation();
  } catch (error) {
    if (isRecoverablePrismaReadError(error)) {
      if (process.env.NODE_ENV !== "production") {
        console.warn("[db:safe-read]", error);
      }
      return null;
    }

    throw error;
  }
}
