# Proposal: add-admin-login

## Why

The masters page reads the prohibited words, which only an account with the `ADMIN` role can read. The control panel has no sign-in, so it cannot send an access token, and the page cannot show that data. Staff must sign in to the panel before using it.

## What Changes

- A sign-in page with an email and a password. It calls `POST /api/auth/login` with `X-Client: web`.
- The access token is kept only in memory, never in `localStorage` or `sessionStorage`. The refresh token stays in the `HttpOnly` cookie that the API sets, so a reload restores the session through `POST /api/auth/refresh` with `X-Client: web`, and no token is readable from page scripts.
- At startup the panel tries a refresh. If it fails, the panel shows the sign-in page.
- Every GraphQL request sends `Authorization: Bearer <accessToken>`. If a request fails with `UNAUTHORIZED`, the panel refreshes once and repeats the request. If the refresh also fails, it shows the sign-in page.
- A sign-out control calls `POST /api/auth/logout` with `X-Client: web`, clears the access token from memory, and shows the sign-in page.
- After sign-in the panel reads `me { role }`. An account enters the panel only when its role is not null, not empty and not `USER`. Any other account sees a «no permissions» page and no panel content.
- Every panel page except the sign-in page requires a session.
- Every visible text is an i18n key with `en` and `es` values.

## Capabilities

### New

- `admin-login`: signing in to the control panel, keeping the session, signing out, and the role check at entry.

## Out of scope

- Signing in with Google. The panel uses email and password only.
- Signing in with a username. The `authentication` spec accepts only email.
- Creating accounts, changing passwords, and password reset.
- Managing roles from the panel. The first administrator is set by the database command in the `admin-role` spec.
- The layout and visual design of the sign-in page. The layout is defined in a later change.

## Depends on

- `authentication`: the login, refresh and logout endpoints, the token lifetimes, and the refresh cookie.
- `admin-role`: the `me { role }` query and the role values.
- `fix-anonymous-admin-check` (`matchmap-api`): without it an anonymous call to `prohibitedWords` fails with `INTERNAL_ERROR` instead of `UNAUTHORIZED`, so the refresh-and-retry path would not run for that operation.

## Decisions

- The sign-in page takes an email and a password. Sign-in by username is out of scope, so no change to `matchmap-api` is needed for it.
- Entry to the panel requires a role that is not null, not empty and not `USER`.
- Creating roles from the panel is out of scope. The `admin-role` spec defines only `ADMIN` and `USER`, so today the entry rule admits only `ADMIN`.
