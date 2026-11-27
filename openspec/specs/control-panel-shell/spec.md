# control-panel-shell

## Requirements

### Requirement: Sidebar brand and footer
The sidebar SHALL show the MatchMap logo and the text «MatchMap» at the top, and the text «Control Panel» directly below it in a smaller size. The footer SHALL show the application version («Versión 1.0.0» in Spanish, «Version 1.0.0» in English) in the accent colour, inside a chip with the surface colour so that its contrast passes WCAG 2.2 AA. When the sidebar is expanded, the chip SHALL be centred horizontally in the footer. The logo SHALL NOT be a link.

#### Scenario: Expanded sidebar shows the brand
- **WHEN** the sidebar is expanded
- **THEN** the logo and the text «MatchMap» are shown at the top
- **AND** the text «Control Panel» is shown directly below the brand text in a smaller size than the brand text
- **AND** the text «Versión 1.0.0» (or «Version 1.0.0») is shown in the footer in the accent colour
- **AND** the logo is not inside a link element

#### Scenario: Collapsed rail hides the brand text
- **WHEN** the sidebar is collapsed to the rail
- **THEN** the text «MatchMap», the text «Control Panel» and the version are not visible
- **AND** the logo is still visible

### Requirement: Navigation items
The navigation SHALL list these items in this order: Home, Maestros, Estadísticas, Usuarios, Perfiles, Marketing, Beneficios, Configuración (last). Each item SHALL have an icon and a text label. Each item SHALL be a link to a route.

#### Scenario: Superadmin sees every item
- **WHEN** the signed-in profile is `superadmin`
- **THEN** all eight items are listed in the defined order

#### Scenario: Each item opens its route
- **WHEN** the user activates an item
- **THEN** the router navigates to that item's route
- **AND** the content renders in the main content area of the main page

#### Scenario: Current item is announced
- **WHEN** a route is active
- **THEN** its navigation link has `aria-current="page"`
- **AND** no other link has `aria-current`

#### Scenario: Items use lazy-loaded routes
- **WHEN** the application builds
- **THEN** each navigation route is a separate lazy-loaded chunk

### Requirement: Collapse to rail
The sidebar SHALL collapse to a 50 px wide rail that shows only the icons, and expand back to its full width. The rail SHALL show the same items, in the same order, and each link SHALL keep an accessible name.

#### Scenario: Collapsing keeps the navigation
- **WHEN** the user collapses the sidebar
- **THEN** the sidebar width is 50 px
- **AND** all eight items remain listed in the same order
- **AND** each item's link has an accessible name equal to its text label

#### Scenario: Toggle has a name and state
- **WHEN** the sidebar is shown at width 768 px or more
- **THEN** a toggle button is available with an accessible name
- **AND** the toggle has `aria-expanded` set to `true` when expanded and `false` when collapsed

#### Scenario: Labels are visible on focus in the rail
- **WHEN** an item in the collapsed rail receives keyboard focus
- **THEN** its text label is shown as a tooltip

#### Scenario: Toggle arrows show the direction of the change
- **WHEN** the sidebar is collapsed
- **THEN** the toggle shows arrows pointing outward, to expand
- **WHEN** the sidebar is expanded
- **THEN** the toggle shows arrows pointing inward, to collapse

### Requirement: Collapsed state is remembered per user
The expanded or collapsed state SHALL be stored per signed-in user, so the same state is restored on the next visit in the same browser. The state SHALL be read through a single storage port so that it can move to the user account preferences when the accounts change exists.

#### Scenario: State is restored on reload
- **WHEN** the user collapses the sidebar and reloads the page
- **THEN** the sidebar is collapsed after the reload

#### Scenario: State belongs to the user
- **WHEN** a different user signs in on the same browser
- **THEN** that user's own saved state is used, not the previous user's

#### Scenario: Storage failure falls back to expanded
- **WHEN** the browser storage is unavailable or throws
- **THEN** the sidebar starts expanded
- **AND** the application does not show an error

### Requirement: Responsive layout
The layout SHALL work from 320 px wide to wide desktop without horizontal page scrolling. At widths below 768 px the sidebar SHALL be a drawer (cajón) that is hidden by default and opened from a menu button in the top bar of the main page. At 768 px and above the sidebar is shown, expanded or collapsed according to the user's saved state.

#### Scenario: No horizontal scroll at 320 px
- **WHEN** the viewport is 320 px wide
- **THEN** the page has no horizontal scrollbar

#### Scenario: Narrow screen shows the drawer closed
- **WHEN** the viewport is below 768 px
- **THEN** the sidebar is not visible
- **AND** a menu button is visible

#### Scenario: Drawer opens and closes
- **WHEN** the user activates the menu button on a narrow screen
- **THEN** the drawer opens over the content with a dimmed backdrop
- **AND** the menu button has `aria-expanded` set to `true`
- **WHEN** the user taps the backdrop, presses Escape, or activates an item
- **THEN** the drawer closes
- **AND** focus returns to the menu button

#### Scenario: Drawer closes with motion
- **WHEN** the drawer closes and the user's system does not ask to reduce motion
- **THEN** the drawer slides out to the left and the backdrop fades out over the same duration and easing as the opening
- **AND** the drawer is removed from the page when that motion ends

#### Scenario: Drawer traps focus while open
- **WHEN** the drawer is open
- **THEN** keyboard focus stays inside the drawer
- **AND** Tab cycles through the drawer's controls

#### Scenario: Resizing across the breakpoint
- **WHEN** the viewport changes from below 768 px to 768 px or more while the drawer is open
- **THEN** the drawer closes and the sidebar is shown

### Requirement: Accessibility
Navigation SHALL be a `nav` landmark with an accessible name. Every interactive element SHALL have a role and an accessible name. Touch targets SHALL be at least 44 × 44 px. Motion SHALL respect the reduced-motion setting.

#### Scenario: Navigation landmark
- **WHEN** the layout renders
- **THEN** the navigation is a `nav` element with `aria-label` set to the localized name of the navigation

#### Scenario: Touch targets
- **WHEN** an item, the toggle, or the menu button is rendered on a touch viewport
- **THEN** its clickable area is at least 44 × 44 px

#### Scenario: Reduced motion
- **WHEN** the user's system asks to reduce motion
- **THEN** the drawer and the sidebar change state without animation

#### Scenario: Automated accessibility check
- **WHEN** the shell is rendered in each state (expanded, collapsed, drawer open)
- **THEN** an automated axe check reports no violations of WCAG 2.2 AA

### Requirement: Theme and tokens
All colours, sizes, radii and spacing SHALL come from the `--mm-*` tokens in `src/styles/tokens.css`. The shell SHALL render correctly in light and dark mode. The active item SHALL use the accent colour. The sidebar background SHALL use the `--mm-map-ocean` token, which is a light blue-grey in light mode and a deep navy in dark mode.

#### Scenario: No hard-coded design values
- **WHEN** the shell styles are checked
- **THEN** they contain no colour, size, radius or spacing values other than `var(--mm-*)` references, and the 50 px rail width defined as a token

#### Scenario: Dark mode
- **WHEN** the system is in dark mode
- **THEN** the shell uses the dark token values

### Requirement: Localized labels
Every visible label of the shell SHALL be an i18n key with `en` and `es` values. The language SHALL be taken from the browser language when it is `en` or `es`, and `en` otherwise.

#### Scenario: Spanish browser
- **WHEN** the browser language is `es-ES`
- **THEN** the labels are shown in Spanish

#### Scenario: Unsupported browser language
- **WHEN** the browser language is `fr-FR`
- **THEN** the labels are shown in English

### Requirement: Route access metadata
Each navigation route SHALL declare the profiles allowed to open it. The application SHALL NOT show an item that the current profile is not allowed to open. Enforcement on the server is required and is outside this change.

#### Scenario: Items hidden for a profile without access
- **WHEN** the current profile is not in an item's allowed profiles
- **THEN** that item is not rendered in the navigation

#### Scenario: Metadata present on every route
- **WHEN** the route table is loaded
- **THEN** every navigation route has a non-empty allowed-profiles list

### Requirement: Breadcrumb trail
Every page of the main layout SHALL show a breadcrumb trail above its title. The trail SHALL be generated from the URL of the current page, with one crumb per URL segment, so that new routes get a trail without extra configuration. Its text SHALL be half the size of the page title. It SHALL sit at the top edge of the content area, above the title, with no extra top margin.

#### Scenario: Trail shows the path to the page
- **WHEN** the user opens `/masters/countries`
- **THEN** the trail shows «Maestros», a chevron separator, and the last segment as the current page
- **AND** the trail is above the page title

#### Scenario: Labels come from the catalogue
- **WHEN** a segment matches a navigation item (`nav.<segment>`)
- **THEN** the crumb uses that translation
- **WHEN** it does not match a navigation item but has a `breadcrumb.<segment>` key
- **THEN** the crumb uses that translation
- **WHEN** neither key exists
- **THEN** the crumb shows the segment with its first letter capitalised

#### Scenario: Current page is the last crumb
- **WHEN** a trail is shown
- **THEN** the last crumb has `aria-current="page"`, is not a link, and uses the accent colour

#### Scenario: Earlier crumbs are links
- **WHEN** a trail has more than one crumb
- **THEN** each crumb before the last is a link to its own page
- **AND** those links use the text colour with no underline, and show an underline on hover or keyboard focus

#### Scenario: Top-level pages
- **WHEN** a page has one URL segment, for example `/home`
- **THEN** the trail shows only that page's name, in the accent colour

#### Scenario: Separators are hidden from assistive technology
- **WHEN** the trail is rendered
- **THEN** the chevron separators have `aria-hidden="true"`
- **AND** the trail is a `nav` landmark with an accessible name in the current language
