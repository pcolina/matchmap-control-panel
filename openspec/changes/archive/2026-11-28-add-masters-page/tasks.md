# Tasks: add-masters-page

Each task names its failing test first, then the code that makes it pass.

## 1. Model and data

- [x] 1.1 Test: `rowsFor` returns one row per country for `countries` and one row per city with its country name for `cities`. Then update `master-rows.ts` and `masters.model.ts`.
- [x] 1.2 Add `data/countries.query.ts` with the `countries` query and its types.
- [x] 1.3 Test: `rowsFor` returns one row per prohibited word with `word`, `category`, `language` and `active`, and `active` maps to the «Sí» or «No» translation key. Then add `data/prohibited-words.query.ts` with the `prohibitedWords` query and its types (`id`, `word`, `category`, `language`, `active`), and the row mapping.

## 2. Routes

- [x] 2.1 Test: `/masters` has children `prohibited-words`, `countries` and `cities`, with the default redirect and the `**` redirect. Then change `app.routes.ts`.
- [x] 2.2 Update `app.routes.spec.ts` to the new `masters` shape.

## 3. Table component

- [x] 3.1 Test: an empty master shows the header and one merged row with «No hay datos en esta tabla de maestros». Then add `master-table`.
- [x] 3.2 Test: a filter on «Ciudad» in the cities table applies to all rows, and the paginator counts the matches, not the page. Then add the column filters.
- [x] 3.3 Test: 10 rows per page by default, options 10, 50 and 100. Then add the paginator.
- [x] 3.4 Test: the toolbar and row action buttons are disabled and have accessible names. Then add them.

## 4. Page

- [x] 4.1 Test: the dropdown lists the three masters and the selected one matches the route. Then add `MastersPage` with the dropdown and the three load states.
- [x] 4.2 Test: choosing a master navigates to `/masters/<master>`. Then wire the dropdown.
- [x] 4.3 Test: `queryFor` returns the `prohibitedWords` query for `prohibited-words` and the `countries` query for `countries` and `cities`. Then make `MastersPage` pick the query from the master slug. The test checks the query choice as a function, because the project has no Apollo test setup for the page.

## 5. Shared pieces

- [x] 5.1 Register `tablerEye`, `tablerPencil`, `tablerTrash`, `tablerPlus` and `tablerUpload` in `app.config.ts`.
- [x] 5.2 Add the `en` and `es` keys to `catalogues.ts`, including `masters.column.word`, `masters.column.category`, `masters.column.language`, `masters.column.active`, `masters.active.yes` and `masters.active.no`.
- [x] 5.3 Use PrimeNG 21.1.10 instead of Angular Material: add the Aura preset with the MatchMap primary palette in `src/app/core/theme/primeng-theme.ts`, register it with `providePrimeNG`, and remove Angular Material.

## 6. Verification

- [x] 6.1 Run `pnpm test`, `pnpm typecheck` and `pnpm build`.
- [ ] 6.2 Manual check in Chrome at `/masters`, `/masters/prohibited-words`, `/masters/countries` and `/masters/cities`, at 320 px and 1280 px, light and dark. Check the prohibited words rows against the `prohibitedWords` query on `http://localhost:8080/graphql`. Partly done: `/masters/countries` and `/masters/cities` load, and at 320 px and 1280 px the page has no horizontal scroll (the table wrapper scrolls). `/masters/prohibited-words` shows the error state because the local backend answers `prohibitedWords` with INTERNAL_ERROR (admin-only check, see `matchmap-api` change `fix-anonymous-admin-check`). Not verified: light theme (the browser runs in dark mode and the window cannot be switched from here), and prohibited word rows (blocked by the backend).
