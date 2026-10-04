# Administrator Special-Card Contract

## Create special card

`POST /api/admin/special-cards`

Requires an administrator session. Validates historical type, country, source
reference, description, and non-negative stock.

## Update special card

`PATCH /api/admin/special-cards/{cardId}`

Requires an administrator session. The requested stock cannot be lower than the
number of copies already assigned. Invalid or unauthorized requests are
rejected explicitly.
