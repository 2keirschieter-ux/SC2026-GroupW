# Collection Contract

## List collection

`GET /api/collection?type=&rarity=&continent=&search=`

Returns only the authenticated user's owned cards. Filters are optional and
combinable. Results include display fields and the stored rarity snapshot.

## Card details

`GET /api/cards/{cardId}`

Returns the card's public details and availability status. It never returns
password data, internal random state, or another user's collection.

## Progress

`GET /api/collection/progress`

Returns owned-card count and total available-card count using the version-1
special-copy counting rules.
