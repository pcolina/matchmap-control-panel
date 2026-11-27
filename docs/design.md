# Design

This document describes the design of the MatchMap control panel. The panel is a separate web app. It talks only to the MatchMap API (`matchmap-api`), never to its database.

## Local data sets

The administrator loads these data sets from the panel. The MatchMap API does not fetch them from a public source at runtime. Tracked in issue #2.

| Data set | What it contains | Where it goes in MatchMap | Format | Status |
|---|---|---|---|---|
| Prohibited words | Words that are not allowed in email and username | Username and email moderation lists (`username-moderation`) | To be defined | Open |
| City catalog | Countries and cities, with latitude and longitude for each city | Country and city tables (`geo-catalog`) | To be defined | Open |

### Prohibited words

- Used to check the email and the username when a user registers, and when the lists are moderated.
- Format, fields and load process: to be defined.

### City catalog

- Each city belongs to exactly one country, identified by its ISO 3166-1 alpha-2 code (two uppercase letters, for example `ES`).
- Each city has a latitude and a longitude in decimal degrees:
  - latitude: from -90 to 90;
  - longitude: from -180 to 180.
- The list of cities to include is decided by the administrator.
- Format and load process: to be defined.
- Country names in each supported language are not part of this data set yet.
