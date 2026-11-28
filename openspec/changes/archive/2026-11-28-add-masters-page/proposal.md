# Proposal: add-masters-page

## Why

The «Maestros» section is an empty page today. Issue #2 (`pcolina/matchmap-control-panel`) says the administrator loads local data sets from this panel: the prohibited words used by the moderation lists, and the city catalog (countries and cities with latitude and longitude) stored in `matchmap-api`. The masters page is where those data sets are seen, and it needs to exist before any load process is added.

## What Changes

- `/masters` opens the first master by default, which is «Palabras prohibidas», and redirects to `/masters/prohibited-words`.
- The masters are, in this order: «Palabras prohibidas» (`prohibited-words`), «Países» (`countries`) and «Ciudades» (`cities`).
- The page title is replaced by a dropdown with all masters. Choosing one navigates to `/masters/<master>`, and the breadcrumb follows the URL as it does on every page: «Maestros > <master>». The current crumb is not a link.
- Under the dropdown, one table shows the selected master:
  - «Palabras prohibidas»: columns «Palabra», «Categoría», «Idioma», «Activa» (Sí/No) and the actions column. One row per prohibited word, from the `prohibitedWords` query. The `normalized` value is not shown.
  - «Países»: columns «Código», «Nombre», «Ciudades» (number of cities) and the actions column. One row per country.
  - «Ciudades»: columns «País», «Ciudad», «Latitud», «Longitud» and the actions column. One row per city, with its country name.
  - The actions column has three icon buttons: view (eye), edit (pencil) and delete (trash). They are rendered with an accessible name, and disabled, because this change only visualises data.
- Above each table, at the top right, a toolbar with two icon buttons: create (plus) and upload (CSV). They are rendered with an accessible name and disabled, like the row actions, because this change only visualises data.
- The countries and cities come from the `countries` query of the shared GraphQL contract (`matchmap-api/contracts/graphql/places.graphqls`). The prohibited words come from the `prohibitedWords` query of `matchmap-api/contracts/graphql/moderation.graphqls`. Each master's data is loaded once per page visit. The panel does not create, change or delete any of them.
- Table behaviour, using PrimeNG (`p-table`, with its sorting, filtering and paginator):
  - Every column has a header with a sort control and a text filter. Sorting and filtering apply to the whole master, not only to the visible page.
  - Pagination shows 10 rows per page by default, with options 10, 50 and 100.
  - A master with no rows shows its header and one merged row with the text «No hay datos en esta tabla de maestros».
  - When filters match no rows, the table shows one merged row with «Ningún resultado coincide con los filtros».
- Every visible text is an i18n key with `en` and `es` values.

## Capabilities

### New

- `masters-catalog`: the masters page, its dropdown, the breadcrumb of each master, and the read-only tables.

## Out of scope

- Loading the city catalog from a file (CSV import). The issue leaves the file format and the load process to be defined, and the contract has no mutation for it.
- Loading prohibited words from a file (CSV import). The contract has the `createProhibitedWord` mutation, but the load process is not defined yet.
- Creating, editing, activating or deactivating prohibited words. The contract has `createProhibitedWord` and `setProhibitedWordActive`, but this change only reads them.
- Translating the prohibited word categories. The category is shown as its contract value (`HATE`, `VIOLENCE`, ...) until the owner defines the labels.
- Country names in each supported language. The issue lists this as an open point, and no data set covers it yet.
- Working view, edit and delete actions. The icons exist and are disabled until the change that adds them.
- Creating, editing or deleting countries or cities. The panel only consumes what `matchmap-api` defines.
- The `active` flag on cities. The API baseline commit is «Add the active flag to cities», but the GraphQL `City` type does not expose it yet, so it is not shown.

## Decisions taken

- Read-only first, with CSV import in later changes.
- Each master loads its own query when its page is visited: `countries` for «Países» and «Ciudades», `prohibitedWords` for «Palabras prohibidas».
- Country names are always present in the contract (`Country.name` is not null), so no fallback is needed.
- The prohibited words table shows `active` as Sí/No, so inactive words are visible to the administrator. The `normalized` form is internal to the moderation lists and is not shown.
