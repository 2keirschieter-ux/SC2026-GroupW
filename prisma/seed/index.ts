import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const db = new PrismaClient();
const seedProbabilities = { common: 0.6, uncommon: 0.3, legendary: 0.1 };

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
  const countries = [
    ['FI', 'Finland', 5600000, 'Europe', 'Helsinki'],
    ['IS', 'Iceland', 390000, 'Europe', 'Reykjavik'],
    ['VA', 'Vatican City', 800, 'Europe', 'Vatican City'],
  ] as const;
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

  for (const [code, name, population, continent, capital] of countries) {
    const country = await db.country.create({
      data: {
        externalCode: code,
        name,
        population,
        continent,
        currentCapital: capital,
        currentFlag: `https://flagcdn.com/${code.toLowerCase()}.svg`,
        sourceSnapshotId: snapshot.id,
      },
    });
    for (const [cardType, cardName] of [
      ['country', name],
      ['capital', capital],
      ['flag', `${name} flag`],
    ] as const) {
      await db.card.create({
        data: {
          cardType,
          countryId: country.id,
          name: cardName,
          rarity:
            population > 10000000
              ? 'legendary'
              : population > 1000000
                ? 'epic'
                : population > 100000
                  ? 'rare'
                  : population > 10000
                    ? 'uncommon'
                    : 'common',
          rarityConfigVersion: cfg.version,
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
