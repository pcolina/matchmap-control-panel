# Proposal: rework-sidebar

## Why

The sidebar has a separate button to expand and collapse it. The owner wants that button removed, and the brand at the top of the sidebar (the MatchMap logo and the «Control Panel» text) to do the job instead. The owner also wants sign-out in the sidebar rather than in the page header, and the version line without its background.

## What Changes

- The expand and collapse button is removed from the sidebar footer, and its arrow icons go with it.
- The brand (logo and text) becomes the control that expands and collapses the sidebar. It is a button with an accessible name that says whether the action expands or collapses.
- In the narrow drawer the brand does nothing, because the drawer is always full width.
- The footer keeps the version text, drawn as plain text without a background, border or padding.
- The sign-out control moves into the sidebar, after the links, separated by a grey horizontal line and a large gap. It shows a logout icon with the same size as the navigation icons, and its label is hidden in the collapsed rail.

## Capabilities

### Modified

- `control-panel-shell`: the collapse requirement now uses the brand as the control, and the separate toggle scenarios are removed.

### New

- `control-panel-shell`: the sign-out placement in the sidebar (requirement added to the same capability).

## Out of scope

- The state storage, which stays as it is.
- Changing how sign-out works. Only its place and icon change here.

## Depends on

- `control-panel-shell` (archived): the collapse requirement this change replaces.
