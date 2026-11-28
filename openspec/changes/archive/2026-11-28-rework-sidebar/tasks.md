# Tasks: rework-sidebar

Each task names its failing test first, then the code that makes it pass.

## 1. Brand as the collapse control

- [x] 1.1 Test: the brand is a button with `aria-expanded` and an accessible name that says the change it makes, and there is no other expand or collapse button. Then make the brand the control and remove the footer toggle.
- [x] 1.2 Test: in the narrow drawer the brand is not a button. Then render it as plain content when `showToggle` is false.

## 2. Footer

- [x] 2.1 Test: the version is plain text, with no background, border or padding. Then remove them.

## 3. Sign-out in the sidebar

- [x] 3.1 Test: the sign-out control comes after the links, behind a divider. Then move it into the sidebar.
- [x] 3.2 Test: when collapsed it shows only the icon, with the accessible name «Sign out». Then add the collapsed mode.
- [x] 3.3 Test: the sign-out icon has the same font size as the navigation icons. Then size it.
- [x] 3.4 Remove the sign-out control from the page header and its styles.

## 4. Verification

- [x] 4.1 Run `pnpm test` (114 tests) and `pnpm typecheck`.
- [ ] 4.2 Manual check in Chrome: the sidebar shows the divider, the sign-out icon size matches, the brand toggles the width, and the version is plain text. Not done yet after the last edits.
