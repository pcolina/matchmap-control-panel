# AGENTS.md: matchmap-control-panel

This is an Angular web app with the same stack and conventions as `matchMap/apps/web`. The rules
of `C:\workspace\pablo\matchMap\CLAUDE.md` and `C:\workspace\pablo\matchMap\apps\web\AGENTS.md`
apply here unless this file says otherwise.

## Setup

- Dev server: `pnpm start` at `http://localhost:4400`. MatchMap web uses 4300, so both can run at once.
- The backend is shared with MatchMap: `proxy.conf.json` forwards `/api` and `/graphql` to `http://localhost:8080`.
- Design: `src/styles/tokens.css` is copied from `matchMap/tokens/tokens.css`. Use `--mm-*` variables only.
- Specs: OpenSpec in `openspec/`. No code without an approved change in `openspec/changes/`.

## Stack

Angular 22 (zoneless, signals), `@angular/router` with lazy-loaded routes, Apollo
(`apollo-angular`), `@ngrx/signals` (SignalStore), RxJS only for async streams, Tabler icons
through `@ng-icons/tabler-icons`, `@ngx-translate/core`, Vitest through `ng test`, Prettier.

Charts, CSV and PDF: ECharts (`echarts`, Apache-2.0) for charts, PapaParse (`papaparse`, MIT) for CSV import, and jsPDF with jspdf-autotable (`jspdf`, `jspdf-autotable`, MIT) for PDF export. Tables, selects and buttons come from PrimeNG (`primeng`, MIT community version), styled with the Aura preset (`@primeuix/themes`, MIT) and the MatchMap accent. All are pinned to exact versions in `package.json`.

## Data ownership

- Datasets, entities and their definitions are decided in `matchmap-api` (its contracts in `C:\workspace\pablo\matchmap-api\contracts\`). They are not decided in this repository.
- This application only consumes and updates the data that `matchmap-api` defines. It never creates a dataset, field or entity on its own, and never proposes one in a change without an API contract first.

## Differences from MatchMap web

- Internal tool, not a consumer product. Its users are staff.
- Languages: `en` and `es` only. The language comes from the browser (`navigator.language`, `en` when it is neither `en` nor `es`). Users can change it inside the tool, but there is no accessible language selector like MatchMap's. Its exact placement is not defined yet.
- Themes: light and dark for now, following the system by default (same `--mm-*` tokens as MatchMap).
- Layout: simpler than MatchMap. Its structure is not defined yet and will be specified in a change.
