# Authentication Contract

## Register

`POST /api/auth/register`

Request: unique email and password. Email is normalized before uniqueness checks.

Success: authenticated session and public user identity (`id`, display
identifier, role). Never return the password or password hash.

Errors: validation failure, duplicate email, or invalid credentials are
reported as explicit client-safe errors.

## Sign in

`POST /api/auth/sign-in`

Request: identifier and password.

Success: authenticated session with the public user identity.

Errors: invalid credentials return a generic authentication error without
revealing whether an identifier exists.

## Sign out

`POST /api/auth/sign-out`

Success: current session is invalidated.
