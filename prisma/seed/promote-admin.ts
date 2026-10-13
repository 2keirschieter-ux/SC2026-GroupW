import { PrismaClient } from '@prisma/client';

const email = process.argv[2]?.trim().toLowerCase();
const db = new PrismaClient();

async function main() {
  if (!email) {
    throw new Error('Usage: npm run db:promote-admin -- user@example.com');
  }

  const user = await db.user.updateMany({
    where: { email },
    data: { role: 'admin' },
  });

  if (user.count !== 1) {
    throw new Error(`No account found for "${email}". Register the account first, then run this command again.`);
  }

  console.log(`Administrator role granted to ${email}.`);
}

main()
  .catch((error) => {
    console.error(`[Admin promotion] ${error instanceof Error ? error.message : error}`);
    process.exitCode = 1;
  })
  .finally(() => db.$disconnect());
