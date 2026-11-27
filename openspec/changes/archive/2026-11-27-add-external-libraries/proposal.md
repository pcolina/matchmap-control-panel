# Proposal: add-external-libraries

## Why

The control panel needs four things that the stack does not cover yet: UI components for tables with filters, sorting and pagination; charts for statistics (bars, lines, pies); importing CSV files; and exporting PDF documents. Adding the libraries in one change, with their licences and versions recorded, lets the feature changes that use them stay small.

## What Changes

Each library is pinned to an exact version. Each one has been checked for licence and for a release at least two weeks old.

| Library | Version | Licence | Use |
|---|---|---|---|
| `@angular/material` and `@angular/cdk` | 22.2.7 | MIT | Tables (`MatTable`, `MatSort`, `MatPaginator`), form fields and filters. Same minor version as Angular 22. |
| `echarts` | 6.1.0 | Apache-2.0 | Charts for statistics: bars, lines, pies. Used directly, without an Angular wrapper. |
| `papaparse` | 5.7.1 | MIT | Parsing CSV files for import. |
| `jspdf` | 4.2.1 | MIT | Creating PDF documents for export. |
| `jspdf-autotable` | 5.0.9 | MIT | Tables inside the PDF exports. |

- `AGENTS.md`: the stack section lists Angular Material; the chart library line is replaced by the chosen libraries, since the change that first needs a chart library proposes it.
- `pnpm-workspace.yaml`: `core-js` is set to `false` in `allowBuilds`, because its install script only prints a message and pnpm needs an explicit value.
- A smoke test checks that each library loads in the test environment.

## Out of scope

- Any page, table, chart, CSV import screen or PDF export button. Each one is its own change.
- Material theming with the `--mm-*` tokens. It is decided in the first change that renders a Material component.

## Capabilities

None. This change adds dependencies and does not change behaviour.
