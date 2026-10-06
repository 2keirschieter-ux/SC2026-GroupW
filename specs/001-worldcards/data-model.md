# Data Model: WorldCards

## User

| Field | Type | Rules |
|-------|------|-------|
| id | UUID | Primary key |
| email | string | Required, normalized, unique; the only supported account identifier in version 1 |
| password_hash | string | Required; bcrypt hash only |
| role | enum | `player` or `admin`; defaults to `player` |
| created_at | timestamp | Required |

Users own collection instances and may open boosters. Only administrators may
manage special-card catalog records.

## Country

| Field | Type | Rules |
|-------|------|-------|
| id | UUID | Primary key |
| external_code | string | Required, unique source identifier |
| name | string | Required |
| population | integer | Required and greater than zero |
| continent | string | Required |
| current_capital | string | Required when provided by source |
| current_flag | string | Required source URL or asset reference |
| source_snapshot_id | UUID | Required reference to imported source snapshot |

Country is the authoritative current-data entity for base cards.

## DataSnapshot

| Field | Type | Rules |
|-------|------|-------|
| id | UUID | Primary key |
| source_name | string | Required, e.g. REST Countries |
| retrieved_at | timestamp | Required |
| source_version | string | Required response checksum or release identifier |
| license_reference | string | Required |
| status | enum | `validated`, `rejected`, or `superseded` |

Only validated snapshots may generate or update cards.

## Card

| Field | Type | Rules |
|-------|------|-------|
| id | UUID | Primary key |
| card_type | enum | `country`, `capital`, `flag`, or `special` |
| country_id | UUID | Required foreign key |
| name | string | Required |
| rarity | enum | `common`, `uncommon`, `rare`, `epic`, `legendary`, or `special` |
| rarity_config_version | string | Required |
| description | string | Required for special cards |
| historical_kind | enum | Required only for special cards |
| stock_total | integer | Required for special cards; otherwise null; total physical-copy capacity |
| stock_remaining | integer | Required for special cards; never negative; equals `stock_total` minus assigned copies |
| source_reference | string | Required for special cards |
| active | boolean | Existing owned cards remain referencable when false |

Base cards are generated from a validated country snapshot. Special cards are
manually curated and require historical source attribution.

## CardInstance

| Field | Type | Rules |
|-------|------|-------|
| id | UUID | Primary key; identifies a physical special copy when applicable |
| card_id | UUID | Required foreign key |
| serial_number | string | Required and unique for special cards |
| assigned_at | timestamp | Null until assigned |

For special cards, one row exists per physical copy. A copy can be assigned at
most once. Increasing `stock_total` creates new unassigned rows; decreasing it
removes only unassigned rows and is rejected when the requested total is below
the number already assigned.

## UserCard

| Field | Type | Rules |
|-------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | Required foreign key |
| card_id | UUID | Required foreign key |
| card_instance_id | UUID | Required for special cards |
| rarity_snapshot | enum | Required, frozen at assignment |
| obtained_at | timestamp | Required |
| booster_opening_id | UUID | Required for booster rewards |

The combination of `user_id` and `card_instance_id` is unique. Base cards may
have multiple owned copies; special physical instances may not. For base cards,
`card_instance_id` is null; for special cards, it is required.

## BoosterOpening

| Field | Type | Rules |
|-------|------|-------|
| id | UUID | Primary key |
| user_id | UUID | Required foreign key |
| idempotency_key | string | Required and unique per user |
| status | enum | `pending`, `completed`, or `failed` |
| card_count | integer | Must equal 5 for version 1 |
| created_at | timestamp | Required |
| completed_at | timestamp | Required when completed |

Opening history supports auditability and prevents duplicate submission from
creating a second reward bundle.

## RarityConfig

| Field | Type | Rules |
|-------|------|-------|
| version | string | Primary key |
| common_max_population | integer | Upper bound for Common; greater than the other thresholds |
| uncommon_max_population | integer | Upper bound for Uncommon; greater than rare and epic thresholds |
| rare_max_population | integer | Upper bound for Rare; greater than the Epic threshold |
| epic_max_population | integer | Upper bound for Epic; lowest population threshold |
| probabilities | JSON/object | Non-negative values totaling 1 |
| active | boolean | At most one active configuration |

Higher population maps to rarer rarity. Special cards are selected only from
available special stock and do not use the base rarity thresholds.

## Relationships and transitions

- A `DataSnapshot` contains the source state referenced by many `Country` rows.
- A `Country` has many `Card` rows across card types and generations.
- A `Card` may have many `CardInstance` rows when it is special.
- A `User` receives many `UserCard` rows through `BoosterOpening`.
- A special-card allocation changes one unassigned `CardInstance` to assigned and
  decrements `Card.stock_remaining` in the same transaction.
- A stock edit changes `stock_total` and creates or removes only unassigned
  `CardInstance` rows; `stock_remaining` is recomputed as total capacity minus
  assigned copies in the same transaction.
- An opening is `pending` before allocation, `completed` only after all five
  cards and ownership rows are committed, and `failed` after rollback.
