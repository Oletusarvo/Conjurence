## [0.3.3-beta] - 14-08-2025

### Fixed

- Incorrect version number in package.json

### Changed

- knexfile development database connection to use a .env variable.
- Wrapped UserAttendanceProvider method-contents inside try-catch blocks.

### Removed

- The tabs from the event feed.

## [0.3.2-beta] - 13-08-2025

### Fixed

- Auto-joining not working in production.

### Added

- JSDoc comments on some methods.

## [0.3.1-beta.2] - 13-08-2025

### Fixed

- The content inside the Tab-component being pushed upwards when the border appears on selection.

## [0.3.0-beta.2] - 13-08-2025

### Changed

- Moved distance and geolocation utils under their feature-folder.
- Event auto-ending and joining to include a check against if the event has ended.

### Added

- Tabs into the event feed for viewing nearby events, as well as attended events.

## [0.3.0-beta.1] - 13-08-2025

### Fixed

- The bug causing unreliable attended_event_id updates on joining, ending or leaving an event.

## [0.3.0-alpha] - 12-08-2025

### Fixed

- The unexpected error occuring on the CreateEventForm due to incorrect JSON-conversion of the geolocation position.

### Changed

- Moved window resizing, service worker loading and notifications permission asking into their own manager components.
- Background color to a black-to-dark-purple.
- The color of the borders on the header, footer, inputs and event cards.

### Added

- Contact host button.
- Function to make auto-joining and leaving smoother by taking the accuracy of the measurements into account.
- A separate interest count badge: InterestCountBadge.

## [0.2.1] - 11-08-2025

### Fixed

- Events not showing up on the feed on first render.

### Added

- Conditionals to setting the current location of a user.
- A single function to handle the attendance auto-action once they're triggered.
- A reusable badge that shows the host of an event.
- Ability to cancel interest, and to leave an event manually.

## [0.2.0] - 11-08-2025

### Added

- Automatically updating event feed, that shows events happening near the user.
- Terms of service and privacy policy.

## [0.1.0] - 11-08-2025

### Unreleased

- Live-updating event feed based on distance to the user.
