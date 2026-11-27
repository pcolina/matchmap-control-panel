# Design: add-control-panel-layout

## Structure

```
src/app/
├── core/
│   ├── i18n/
│   │   ├── language.ts              # pickLanguage(navigatorLanguage): 'en' | 'es'
│   │   └── catalogues.ts            # en and es catalogues for the shell keys
│   ├── nav/
│   │   ├── nav-items.ts             # navigation table: key, icon, route, allowed profiles
│   │   └── profile.ts               # current profile (superadmin for now), pure helpers
│   ├── preferences/
│   │   ├── sidebar-storage.ts       # SidebarStorage port + browser implementation (per user key)
│   │   └── sidebar-preference.store.ts  # SignalStore: collapsed state, load, toggle
│   └── viewport/
│       └── breakpoint.ts            # NARROW_BREAKPOINT_PX = 768, isNarrow(width), viewport signal
├── shared/
│   └── layout/
│       ├── main-layout/             # shell: sidebar or drawer + top bar + <router-outlet>
│       └── sidebar/                 # brand, nav list, collapse toggle, footer label
└── features/
    ├── home/pages/home.page.ts
    ├── settings/pages/settings.page.ts
    ├── masters/pages/masters.page.ts
    ├── statistics/pages/statistics.page.ts
    ├── users/pages/users.page.ts
    ├── profiles/pages/profiles.page.ts
    ├── marketing/pages/marketing.page.ts
    └── benefits/pages/benefits.page.ts
```

- Each feature page is a placeholder component with an i18n title. Each route loads its own chunk with `loadComponent`.
- Routes: `''` (main layout) with the eight items as children. Each child declares `data.allowedProfiles`.
- No `@ngrx/store`. The store is a `@ngrx/signals` SignalStore. It has no RxJS, because nothing is asynchronous.

## Decisions

- **Breakpoint:** 768 px. `isNarrow(width) = width < 768`. The viewport signal comes from `matchMedia('(max-width: 767.98px)')`, so it changes when the viewport crosses the breakpoint.
- **Collapsed state:** the SignalStore holds `collapsed: boolean`. The storage port reads and writes `control-panel.sidebar.<userId>` in `localStorage`. Every read and write is wrapped in try/catch. A read that fails or returns anything other than `'collapsed'` means expanded. The port is one interface (`SidebarStorage`), so the accounts change can replace it with a server-backed adapter without touching the store or the layout.
- **Current user:** `profile.ts` exports the constant user `{ id: 'local-superadmin', profile: 'superadmin' }` for now. The accounts change replaces it.
- **Drawer:** a `<dialog>`-free implementation with `aria-modal="true"` on the drawer panel, a backdrop `<div>` (`aria-hidden`), a focus trap that loops Tab/Shift+Tab over the drawer's focusable elements, Escape handled on the drawer, and focus restored to the menu button on close. Opening focuses the first nav link.
- **Rail tooltips:** each collapsed link has `aria-label` set to its label, and a `title` attribute with the label, so the name is available on hover and focus. Visible tooltips are CSS-only and appear on `:focus-visible` and `:hover` for pointer users.
- **Reduced motion:** transitions are inside `@media (prefers-reduced-motion: no-preference)`.
- **Tokens:** `src/styles/tokens.css` is generated from MatchMap's `tokens.json` and is not edited here. Layout-only sizes are defined once on `:root` in `src/styles.css`: `--cp-sidebar-width` (240 px) and `--cp-rail-width` (50 px). The drawer uses the sidebar width, so its content fills it. Every colour, radius and spacing uses `var(--mm-*)`.
- **i18n:** `@ngx-translate/core` with a custom `TranslateLoader` that returns the catalogues in `catalogues.ts` as observables, so there is no HTTP request. Language is set once at startup by `pickLanguage(navigator.language)`.
- **Security:** route metadata (`allowedProfiles`) only hides items. The server is the enforcement point and is outside this change. No token or personal data is stored by this change.

## Testing approach

- Unit tests (Vitest): `pickLanguage`, `isNarrow`, `nav-items` order and superadmin filtering, `SidebarPreferenceStore` (restore, toggle, per-user key, storage throws, invalid stored value).
- Component tests (Vitest with Angular TestBed): sidebar renders eight links in order, `aria-current` on the active route, collapsed state hides labels but keeps accessible names, drawer opens and closes, Escape closes, focus returns to the menu button.
- Accessibility: axe-core (same version as MatchMap, 4.14.0) run on the shell in expanded, collapsed and drawer-open states; zero violations.
- Layout at 320 px: a component test cannot measure layout, so the check is a manual step recorded in the PR (see tasks).
