# Proposal: add-toast-notifications

## Why

The panel has no shared way to tell the user that something happened: a save worked, a request failed, or something needs attention. Each page would otherwise invent its own message. A single notification service and a single component give every page the same behaviour.

## What Changes

- A shared notification service, `core/notifications`, that any page or store can call with a message and a kind: `info`, `warning` or `error`.
- A shared toast component, `shared/notifications/toast`, rendered once at the application root. Each notification is a bar that spans the full width of the viewport and is 40 px tall. Several notifications stack on top of each other, and all of them can be visible at the same time.
- Each notification stays for 7 seconds and then disappears. The user can close it early by clicking it, but only after it has been visible for 3 seconds, so an accidental click before it is read does nothing. Each notification has its own 7-second timer, so a notification that arrives later does not reset the timer of one already shown.
- Colours from the MatchMap tokens:
  - `error`: background `--mm-color-danger`.
  - `info`: background `--mm-color-accent`.
  - `warning`: background `--mm-color-warning`.
  - Text in `--mm-color-onAccent` or white, so it reads on every background.
- The bar has `role="status"` for `info` and `warning`, and `role="alert"` for `error`, so screen readers announce it.
- Every message that is not already a translation key is passed through the translate pipe, so messages can be i18n keys with `en` and `es` values.
- No new dependency.

## Capabilities

### New

- `notifications`: showing short, timed messages of three kinds to the user from any part of the panel.

## Out of scope

- Wiring every existing page to the service. This change adds the service and the component, and wires only the sign-in error and the masters load error, which already exist. Other messages (for example saves) come in the changes that add those actions.
- Persistent notifications, a notification history, and action buttons inside the bar.
- Closing the bar with the keyboard. Clicking closes it (see What Changes).

## Depends on

- `add-admin-login` (archived): the sign-in error that is wired here.
- `add-masters-page` (archived): the masters load error that is wired here.

## Open points

- The toast is pinned to the bottom edge of the viewport, above the page content, as the owner decided. The request says "modal", but a bar that spans the full width and is 40 px high is a toast.
- The `info` kind uses the accent colour `--mm-color-accent` (teal in the MatchMap palette), as the owner asked.
