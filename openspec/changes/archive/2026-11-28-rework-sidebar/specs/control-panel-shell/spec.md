## MODIFIED Requirements

### Requirement: Collapse to rail
The sidebar SHALL collapse to a 50 px wide rail that shows only the icons, and expand back to its full width. The brand at the top of the sidebar SHALL be the control that changes this state. The rail SHALL show the same items, in the same order, and each link SHALL keep an accessible name.

#### Scenario: Collapsing keeps the navigation
- **WHEN** the user collapses the sidebar
- **THEN** the sidebar width is 50 px
- **AND** all eight items remain listed in the same order
- **AND** each item's link has an accessible name equal to its text label

#### Scenario: Toggle has a name and state
- **WHEN** the sidebar is shown at width 768 px or more
- **THEN** the brand is a button with an accessible name
- **AND** the button has `aria-expanded` set to `true` when expanded and `false` when collapsed
- **AND** there is no other expand or collapse button in the sidebar

#### Scenario: Labels are visible on focus in the rail
- **WHEN** an item in the collapsed rail receives keyboard focus
- **THEN** its text label is shown as a tooltip

#### Scenario: Toggle arrows show the direction of the change
- **WHEN** the sidebar is collapsed
- **THEN** the brand button's accessible name says it expands the sidebar
- **WHEN** the sidebar is expanded
- **THEN** the brand button's accessible name says it collapses the sidebar

#### Scenario: Brand in the narrow drawer
- **WHEN** the sidebar is shown in the narrow drawer
- **THEN** the brand is not a button and does not change the width

## MODIFIED Requirements

### Requirement: Sidebar brand and footer
The sidebar SHALL show the MatchMap logo and the text «MatchMap» at the top, and the text «Control Panel» directly below it in a smaller size. The footer SHALL show the application version («Versión 1.0.0» in Spanish, «Version 1.0.0» in English) as plain text in the accent colour, without a background, border or padding. Its contrast SHALL pass WCAG 2.2 AA on the sidebar background. When the sidebar is expanded, the version SHALL be centred horizontally in the footer. The logo SHALL NOT be a link.

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

## ADDED Requirements

### Requirement: Sign-out lives in the sidebar
The sign-out control SHALL be shown in the sidebar, after the navigation links, separated from them by a grey horizontal line and a large gap. It SHALL show a logout icon with the same size as the navigation icons. When the sidebar is collapsed, the control SHALL show only the icon with an accessible name.

#### Scenario: Sign-out below the links
- **WHEN** the sidebar is shown
- **THEN** the sign-out control comes after the last navigation link, with a divider between them

#### Scenario: Icon matches navigation icons
- **WHEN** the sign-out control is shown
- **THEN** its icon has the same font size as the navigation icons

#### Scenario: Collapsed rail
- **WHEN** the sidebar is collapsed
- **THEN** the sign-out control shows only the icon, and keeps the accessible name «Sign out»
