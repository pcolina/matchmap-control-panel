## ADDED Requirements

### Requirement: Sign in with email and password
The control panel SHALL show a sign-in page with an email field and a password field. Submitting it SHALL call `POST /api/auth/login` with `X-Client: web`. Sign-in by username is out of scope.

#### Scenario: Correct credentials
- **WHEN** a user submits a valid email and password on the sign-in page
- **THEN** the panel stores the access token in memory only
- **AND** the panel opens the page the user asked for

#### Scenario: Wrong credentials
- **WHEN** a user submits a wrong email or password
- **THEN** the panel shows an error and keeps the user on the sign-in page
- **AND** no token is stored

### Requirement: The access token is kept in memory only
The access token SHALL NOT be written to `localStorage`, `sessionStorage` or cookies by the panel. The refresh token SHALL stay in the `HttpOnly` cookie that the API sets, and the panel SHALL NOT read it.

#### Scenario: Reload keeps the session
- **WHEN** a signed-in user reloads the panel
- **THEN** the panel calls `POST /api/auth/refresh` with `X-Client: web` and gets a new access token
- **AND** the user stays on the same page

#### Scenario: No token in storage
- **WHEN** a user has signed in
- **THEN** no access token value is present in `localStorage` or `sessionStorage`

### Requirement: Failed refresh shows the sign-in page
If `POST /api/auth/refresh` fails, the panel SHALL show the sign-in page.

#### Scenario: Expired session
- **WHEN** the panel starts with no valid refresh cookie
- **THEN** the panel shows the sign-in page

### Requirement: Retry once after an unauthorized response
When a GraphQL request fails with `extensions.classification` `UNAUTHORIZED`, the panel SHALL refresh the session once and repeat that request. If the refresh fails, the panel SHALL show the sign-in page.

#### Scenario: Access token expired during use
- **WHEN** a GraphQL request returns `UNAUTHORIZED` and the refresh succeeds
- **THEN** the panel repeats the request once with the new access token
- **AND** shows its data

#### Scenario: Session ended on the server
- **WHEN** a GraphQL request returns `UNAUTHORIZED` and the refresh fails
- **THEN** the panel shows the sign-in page

### Requirement: Sign out ends the session
The panel SHALL offer a sign-out control. It SHALL call `POST /api/auth/logout` with `X-Client: web`, clear the access token from memory, and show the sign-in page.

#### Scenario: Sign out
- **WHEN** a signed-in user uses the sign-out control
- **THEN** the panel calls `POST /api/auth/logout` with `X-Client: web`
- **AND** the panel shows the sign-in page
- **AND** a later refresh does not restore the session

### Requirement: Role check at entry
After sign-in the panel SHALL read `me { role }`. An account SHALL enter the panel only when its role is not null, not empty and not `USER`. Any other account SHALL see a «no permissions» page and no panel content.

#### Scenario: Administrator enters the panel
- **WHEN** a signed-in account with the role `ADMIN` opens the panel
- **THEN** the panel shows its pages

#### Scenario: User without permissions
- **WHEN** a signed-in account with the role `USER` opens the panel
- **THEN** the panel shows the «no permissions» page
- **AND** no master data is requested

### Requirement: Panel pages require a session
Every page of the panel except the sign-in page SHALL require a session. A visitor without a session SHALL see the sign-in page.

#### Scenario: Visitor opens a master
- **WHEN** a visitor without a session opens `/masters/countries`
- **THEN** the panel shows the sign-in page
- **AND** no master data is requested

### Requirement: Texts in both languages
Every visible text of the sign-in page, the sign-out control and the «no permissions» page SHALL be an i18n key with `en` and `es` values.

#### Scenario: Spanish browser
- **WHEN** the browser language is `es`
- **THEN** every text of these pages is in Spanish
