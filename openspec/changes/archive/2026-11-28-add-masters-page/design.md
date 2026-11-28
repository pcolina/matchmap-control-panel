# Design: add-masters-page

## Contract baseline

`matchmap-api` commit `fdb091f` («Add the prohibited word schema»). It was the last contract change when this design was updated. The earlier baseline was `463aa20` («Add the active flag to cities»). The changes between them (`places.graphqls`: `Country.id`, `Country.visitedCities`, the catalog import and admin mutations; `moderation.graphqls`: the prohibited word schema) were checked, and the `countries` query below is unchanged by them.

Check for later changes with `git -C C:\workspace\pablo\matchmap-api log --oneline fdb091f..HEAD -- contracts/`.

The queries used:

- From `contracts/graphql/places.graphqls`, `countries: [Country!]!`:
  - `Country`: `code: String!`, `name: String!`, `cities: [City!]!`
  - `City`: `id: ID!`, `name: String!`, `latitude: Float!`, `longitude: Float!`
- From `contracts/graphql/moderation.graphqls`, `prohibitedWords: [ProhibitedWord!]!`:
  - `ProhibitedWord`: `id: ID!`, `word: String!`, `category: ProhibitedCategory!`, `language: String!`, `active: Boolean!`
  - `ProhibitedCategory`: `CHILD_SAFETY`, `HATE`, `VIOLENCE`, `SEXUAL`, `IMPERSONATION`, `RESERVED`

`normalized: String!` exists on `ProhibitedWord` but is not requested, because the table does not show it.

## Routes

- `/masters` redirects to `/masters/prohibited-words`.
- `/masters/prohibited-words`, `/masters/countries` and `/masters/cities` load the same `MastersPage` component. Each child route carries its master slug in `data.master`.
- Any other child path redirects to `/masters/prohibited-words`.
- The `masters` parent keeps `data.allowedProfiles`, like every other page.
- The breadcrumb needs no change: it reads the URL and uses the labels `breadcrumb.prohibited-words`, `breadcrumb.countries` and `breadcrumb.cities`.

## Data

- Each master has its own query, chosen from the master slug:
  - `prohibited-words`: `prohibitedWords`.
  - `countries` and `cities`: `countries`.
- One Apollo `watchQuery` per query per page visit. Apollo's cache answers later visits, so switching between «Países» and «Ciudades» does not query again.
- Rows are derived in memory:
  - `prohibited-words`: one row per word with `word`, `category`, `language` and `active` (text «Sí» or «No» through the catalogue).
  - `countries`: one row per country with `code`, `name` and `cityCount`.
  - `cities`: one row per city with `country` (the country name), `city`, `latitude` and `longitude`.
- The page keeps three load states per query: loading, error, ready. The error state shows a message and no table.

## Table

- `MatTableDataSource` holds all rows of the master. Sorting and filtering run on that full data set, and the paginator runs last.
- Each data column header has a sort control (`mat-sort-header`) and a text filter. The filter input stops click propagation so typing in it does not toggle the sort.
- Column filters are a record of `column -> text`. A row matches when every non-empty filter is contained in that column's value, case-insensitively.
- Pagination: 10 rows by default, options 10, 50 and 100. Changing a filter returns to the first page.
- Empty master: one merged row with «No hay datos en esta tabla de maestros». Filters that match nothing: one merged row with «Ningún resultado coincide con los filtros».
- The table sits in a wrapper with horizontal overflow, so the page itself never scrolls horizontally at 320 px.
- Toolbar above the table, top right: create (`tablerPlus`) and upload CSV (`tablerUpload`). Both disabled.
- Row actions: view (`tablerEye`), edit (`tablerPencil`) and delete (`tablerTrash`). All disabled.

## Component library and theme

The table, the select and the buttons come from PrimeNG 21.1.10 (`primeng`, MIT community version), not from Angular Material. Angular Material was removed from the project, as the owner asked.

- PrimeNG 21.1.10 is the free community line (21.x as requested). Every 22.x release depends on `@primeui/license-manager`, which shows the "invalid PrimeUI license" banner without a key, so 22.x was not used.
- `@primeuix/themes` 2.0.3 provides the Aura preset. It is the line that depends on the same `@primeuix/styled` 0.7.x as PrimeNG 21.1.10. `src/app/core/theme/primeng-theme.ts` defines `MatchMapPreset`, which uses the teal palette as primary, and `app.config.ts` registers it with `providePrimeNG`. The dark mode follows the system by default.
- `@angular/cdk` was removed: PrimeNG 21.1.10 does not need it for the components this change uses. The peer dependencies of PrimeNG 21 name Angular 21, while this project is on Angular 22.2.3. The build and the tests pass with that peer mismatch, and it is reported as a pnpm warning.
- The MatchMap `--mm-*` tokens style the table rows, the header, the filters and the empty message through the component CSS.

## Icons

The icons `tablerEye`, `tablerPencil`, `tablerTrash`, `tablerPlus` and `tablerUpload` are registered in `app.config.ts`.

## Texts

Every visible text is an i18n key with `en` and `es` values in `core/i18n/catalogues.ts`. The keys are the ones in the spec, plus `masters.column.*` (including `masters.column.word`, `masters.column.category`, `masters.column.language` and `masters.column.active`), `masters.active.yes` and `masters.active.no`, `masters.action.*`, `masters.toolbar.*`, `masters.loading` and `masters.error`.

The category values are shown as their contract values. Their labels are not translated in this change (see proposal, out of scope).
