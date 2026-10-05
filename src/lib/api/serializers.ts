import type { Card, User } from '@prisma/client';
export function publicUser(user: Pick<User, 'id'|'email'|'role'>) { return { id: user.id, email: user.email, role: user.role }; }
export function publicCard(card: Card & { country?: { continent: string } }, instanceId: string | null = null) { return { cardId: card.id, instanceId, type: card.cardType, name: card.name, rarity: card.rarity, continent: card.country?.continent, description: card.description }; }
