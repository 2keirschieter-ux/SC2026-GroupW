import { PrismaClient } from '@prisma/client';

const db = new PrismaClient();

const rarityConfig = {
  version: 'v2',
  commonMaxPopulation: 10_000_000,
  uncommonMaxPopulation: 40_000_000,
  rareMaxPopulation: 75_000_000,
  epicMaxPopulation: 225_000_000,
  probabilities: {
    common: 0.5,
    uncommon: 0.25,
    rare: 0.12,
    epic: 0.075,
    legendary: 0.05,
    special: 0.005,
  },
};

async function main() {
  const total = Object.values(rarityConfig.probabilities).reduce((sum, probability) => sum + probability, 0);
  if (Math.abs(total - 1) > 1e-9) {
    throw new Error(`INVALID_RARITY_PROBABILITIES_${total}`);
  }

  await db.$transaction(async (tx) => {
    await tx.rarityConfig.updateMany({ where: { active: true }, data: { active: false } });
    await tx.rarityConfig.upsert({
      where: { version: rarityConfig.version },
      update: {
        commonMaxPopulation: rarityConfig.commonMaxPopulation,
        uncommonMaxPopulation: rarityConfig.uncommonMaxPopulation,
        rareMaxPopulation: rarityConfig.rareMaxPopulation,
        epicMaxPopulation: rarityConfig.epicMaxPopulation,
        probabilities: rarityConfig.probabilities,
        active: true,
      },
      create: {
        ...rarityConfig,
        active: true,
      },
    });
  });

  console.log('Rarity configuration v2 is now active. Existing cards and images were not modified.');
}

main()
  .catch((error) => {
    console.error(`[Rarity configuration update] ${error instanceof Error ? error.message : error}`);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
