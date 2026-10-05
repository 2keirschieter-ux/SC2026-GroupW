# WorldCards traceability

This matrix maps the functional requirements in `spec.md` to implementation
surfaces and executable test locations. Integration and browser tests require a
running PostgreSQL database and a Node.js environment.

| Requirements | Implementation | Tests |
|---|---|---|
| FR-001–FR-004 (identity, registration, isolation) | `src/lib/auth/`, `src/app/api/auth/`, `src/app/api/collection/` | `tests/integration/auth-contract.test.ts`, `auth-boundaries.test.ts` |
| FR-005–FR-009 (five-card draws and rarity) | `src/lib/cards/rarity.ts`, `draw-rules.ts`, `booster.ts` | `tests/unit/rarity.test.ts`, `draw-rules.test.ts`, `booster-contract.test.ts` |
| FR-010–FR-013 (special stock and atomic ownership) | `src/lib/cards/special-stock.ts`, `admin-special-cards.ts`, migration constraints | `tests/integration/special-stock.test.ts`, `concurrent-stock.test.ts`, `admin-stock-adjustments.test.ts` |
| FR-014–FR-017 (collection filtering) | `src/lib/cards/collection.ts`, collection route and page | `tests/integration/collection-filters.test.ts` |
| FR-018–FR-020 (details and progress) | `src/lib/cards/details.ts`, `progress.ts` | `tests/integration/card-details.test.ts`, `progress.test.ts` |
| FR-021–FR-022 (administrator catalog) | `src/app/api/admin/special-cards/`, `admin-special-cards.ts` | `tests/integration/admin-special-cards.test.ts`, `admin-authorization.test.ts` |
| SC-002–SC-008 | Application and API test suites | `tests/e2e/`, `tests/integration/` |

The implementation is based on the generation request recorded in
`specs/001-worldcards/spec.md`: “Create WorldCards, a trading card game
website about the countries of the world.”
