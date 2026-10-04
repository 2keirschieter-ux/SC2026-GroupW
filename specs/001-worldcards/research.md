# Research: WorldCards

## Decision: Use one Next.js TypeScript application

**Rationale**: A single App Router application keeps the student project small,
allows server-only modules for game rules, and deploys naturally to Vercel.
Client components are limited to interactive views; authentication, database
access, data import, and draw logic remain server-only.

**Alternatives considered**: A separate frontend and API would create an
additional deployment boundary and duplicate types without improving the
version-1 requirements.

## Decision: Use hosted PostgreSQL for authoritative game state

**Rationale**: Users, cards, ownership, stock, and audit history require durable
relational constraints and transactions. PostgreSQL supports atomic conditional
updates and uniqueness constraints needed for physical special-copy allocation.

**Alternatives considered**: An in-memory store is unsafe for deployment; a
document database would add complexity for relational ownership and stock rules.

## Decision: Keep authentication simple and server-managed

**Rationale**: Version 1 uses email-or-username and password registration with
bcrypt hashing, server-side session checks, and role authorization. OAuth is not
required for the MVP and would add external configuration and privacy concerns.

**Alternatives considered**: OAuth can be added later, but it is not necessary
to satisfy the current user stories.

## Decision: Import REST Countries into the database

**Rationale**: REST Countries is used as the single source for current country
name, population, continent, capital, and flag data. The application imports a
validated snapshot rather than depending on the remote API during every page
request or booster draw. Each import records source, retrieval date, source
version or response checksum, and attribution metadata.

**Alternatives considered**: Live per-request API calls would make gameplay
dependent on an external service and could change rarity between requests.

## Decision: Curate historical cards locally

**Rationale**: Former flags, former capitals, and former country names are
maintained as reviewed records in the database, with source citations and
attribution. This keeps the limited version-1 catalog deterministic.

**Alternatives considered**: An unverified historical API would conflict with
the constitution's single reliable source requirement for authoritative data.

## Decision: Allocate special stock transactionally

**Rationale**: A booster draw first determines a rarity and candidate pool on
the server, then reserves a special physical copy through a database
transaction with a conditional stock check and a uniqueness constraint. If any
card in the five-card bundle cannot be allocated, the complete opening rolls
back.

**Alternatives considered**: Decrementing stock after inserting ownership would
permit races and duplicate the last copy.

## Decision: Store rarity snapshots

**Rationale**: Catalog cards store the rarity calculated from the active country
population at generation time. Ownership records also store the assigned rarity
snapshot so already-owned cards remain historically stable after a data update.
New assignments use the current catalog generation.

**Alternatives considered**: Recalculating rarity on every request would make
existing collections change unexpectedly and would violate the clarified
historical behavior.

## Decision: Use documented initial balancing values

**Rationale**: Population thresholds and rarity probabilities are configuration
data, not client inputs. The initial five-card booster uses documented server
configuration and is tested for valid probability totals and boundary behavior.

**Alternatives considered**: Hard-coding values in UI or client code would make
the rules mutable by clients and harder to audit.
