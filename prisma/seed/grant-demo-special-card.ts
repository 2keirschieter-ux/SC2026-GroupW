import { PrismaClient } from '@prisma/client';
import { allocateSpecialInstance } from '../../src/lib/cards/special-stock';

const db = new PrismaClient();
const targetEmail = process.argv[2]?.trim().toLowerCase();

async function main() {
  await db.$transaction(async (tx) => {
    const users = await tx.user.findMany({
      where: targetEmail
        ? { email: targetEmail }
        : {
          OR: [
            { username: { contains: 'victo', mode: 'insensitive' } },
            { email: { contains: 'victo', mode: 'insensitive' } },
          ],
        },
      select: { id: true, username: true, email: true },
    });

    if (users.length !== 1) {
      throw new Error(`EXPECTED_ONE_TARGET_ACCOUNT_FOUND_${users.length}`);
    }

    const user = users[0];
    const card = await tx.card.findFirst({
      where: { cardType: 'special', active: true, stockRemaining: { gt: 0 } },
      orderBy: { name: 'asc' },
    });
    if (!card) throw new Error('NO_AVAILABLE_SPECIAL_CARD');

    const existing = await tx.userCard.findFirst({
      where: { userId: user.id, cardId: card.id },
    });
    if (existing) {
      console.log(`Demo card already belongs to ${user.username ?? user.email}.`);
      return;
    }

    const instanceId = await allocateSpecialInstance(tx, card.id);
    const opening = await tx.boosterOpening.create({
      data: {
        userId: user.id,
        idempotencyKey: `demo-special-${card.id}`,
        status: 'completed',
        cardCount: 5,
        completedAt: new Date(),
      },
    });
    await tx.userCard.create({
      data: {
        userId: user.id,
        cardId: card.id,
        cardInstanceId: instanceId,
        raritySnapshot: 'special',
        boosterOpeningId: opening.id,
      },
    });

    console.log(`Granted "${card.name}" to ${user.username ?? user.email}.`);
  });
}

main()
  .catch((error) => {
    console.error(`[Demo special card] ${error instanceof Error ? error.message : error}`);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
