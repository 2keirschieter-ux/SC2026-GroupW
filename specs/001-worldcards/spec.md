# Feature Specification: WorldCards

**Feature Branch**: `001-worldcards`

**Created**: 2026-10-04

**Status**: Draft

**Input**: User description: "Create WorldCards, a trading card game website about the countries of the world."

## Clarifications

### Session 2026-10-04

- Q: How should rarity levels be determined from population and used in boosters? → A: Configurable population thresholds and rarity probabilities, with documented initial values.
- Q: How many cards should a booster contain in version 1? → A: 5 cards per booster, with the same bundle size for every opening.
- Q: When a special card has multiple copies in stock, may the same player own multiple distinct copies? → A: Yes, if stock allows it; each physical copy may be assigned only once.
- Q: When a population update changes a country's rarity level, should already-owned cards change too? → A: No, rarity is fixed at assignment; new draws use current data.

## User Scenarios & Testing *(mandatory)*

### User Story 1 - Create a personal collection (Priority: P1)

As a player, I create an account and sign in so that I have my own card
collection.

**Why this priority**: A player's identity and collection are required to retain
obtained cards and track progress.

**Independent Test**: A user can create an account, sign in, view an empty
collection, and find that collection again after signing in later.

**Acceptance Scenarios**:

1. **Given** a visitor without an account, **When** they provide valid
   registration information, **Then** an account is created and no sensitive
   data is publicly displayed.
2. **Given** an existing account, **When** the player provides valid credentials,
   **Then** they can access only their own collection.
3. **Given** invalid or already-used registration information, **When** the
   visitor attempts to register, **Then** registration is rejected with an
   understandable message.

---

### User Story 2 - Open a booster (Priority: P1)

As a signed-in player, I open a booster and receive a bundle of cards drawn
randomly according to the rarity rules.

**Why this priority**: Booster draws are the main activity and the primary source
of collection progress.

**Independent Test**: A signed-in player can open a booster and see the cards
received, including each card's type, rarity, and key information.

**Acceptance Scenarios**:

1. **Given** a signed-in player and an available catalog, **When** they open a
   booster, **Then** they receive a bundle of cards and it is added to their
   collection.
2. **Given** multiple successive openings, **When** the player opens boosters,
   **Then** every draw follows the rarity probabilities and cannot be chosen or
   predicted by the player.
3. **Given** an opening attempt by a visitor who is not signed in, **When** they
   request a booster, **Then** no card is assigned and they are invited to sign
   in.

---

### User Story 3 - Enforce special-card stock (Priority: P1)

As a player, I want special cards to remain genuinely limited so that their
rarity and value stay consistent.

**Why this priority**: Limited stock is a core game rule and must prevent
duplication of a unique physical copy.

**Independent Test**: With a known stock configured, enough boosters are opened
to exhaust it, and no later draw contains an exhausted special card.

**Acceptance Scenarios**:

1. **Given** a special card with stock above zero, **When** a draw selects it,
   **Then** it is assigned to the player and its remaining stock decreases by one.
2. **Given** a special card with zero remaining stock, **When** a booster is
   opened, **Then** that card cannot be returned.
3. **Given** a unique-stock special card already assigned to a player, **When**
   that player views or opens boosters, **Then** they cannot see or receive a
   second copy of that physical card.
4. **Given** multiple simultaneous openings targeting the last copy, **When**
   the draws are processed, **Then** at most one player receives it and stock
   never becomes negative.

---

### User Story 4 - Browse and filter the collection (Priority: P2)

As a player, I view my collection and filter it by type, rarity, or continent,
with a name search.

**Why this priority**: A collection quickly becomes difficult to browse without
search and filtering tools.

**Independent Test**: A collection containing different types, rarities, and
continents can be filtered by each criterion and searched by name.

**Acceptance Scenarios**:

1. **Given** a collection containing several cards, **When** the player selects a
   type, rarity, or continent, **Then** only matching cards are displayed.
2. **Given** a collection containing several names, **When** the player enters a
   partial name search, **Then** relevant results are displayed.
3. **Given** filters matching no cards, **When** the player applies them, **Then**
   the collection displays a clear empty state.

---

### User Story 5 - View card details and progress (Priority: P2)

As a player, I view a card's detailed page and my progress compared with the
total available collection.

**Why this priority**: Details and progress give players a collection goal and
help them understand the cards they obtain.

**Independent Test**: From a collection, the player opens a card, verifies all
its information, and views the owned-card count and available total.

**Acceptance Scenarios**:

1. **Given** a card visible in the collection, **When** the player opens its
   details, **Then** they see its name, type, rarity, and available geographic
   or historical information.
2. **Given** a partially completed collection, **When** the player views progress,
   **Then** the owned count and available total are shown without counting the
   same special copy twice.
3. **Given** an exhausted special card, **When** a player who does not own it
   views the catalog or progress, **Then** its availability status is shown
   consistently.

---

### User Story 6 - Manage special cards (Priority: P2)

As an administrator, I add or edit a special card and its remaining stock.

**Why this priority**: Catalog administration is required to maintain historical
content and limited stock.

**Independent Test**: An administrator can create a special card with valid
stock, edit its information, and verify that the resulting stock is used by
future draws.

**Acceptance Scenarios**:

1. **Given** an authenticated administrator, **When** they create a special card
   with complete information and valid stock, **Then** it becomes available
   according to that stock.
2. **Given** an existing special card, **When** the administrator edits its
   information or stock with a valid value, **Then** the changes are saved and
   applied to future draws.
3. **Given** a player without administrator rights, **When** they attempt to
   manage a special card, **Then** the action is rejected.
4. **Given** stock that has already been assigned, **When** the administrator
   enters stock below the number of assigned copies, **Then** the change is
   rejected with an explanation.

### Edge Cases

- A booster requested when no card can be drawn is rejected without changing
  the collection or stock.
- A deleted or unavailable special card remains identifiable in collections
  where it was already assigned.
- Missing, zero, or invalid population prevents rarity generation or updating
  instead of producing an arbitrary rarity.
- A population update may change rarity for new assignments, but must not change
  the fixed rarity of an assigned card, create a duplicate, or remove an owned
  card.
- A no-result search, an empty collection, and an empty catalog have distinct,
  explicit interface states.
- A connection loss or duplicate submission during a draw must not assign the
  same physical special copy twice.

## Requirements *(mandatory)*

### Functional Requirements

- **FR-001**: The system MUST allow a visitor to create an account with valid
  information and a player to sign in to access their collection.
- **FR-002**: The system MUST isolate each collection so that a player can view
  or modify only their own cards.
- **FR-003**: The system MUST represent Country cards with a name, population,
  continent, and flag.
- **FR-004**: The system MUST represent Capital cards with the associated
  country's current capital.
- **FR-005**: The system MUST represent Flag cards with the associated country's
  current flag.
- **FR-006**: The system MUST support special cards for former flags, former
  capitals, and former country names, without requiring them for every country.
- **FR-007**: The system MUST assign rarity using configurable population
  thresholds: Common, Uncommon, Rare, Epic, and Legendary, with Special above
  these levels.
- **FR-008**: The system MUST calculate rarity consistently from the population
  currently recorded at generation time by applying the active documented
  thresholds.
- **FR-008a**: The system MUST use a configurable probability table by rarity
  for boosters, with documented initial values that can be verified by tests.
- **FR-008b**: The system MUST freeze an instance's rarity when it is assigned
  and MUST NOT recalculate it retroactively when population or thresholds change.
- **FR-009**: The system MUST open a booster only for a signed-in player and
  assign a fixed bundle of 5 cards drawn randomly according to the rarity rules.
- **FR-010**: Draws, their probabilities, and special-stock decrementation MUST
  run in a way that the client cannot control.
- **FR-011**: The system MUST NEVER assign a special card whose remaining stock
  is zero.
- **FR-012**: The system MUST prevent the same physical copy of a special card
  from being assigned or shown twice to a player, while allowing multiple
  distinct copies of the same special card when stock permits.
- **FR-013**: The system MUST ensure concurrent draws never make special-card
  stock negative or distribute the last copy twice.
- **FR-014**: The system MUST allow collection filtering by type, rarity, and
  continent, and searching by name.
- **FR-015**: The system MUST display a detailed page with all available
  information for a card.
- **FR-016**: The system MUST display a player's progress as owned cards
  compared with the total available cards, counting special copies correctly.
- **FR-017**: The system MUST allow an authorized administrator to add and edit
  a special card and its remaining stock.
- **FR-018**: The system MUST reject an administered stock lower than the number
  of copies already assigned.
- **FR-019**: The system MUST validate user input and show explicit errors
  without exposing sensitive data.
- **FR-020**: Passwords MUST be protected and MUST NEVER be displayed or stored
  in plain text.
- **FR-021**: The system MUST preserve traceability from this feature to its
  specification and the prompts used to generate it.
- **FR-022**: Population, capital, flag, and image sources MUST be identified and
  their terms of use MUST be compatible with the project.

### Key Entities

- **Player**: An authenticated account that owns a collection and has a player or
  administrator role.
- **Country**: A geographic reference entity with a name, population, continent,
  current capital, and current flag.
- **Card**: A collectible representation linked to a country, with a type,
  rarity, and information required for its details.
- **Special card**: A historical card linked to a country, with a description of
  the former information and a limited stock.
- **Instance**: A card assignment to a player that identifies a special physical
  copy and prevents its duplication.
- **Booster**: An operation that produces a bundle of cards for a player
  according to the draw rules.
- **Progress**: Indicators of the number of owned cards compared with the total
  available.

## Success Criteria *(mandatory)*

### Measurable Outcomes

- **SC-001**: At least 95% of test users can create an account, sign in, and
  find their collection without help on their first attempt.
- **SC-002**: 100% of test draws assign no special card whose stock is zero,
  including concurrent draws.
- **SC-003**: 100% of newly generated cards in tests show rarity matching the
  currently recorded population and thresholds, while assigned instances retain
  their historical rarity.
- **SC-004**: 100% of unique-stock tests prevent duplicate assignment or
  duplicate visibility of the same physical special copy for a player.
- **SC-005**: At least 90% of test users find a specified card in under
  30 seconds using filters and search.
- **SC-006**: At least 90% of test users view a card's details and identify its
  key information without assistance.
- **SC-007**: A test administrator can add or edit a special card and verify the
  resulting stock in under 2 minutes.
- **SC-008**: No version 1 feature allows player trading, leaderboards, or
  duplicate conversion.

## Assumptions

- Version 1 is browser-accessible and targets players with a stable internet
  connection.
- Standard registration uses a unique email address or username and a password;
  no external identity provider is required.
- A booster contains 5 cards in version 1, and all boosters use the same format.
- Initial numeric values for rarity thresholds and draw probabilities will be
  defined and documented during design; configuration must preserve the stated
  rarity rules.
- Special cards with stock above one may be obtained by multiple players, and
  one player may own multiple distinct copies; each physical copy may be assigned
  only once.
- Reference data is maintained by one validated, versioned source; updates do
  not remove already collected history.
- An assigned instance's rarity is a historical snapshot; only new assignments
  apply updated populations and thresholds.
- Player trading, leaderboards, and duplicate conversion are explicitly out of
  scope for this version.
