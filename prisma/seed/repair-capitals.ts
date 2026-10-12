import { PrismaClient } from '@prisma/client';
import { readFile } from 'node:fs/promises';
import { fetchWikimediaImage } from '../../src/lib/media/wikimedia';

const db = new PrismaClient();

type CountrySnapshot = {
  code: string;
  name: string;
  capital?: string | null;
};

async function main() {
  const snapshot = JSON.parse(
    await readFile(new URL('./data/countries.json', import.meta.url), 'utf8'),
  ) as CountrySnapshot[];

  let repaired = 0;
  for (const entry of snapshot) {
    const capital = entry.capital ?? null;
    const country = await db.country.findUnique({
      where: { externalCode: entry.code },
      select: { id: true },
    });
    if (!country) continue;

    await db.country.update({
      where: { id: country.id },
      data: { currentCapital: capital },
    });

    if (capital) {
      const image = (await fetchWikimediaImage(capital, 'capital', entry.name))
        ?? await fetchWikimediaImage(entry.name, 'country');
      if (!image) throw new Error(`CAPITAL_IMAGE_NOT_FOUND_${entry.code}`);
      await db.card.updateMany({
        where: { countryId: country.id, cardType: 'capital' },
        data: {
          name: capital,
          imageUrl: image.imageUrl,
          imageCredit: image.imageCredit,
        },
      });
    }
    repaired += 1;
  }

  console.log(`Repaired capital names for ${repaired} countries.`);
}

main().finally(() => db.$disconnect());
