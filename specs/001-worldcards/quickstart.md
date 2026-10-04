# WorldCards Quickstart Validation

## Prerequisites

- Node.js LTS and the project package manager
- A hosted or local PostgreSQL database
- Environment variables for the database connection and session secret
- A configured bcrypt cost suitable for the development environment

## Setup

1. Install dependencies.
2. Apply database migrations.
3. Seed a validated country snapshot, rarity configuration, base cards, one
   special card with stock 1, and one administrator account.
4. Start the development server.

The exact package-manager commands are defined during implementation after the
repository scaffold is created.

## Validation scenarios

1. Register two players and sign in separately. Verify that each sees only their
   own collection.
2. Open a booster and verify exactly five cards are added, with rarity snapshots
   and an opening-history record.
3. Open concurrent boosters against a special card with stock 1. Verify that at
   most one opening receives it, stock never becomes negative, and the physical
   copy is assigned once.
4. Submit the same opening request twice with the same idempotency key. Verify
   that only one completed opening and one reward bundle exist.
5. Change the active population snapshot and generate a new card. Verify that
   the new assignment uses the updated rarity while an existing UserCard keeps
   its stored rarity snapshot.
6. Filter and search a collection by card type, rarity, continent, and name.
7. Attempt administrator actions as a player and verify authorization failure.
8. Set special stock below already assigned copies and verify validation failure.
9. Run unit tests for population thresholds, probability boundaries, exhausted
   stock, and invalid population values.

## Expected outcome

All critical draw, rarity, uniqueness, authentication, authorization, and
validation scenarios pass without exposing password hashes or allowing client
input to select a reward.
