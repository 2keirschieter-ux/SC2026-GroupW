---

description: "Implementation task list for WorldCards"
---

# Tasks: WorldCards

**Input**: Design documents from `/specs/001-worldcards/`

**Prerequisites**: plan.md, spec.md, research.md, data-model.md, contracts/

**Tests**: Included because the specification and constitution require automated coverage for authentication boundaries, rarity rules, stock allocation, collection flows, and browser-level journeys.

**Organization**: Tasks are grouped by user story so each story can be implemented and validated as an independently testable increment.

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Initialize the single Next.js TypeScript application and its development tooling.

- [ ] T001 Create the Next.js App Router project structure with TypeScript under `src/`, `tests/`, `prisma/`, and `public/`
- [ ] T002 Initialize `package.json` with Next.js, React, TypeScript, PostgreSQL ORM/client, bcrypt, Zod, test runner, and browser smoke-test dependencies
- [ ] T003 [P] Configure TypeScript, Next.js, ESLint, and formatting rules in `tsconfig.json`, `next.config.ts`, `eslint.config.mjs`, and `.prettierrc`
- [ ] T004 [P] Configure unit, integration, and end-to-end test projects in `vitest.config.ts` and `playwright.config.ts`
- [ ] T005 [P] Document required Node.js, PostgreSQL, database, session-secret, and bcrypt environment variables in `.env.example` and `README.md`
- [ ] T006 [P] Add source attribution and license/terms records for REST Countries and flag assets in `docs/data-sources.md`

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Establish the database, domain types, server boundaries, validation, and shared UI/API infrastructure required by every story.

**⚠️ CRITICAL**: No user story implementation can begin until this phase is complete.

- [ ] T007 Define the User, DataSnapshot, Country, Card, CardInstance, UserCard, BoosterOpening, and RarityConfig models with all required enums, foreign keys, unique constraints, and stock invariants in `prisma/schema.prisma`
- [ ] T008 Create and verify the initial PostgreSQL migration for the WorldCards schema in `prisma/migrations/`
- [ ] T009 [P] Create shared domain enums, API response types, and public card/identity types in `src/types/domain.ts`
- [ ] T010 [P] Implement server-only database client lifecycle and transaction helpers in `src/lib/db/client.ts` and `src/lib/db/transactions.ts`
- [ ] T011 [P] Implement environment parsing with explicit startup errors for missing database and session configuration in `src/lib/config.ts`
- [ ] T012 [P] Implement Zod schemas and explicit client-safe validation error mapping in `src/lib/validation/`
- [ ] T013 [P] Implement server-managed session creation, lookup, invalidation, and cookie handling in `src/lib/auth/session.ts`
- [ ] T014 [P] Implement role guards and authenticated-user helpers that never expose password hashes in `src/lib/auth/guards.ts`
- [ ] T015 [P] Implement shared API error responses, request logging, and no-sensitive-data serialization in `src/lib/api/errors.ts` and `src/lib/api/serializers.ts`
- [ ] T016 [P] Add responsive application shell, navigation, loading, error, and explicit empty-state components in `src/components/`
- [ ] T017 Seed a validated source snapshot, initial active rarity configuration, base-country card records, and an administrator account whose initial credential is supplied through a one-time environment variable or setup flow and bcrypt-hashed before persistence, without committing secrets, in `prisma/seed/`
- [ ] T018 [P] Add foundational database constraint, server-boundary, conditional ownership, and stock-invariant tests proving base cards have null `card_instance_id`, special cards require it, assigned instances are unique, and stock never becomes negative in `tests/integration/foundation.test.ts` and `tests/integration/card-invariants.test.ts`

**Checkpoint**: Database schema, server-only boundaries, validation, sessions, and shared UI infrastructure are ready for story work.

## Phase 3: User Story 1 - Create a personal collection (Priority: P1) 🎯 MVP

**Goal**: Visitors can register and sign in, and authenticated players can access only their own persistent collection.

**Independent Test**: Register a player, sign in, view an empty collection, sign out, sign in again, and verify that another player cannot access that collection.

### Tests for User Story 1

- [ ] T019 [P] [US1] Add authentication contract tests for register, sign-in, and sign-out responses in `tests/integration/auth-contract.test.ts`
- [ ] T020 [P] [US1] Add authentication boundary and collection-isolation tests for duplicate emails, invalid credentials, and cross-user access in `tests/integration/auth-boundaries.test.ts`
- [ ] T021 [P] [US1] Add browser smoke coverage for registration, sign-in, sign-out, and empty collection recovery in `tests/e2e/auth-collection.spec.ts`

### Implementation for User Story 1

- [ ] T022 [P] [US1] Implement bcrypt password hashing and generic credential verification in `src/lib/auth/passwords.ts`
- [ ] T023 [US1] Implement email-only registration, duplicate-email handling, and public identity creation in `src/lib/auth/register.ts`
- [ ] T024 [US1] Implement sign-in and sign-out services using server-managed sessions in `src/lib/auth/sign-in.ts`
- [ ] T025 [US1] Implement `POST /api/auth/register` in `src/app/api/auth/register/route.ts` according to `contracts/auth.md`
- [ ] T026 [US1] Implement `POST /api/auth/sign-in` in `src/app/api/auth/sign-in/route.ts` with generic invalid-credential errors
- [ ] T027 [US1] Implement `POST /api/auth/sign-out` in `src/app/api/auth/sign-out/route.ts`
- [ ] T028 [US1] Implement authenticated collection loading scoped to the current user in `src/lib/cards/collection.ts` and `src/app/api/collection/route.ts`
- [ ] T029 [US1] Build registration, sign-in, and empty collection pages in `src/app/(auth)/` and `src/app/(player)/collection/page.tsx`

**Checkpoint**: US1 is independently usable and proves identity, authorization, persistence, and sensitive-data protections.

## Phase 4: User Story 2 - Open a booster (Priority: P1)

**Goal**: A signed-in player can submit an idempotent booster request and receive exactly five server-selected cards.

**Independent Test**: With a seeded catalog and authenticated player, open a booster and verify five ownership records, five response cards, frozen rarity snapshots, and a repeat request that does not create a second bundle.

**Dependencies**: Requires Phase 2 and the authenticated session/collection boundary from US1.

### Tests for User Story 2

- [ ] T030 [P] [US2] Add unit tests for configurable population thresholds, invalid populations, rarity boundaries, and probability totals in `tests/unit/rarity.test.ts`
- [ ] T031 [P] [US2] Add unit tests for server-only random rarity selection and fixed five-card bundle behavior in `tests/unit/draw-rules.test.ts`
- [ ] T032 [P] [US2] Add booster contract and idempotency integration tests for `POST /api/boosters/open` in `tests/integration/booster-contract.test.ts`
- [ ] T033 [P] [US2] Add browser smoke coverage for opening a booster and displaying the received cards in `tests/e2e/booster.spec.ts`

### Implementation for User Story 2

- [ ] T034 [P] [US2] Implement active rarity configuration loading and population-to-rarity calculation in `src/lib/cards/rarity.ts`
- [ ] T035 [P] [US2] Implement server-only probability sampling and catalog candidate selection in `src/lib/cards/draw-rules.ts`
- [ ] T036 [US2] Implement booster opening transaction creation, five-card assignment, rarity snapshots, completion state, and idempotency handling in `src/lib/cards/booster.ts`
- [ ] T037 [US2] Implement `POST /api/boosters/open` with authenticated-user enforcement and the exact five-card response shape in `src/app/api/boosters/open/route.ts`
- [ ] T038 [US2] Build the booster-opening UI and result view without accepting card IDs, rarity, random values, or stock changes from the client in `src/app/(player)/booster/page.tsx` and `src/components/booster/`

**Checkpoint**: US2 is independently testable for normal draws, unauthorized requests, idempotency, rarity snapshots, and server-only draw control.

## Phase 5: User Story 3 - Enforce special-card stock (Priority: P1)

**Goal**: Special cards use individually identifiable physical copies and remain non-duplicable under exhaustion and concurrent draws.

**Independent Test**: Seed a special card with known stock, exhaust it through openings, and run simultaneous last-copy attempts; verify one assignment at most, no negative stock, and no duplicate physical instance.

**Dependencies**: Requires the booster transaction and draw pipeline from US2.

### Tests for User Story 3

- [ ] T039 [P] [US3] Add integration tests for special-card instance creation, assignment, exhausted stock, and rollback when a five-card bundle cannot complete in `tests/integration/special-stock.test.ts`
- [ ] T040 [P] [US3] Add concurrent transaction tests proving conditional stock decrement and unique physical-copy assignment in `tests/integration/concurrent-stock.test.ts`
- [ ] T041 [P] [US3] Add regression tests proving assigned rarity snapshots and owned special instances remain stable after catalog updates in `tests/integration/historical-snapshots.test.ts`

### Implementation for User Story 3

- [ ] T042 [US3] Implement special-card physical-copy creation and availability queries in `src/lib/cards/special-stock.ts`
- [ ] T043 [US3] Extend booster allocation to lock/select one unassigned `CardInstance`, decrement stock atomically, and roll back the whole opening on allocation failure in `src/lib/cards/booster.ts`
- [ ] T044 [US3] Enforce database-level uniqueness and non-negative stock checks for special instances in `prisma/schema.prisma` and `prisma/migrations/`
- [ ] T045 [US3] Update booster response and collection serialization to expose only ownership-safe instance identifiers and never duplicate a physical copy in `src/lib/api/serializers.ts`
- [ ] T046 [US3] Add unavailable/exhausted special-card messaging and failed-opening recovery to `src/components/booster/` and `src/app/(player)/booster/page.tsx`

**Checkpoint**: US3 is independently verified against exhaustion, rollback, concurrency, and historical ownership behavior.

## Phase 6: User Story 4 - Browse and filter the collection (Priority: P2)

**Goal**: Players can combine type, rarity, continent, and partial-name filters and receive a clear no-results state.

**Independent Test**: Seed a collection with varied cards, apply each filter independently and in combination, search by partial name, and verify empty and no-result states.

**Dependencies**: Requires the authenticated collection route from US1 and owned-card data from US2.

### Tests for User Story 4

- [ ] T047 [P] [US4] Add collection query tests for combinable type, rarity, continent, and partial-name filters in `tests/integration/collection-filters.test.ts`
- [ ] T048 [P] [US4] Add browser smoke coverage for filter combinations, search, empty collection, and no-result states in `tests/e2e/collection-filters.spec.ts`

### Implementation for User Story 4

- [ ] T049 [US4] Implement validated collection query parsing and parameterized filtering in `src/lib/cards/collection.ts`
- [ ] T050 [US4] Extend `GET /api/collection` to return stored rarity snapshots and display fields for only the authenticated user in `src/app/api/collection/route.ts`
- [ ] T051 [US4] Build responsive collection filter controls, card grid, search state, and no-result state in `src/components/collection/` and `src/app/(player)/collection/page.tsx`

**Checkpoint**: US4 is independently testable through the collection API and browser UI.

## Phase 7: User Story 5 - View card details and progress (Priority: P2)

**Goal**: Players can inspect complete card details and compare owned count with total available cards using correct special-copy counting.

**Independent Test**: Open a card from the collection, verify geographic/historical details and availability, then verify progress counts before and after an owned special copy is assigned.

**Dependencies**: Requires the collection and special-card ownership representations from US1, US2, and US3.

### Tests for User Story 5

- [ ] T052 [P] [US5] Add card-detail and availability contract tests for `GET /api/cards/{cardId}` in `tests/integration/card-details.test.ts`
- [ ] T053 [P] [US5] Add progress-count tests for base cards, distinct special copies, exhausted specials, and unavailable historical records in `tests/integration/progress.test.ts`
- [ ] T054 [P] [US5] Add browser smoke coverage for details navigation and progress display in `tests/e2e/card-details-progress.spec.ts`

### Implementation for User Story 5

- [ ] T055 [P] [US5] Implement card-detail and availability queries that preserve inactive owned cards in `src/lib/cards/details.ts`
- [ ] T056 [P] [US5] Implement owned-versus-total progress calculation with version-1 special-copy rules in `src/lib/cards/progress.ts`
- [ ] T057 [US5] Implement `GET /api/cards/{cardId}` and `GET /api/collection/progress` in `src/app/api/cards/[cardId]/route.ts` and `src/app/api/collection/progress/route.ts`
- [ ] T058 [US5] Build card detail, availability, and progress views in `src/app/(player)/cards/[cardId]/page.tsx`, `src/components/cards/`, and `src/components/progress/`

**Checkpoint**: US5 is independently usable for card comprehension, availability, and progress tracking.

## Phase 8: User Story 6 - Manage special cards (Priority: P2)

**Goal**: Administrators can create and edit historical special cards while players are rejected and assigned stock cannot be reduced below copies already allocated.

**Independent Test**: An administrator creates and edits a valid special card, verifies future availability, and attempts invalid, under-stock, and player-authorized operations.

**Dependencies**: Requires role guards from Phase 2 and special stock/instance behavior from US3.

### Tests for User Story 6

- [ ] T059 [P] [US6] Add administrator special-card contract tests for create and patch requests in `tests/integration/admin-special-cards.test.ts`
- [ ] T060 [P] [US6] Add authorization and assigned-stock validation tests for player requests, invalid historical fields, and stock below assigned copies in `tests/integration/admin-authorization.test.ts`
- [ ] T061 [P] [US6] Add browser smoke coverage for administrator create/edit and rejected player access in `tests/e2e/admin-special-cards.spec.ts`

### Implementation for User Story 6

- [ ] T062 [US6] Implement validated special-card create/update services with source attribution and assigned-copy stock checks in `src/lib/cards/admin-special-cards.ts`
- [ ] T063 [US6] Implement `POST /api/admin/special-cards` and `PATCH /api/admin/special-cards/[cardId]` with administrator-only guards in `src/app/api/admin/special-cards/route.ts` and `src/app/api/admin/special-cards/[cardId]/route.ts`
- [ ] T064 [US6] Build administrator special-card catalog and edit forms with explicit validation errors in `src/app/admin/special-cards/` and `src/components/admin/`

**Checkpoint**: US6 is independently testable for administrator workflows, authorization, attribution, and stock invariants.

## Phase 9: Polish & Cross-Cutting Concerns

**Purpose**: Validate the complete feature against performance, accessibility, traceability, source compliance, and the documented quickstart.

- [ ] T065 [P] Add end-to-end regression coverage for the complete register-to-booster-to-filter-to-detail journey in `tests/e2e/worldcards-journey.spec.ts`
- [ ] T066 [P] Add accessibility checks for authentication, collection, booster, detail, and admin views in `tests/e2e/accessibility.spec.ts`
- [ ] T067 [P] Add performance checks for 20 concurrent users issuing 100 collection/card-detail requests and 50 successful booster openings, asserting p95 collection/card-detail latency <= 1 second and p95 booster latency <= 2 seconds in `tests/integration/performance.test.ts`
- [ ] T068 [P] Add data-import validation, checksum/version recording, source URL/retrieval date/license/terms/attribution retention, and deterministic Country, Capital, and Flag card generation from a validated snapshot in `src/lib/data-import/` and `prisma/seed/`
- [ ] T069 [P] Document API behavior, data-source attribution, rarity configuration, and implementation deviations in `README.md` and `docs/`
- [ ] T070 Run the scenarios in `specs/001-worldcards/quickstart.md`, the full lint/type-check/test suite, and verify no version-1 feature adds trading, leaderboards, or duplicate conversion
- [ ] T071 Review the implementation against `.specify/memory/constitution.md`, update `specs/001-worldcards/plan.md` for any justified deviations, and record the final traceability evidence in `specs/001-worldcards/`
- [ ] T072 [P] Add integration tests for increasing and decreasing `stock_total`, creation/removal of only unassigned physical instances, recomputed `stock_remaining`, and rejection below assigned copies in `tests/integration/admin-stock-adjustments.test.ts`
- [ ] T073 [US6] Implement transactional stock-total adjustment semantics, including creation/removal of unassigned instances and rejection below assigned copies, in `src/lib/cards/admin-special-cards.ts`
- [ ] T074 [P] Create a requirements-to-tests traceability matrix covering FR-001 through FR-022, buildable SC-002 through SC-008, and the generation prompt reference in `specs/001-worldcards/traceability.md`
- [ ] T075 [P] Document the exact source evidence required for each imported field, including source URL, retrieval date, checksum/version, license/terms reference, and attribution text, in `docs/data-sources.md`

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: No dependencies; T003-T006 can run in parallel after T001-T002 establish the project.
- **Foundational (Phase 2)**: Depends on Setup; T009-T018 can proceed in parallel where they touch different files, but all foundational tasks block user stories.
- **US1 (Phase 3)**: Depends on Phase 2; MVP authentication and collection access.
- **US2 (Phase 4)**: Depends on Phase 2 and US1's authenticated-user boundary.
- **US3 (Phase 5)**: Depends on US2's transaction and draw pipeline.
- **US4 (Phase 6)**: UI/query scaffolding may begin after US1, but independently testable completion depends on owned-card records produced by US2.
- **US5 (Phase 7)**: Depends on US3 plus collection data from US1/US2.
- **US6 (Phase 8)**: Depends on Phase 2 role guards and US3 stock/instance behavior.
- **Polish (Phase 9)**: Depends on all desired stories being complete.

### User Story Dependencies

```text
Phase 2 ──┬──> US1 ──> US2 ──> US3 ──> US5
          ├──> US4 ────────────────┘
          └──> US6 (also requires US3 stock behavior)
```

US4 scaffolding can begin after US1, while US4 story validation waits for US2-owned-card data. US6 can begin after the shared foundation, but its stock-invariant implementation must wait for US3. US5 waits for the stable special-copy representation.

### Parallel Opportunities

- T003-T006 are parallel setup work after project initialization.
- T009-T016 and T018 can be split across contributors after the schema direction is agreed.
- Within each story, all listed test tasks marked `[P]` can run in parallel.
- Rarity rules (T034-T035), card detail/progress reads (T055-T056), and admin UI/API work (T063-T064) can be split by file once their prerequisite domain contracts are stable.
- After Phase 2, US1 can proceed alongside preparatory US4 work; after US3, US5 and US6 UI work can proceed in parallel.

## Parallel Example: User Story 1

```text
Task T019: Authentication contract tests in tests/integration/auth-contract.test.ts
Task T020: Authentication boundary tests in tests/integration/auth-boundaries.test.ts
Task T021: Browser smoke tests in tests/e2e/auth-collection.spec.ts
Task T022: Password hashing in src/lib/auth/passwords.ts
```

## Parallel Example: User Story 2

```text
Task T030: Rarity unit tests in tests/unit/rarity.test.ts
Task T031: Draw-rule unit tests in tests/unit/draw-rules.test.ts
Task T034: Rarity calculation in src/lib/cards/rarity.ts
Task T035: Probability sampling in src/lib/cards/draw-rules.ts
```

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1 setup.
2. Complete Phase 2 foundational infrastructure.
3. Complete Phase 3 User Story 1.
4. Run the US1 integration and browser tests and verify collection isolation.
5. Stop for MVP validation before adding booster rules.

### Incremental Delivery

1. Add US2 to make the primary five-card activity usable.
2. Add US3 before treating special cards as production-ready.
3. Add US4 and US5 for collection usability and progress.
4. Add US6 for catalog maintenance.
5. Complete Phase 9 before release.

## Completion Criteria

- All tasks use the required `- [ ] T### [P?] [US#?] description with file path` checklist format.
- Every user story has an independent test criterion and implementation tasks mapped to its contract/model/UI surfaces.
- Critical rarity, authentication, stock, concurrency, and snapshot behavior has automated coverage.
- The quickstart scenarios and constitutional constraints pass before integration.
