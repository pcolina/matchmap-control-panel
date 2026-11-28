# Tasks: add-admin-login

Each task names its failing test first, then the code that makes it pass.

## 1. Entry rule

- [x] 1.1 Test `canEnterPanel`: `ADMIN` returns `true`; `USER`, `null`, `undefined` and `''` return `false`. Run it and show it failing. Then add `core/auth/can-enter-panel.ts`.

## 2. Auth API

- [x] 2.1 Test `AuthApi.login` sends `POST /api/auth/login` with header `X-Client: web` and body `{ email, password }`, and returns the access token and `expiresIn`. Use `HttpTestingController`. Run it and show it failing. Then add `core/auth/auth.api.ts` with `login`.
- [x] 2.2 Test `AuthApi.refresh` sends `POST /api/auth/refresh` with `X-Client: web` and no body, and `AuthApi.logout` sends `POST /api/auth/logout` with `X-Client: web`. Then add those methods.

## 3. Auth store

- [x] 3.1 Test `AuthStore` login stores the access token in memory, and neither `localStorage.setItem` nor `sessionStorage.setItem` is called. Run it and show it failing. Then add `core/auth/auth.store.ts` with `login`.
- [x] 3.2 Test `AuthStore.restore` with three parallel calls sends exactly one `POST /api/auth/refresh`, and a failed refresh sets the status to `signedOut`. Then add `restore` with one shared in-flight promise.
- [x] 3.3 Test `AuthStore.logout` calls `POST /api/auth/logout`, clears the token and the role, and sets `signedOut`. Then add `logout`.
- [x] 3.4 Test the role load: after `signedIn`, the store loads `me { role }` and keeps the role. Then add the role load through Apollo.

## 4. Apollo link

- [x] 4.1 Test the request link: an operation sends `Authorization: Bearer <token>` when the store has a token, and sends no header when it does not. Run it and show it failing. Then add `core/auth/apollo-auth.link.ts` and register it in `app.config.ts`.
- [x] 4.2 Test the error link: a response with `UNAUTHORIZED` refreshes once and repeats the operation once. Test that a second `UNAUTHORIZED` after the repeat does not refresh again. Then add the error link.
- [x] 4.3 Test the error link: when the refresh fails, the store is `signedOut` and the original error reaches the caller. Then add that branch.

## 5. Guard and routes

- [x] 5.1 Test the guard: no session sends the visitor to `/login`; a `USER` account to `/no-permissions`; an `ADMIN` account is allowed. Run it and show it failing. Then add `core/auth/auth.guard.ts`.
- [x] 5.2 Test `app.routes.spec.ts`: `/login` and `/no-permissions` are public, and the `MainLayout` route has the guard. Then update `app.routes.ts`.

## 6. Pages

- [x] 6.1 Test the sign-in page: submitting valid data calls `login` and navigates to the requested page; a `401` with `invalid_credentials` shows the generic error and stores no token. Run it and show it failing. Then add `features/login/pages/login.page.ts`.
- [x] 6.2 Test the no-permissions page renders its text and no panel content. Then add `features/no-permissions/pages/no-permissions.page.ts`.
- [x] 6.3 Test the sign-out control calls `logout` and shows the sign-in page. Then add it to the main layout.

## 7. Texts

- [x] 7.1 Add the `en` and `es` keys for the sign-in page, the sign-out control and the no-permissions page to `core/i18n/catalogues.ts`.

## 8. Verification

- [x] 8.1 Run `pnpm test`, `pnpm typecheck` and `pnpm build`.
- [ ] 8.2 Manual check in Chrome at `http://localhost:4400`. Done so far: the sign-in page renders with the brand, `/masters/countries` and `/masters/cities` load with the session restored by the refresh cookie (Chrome accepted the `Secure` cookie on `http://localhost`), and `/masters/prohibited-words` shows its 4 rows through the Bearer token. Not done: signing in and out from the form (I did not sign out, because the cookie is shared by every `localhost` port and would end the MatchMap session too) and the `refresh_token` attributes in DevTools (the tool redacts cookies). Needs the owner to run the sign-out check.
