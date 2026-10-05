import { db } from '@/lib/db/client';
import { sampleRarity, bundleSize } from './draw-rules';
import { publicCard } from '@/lib/api/serializers';
import { allocateSpecialInstance } from './special-stock';
export async function openBooster(userId: string, idempotencyKey: string) {
  return db.$transaction(async (tx) => {
    const existing = await tx.boosterOpening.findUnique({ where: { userId_idempotencyKey: { userId, idempotencyKey } }, include: { cards: { include: { card: true } } } });
    if (existing?.status === 'completed') return { openingId: existing.id, cards: existing.cards.map((c) => publicCard(c.card, c.cardInstanceId)) };
    const opening = existing ?? await tx.boosterOpening.create({ data: { userId, idempotencyKey, status: 'pending', cardCount: bundleSize } });
    const cfg = await tx.rarityConfig.findFirst({ where: { active: true } }); if (!cfg) throw new Error('NO_RARITY_CONFIG');
    const cards = [];
    for (let i=0;i<bundleSize;i++) {
      const rarity = sampleRarity({ ...cfg, probabilities: cfg.probabilities as Record<string, number> } as never);
      const candidates = await tx.card.findMany({ where: { active: true, rarity, ...(rarity === 'special' ? { stockRemaining: { gt: 0 } } : {}) }, include: { country: true } });
      if (!candidates.length) throw new Error('NO_AVAILABLE_CARD');
      const card = candidates[Math.floor(Math.random()*candidates.length)];
      let instanceId: string | null = null;
      if (card.cardType === 'special') instanceId = await allocateSpecialInstance(tx, card.id);
      await tx.userCard.create({ data: { userId, cardId: card.id, cardInstanceId: instanceId, raritySnapshot: rarity, boosterOpeningId: opening.id } });
      cards.push(publicCard(card, instanceId));
    }
    await tx.boosterOpening.update({ where: { id: opening.id }, data: { status: 'completed', completedAt: new Date() } });
    return { openingId: opening.id, cards };
  });
}
