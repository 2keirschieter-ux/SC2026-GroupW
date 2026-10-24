# WorldCards

WorldCards is a trading card game website about the countries of the world, built as a Next.js / TypeScript MVP for the Software Construction course. Players open boosters and collect **Country**, **Capital** and **Flag** cards. Rarity depends on the country's population: **the more inhabitants, the rarer the card**. A few **Special** cards (former flag, former capital, former country name) exist in strictly limited quantities.

All game logic (rarity, booster draws, special-card stock) runs server-side, with PostgreSQL as the single source of truth.

## Features

- Account registration, sign-in and sign-out (bcrypt-hashed passwords, server-side sessions)
- Booster opening: five cards per booster, rarity-weighted draw, idempotent requests
- Limited stock for Special cards, allocated transactionally so stock can never go negative
- Collection page with filters (type, rarity, continent) and search by name
- Card detail page and collection progress
- Administrator routes to add or edit Special cards and their remaining stock
- Rarity tiers: Common, Uncommon, Rare, Epic, Legendary, plus Special above all
- Card visuals styled by rarity, with a rarity badge; Country and Capital cards show Wikipedia images (cached in the database, with an attribution link) and Flag cards show the country's flag

## Tech stack

| Layer | Technology |
|---|---|
| Framework | Next.js 15 (React 19), TypeScript |
| Database | PostgreSQL (Docker for local development) |
| ORM and migrations | Prisma 6 |
| Authentication and validation | bcryptjs, zod |
| Unit tests | Vitest |
| End-to-end tests | Playwright |
| Quality | ESLint, Prettier, TypeScript type-check |

## Getting started

### Prerequisites

- Node.js and npm
- Git
- Docker (or any other PostgreSQL server)

### 1. Clone and install

```bash
git clone https://github.com/2keirschieter-ux/SC2026.git
cd SC2026
npm install
```

### 2. Start PostgreSQL

With Docker:

```bash
docker run --name worldcards-db -e POSTGRES_PASSWORD=devpassword -e POSTGRES_DB=worldcards -p 5432:5432 -d postgres
```

### 3. Configure the environment

Copy the template and edit the values:

```bash
cp .env.example .env        # PowerShell: copy .env.example .env
```

| Variable | Purpose |
|---|---|
| `DATABASE_URL` | PostgreSQL connection string, e.g. `postgresql://postgres:devpassword@localhost:5432/worldcards` |
| `SESSION_SECRET` | Long random string used to protect sessions |
| `ADMIN_INITIAL_PASSWORD` | Password of the administrator account created by the seed (local development only) |

Never commit `.env` or any credentials. It is already excluded by `.gitignore`.

### 4. Create the schema and seed the data

```bash
npx prisma migrate dev
npm run db:seed
```

The seed script is re-runnable. It loads the countries, generates their cards, stores the rarity configuration and creates the administrator account `admin@example.com`.

### 5. Run the application

```bash
npm run dev
```

Open http://localhost:3000.

## Available scripts

| Command | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run typecheck` | Run the TypeScript compiler without emitting files |
| `npm test` | Run unit tests once (Vitest) |
| `npm run test:watch` | Run unit tests in watch mode |
| `npm run e2e` | Run end-to-end tests (Playwright) |
| `npm run db:generate` | Generate the Prisma client |
| `npm run db:migrate` | Create and apply a development migration |
| `npm run db:seed` | Seed the database |

To inspect the database visually: `npx prisma studio`.

## Testing

At the last full validation, 22 unit tests (Vitest) and 7 end-to-end tests (Playwright) passed, together with type-check, lint, build and migration status. Critical game rules (rarity calculation, booster draw, special-card stock) are covered by automated tests. The visual layer is checked manually.

## Project structure

```text
.
├── .github/                 Copilot prompt files installed by Spec Kit
├── .specify/                Spec Kit templates, scripts and project constitution
├── specs/001-worldcards/    Specification, plan, data model and tasks
├── prisma/
│   ├── schema.prisma        Data model
│   ├── migrations/          Database migrations
│   └── seed/index.ts        Seed script
├── src/
│   ├── app/                 Pages and server routes (Next.js App Router)
│   ├── components/          UI components (e.g. card visual)
│   └── lib/                 Game logic (cards, rarity) and media helpers
└── tests/                   Unit and end-to-end tests
```

## Development approach

This project was built with AI-assisted development under two complementary approaches:

- **Spec-Driven Development (SDD)** with [Spec Kit](https://github.com/github/spec-kit) and GitHub Copilot for the core logic: constitution, specification, plan, tasks, analysis and implementation. All artifacts are versioned in `.specify/` and `specs/`.
- **Vibe coding** for the presentation layer: card styling by rarity, card layout and imagery, driven by short natural-language prompts.

The full analysis (requirements, prompts, iteration log, verification and lessons learned) is in the project report.

## Data sources and licenses

- Country data (name, population, continent, capital, flag) comes from REST Countries.
- Country and Capital images come from Wikipedia. Each image is displayed with an attribution link to its source article.
- Only legally reusable sources are used, in line with the project constitution.

## Known limitations

- The application is developed and tested locally. A hosted deployment (for example Vercel with a hosted PostgreSQL database) is planned in the technical plan but not part of this submission.
- `npm audit` reports 12 findings (3 moderate, 9 high), all in build and test tooling dependencies. They were not force-upgraded to avoid breaking major-version changes.
- Out of scope for this version: trading between players, leaderboards, duplicate conversion.

## Troubleshooting (Windows)

- `uv` or `specify` not found: close and reopen the terminal after installing.
- `npx` blocked by PowerShell: run `Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned`.
- Prisma error "column does not exist": the schema and database are out of sync; run `npx prisma migrate dev`.
- Seed fails with a unique-constraint error on an old database: run `npx prisma migrate reset`.

## Team

Software Construction course project, 2026.

| Member | GitHub | Role |
|---|---|---|
| [Loriane Vinour] | [@lo1122] | [Vibe Coder] |
| [Victor Dekeirschieter] | [@2keirschieter-ux] | [SDD Coder] |
