# Tasks: add-toast-notifications

Each task names its failing test first, then the code that makes it pass.

## 1. Notification store

- [x] 1.1 Test `NotificationStore.show`: adds an item with its `kind` and `message`, and `dismiss(id)` removes it. Run it and show it failing. Then add `core/notifications/notification.store.ts`.
- [x] 1.2 Test the timer: an item is removed 7 seconds after it was shown, with `vi.useFakeTimers`. Then add the timer.
- [x] 1.3 Test stacking: a second `show` does not reset the timer of the first item. Then add per-item timers.

## 2. Toast component

- [x] 2.1 Test `app-toast` renders one bar per notification, and two notifications are visible at the same time. Run it and show it failing. Then add `shared/notifications/toast/toast.ts`, `toast.html` and `toast.css`.
- [x] 2.2 Test the colours: an `error` bar has the danger background class, an `info` bar the accent class, and a `warning` bar the warning class. Then add the classes.
- [x] 2.3 Test the accessibility roles: an `error` bar has `role="alert"`, and `info` and `warning` bars have `role="status"`. Then add the roles.
- [x] 2.4 Test the click: a click 1 second after the bar appears does not dismiss it; a click 4 seconds after does. Then add the click handler with the 3-second rule.
- [x] 2.5 Test the layout classes: the container is fixed to the bottom, and each bar is 40 px high. Then add the styles and check them in the manual step.

## 2b. Repeated notifications

- [x] 2b.1 Test: showing the same kind and message while it is visible adds no second bar; a different message still adds one. Run it and show it failing. Then make `show` skip a repeat.

## 3. Root wiring

- [x] 3.1 Test `app.ts` renders `app-toast` outside the router outlet. Then add `app-toast` to the root template.

## 4. Pages

- [x] 4.1 Test the sign-in page: a failed sign-in calls `show('error', 'login.error')` and shows no inline error text. Update the existing `login.page.spec.ts` test that expects the inline text. Then remove the inline error from `login.page.html` and `login.page.ts`, and call the store.
- [x] 4.2 Test the masters page: an error from the query calls `show('error', 'masters.error')`. Then add the `tap` in the error branches of `masters.page.ts`. The inline error text stays.

## 5. Verification

- [x] 5.1 Run `pnpm test`, `pnpm typecheck` and `pnpm build`.
- [ ] 5.2 Manual check in Chrome at `http://localhost:4400/login`: the bar spans the full width (1536 px), is 40 px high with its text centred vertically, stacks upward from the bottom edge with two bars visible at once, closes on click only after 3 seconds, and disappears after 7 seconds. The warning and error text contrast was computed from the tokens: 5.02:1 on warning in light theme and 10.24:1 in dark theme. Not done: the 320 px check and the light theme screenshot, because the browser runs in dark mode and its window cannot be resized below 1036 px from here. The pointer cursor only after 3 seconds from the design was not implemented; the bar uses the default cursor.
