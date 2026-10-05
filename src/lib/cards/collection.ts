import { db } from '@/lib/db/client';
import type { Prisma } from '@prisma/client';
export async function getCollection(userId: string, filters: { type?: string; rarity?: string; continent?: string; search?: string }) {
  const card: Prisma.CardWhereInput = { ...(filters.type ? { cardType: filters.type as never } : {}), ...(filters.continent ? { country: { continent: { equals: filters.continent, mode: 'insensitive' } } } : {}), ...(filters.search ? { name: { contains: filters.search, mode: 'insensitive' } } : {}) };
  const where: Prisma.UserCardWhereInput = { userId, card, ...(filters.rarity ? { raritySnapshot: filters.rarity as never } : {}) };
  return db.userCard.findMany({ where, include: { card: { include: { country: true } }, instance: true }, orderBy: { obtainedAt: 'desc' } });
}
