# Design: add-admin-login

## Contract baseline

`matchmap-api` at commit `328bd52` («Merge pull request #58 from pcolina/add-prohibited-word-admin»). The contracts this change uses:

- `contracts/openapi/auth.yaml`: `POST /api/auth/login`, `POST /api/auth/refresh`, `POST /api/auth/logout`. Every operation requires the `X-Client` header. For `web` the refresh token travels only in the `refresh_token` cookie (`Path=/api/auth`, `HttpOnly`, `Secure`, `SameSite` Lax by default) and never in a body.
- `contracts/graphql/account.graphqls`: `me: User!` with `role: UserRole!`.

Check for changes made meanwhile with `git -C C:\workspace\pablo\matchmap-api log --oneline 328bd52..HEAD -- contracts/`.

## Sign-in flow

- `AuthApi` (HttpClient, not Apollo) calls the three REST endpoints. Its calls always send `X-Client: web`, and the login call sends `{ email, password }` as JSON.
- `AuthStore` (SignalStore, `core/auth/auth.store.ts`) holds the access token and the session status: `unknown`, `signedOut`, `signedIn`. The access token is a private state field, held in memory only.
- The store never writes to `localStorage`, `sessionStorage` or any cookie.

## Session restore

- `restore()` calls `POST /api/auth/refresh` with `X-Client: web` and no body. On success it stores the new access token. On failure it sets `signedOut`.
- A single in-flight restore promise is shared, so parallel callers do not refresh twice.
- The protected route guard awaits `restore()` once per page load, and the guard only runs on the first navigation for a `signedOut` or `unknown` status.

## Apollo link

- A request link sets `Authorization: Bearer <accessToken>` when the store has a token. It reads the token at send time, not at creation time.
- An error link inspects every GraphQL error. When one has `extensions.classification` `UNAUTHORIZED`, it awaits the shared refresh, then repeats the operation once. If the refresh fails, it sets `signedOut` and lets the error pass to the caller. A repeated operation that fails again with `UNAUTHORIZED` is not retried a second time.
- The refresh uses `HttpClient`, so it does not go through the Apollo link, and no loop is possible.

## Role check

- After `signedIn`, `AuthStore` loads `me { role }` through Apollo, and it stores the role. `canEnterPanel(role)` returns `true` only when the role is a non-empty string other than `USER`. A `null` or `undefined` role gives `false`.
- The guard for panel routes allows entry only when the status is `signedIn` and `canEnterPanel(role)` is `true`. A signed-in account that fails the check goes to `/no-permissions`.

## Routes

- New public routes `/login` (sign-in page) and `/no-permissions`.
- The `MainLayout` route and all of its children get the guard. The guard sends a visitor without a session to `/login`, and sends a `USER` account to `/no-permissions`.
- After sign-in the app navigates to the page the visitor asked for, or to `home` when there is none.

## Sign-out

- The sign-out control calls `POST /api/auth/logout` with `X-Client: web`. It clears the access token and the role, sets `signedOut`, and navigates to `/login`. The server clears the cookie in its response.

## Sign-in page

- Two fields, email and password, and one submit button. The page maps `401` with `invalid_credentials` to a generic error message, so it does not reveal whether the email exists. A `400` from a missing header is a bug and shows the same generic error.
- Texts are i18n keys in `core/i18n/catalogues.ts`, with `en` and `es` values.

## Components and dependencies

- No new dependency. Angular, `@ngrx/signals`, Apollo and `@angular/common/http` are already in the project.
- Files: `core/auth/auth.api.ts`, `core/auth/auth.store.ts`, `core/auth/auth.guard.ts`, `core/auth/can-enter-panel.ts`, `core/auth/apollo-auth.link.ts`, `features/login/pages/login.page.ts`, `features/no-permissions/pages/no-permissions.page.ts`.

## Test plan

- Unit `canEnterPanel`: `ADMIN` true; `USER` false; `null`, `undefined` and `''` false.
- Unit `AuthStore`: login stores the token in memory and no value is written to `localStorage` or `sessionStorage` (spy on both).
- Unit `AuthStore.restore`: parallel calls send one refresh request (`HttpTestingController` expects one).
- Unit the error link: an `UNAUTHORIZED` response refreshes once and repeats the request; a second `UNAUTHORIZED` after the repeat does not refresh again.
- Unit the guard: no session → `/login`; `USER` → `/no-permissions`; `ADMIN` → allowed.
- Unit the sign-in page: a `401 invalid_credentials` shows the generic error and no token is stored.
- Manual, in Chrome at `http://localhost:4400`: sign in as an `ADMIN` account, reload and stay signed in, then sign out and confirm that a reload shows the sign-in page. Check in DevTools that the `refresh_token` cookie has `HttpOnly` and `Secure` and that `localStorage` holds no token. Chrome accepts `Secure` cookies on `http://localhost`; if it does not, this design is revisited before continuing.

## Risks

- `Secure` cookies on the local dev host. See the manual check above.
- An anonymous `prohibitedWords` call returns `INTERNAL_ERROR` until `fix-anonymous-admin-check` is applied in `matchmap-api`. The guard prevents anonymous panel requests, so this only matters for a request that fails after sign-out.

## Out of scope

- Sign-in with Google, sign-in with a username, registration, password reset, and role management.
- Refreshing the access token before it expires. The panel refreshes only on `UNAUTHORIZED` and at startup.
