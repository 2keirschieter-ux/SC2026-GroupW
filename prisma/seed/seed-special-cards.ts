import { PrismaClient, type HistoricalKind } from '@prisma/client';

const db = new PrismaClient();

type SpecialCardSeed = {
  countryName: string;
  name: string;
  historicalKind: HistoricalKind;
  description: string;
  sourceReference: string;
  stockTotal: number;
};

const specialCards: SpecialCardSeed[] = [
  {
    countryName: 'Brazil',
    name: 'Rio de Janeiro — former capital',
    historicalKind: 'former_capital',
    description: 'Rio de Janeiro was the capital of Brazil until Brasília became the capital in 1960.',
    sourceReference: 'https://en.wikipedia.org/wiki/History_of_Brazil',
    stockTotal: 5,
  },
  {
    countryName: 'Kazakhstan',
    name: 'Almaty — former capital',
    historicalKind: 'former_capital',
    description: 'Almaty was the capital of Kazakhstan before the capital moved to Astana in 1997.',
    sourceReference: 'https://en.wikipedia.org/wiki/Almaty',
    stockTotal: 5,
  },
  {
    countryName: 'Nigeria',
    name: 'Lagos — former capital',
    historicalKind: 'former_capital',
    description: 'Lagos was replaced by Abuja as the capital of Nigeria in 1991.',
    sourceReference: 'https://en.wikipedia.org/wiki/Abuja',
    stockTotal: 5,
  },
  {
    countryName: 'Myanmar',
    name: 'Rangoon — former capital',
    historicalKind: 'former_capital',
    description: 'Rangoon, now Yangon, was replaced by Naypyidaw as the capital of Myanmar in 2006.',
    sourceReference: 'https://en.wikipedia.org/wiki/Naypyidaw',
    stockTotal: 5,
  },
  {
    countryName: 'Russia',
    name: 'Flag of the Soviet Union',
    historicalKind: 'former_flag',
    description: 'The flag of the Soviet Union was used until the dissolution of the USSR in 1991.',
    sourceReference: 'https://en.wikipedia.org/wiki/Flag_of_the_Soviet_Union',
    stockTotal: 5,
  },
  {
    countryName: 'Serbia',
    name: 'Flag of Yugoslavia',
    historicalKind: 'former_flag',
    description: 'This flag represented the former Yugoslav state during the socialist period.',
    sourceReference: 'https://en.wikipedia.org/wiki/Flag_of_Yugoslavia',
    stockTotal: 5,
  },
  {
    countryName: 'Czechia',
    name: 'Flag of Czechoslovakia',
    historicalKind: 'former_flag',
    description: 'This flag is associated with Czechoslovakia before its dissolution in 1993.',
    sourceReference: 'https://en.wikipedia.org/wiki/Flag_of_Czechoslovakia',
    stockTotal: 5,
  },
  {
    countryName: 'Libya',
    name: 'The Libyan green flag',
    historicalKind: 'former_flag',
    description: 'The plain green flag was used by Libya under Muammar Gaddafi until 2011.',
    sourceReference: 'https://en.wikipedia.org/wiki/Flag_of_Libya',
    stockTotal: 5,
  },
  {
    countryName: 'Iran',
    name: 'Persia — former name',
    historicalKind: 'former_name',
    description: 'Persia was the historical name widely used for Iran before the modern international usage of Iran.',
    sourceReference: 'https://en.wikipedia.org/wiki/Name_of_Iran',
    stockTotal: 5,
  },
  {
    countryName: 'Thailand',
    name: 'Siam — former name',
    historicalKind: 'former_name',
    description: 'Siam was the official name of Thailand before the country adopted the name Thailand.',
    sourceReference: 'https://en.wikipedia.org/wiki/Names_of_Thailand',
    stockTotal: 5,
  },
  {
    countryName: 'Sri Lanka',
    name: 'Ceylon — former name',
    historicalKind: 'former_name',
    description: 'Ceylon was the former name of Sri Lanka before the country became a republic in 1972.',
    sourceReference: 'https://en.wikipedia.org/wiki/History_of_Sri_Lanka',
    stockTotal: 5,
  },
  {
    countryName: 'Burkina Faso',
    name: 'Upper Volta — former name',
    historicalKind: 'former_name',
    description: 'Upper Volta was the former name of Burkina Faso until 1984.',
    sourceReference: 'https://en.wikipedia.org/wiki/History_of_Burkina_Faso',
    stockTotal: 5,
  },
];

async function main() {
  await db.$transaction(async (tx) => {
    for (const cardData of specialCards) {
      const country = await tx.country.findFirst({ where: { name: cardData.countryName } });
      if (!country) {
        throw new Error(`SPECIAL_CARD_COUNTRY_NOT_FOUND_${cardData.countryName}`);
      }

      const existing = await tx.card.findFirst({
        where: {
          countryId: country.id,
          name: cardData.name,
          cardType: 'special',
        },
      });
      if (existing) continue;

      await tx.card.create({
        data: {
          cardType: 'special',
          countryId: country.id,
          name: cardData.name,
          rarity: 'special',
          rarityConfigVersion: 'special-v1',
          historicalKind: cardData.historicalKind,
          description: cardData.description,
          imageUrl: country.currentFlag,
          imageCredit: cardData.sourceReference,
          sourceReference: cardData.sourceReference,
          stockTotal: cardData.stockTotal,
          stockRemaining: cardData.stockTotal,
          instances: {
            create: Array.from({ length: cardData.stockTotal }, (_, index) => ({
              serialNumber: `special-${country.externalCode}-${index + 1}-${crypto.randomUUID()}`,
            })),
          },
        },
      });
    }
  });

  console.log(`Seeded ${specialCards.length} special card definitions (existing cards were preserved).`);
}

main()
  .catch((error) => {
    console.error(`[Special cards seed] ${error instanceof Error ? error.message : error}`);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
