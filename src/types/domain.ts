export const cardTypes = ['country', 'capital', 'flag', 'special'] as const;
export type CardType = typeof cardTypes[number];
export const rarities = ['common', 'uncommon', 'rare', 'epic', 'legendary', 'special'] as const;
export type Rarity = typeof rarities[number];
export type PublicUser = { id: string; email: string; role: 'player' | 'admin' };
export type PublicCard = { cardId: string; instanceId: string | null; type: CardType; name: string; rarity: Rarity; obtainedAt?: string };
export type ApiError = { error: { code: string; message: string; details?: unknown } };
