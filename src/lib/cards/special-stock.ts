import type { Prisma } from '@prisma/client';

export async function allocateSpecialInstance(tx: Prisma.TransactionClient, cardId: string) {
  const candidate = await tx.cardInstance.findFirst({
    where: { cardId, assignedAt: null },
    select: { id: true },
  });
  if (!candidate) throw new Error('STOCK_EXHAUSTED');
  const claimed = await tx.cardInstance.updateMany({
    where: { id: candidate.id, assignedAt: null },
    data: { assignedAt: new Date() },
  });
  if (claimed.count !== 1) throw new Error('STOCK_EXHAUSTED');
  const decremented = await tx.card.updateMany({
    where: { id: cardId, cardType: 'special', stockRemaining: { gt: 0 } },
    data: { stockRemaining: { decrement: 1 } },
  });
  if (decremented.count !== 1) throw new Error('STOCK_EXHAUSTED');
  return candidate.id;
}
