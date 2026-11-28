# masters-catalog Specification

## Purpose
TBD - created by archiving change add-masters-page. Update Purpose after archive.

## Requirements

### Requirement: Masters page opens the first master
The masters page SHALL list three masters in this order: «Palabras prohibidas» (`prohibited-words`), «Países» (`countries`) and «Ciudades» (`cities`). Opening `/masters` SHALL redirect to `/masters/prohibited-words`.

#### Scenario: Default master
- **WHEN** the user opens `/masters`
- **THEN** the browser shows `/masters/prohibited-words`
- **AND** the dropdown shows «Palabras prohibidas» as selected

### Requirement: Master dropdown replaces the page title
The masters page SHALL show a dropdown with the three masters in place of a page title. Choosing a master SHALL navigate to `/masters/<master>`. The breadcrumb trail SHALL be generated from that URL, as required by the breadcrumb trail.

#### Scenario: Choosing a master updates the trail
- **WHEN** the user selects «Ciudades» in the dropdown
- **THEN** the browser shows `/masters/cities`
- **AND** the trail shows «Maestros», a chevron, and «Ciudades» as the current page

#### Scenario: Labels come from the catalogue
- **WHEN** the masters page renders
- **THEN** each master name uses the `breadcrumb.<master>` translation in the current language

### Requirement: Master tables show the main columns
Each master SHALL show a table with the columns below, and a last actions column.

- «Palabras prohibidas»: «Palabra», «Categoría», «Idioma», «Activa».
- «Países»: «Código», «Nombre», «Ciudades» (number of cities).
- «Ciudades»: «País», «Ciudad», «Latitud», «Longitud».

#### Scenario: Countries table
- **WHEN** the user opens `/masters/countries`
- **THEN** the table has one row per country from the `countries` query, with its code, name and number of cities

#### Scenario: Cities table
- **WHEN** the user opens `/masters/cities`
- **THEN** the table has one row per city from the `countries` query, with the name of its country, its name, latitude and longitude

#### Scenario: Prohibited words table
- **WHEN** the user opens `/masters/prohibited-words`
- **THEN** the table has one row per word from the `prohibitedWords` query, with its word, its category value, its language and its active state

### Requirement: Prohibited words show their active state
The «Activa» column of «Palabras prohibidas» SHALL show «Sí» when the word is active and «No» when it is not, using the `masters.active.yes` and `masters.active.no` translations. The category SHALL be shown as its contract value.

#### Scenario: Inactive word
- **WHEN** a prohibited word has `active` set to false
- **THEN** its row shows «No» in the «Activa» column

#### Scenario: Category value
- **WHEN** a prohibited word has the category `HATE`
- **THEN** its row shows `HATE` in the «Categoría» column

### Requirement: Actions column with disabled icon buttons
The last column of every table SHALL show three icon buttons: view (eye), edit (pencil) and delete (trash). Each button SHALL have an accessible name from the catalogue, and SHALL be disabled in this change.

#### Scenario: Buttons are present and disabled
- **WHEN** a master table renders with at least one row
- **THEN** each row shows the three buttons
- **AND** each button is disabled and has an accessible name

### Requirement: Toolbar with disabled create and upload buttons
Above each master table, at the top right, the page SHALL show two icon buttons: create (plus) and upload CSV (upload). Both SHALL have an accessible name from the catalogue, and SHALL be disabled in this change.

#### Scenario: Toolbar buttons are present and disabled
- **WHEN** a master table renders
- **THEN** the toolbar shows the create and upload buttons at the top right, above the table
- **AND** both buttons are disabled and have an accessible name

### Requirement: Headers sort and filter the whole master
Each column header SHALL offer sorting and a text filter. Sorting and filtering SHALL apply to all rows of the master, and pagination SHALL apply after them.

#### Scenario: Filter searches all rows
- **WHEN** the user types a text in the «Ciudad» filter of the cities table
- **THEN** the table shows only matching cities from all countries, not only the rows on the current page

#### Scenario: Sort applies to all rows
- **WHEN** the user sorts «Latitud» in the cities table
- **THEN** the order applies to all cities, and the first page shows the first rows of that order

### Requirement: Pagination with three page sizes
The tables SHALL paginate with 10 rows per page by default. The page size options SHALL be 10, 50 and 100.

#### Scenario: Default page size
- **WHEN** the user opens a master table with more than 10 rows
- **THEN** the table shows 10 rows
- **AND** the paginator offers 10, 50 and 100 rows per page

### Requirement: Empty and no-match states
A master with no rows SHALL show its header and one merged row with the text «No hay datos en esta tabla de maestros». When filters match no rows, the table SHALL show its header and one merged row with the text «Ningún resultado coincide con los filtros».

#### Scenario: Empty master
- **WHEN** the user opens a master whose query returns no rows
- **THEN** the header shows and one merged row says «No hay datos en esta tabla de maestros»

#### Scenario: No match
- **WHEN** a filter matches no rows
- **THEN** one merged row says «Ningún resultado coincide con los filtros»

### Requirement: Data is read-only and comes from the contract
The masters page SHALL read countries and cities from the `countries` query, and prohibited words from the `prohibitedWords` query, both from the shared GraphQL contract. Each master SHALL load its query once per page visit. The page SHALL NOT create, change, activate or delete any country, city or prohibited word.

#### Scenario: One query per visit
- **WHEN** the user switches between «Países» and «Ciudades»
- **THEN** the page uses the data already loaded for that visit and does not query again

#### Scenario: Prohibited words query
- **WHEN** the user opens `/masters/prohibited-words`
- **THEN** the page runs the `prohibitedWords` query and does not run the `countries` query

### Requirement: Texts in both languages
Every visible text of the masters page SHALL be an i18n key with `en` and `es` values.

#### Scenario: Spanish browser
- **WHEN** the browser language is `es`
- **THEN** every label, header, empty-state message and button name on the masters page is in Spanish
