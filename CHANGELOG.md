## [0.8.0-alpha.1] - 20-08-2025

### Fixed

- Incorrect socket server import in server.mjs

## [0.8.0-alpha.0] - 30-08-2025

### Changed

- Renamed all files to kebab-case.

## [0.7.1-alpha.0] - 22-08-2025

### Fixed

- Mobile event positions not updating correctly.

## [0.7.0-alpha.4] - 21-08-2025

### Added

- JSDOC-comments on various components.
- The EventActionDialog-component, responsible for viewing the dialogs when the EventActionButton is pressed.

### Changed

- The registration flow to first send a verification link to the users email, encoding the email, before continuing with the username and password inputs once the link is clicked.
- EventActionButton is now only concerned with its content.
- The dialogs while viewing an event are now triggered by a ToggleProvider.
- The CheckboxInput to have its own state, so that the highlighting of it works even when a checked-value is not provided from the outside.

### Removed

- The unused attendance related actions inside the experimental-folder.

## [0.7.0-alpha.3] - 21-08-2025

### Changed

- Instead of waiting for an event position to be updated on the db, the new position is emitted immediately to all peers, from the socketServer event:position_update-event.

## [0.7.0-alpha.2] - 21-08-2025

### Changed

- Split CreateEventForm inputs into separate components.
- Moved the description-input on the first step of CreateEventForm and moved the is mobile- and is-template checkboxes onto the second step.

### Removed

- The third step of CreateEventForm.
- The location title-input from CreateEventForm.
- The location title-badge from the event-screen.

## [0.7.0-alpha.1] - 21-08-2025

### Added

- A map displaying the event and user locations, when viewing an event.

### Fixed

- The bug preventing return to the feed after leaving an event.

## [0.6.0-alpha.2] - 20-08-2025

### Fixed

- Incorrect version number.
- Wrong imports for TabButton.

## [0.6.0-alpha.1] - 20-08-2025

### Added

- An indicator the session is being updated, and disabling the back-to-feed button while it is, once an event has ended.

### Changed

- The bottom-bar is now only displayed when creating events, and hidden on the event-screen.
- Shortened the time-string of the EventStatusBadge to allow more room on the screen.

## [0.5.0-alpha.1] - 17-08-2025

### Added

- User subscriptions.
- Support for mobile events.
- StepProvider.
- Ability to rejoin an event after leaving.
- MobileBadge.

### Changed

- Event creation from template or from scratch is done on the same page.
- UserAttendanceProvider to manage a single attendance at a time.
- Split the event creation form into steps.
- The alignment of the contents of AttendanceEntry.

### Removed

- The UserAttendanceManagers associated with each event-card in the feed.

## [0.4.0-alpha.3] - 15-08-2025

### Fixed

- Wonky alignment of the event title and status badge on the event screen.

### Added

- Optional cleanup-method for timeouts created using useTimeout.
- the join- and leave thresholds on the DistanceProvider.
- A generic reusable Distance-component for creating other distance displaying components.
- The badges JoinDistanceBadge and LeaveDistanceBadge for displaying the leave and join thresholds when viewing an event.
- A utility function returning a distance formatted to meters or kilometers.
- Individual leave and join thresholds for events, selectable on the CreateEventForm.
- A location title to events.

### Changed

- Put the final state change inside a finally-block within the UserAttendanceManager handleAction-function.

## [0.4.0-alpha.2] - 15-08-2025

### Changed

- Disabled high-accuracy on geolocation.

## [0.4.0-alpha.1] - 15-08-2025

### Changed

- Removed manual position age checking, instead using the options for the watchPosition-function.
- Moved event-actions within the EventActionProvider file.
- The JSDoc for the EventActionButton.
- The autoJoin-methods to use the getThresholdAdjusted-function when comparing to a threshold.

### Removed

- Deprecated event-actions from the useEventActions-hook.
- The empty managers-folder from under the events-folder.
- The empty dialogs-folder from under the events-folder.

## [0.3.4] - 14-08-2025

### Fixed

- The description not changing in production when selecting an event category.
- The sorting button not working when viewing event templates.

### Changed

- Serviceworker to return a cached response if the fetch returns a status other than 200.
- CreateEventForm to use a List-component to render the options for the event category-select.
- List-component creates an id for itself using useId, and adds it in the key for each item.

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
