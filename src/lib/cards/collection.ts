import { db } from '@/lib/db/client';
import type { Prisma } from '@prisma/client';
export async function getCollection(userId: string, filters: { type?: string; rarity?: string; continent?: string; search?: string }) {
  const card: Prisma.CardWhereInput = { ...(filters.type ? { cardType: filters.type as never } : {}), ...(filters.continent ? { country: { continent: { equals: filters.continent, mode: 'insensitive' } } } : {}), ...(filters.search ? { name: { contains: filters.search, mode: 'insensitive' } } : {}) };
  const where: Prisma.UserCardWhereInput = { userId, card, ...(filters.rarity ? { raritySnapshot: filters.rarity as never } : {}) };
  const ownedCards = await db.userCard.findMany({ where, include: { card: { include: { country: true } }, instance: true }, orderBy: { obtainedAt: 'desc' } });
  const cards = Array.from(
    ownedCards.reduce((grouped, userCard) => {
      const existing = grouped.get(userCard.cardId);
      if (existing) {
        existing.quantity += 1;
      } else {
        grouped.set(userCard.cardId, { ...userCard, quantity: 1 });
      }
      return grouped;
    }, new Map<string, (typeof ownedCards)[number] & { quantity: number }>()),
    ([, userCard]) => userCard,
  );
  const rarityOrder = ['special', 'legendary', 'epic', 'rare', 'uncommon', 'common'];
  return cards.sort((left, right) => rarityOrder.indexOf(left.raritySnapshot) - rarityOrder.indexOf(right.raritySnapshot));
}
