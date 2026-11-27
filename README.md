<p align="center">
  <picture>
    <source media="(prefers-color-scheme: dark)" srcset="docs/horizontal-on-dark.svg">
    <img src="docs/horizontal-on-light.svg" alt="MatchMap" width="320">
  </picture>
</p>

<h1 align="center">Control Panel</h1>

<p align="center">
  <img src="https://img.shields.io/badge/Angular-22.2-DD0031" alt="Angular 22.2">
  <img src="https://img.shields.io/badge/NgRx%20Signals-22-BA2BD2" alt="NgRx Signals 22">
  <img src="https://img.shields.io/badge/RxJS-7.8-B7178C" alt="RxJS 7.8">
  <img src="https://img.shields.io/badge/Apollo%20Client-4.3-311C87" alt="Apollo Client 4.3">
  <img src="https://img.shields.io/badge/GraphQL-API-E10098" alt="GraphQL">
  <img src="https://img.shields.io/badge/ngx--translate-18-0F7C80" alt="ngx-translate 18">
  <img src="https://img.shields.io/badge/Tabler%20Icons-36-206BC4" alt="Tabler Icons 36">
  <img src="https://img.shields.io/badge/Vitest-5-6E9F18" alt="Vitest 5">
  <img src="https://img.shields.io/badge/Node-22.18%2B-339933" alt="Node 22.18+">
  <img src="https://img.shields.io/badge/pnpm-11-F69220" alt="pnpm 11">
  <img src="https://img.shields.io/badge/status-initial%20setup-blue" alt="Status: initial setup">
</p>

Internal control panel for **MatchMap**. It is an internal tool for staff, so it has a simpler layout than the public app. It uses the same stack, versions, design tokens and branding as [MatchMap](../matchMap), and shares its API.

> **Status:** first change (`add-control-panel-layout`) implemented: shell, navigation and placeholder pages. The sections have no content yet.

---

## Table of contents

- [Menu](#menu)
- [Tech stack](#tech-stack)
- [Getting started](#getting-started)
- [Configuration](#configuration)
- [Specs and workflow](#specs-and-workflow)
- [Design](#design)
- [License](#license)

---

## Menu

Items shown depend on the user role. Every section opens its content in the main page.

| # | Section | Route | Who sees it |
|---|---|---|---|
| 1 | Home | `/home` | superadmin |
| 2 | Configuración | `/settings` | superadmin |
| 3 | Maestros | `/masters` | superadmin |
| 4 | Estadísticas | `/statistics` | superadmin |
| 5 | Usuarios | `/users` | superadmin |
| 6 | Perfiles | `/profiles` | superadmin |
| 7 | Marketing | `/marketing` | superadmin |
| 8 | Beneficios | `/benefits` | superadmin |

The sidebar is expanded or collapsed to a 50 px rail with icons only. On screens below 768 px it becomes a drawer (cajón) opened from a menu button. Each user keeps their own collapsed or expanded state in the browser.

## Tech stack

| Area | Technology |
|---|---|
| UI | Angular 22.2 (zoneless, signals, standalone components, `@if` / `@for`) |
| Routing | `@angular/router` with lazy-loaded feature routes |
| State | `@ngrx/signals` (SignalStore), RxJS only for asynchronous streams |
| API | Apollo Client (`apollo-angular`) against the shared GraphQL contract |
| i18n | `@ngx-translate/core`, `en` and `es`, language taken from the browser |
| Icons | `@ng-icons/tabler-icons` |
| Design | Tokens from `src/styles/tokens.css` (`--mm-*`), light and dark mode |
| Charts and statistics | Not chosen yet. Chosen in the change that first needs it |
| Testing | Vitest through `ng test`, axe-core for WCAG 2.2 AA |
| Tooling | pnpm 11, Prettier, TypeScript 6 |

## Getting started

Requirements: Node.js 22.18 or newer, and pnpm 11 (`corepack enable`).

```powershell
pnpm install
pnpm start
```

The dev server runs at `http://localhost:4400`. MatchMap web uses port 4300 (and 4333 in mock mode), so both apps can run at the same time.

| Script | Purpose |
|---|---|
| `pnpm start` | Dev server on port 4400 |
| `pnpm build` | Production build |
| `pnpm test` | Unit tests |
| `pnpm typecheck` | TypeScript check for app and tests |

## Configuration

- **Port:** 4400, set in the `serve` options of `angular.json`.
- **API:** `proxy.conf.json` forwards `/api` and `/graphql` to `http://localhost:8080`, the same backend as MatchMap.
- **Language:** `en` and `es`, from the browser language. Users can change it inside the tool.
- **Theme:** light and dark, following the system by default.

## Specs and workflow

Changes are specified in `openspec/changes/<kebab-name>/` (proposal, specs, design, tasks) and approved before implementation. Approved behaviour lives in `openspec/specs/`. Only one change is open at a time. Commits follow the MatchMap convention: short imperative English subjects, one commit per task.

## Design

Visual rules come from the MatchMap design system ([`matchMap/docs/design.md`](../matchMap/docs/design.md) and [`matchMap/docs/brand.md`](../matchMap/docs/brand.md)). Colours, sizes, radii and spacing always come from the tokens, never hard-coded. Every screen supports light and dark mode and meets WCAG 2.2 AA.

## License

[PolyForm Noncommercial 1.0.0](LICENSE)
