# notifications Specification

## Purpose
TBD - created by archiving change add-toast-notifications. Update Purpose after archive.

## Requirements

### Requirement: Any part of the panel can show a notification
The notification service SHALL accept a message and a kind of `info`, `warning` or `error`, and SHALL show the notification in a single shared toast rendered once at the application root.

#### Scenario: Error notification
- **WHEN** a page reports an error with the message `masters.error`
- **THEN** the toast shows that message with the error colour

#### Scenario: Informative notification
- **WHEN** a page reports an informative message
- **THEN** the toast shows that message with the accent colour

#### Scenario: Warning notification
- **WHEN** a page reports a warning
- **THEN** the toast shows that message with the warning colour

### Requirement: The toast is a full-width bar that disappears after 7 seconds
The toast SHALL span the full width of the viewport, SHALL be pinned to the bottom edge of the viewport, SHALL be 40 px high, with its text centred horizontally and vertically, and SHALL disappear 7 seconds after it appears. Several notifications SHALL stack, all of them visible at the same time, and each SHALL keep its own 7-second timer.

#### Scenario: Notification expires
- **WHEN** a notification has been shown for 7 seconds
- **THEN** the toast is removed

#### Scenario: Notifications arrive together
- **WHEN** two notifications are reported within the same second
- **THEN** both are visible at the same time, and each disappears 7 seconds after it appeared

### Requirement: A repeated notification is not shown twice
While a notification with the same kind and the same message is visible, a new notification with that kind and message SHALL NOT add another bar. The visible notification keeps its original 7-second timer; the repeat does not restart it.

#### Scenario: Same message while visible
- **WHEN** the sign-in error is reported twice within 7 seconds
- **THEN** only one error bar with that message is visible

#### Scenario: Different message
- **WHEN** an error with a different message is reported while another error is visible
- **THEN** both bars are visible

### Requirement: The user can close the toast by clicking it after 3 seconds
A click on the toast SHALL close it only when it has been visible for at least 3 seconds. A click before that SHALL do nothing.

#### Scenario: Early click is ignored
- **WHEN** the user clicks the toast 1 second after it appears
- **THEN** the toast stays visible

#### Scenario: Click after 3 seconds closes it
- **WHEN** the user clicks the toast 4 seconds after it appears
- **THEN** the toast is removed

### Requirement: Screen readers announce the notification
A warning or information notification SHALL have `role="status"`. An error notification SHALL have `role="alert"`.

#### Scenario: Error is announced as an alert
- **WHEN** an error notification is shown
- **THEN** the toast has `role="alert"`

### Requirement: Sign-in and masters errors use the toast
The sign-in page SHALL report a failed sign-in as an error notification, and the masters page SHALL report a failed load as an error notification.

#### Scenario: Failed sign-in
- **WHEN** a sign-in fails with invalid credentials
- **THEN** the toast shows the sign-in error as an error notification

#### Scenario: Failed masters load
- **WHEN** a master cannot be loaded
- **THEN** the toast shows the load error as an error notification
