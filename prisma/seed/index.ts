import { PrismaClient } from '@prisma/client';
import { readFile } from 'node:fs/promises';
import bcrypt from 'bcryptjs';
import { fetchWikimediaImage } from '@/lib/media/wikimedia';
import { rarityForPopulation } from '@/lib/cards/rarity';

const db = new PrismaClient();
const seedProbabilities = { common: 0.6, uncommon: 0.3, legendary: 0.1 };

type RestCountry = {
  name?: string;
  code?: string;
  population?: number;
  continent?: string;
  capital?: string | null;
  flag?: string;
};

function normalizeCountry(country: RestCountry) {
  const name = country.name;
  const code = country.code;
  const population = country.population;
  const continent = country.continent;
  const flag = country.flag;
  if (!name || !code || typeof population !== 'number' || !Number.isInteger(population) || population <= 0 || !continent || !flag) {
    throw new Error(`REST_COUNTRIES_INVALID_RECORD_${code ?? 'UNKNOWN'}`);
  }
  return {
    code,
    name,
    population,
    continent,
    capital: country.capital?.[0] ?? null,
    flag,
  };
}

async function main() {
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  if (!password) throw new Error('ADMIN_INITIAL_PASSWORD is required for seeding');

  const snapshot = await db.dataSnapshot.create({
    data: {
      sourceName: 'REST Countries',
      retrievedAt: new Date(),
      sourceVersion: 'seed-v1',
      licenseReference: 'REST Countries terms',
      status: 'validated',
    },
  });
  const countryData = JSON.parse(await readFile(new URL('./data/countries.json', import.meta.url), 'utf8')) as RestCountry[];
  const countries = countryData.map(normalizeCountry);
  const cfg = await db.rarityConfig.upsert({
    where: { version: 'v1' },
    update: {
      commonMaxPopulation: 10_000,
      uncommonMaxPopulation: 100_000,
      rareMaxPopulation: 1_000_000,
      epicMaxPopulation: 10_000_000,
      active: true,
      probabilities: seedProbabilities,
    },
    create: {
      version: 'v1',
      commonMaxPopulation: 10_000,
      uncommonMaxPopulation: 100_000,
      rareMaxPopulation: 1_000_000,
      epicMaxPopulation: 10_000_000,
      probabilities: seedProbabilities,
      active: true,
    },
  });

  for (const { code, name, population, continent, capital, flag } of countries) {
    const country = await db.country.create({
      data: {
        externalCode: code,
        name,
        population,
        continent,
        currentCapital: capital,
        currentFlag: flag,
        sourceSnapshotId: snapshot.id,
      },
    });
    const [countryImage, capitalImage] = await Promise.all([
      fetchWikimediaImage(name, 'country'),
      capital ? fetchWikimediaImage(capital, 'capital') : Promise.resolve(null),
    ]);
    const cards: Array<['country' | 'capital' | 'flag', string, typeof countryImage]> = [
      ['country', name, countryImage],
      ['flag', `${name} flag`, null],
    ];
    if (capital) cards.splice(1, 0, ['capital', capital, capitalImage]);
    for (const [cardType, cardName, image] of cards) {
      await db.card.create({
        data: {
          cardType,
          countryId: country.id,
          name: cardName,
          rarity: rarityForPopulation(population, {
            ...cfg,
            probabilities: cfg.probabilities as Record<string, number>,
          }),
          rarityConfigVersion: cfg.version,
          imageUrl: image?.imageUrl,
          imageCredit: image?.imageCredit,
        },
      });
    }
  }

  await db.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      passwordHash: await bcrypt.hash(password, 12),
      role: 'admin',
    },
  });
}

main().finally(() => db.$disconnect());
