import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

async function main() {
  const cards = await db.card.findMany({
    where: { cardType: 'special', imageUrl: null },
    include: { country: { select: { currentFlag: true } } },
  });

  for (const card of cards) {
    await db.card.update({
      where: { id: card.id },
      data: {
        imageUrl: card.country.currentFlag,
        imageCredit: card.sourceReference,
      },
    });
  }

  console.log(`Added images to ${cards.length} special cards.`);
}

main()
  .catch((error) => {
    console.error(`[Special card images] ${error instanceof Error ? error.message : error}`);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
