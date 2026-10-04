# Implementation Plan: WorldCards

**Branch**: `001-worldcards` | **Date**: 2026-10-04 | **Spec**: [spec.md](./spec.md)

**Input**: Feature specification from `/specs/001-worldcards/spec.md`

## Summary

Build WorldCards as a single Next.js web application with TypeScript, a hosted
PostgreSQL database, and server-side authentication and game rules. Current
country data is imported from REST Countries into the database; historical
special cards are manually curated. Booster draws run only in server code and
allocate special-card stock inside a database transaction so concurrent draws
cannot duplicate a physical copy or make stock negative.

## Technical Context

**Language/Version**: TypeScript on Node.js LTS

**Primary Dependencies**: Next.js (React, App Router), PostgreSQL client/ORM,
bcrypt, Zod, and a test runner suitable for unit and integration tests

**Storage**: Hosted PostgreSQL, accessed from server-only application code

**Testing**: Unit tests for rarity and draw rules; integration tests for
transactional stock allocation, authentication boundaries, and collection flows;
browser-level smoke tests for the primary user journeys

**Target Platform**: Vercel-hosted web application with a separately hosted
PostgreSQL database

**Project Type**: Full-stack web application

**Performance Goals**: 95% of collection searches and card-detail views complete
within 1 second under the version-1 target load; booster opening completes within
2 seconds for 95% of successful requests

**Constraints**: Draw logic and stock changes MUST remain server-only; special
stock decrement MUST be atomic; passwords MUST be hashed; user input MUST be
validated; the interface MUST support mobile and desktop; external data and
licenses MUST be documented

**Scale/Scope**: Student-project MVP with one catalog of countries, a small
curated set of historical cards, authenticated player collections, one booster
format of five cards, and no trading, leaderboards, or duplicate conversion

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| Principle | Check |
|-----------|-------|
| Draw Integrity | PASS: booster selection, probability application, and special-stock allocation are server-only and covered by tests. |
| Data Consistency | PASS: REST Countries data is imported into one versioned database snapshot; card and ownership snapshots preserve historical consistency. |
| Simplicity First | PASS: one Next.js application and one PostgreSQL database; no separate service is introduced. |
| Critical-Logic Testing | PASS: rarity, draw boundaries, exhausted stock, and concurrent allocation have explicit unit/integration coverage. |
| Basic Security | PASS: bcrypt password hashes, server-side validation, authorization checks, and no sensitive fields in client responses. |
| Process Traceability | PASS: this plan links to the specification and defines traceable design artifacts and audit records. |
| License Compliance | PASS: REST Countries and flag-image terms are recorded before import; historical content includes source attribution. |

## Project Structure

### Documentation (this feature)

```text
specs/001-worldcards/
├── plan.md
├── research.md
├── data-model.md
├── quickstart.md
├── contracts/
│   ├── auth.md
│   ├── boosters.md
│   ├── collection.md
│   └── admin-special-cards.md
└── tasks.md              # Created by /speckit-tasks
```

### Source Code (repository root)

```text
src/
├── app/
│   ├── (auth)/
│   ├── (player)/
│   ├── admin/
│   └── api/
├── components/
├── lib/
│   ├── auth/
│   ├── cards/
│   ├── db/
│   ├── validation/
│   └── data-import/
└── types/

tests/
├── unit/
├── integration/
└── e2e/

prisma/
├── migrations/
└── seed/
```

**Structure Decision**: Use one Next.js application with route groups for
authentication, player pages, and administration. Keep domain rules in
server-only modules under `src/lib/`, with API/server-action adapters under
`src/app/`. Keep database migrations and deterministic seed data under
`prisma/`. Separate unit, integration, and end-to-end tests by test purpose.

## Complexity Tracking

No constitution violations identified.
