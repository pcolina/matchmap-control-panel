# Tasks: add-control-panel-layout

Each task names its failing test first, then the code that makes it pass. One commit per task, with `Task: <id>` in the body.

## 1. Foundation

- [x] 1.1 Test: `pickLanguage('es-ES')` returns `es`; `pickLanguage('fr-FR')` and `pickLanguage('')` return `en`. Then implement `core/i18n/language.ts`.
- [x] 1.2 Test: every key in the `en` catalogue exists in `es` and the reverse. Then implement `core/i18n/catalogues.ts` with the shell keys (`nav.*`, `brand.*`, `layout.*`).
- [x] 1.3 Test: `isNarrow(767)` is true, `isNarrow(768)` is false. Then implement `core/viewport/breakpoint.ts`.
- [x] 1.4 Test: navigation table has eight items in the defined order, each with an icon name, a route, and a non-empty `allowedProfiles`. Then implement `core/nav/nav-items.ts`.
- [x] 1.5 Test: for `superadmin` the visible items are all eight; for a profile not in the list, the visible items are none. Then implement `core/nav/profile.ts` and the filter helper.

## 2. Preference store

- [x] 2.1 Test: with empty storage the store is expanded. With `'collapsed'` stored for user `u1`, `load('u1')` sets collapsed. Then implement `core/preferences/sidebar-storage.ts` and the store's `load`.
- [x] 2.2 Test: `toggle()` writes `control-panel.sidebar.u1` = `collapsed`, then `expanded`, and flips the signal. Then implement `toggle`.
- [x] 2.3 Test: storage whose `getItem` or `setItem` throws leaves the store expanded and does not throw. Then add the try/catch.
- [x] 2.4 Test: loading user `u2` after `u1` collapsed does not show `u1`'s state. Then key the storage by user id.

## 3. Layout

- [x] 3.1 Test: the sidebar renders eight links in order, each with `aria-label` equal to its text, and the brand logo is not inside an `a`. Then implement `shared/layout/sidebar`.
- [x] 3.2 Test: the link for the current route has `aria-current="page"`; no other link has it. Then wire the router.
- [x] 3.3 Test: collapsed sidebar has width token `--cp-rail-width` and hides the brand text and the footer text; the links keep their accessible names. Then add the rail styles.
- [x] 3.4 Test: the collapse toggle has `aria-expanded` matching the state and calls `toggle()` on activation. Then add the toggle.
- [x] 3.5 Test: at a narrow viewport the sidebar is not rendered in the layout and the menu button is. Then implement `main-layout`.
- [x] 3.6 Test: activating the menu button opens the drawer with `aria-expanded="true"`; Escape closes it and focus returns to the button. Then implement the drawer.
- [x] 3.7 Test: with the drawer open, Tab from the last control moves to the first control and Shift+Tab from the first moves to the last. Then implement the focus trap.
- [x] 3.8 Test: activating a drawer item closes the drawer. Then wire it.
- [x] 3.9 Test: when the viewport crosses 768 px while the drawer is open, the drawer closes. Then implement the breakpoint effect.

## 4. Routes and pages

- [x] 4.1 Test: the route table has eight children under the main layout, each with `loadComponent` and `data.allowedProfiles`. Then add `app.routes.ts`.
- [x] 4.2 Test: each of the eight feature pages renders a heading from its i18n key. Then add the eight placeholder pages under `features/*/pages/`.

## 6. Sidebar visual adjustments

- [x] 6.1 Test: the expanded sidebar shows «Control Panel» inside the brand block, directly after «MatchMap», and the footer shows «Version 1.0.0» in an element with class `sidebar__version`. Then move the subtitle and replace the footer text. Add `brand.version` to both catalogues with the `{{version}}` parameter, and `APP_VERSION = '1.0.0'` in `core/app-info.ts`.
- [x] 6.2 Test: the toggle uses `tablerArrowsMaximize` when collapsed and `tablerArrowsMinimize` when expanded. Then update the icon names and register both icons in `app.config.ts`.
- [x] 6.3 Test: the sidebar and its version chip are hidden in the rail. Then keep the subtitle and the version inside the `@if (!collapsed())` blocks.
- [x] 6.4 Manual check, recorded in the PR: sidebar background is `--mm-map-ocean` in light and dark mode, the version chip is readable, and the text contrast passes AA. Checked in Chrome: light background looks as designed and dark background computes to `#0A1324`; the version is `#2DD4BF` on the dark chip. Contrast in light mode is the spec's calculated values: text on ocean about 12:1, secondary text about 5.2:1, accent on white chip about 5:1.
- [x] 6.5 Test: closing the drawer keeps it in the page while the slide-out runs, and removes it on `animationend`; with reduced motion or without the Web Animations API it closes at once. Then add the closing classes, the keyframes and the `animationend` handler in `main-layout`.

## 5. Accessibility and quality

- [x] 5.1 Test: axe reports zero violations for the shell in expanded, collapsed and drawer-open states. Then fix anything it reports.
- [x] 5.2 Test: reduced-motion styles disable transitions. Then add the media query. Test in `shared/layout/reduced-motion.spec.ts` reads the sidebar and main-layout stylesheets and checks that every transition and animation is inside `prefers-reduced-motion: no-preference`.
- [x] 5.3 Manual check, recorded in the PR: layout at 320 px, 768 px and 1280 px, light and dark mode, no horizontal scroll. Checked in Chrome with the app in an iframe of each width and `data-theme` set to light or dark: no horizontal scroll in all six cases; drawer at 320 px, sidebar at 768 px and 1280 px. Earlier: expanded sidebar, the 50 px rail and the drawer at about 500 px.
- [x] 5.4 Run `pnpm test`, `pnpm typecheck` and `pnpm build`. Paste the summary in the PR. Run directly with `npx`: `ng test --watch=false` 41 passed in 10 files, `tsc` for app and spec OK, `ng build` OK.
- [x] 5.5 Move the change to `openspec/changes/archive/` and merge the spec into `openspec/specs/control-panel-shell/`.
