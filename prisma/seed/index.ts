import { PrismaClient } from '@prisma/client';
import { readFile } from 'node:fs/promises';
import bcrypt from 'bcryptjs';
import { fetchWikimediaImage } from '@/lib/media/wikimedia';
import { rarityForPopulation } from '@/lib/cards/rarity';
import { UN_COUNTRY_CODES, UN_COUNTRY_COUNT } from './data/un-countries';

const db = new PrismaClient();
const seedProbabilities = { common: 0.6, uncommon: 0.3, legendary: 0.1 };

type RestCountry = {
  name?: string;
  code?: string;
  population?: number;
  continent?: string;
  capital?: string | string[] | null;
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
    capital: Array.isArray(country.capital) ? country.capital[0] ?? null : country.capital ?? null,
    flag,
  };
}

async function main() {
  const password = process.env.ADMIN_INITIAL_PASSWORD;
  if (!password) throw new Error('ADMIN_INITIAL_PASSWORD is required for seeding');

  const countryData = JSON.parse(await readFile(new URL('./data/countries.json', import.meta.url), 'utf8')) as RestCountry[];
  const countries = countryData.map(normalizeCountry);
  if (
    countries.length !== UN_COUNTRY_COUNT ||
    new Set(countries.map(({ code }) => code)).size !== UN_COUNTRY_COUNT ||
    countries.some(({ code }) => !UN_COUNTRY_CODES.has(code))
  ) {
    throw new Error(`COUNTRY_SEED_MUST_CONTAIN_${UN_COUNTRY_COUNT}_UN_COUNTRIES`);
  }

  const snapshot = await db.dataSnapshot.create({
    data: {
      sourceName: 'REST Countries',
      retrievedAt: new Date(),
      sourceVersion: 'seed-v1',
      licenseReference: 'REST Countries terms',
      status: 'validated',
    },
  });
  const cfg = await db.rarityConfig.upsert({
    where: { version: 'v1' },
    update: {
      commonMaxPopulation: 10_000_000,
      uncommonMaxPopulation: 40_000_000,
      rareMaxPopulation: 75_000_000,
      epicMaxPopulation: 225_000_000,
      active: true,
      probabilities: seedProbabilities,
    },
    create: {
      version: 'v1',
      commonMaxPopulation: 10_000_000,
      uncommonMaxPopulation: 40_000_000,
      rareMaxPopulation: 75_000_000,
      epicMaxPopulation: 225_000_000,
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
    const countryImage = await fetchWikimediaImage(name, 'country');
    const capitalImage = capital
      ? (await fetchWikimediaImage(capital, 'capital', name)) ?? countryImage
      : null;
    if (!countryImage) {
      throw new Error(`COUNTRY_IMAGE_NOT_FOUND_${code}`);
    }
    if (capital && !capitalImage) {
      throw new Error(`CAPITAL_IMAGE_NOT_FOUND_${code}`);
    }
    const cards: Array<['country' | 'capital' | 'flag', string, { imageUrl: string; imageCredit: string } | null]> = [
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
