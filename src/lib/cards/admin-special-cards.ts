import { db } from '@/lib/db/client';
import { specialCardSchema } from '@/lib/validation/schemas';
import type { Prisma } from '@prisma/client';

export function stockDelta(stockTotal: number, assignedCopies: number, requestedTotal: number) {
  if (!Number.isInteger(requestedTotal) || requestedTotal < 0) throw new Error('INVALID_STOCK');
  if (requestedTotal < assignedCopies) throw new Error('STOCK_TOO_LOW');
  return requestedTotal - stockTotal;
}

export async function adjustSpecialStock(cardId: string, requestedTotal: number, tx: Prisma.TransactionClient = db as unknown as Prisma.TransactionClient) {
  const card = await tx.card.findUnique({ where: { id: cardId }, include: { instances: true } });
  if (!card || card.cardType !== 'special') throw new Error('NOT_FOUND');
  const assigned = card.instances.filter((instance) => instance.assignedAt !== null).length;
  const delta = stockDelta(card.stockTotal ?? 0, assigned, requestedTotal);
  if (delta > 0) {
    await tx.cardInstance.createMany({
      data: Array.from({ length: delta }, (_, index) => ({
        cardId,
        serialNumber: `${cardId}-${Date.now()}-${index}-${crypto.randomUUID()}`,
      })),
    });
  } else if (delta < 0) {
    const removable = await tx.cardInstance.findMany({
      where: { cardId, assignedAt: null },
      select: { id: true },
      take: -delta,
    });
    if (removable.length !== -delta) throw new Error('STOCK_INVARIANT');
    await tx.cardInstance.deleteMany({ where: { id: { in: removable.map(({ id }) => id) } } });
  }
  return tx.card.update({
    where: { id: cardId },
    data: { stockTotal: requestedTotal, stockRemaining: requestedTotal - assigned },
  });
}

export async function updateSpecialCard(cardId: string, input: unknown) {
  const parsed = specialCardSchema.partial({ countryId: true }).safeParse(input);
  if (!parsed.success) throw new Error('VALIDATION');
  return db.$transaction(async (tx) => {
    const card = await tx.card.findUnique({ where: { id: cardId } });
    if (!card || card.cardType !== 'special') throw new Error('NOT_FOUND');
    const { stockTotal, ...metadata } = parsed.data;
    if (stockTotal !== undefined) await adjustSpecialStock(cardId, stockTotal, tx);
    return tx.card.update({
      where: { id: cardId },
      data: { ...metadata, ...(stockTotal === undefined ? {} : { stockTotal }) },
    });
  });
}
