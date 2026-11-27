# Proposal: add-control-panel-layout

## Why

The control panel is an internal tool with no screens yet. It needs a shell that every section plugs into: a left sidebar with the navigation, a content area, and a responsive behaviour for narrow screens. Defining the shell first lets each later section be a separate change.

## What Changes

- A left sidebar, always present on every page after sign-in:
  - Top: the MatchMap logo and the text «MatchMap». The logo does not link anywhere.
  - Bottom, smaller text: «Control Panel».
  - Navigation items with an icon and a text label, spaced with a comfortable margin between them.
- Navigation items, in this order. The set of items each user sees depends on their role, so this list is the full catalogue, not what every user gets:
  1. **Home**: a miscellany of the most important information for the user's profile. Its content is defined later and depends on the profile.
  2. **Configuración** (Settings)
  3. **Maestros** (Master data)
  4. **Estadísticas** (Statistics)
  5. **Usuarios** (Users): manage the users who can sign in to the tool, and assign them to profiles.
  6. **Perfiles** (Profiles): manage and view what each profile can do.
  7. **Marketing**: report on marketing campaigns.
  8. **Beneficios** (Benefits): manage benefits and calculate income from subscriptions and similar revenue.
- Collapse and expand: the sidebar can be minimised to a 50 px rail that shows only the icons. The rail keeps the same navigation and the same behaviour (same items, same order, each icon has an accessible name). The user can toggle between the two states. The chosen state is remembered per user account, so it is the same on the next visit.
- Responsive: the layout works from 320 px to wide desktop. On narrow screens the sidebar becomes a drawer (cajón): it is hidden, a menu button opens it over the content with a dimmed backdrop, and it closes when the user taps outside it or picks an item.
- Light and dark mode, using the `--mm-*` tokens already in `src/styles/tokens.css`. The sidebar follows the same design rules as MatchMap (`matchMap/docs/design.md`): icons from `@ng-icons/tabler-icons`, the accent colour for the active item, WCAG 2.2 AA contrast, touch targets of at least 44 px.
- All navigation items open their content in the same main page: the sidebar stays in place and the selected section renders in the main content area. Each item is a lazy-loaded child route of that main page. This change adds the routes and placeholder content only.
- The sidebar has no sub-items. «Configuración» and «Maestros» open in the main content area like the rest; any tabs inside a section are that section's decision.
- Until role-based access exists, the profile `superadmin` is the only profile. It sees all eight items and can do everything in each of them. Other profiles are defined in the roles change.
- Every label is an i18n key (`nav.home`, `nav.settings`, and so on) with `en` and `es` values. The language comes from the browser.
- Icons, proposed and to be refined later: home, settings, database, chart-bar, users, shield or id-badge, speakerphone, coin.

## Capabilities

### New

- `control-panel-shell`: the layout (sidebar, collapsed rail, drawer on narrow screens, content area), the role-based navigation, and the responsive rules.

## Out of scope

- Content of any section. Each section is its own change.
- Content of Home. It is defined in a separate change once the most important information is agreed.
- Authentication, roles and profile-based permissions. The menu shows every item for now. The role model is a separate change.
- Where the per-user preference is stored on the server. This change only stores the collapsed state; the storage mechanism is decided with the user accounts change.
- Charts and statistics library. It is chosen in the change that first needs it.
- The breadcrumbs, the page header and the search.

## Depends on

None. This is the first change in the repository.

## Open questions

None.
