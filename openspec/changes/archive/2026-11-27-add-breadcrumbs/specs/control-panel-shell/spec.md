# control-panel-shell

## ADDED Requirements

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
