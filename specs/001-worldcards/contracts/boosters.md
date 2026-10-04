# Booster Contract

## Open booster

`POST /api/boosters/open`

Request:

```json
{
  "idempotencyKey": "client-generated-unique-request-key"
}
```

The key is treated only as a duplicate-submission guard. The client cannot
provide rarity, card IDs, random values, or stock changes.

Success:

```json
{
  "openingId": "uuid",
  "cards": [
    {
      "cardId": "uuid",
      "instanceId": "uuid-or-null",
      "type": "country",
      "name": "Example",
      "rarity": "rare",
      "obtainedAt": "timestamp"
    }
  ]
}
```

The response contains exactly five cards for a completed opening. Special
physical instance identifiers are returned only as needed to display ownership;
stock internals and random state are not exposed.

Failure: no partial bundle is returned. The opening is rolled back or marked
failed with a client-safe error.
