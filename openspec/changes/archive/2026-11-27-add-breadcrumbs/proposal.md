# Proposal: add-breadcrumbs

## Why

Every page sits inside the main layout, and the user cannot see where they are within a section. A breadcrumb trail above the page title shows the path (for example «Maestros > Países») and lets the user jump back to any level.

## What Changes

- Every page of the main layout shows a breadcrumb trail above its title, generated automatically from the URL. No page declares its own trail, so a new route gets a trail without extra setup.
- Each URL segment becomes one crumb. Its label is the translation of `nav.<segment>` when that key exists, otherwise of `breadcrumb.<segment>`, otherwise the segment itself with its first letter capitalised.
- Placement: the trail sits above the page title, at the top edge of the content area with no extra top margin (`--cp-breadcrumb-top: 0px`).
- Size: half the title size. The title is the browser default `h1`, 32 px, so the trail is 16 px (`--mm-type-body-size`).
- Separator: a chevron icon (`tablerChevronRight`), hidden from assistive technology.
- Last crumb: the current page, in the accent colour, with `aria-current="page"`, not a link.
- Earlier crumbs: plain text in the text colour, no underline and no other style. On hover or keyboard focus they show an underline and go to their page.

## Capabilities

### Modified

- `control-panel-shell`: adds the breadcrumb trail to the content area of the main layout.

## Out of scope

- A «Países» page under «Maestros». The trail will read «Maestros > Países» once that route and its `breadcrumb.countries` label exist.
- Breadcrumbs inside the sidebar or the drawer.
