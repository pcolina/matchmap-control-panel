# Design: add-toast-notifications

## Contract baseline

No API contract is involved. This change is frontend only.

## Components

- `core/notifications/notification.store.ts`: a SignalStore, `NotificationStore`, `providedIn: 'root'`. Its state is `items: Notification[]`, where each item has `id`, `kind` (`'info' | 'warning' | 'error'`), `message` (a translation key or plain text) and `shownAt` (a timestamp). Its method `show(kind, message)` adds an item and starts its own timer; `dismiss(id)` removes it.
- `shared/notifications/toast/toast.ts`: the component `app-toast`, rendered once in `app.ts` (the root component), outside the router outlet, so it stays above every page.
- `shared/notifications/toast/toast.html` and `toast.css`: the markup and styles.

Pages and stores call `NotificationStore.show`. They never render a toast themselves.

## Timing

- Each notification has its own timer. The timer is `setTimeout(dismiss, 7000)`, set when the item is added. Dismissing the item clears its timer.
- A click on a notification calls `dismiss(id)` only when `Date.now() - shownAt >= 3000`. A click earlier does nothing, so an accidental click before the text is read has no effect.
- Notifications stack: each one keeps its own timer, so a later notification does not reset an earlier one.

## Layout

- The toast container is `position: fixed`, `left: 0`, `right: 0`, `bottom: 0`, with `z-index` above the page content. It has no padding and no gap, so each bar is exactly 40 px high and spans the full width.
- Bars stack upward from the bottom edge. The newest bar is the one nearest the page content, and the oldest is the one at the bottom edge. This ordering is a design choice that the owner did not specify; it can be changed in the CSS.
- Each bar is a `div` with `height: 40px`, `width: 100%`, a single line of text with ellipsis for long messages, and a `cursor: pointer` only after 3 seconds. The bar is not focusable and has no keyboard handler, because keyboard closing is out of scope.

## Colours

- `error`: background `--mm-color-danger`, text `--mm-color-onDanger`.
- `info`: background `--mm-color-accent`, text `--mm-color-onAccent`.
- `warning`: background `--mm-color-warning`, text `--mm-color-onAccent` in light mode. The token set has no text colour for warning, so the design uses `--mm-color-onAccent` and checks the contrast in both themes before the change is done.

## Accessibility

- An `error` bar has `role="alert"`. A `warning` or `info` bar has `role="status"`.
- Each bar keeps the text in the DOM, so screen readers read it.

## Wiring

- The sign-in page calls `show('error', 'login.error')` when `NotificationStore` is used by `LoginPage`. The inline error text and its `error` signal are removed. The sign-in spec that expects the inline text is updated to expect the toast.
- The masters page calls `show('error', 'masters.error')` in the error branches of its pipeline, using `tap`. The inline error text in the page template stays, because the spec for the masters page states that the table is replaced by an error message.

## Texts

- No new translation keys. The message is a key (`login.error`, `masters.error`), so the translate pipe renders the text in the current language. Plain text passed as a message is shown as it is.

## Test plan

- Unit `NotificationStore`: `show` adds an item with its kind and message; `dismiss` removes it; a second `show` does not reset the first item's timer (use `vi.useFakeTimers`).
- Unit `NotificationStore`: the item is removed after 7 seconds.
- Unit `app-toast`: a click before 3 seconds does not dismiss; a click after 3 seconds does; the error bar has `role="alert"`; the info bar uses the accent background class.
- Unit `app-toast`: two items are rendered at the same time.
- Unit `LoginPage`: a failed sign-in calls `show('error', 'login.error')` and shows no inline error (replaces the test that expects the inline text).
- Unit `MastersPage`: an error from the query calls `show('error', 'masters.error')`.
- Manual in Chrome at 320 px and 1280 px: the bar spans the full width, is 40 px tall, closes after 7 seconds, and two stacked bars are both visible.

## Out of scope

- Keyboard closing, action buttons, history, and persistence, as in the proposal.
- Wiring saves and other actions. They come in the changes that add those actions.
