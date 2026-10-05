-- DropForeignKey
ALTER TABLE "BoosterOpening" DROP CONSTRAINT "BoosterOpening_userId_fkey";

-- DropForeignKey
ALTER TABLE "Card" DROP CONSTRAINT "Card_countryId_fkey";

-- DropForeignKey
ALTER TABLE "CardInstance" DROP CONSTRAINT "CardInstance_cardId_fkey";

-- DropForeignKey
ALTER TABLE "Country" DROP CONSTRAINT "Country_sourceSnapshotId_fkey";

-- DropForeignKey
ALTER TABLE "Session" DROP CONSTRAINT "Session_userId_fkey";

-- DropForeignKey
ALTER TABLE "UserCard" DROP CONSTRAINT "UserCard_boosterOpeningId_fkey";

-- DropForeignKey
ALTER TABLE "UserCard" DROP CONSTRAINT "UserCard_cardId_fkey";

-- DropForeignKey
ALTER TABLE "UserCard" DROP CONSTRAINT "UserCard_cardInstanceId_fkey";

-- DropForeignKey
ALTER TABLE "UserCard" DROP CONSTRAINT "UserCard_userId_fkey";

-- AlterTable
ALTER TABLE "BoosterOpening" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Card" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "CardInstance" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Country" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "DataSnapshot" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Session" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "User" ALTER COLUMN "id" DROP DEFAULT;

-- AlterTable
ALTER TABLE "UserCard" ALTER COLUMN "id" DROP DEFAULT;

-- AddForeignKey
ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Country" ADD CONSTRAINT "Country_sourceSnapshotId_fkey" FOREIGN KEY ("sourceSnapshotId") REFERENCES "DataSnapshot"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Card" ADD CONSTRAINT "Card_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CardInstance" ADD CONSTRAINT "CardInstance_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCard" ADD CONSTRAINT "UserCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCard" ADD CONSTRAINT "UserCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCard" ADD CONSTRAINT "UserCard_cardInstanceId_fkey" FOREIGN KEY ("cardInstanceId") REFERENCES "CardInstance"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserCard" ADD CONSTRAINT "UserCard_boosterOpeningId_fkey" FOREIGN KEY ("boosterOpeningId") REFERENCES "BoosterOpening"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "BoosterOpening" ADD CONSTRAINT "BoosterOpening_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
