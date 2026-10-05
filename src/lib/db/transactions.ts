import { db } from './client';
import type { Prisma } from '@prisma/client';
export function transaction<T>(fn: (tx: Prisma.TransactionClient) => Promise<T>) {
  return db.$transaction(fn);
}
