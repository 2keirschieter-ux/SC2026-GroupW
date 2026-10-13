import { PrismaClient } from '@prisma/client';
import { fetchWikimediaImage } from '../../src/lib/media/wikimedia';

const db = new PrismaClient();

async function main() {
  const countries = await db.country.findMany({
    include: { cards: { where: { cardType: 'country' }, select: { id: true } } },
    orderBy: { name: 'asc' },
  });

  for (const country of countries) {
    const card = country.cards[0];
    if (!card) continue;

    const image = await fetchWikimediaImage(country.name, 'country');
    if (!image) {
      console.error(`[Country images] No landscape image found for "${country.name}"`);
      continue;
    }

    await db.card.update({
      where: { id: card.id },
      data: { imageUrl: image.imageUrl, imageCredit: image.imageCredit },
    });
    console.log(`[Country images] Updated "${country.name}"`);
  }
}

main()
  .catch((error) => {
    console.error('[Country images] Refresh failed:', error);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
