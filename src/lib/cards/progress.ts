import { db } from '@/lib/db/client';
export async function progress(userId: string) {
  const [ownedBase, ownedSpecial, totalBase, totalSpecial] = await Promise.all([
    db.userCard.findMany({ where: { userId, card: { cardType: { not: 'special' } } }, distinct: ['cardId'], select: { cardId: true } }),
    db.userCard.count({ where: { userId, card: { cardType: 'special' }, cardInstanceId: { not: null } } }),
    db.card.count({ where: { active: true, cardType: { not: 'special' } } }),
    db.card.aggregate({ where: { active: true, cardType: 'special' }, _sum: { stockTotal: true } }),
  ]);
  return { owned: ownedBase.length + ownedSpecial, total: totalBase + (totalSpecial._sum.stockTotal ?? 0) };
}
