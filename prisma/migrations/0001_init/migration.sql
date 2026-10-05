CREATE EXTENSION IF NOT EXISTS "pgcrypto";
CREATE TYPE "Role" AS ENUM ('player', 'admin');
CREATE TYPE "CardType" AS ENUM ('country', 'capital', 'flag', 'special');
CREATE TYPE "Rarity" AS ENUM ('common', 'uncommon', 'rare', 'epic', 'legendary', 'special');
CREATE TYPE "HistoricalKind" AS ENUM ('former_flag', 'former_capital', 'former_name');
CREATE TYPE "SnapshotStatus" AS ENUM ('validated', 'rejected', 'superseded');
CREATE TYPE "OpeningStatus" AS ENUM ('pending', 'completed', 'failed');

CREATE TABLE "User" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), "email" TEXT NOT NULL UNIQUE, "passwordHash" TEXT NOT NULL, "role" "Role" NOT NULL DEFAULT 'player', "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE "Session" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), "userId" UUID NOT NULL, "tokenHash" TEXT NOT NULL UNIQUE, "expiresAt" TIMESTAMP(3) NOT NULL, "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP);
CREATE TABLE "DataSnapshot" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), "sourceName" TEXT NOT NULL, "retrievedAt" TIMESTAMP(3) NOT NULL, "sourceVersion" TEXT NOT NULL, "licenseReference" TEXT NOT NULL, "status" "SnapshotStatus" NOT NULL);
CREATE TABLE "Country" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), "externalCode" TEXT NOT NULL UNIQUE, "name" TEXT NOT NULL, "population" INTEGER NOT NULL CHECK ("population" > 0), "continent" TEXT NOT NULL, "currentCapital" TEXT, "currentFlag" TEXT NOT NULL, "sourceSnapshotId" UUID NOT NULL);
CREATE TABLE "Card" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), "cardType" "CardType" NOT NULL, "countryId" UUID NOT NULL, "name" TEXT NOT NULL, "rarity" "Rarity" NOT NULL, "rarityConfigVersion" TEXT NOT NULL, "description" TEXT NOT NULL DEFAULT '', "historicalKind" "HistoricalKind", "stockTotal" INTEGER CHECK ("stockTotal" IS NULL OR "stockTotal" >= 0), "stockRemaining" INTEGER CHECK ("stockRemaining" IS NULL OR "stockRemaining" >= 0), "sourceReference" TEXT, "active" BOOLEAN NOT NULL DEFAULT true, CHECK (("cardType" = 'special' AND "historicalKind" IS NOT NULL AND "stockTotal" IS NOT NULL AND "stockRemaining" IS NOT NULL) OR ("cardType" <> 'special' AND "historicalKind" IS NULL AND "stockTotal" IS NULL AND "stockRemaining" IS NULL)));
CREATE TABLE "CardInstance" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), "cardId" UUID NOT NULL, "serialNumber" TEXT NOT NULL UNIQUE, "assignedAt" TIMESTAMP(3));
CREATE TABLE "BoosterOpening" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), "userId" UUID NOT NULL, "idempotencyKey" TEXT NOT NULL, "status" "OpeningStatus" NOT NULL, "cardCount" INTEGER NOT NULL CHECK ("cardCount" = 5), "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "completedAt" TIMESTAMP(3), UNIQUE ("userId", "idempotencyKey"));
CREATE TABLE "UserCard" ("id" UUID PRIMARY KEY DEFAULT gen_random_uuid(), "userId" UUID NOT NULL, "cardId" UUID NOT NULL, "cardInstanceId" UUID UNIQUE, "raritySnapshot" "Rarity" NOT NULL, "obtainedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP, "boosterOpeningId" UUID NOT NULL);
CREATE TABLE "RarityConfig" ("version" TEXT PRIMARY KEY, "commonMaxPopulation" INTEGER NOT NULL, "uncommonMaxPopulation" INTEGER NOT NULL, "rareMaxPopulation" INTEGER NOT NULL, "epicMaxPopulation" INTEGER NOT NULL, "probabilities" JSONB NOT NULL, "active" BOOLEAN NOT NULL DEFAULT false);

ALTER TABLE "Session" ADD CONSTRAINT "Session_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
ALTER TABLE "Country" ADD CONSTRAINT "Country_sourceSnapshotId_fkey" FOREIGN KEY ("sourceSnapshotId") REFERENCES "DataSnapshot"("id");
ALTER TABLE "Card" ADD CONSTRAINT "Card_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "Country"("id");
ALTER TABLE "CardInstance" ADD CONSTRAINT "CardInstance_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id") ON DELETE CASCADE;
ALTER TABLE "BoosterOpening" ADD CONSTRAINT "BoosterOpening_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id");
ALTER TABLE "UserCard" ADD CONSTRAINT "UserCard_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE;
ALTER TABLE "UserCard" ADD CONSTRAINT "UserCard_cardId_fkey" FOREIGN KEY ("cardId") REFERENCES "Card"("id");
ALTER TABLE "UserCard" ADD CONSTRAINT "UserCard_cardInstanceId_fkey" FOREIGN KEY ("cardInstanceId") REFERENCES "CardInstance"("id");
ALTER TABLE "UserCard" ADD CONSTRAINT "UserCard_boosterOpeningId_fkey" FOREIGN KEY ("boosterOpeningId") REFERENCES "BoosterOpening"("id");
CREATE INDEX "Card_cardType_active_rarity_idx" ON "Card"("cardType", "active", "rarity");
CREATE INDEX "CardInstance_cardId_assignedAt_idx" ON "CardInstance"("cardId", "assignedAt");
CREATE INDEX "UserCard_userId_cardId_idx" ON "UserCard"("userId", "cardId");
ALTER TABLE "Card" ADD CONSTRAINT "Card_stockRemaining_not_above_total_ck"
  CHECK ("cardType" <> 'special' OR "stockRemaining" <= "stockTotal");

CREATE OR REPLACE FUNCTION enforce_card_instance_rules() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE kind "CardType";
BEGIN
  SELECT "cardType" INTO kind FROM "Card" WHERE id = NEW."cardId";
  IF kind <> 'special' THEN RAISE EXCEPTION 'only special cards may have physical instances'; END IF;
  RETURN NEW;
END $$;
CREATE CONSTRAINT TRIGGER "CardInstance_special_only" AFTER INSERT OR UPDATE ON "CardInstance" DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION enforce_card_instance_rules();

CREATE OR REPLACE FUNCTION enforce_user_card_instance_rules() RETURNS trigger LANGUAGE plpgsql AS $$
DECLARE kind "CardType";
BEGIN
  SELECT "cardType" INTO kind FROM "Card" WHERE id = NEW."cardId";
  IF (kind = 'special' AND NEW."cardInstanceId" IS NULL) OR (kind <> 'special' AND NEW."cardInstanceId" IS NOT NULL) THEN RAISE EXCEPTION 'card instance does not match card type'; END IF;
  RETURN NEW;
END $$;
CREATE CONSTRAINT TRIGGER "UserCard_instance_matches_type" AFTER INSERT OR UPDATE ON "UserCard" DEFERRABLE INITIALLY DEFERRED FOR EACH ROW EXECUTE FUNCTION enforce_user_card_instance_rules();
