# Administrator Special-Card Contract

## Create special card

`POST /api/admin/special-cards`

Requires an administrator session. Validates historical type, country, source
reference, description, and non-negative `stock_total`. The resulting
`stock_remaining` equals total stock minus assigned copies.

## Update special card

`PATCH /api/admin/special-cards/{cardId}`

Requires an administrator session. The requested `stock_total` cannot be lower
than the number of copies already assigned. Increasing total stock creates
unassigned physical instances; decreasing it removes only unassigned instances.
Invalid or unauthorized requests are rejected explicitly.
