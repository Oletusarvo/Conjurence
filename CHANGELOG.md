## [0.8.0-beta.20] - 21-09-2025

### Added

- Event feed-map refresh button.

## [0.8.0-beta.19] - 20-09-2025

### Added

- Account deletion functionality

## [0.8.0-beta.18] - 17-09-2025

### Fixed

- createEventAction throwing an error when is_template is true.

### Added

- EventTemplateProvider

## [0.8.0-beta.17] - 14-09-2025

### Changed

- The key for useSessionStorage to an array of strings from a single string.

### Added

- A cleanupOnUnmount-flag for useSessionStorage, to remove the saved value on unmount.

## [0.8.0-beta.16] - 14-08-2025

### Changed

- Moved the icon-instantiations of useEventmarker into the initialization of the ref, instead of lazy-loading leaflet in a useEffect before setting them, to prevent a flash of missing icons on the map.

### Added

- Temporarily added back the manual cache-ref for useNearbyEvents.

## [0.8.0-beta.15] - 14-09-2025

### Fixed

- An oversight where the handlers for messages on the socket-server were not awaited.

### Changed

- Moved EventPositionProvider into its own file.
- Made the event marker icons be saved inside a ref instead of state, so they are loaded once and reused later.

## [0.8.0-beta.14] - 13-09-2025

### Changed

- Moved the center position of GeolocationMap into a ref to prevent the component from re-rendering unecessarily every time the users location changes.

- Removed null and stale-timestamp check from the updateEventPositionHandler, to see if it fixes the problem where a stale position is displayed breafly after re-renders on EventMap and EventMapSpecific.

- Changed the initial event-position argument to come from the initialEvent-prop instead of the event-state, also as an attempt to see if it stops an events stale position from flashing briefly after re-renders.

## [0.8.0-beta.13] - 13-09-2025

### Changed

- The socket server event position update handler now excludes the socket from which the update came from, and the host directly sets the event position through state.

- Moved event subqueries under EventMetaRepository.

### Fixed

- useStaleTimestamp not working on the host of an event.

### Added

- EventTemplateRepository and service.

## [0.8.0-beta.12] - 12-09-2025

### Added

- Beta-notice on the hero-section.
- A notice explaining only gmail is allowed, on the registration-page.

## [0.8.0-beta.11] - 12-09-2025

### Changed

- The socket server event position update handler now checks for null before updating, and emits the received position after
  the database operation has finished, to try to make sure the mobile events position does not jump to where it was started at
  on screen refresh.

- Inactive buttons now do not play the press-down animation.

## [0.8.0-beta.10] - 10-09-2025

### Added

- Animations to buttons when pressed.

## [0.8.0-beta.9] - 09-09-2025

### Fixed

- Event markers flickering on the feed-map when the user's position changes.

### Changed

- Moved event position-logic and provider inside the EventProvider.

## [0.8.0-beta.8] - 09-09-2025

### Changed

- Moved socket-server hadlers into their own files.
- Added a return button to each step in the event-creation flow.

## [0.8.0-beta.7] - 08-09-2025

### Added

- Handler for native-platform geolocation.
- Background geolocation. (Server-side logic for joining and leaving not implemented yet.).

### Changed

- GeolocationProvider to handle its logic in separate components; chosen based on if the platform is native or not.

## [0.8.0-beta.6] - 08-09-2025

### Changed

- The event creation form to not use an explicit state to store the input values, and instead reading them directly from the inputs on submission; made possible by hiding the steps instead of not rendering them when not on them.

### Fixed

- The FlyToPosition-component not updating the map view when position changes...possibly.

## [0.8.0-beta.5] - 07-09-2025

### Changed

- The modal show-prop now affects the hidden-attribute of itself, rather than the modal being conditionally rendered.

### Added

- EventMapSpecific now flys to the location of the event.

## [0.8.0-beta.4] - 07-09-2025

### Changed

- Moved event position under its own provider, to prevent the event from re-rendering every time the position of it changes.

## [0.8.0-beta.3] - 06-08-2025

### Added

- The onValidate-callback to useOnSubmit.

### Changed

- Deprecated the validationSchema-option of useOnSubmit.

## [0.8.0-beta.2] - 06-08-2025

### Fixed

- Bug in CreateEventForm causing the size-option to be invalid when using a template.
- Incorrect date in the 0.8.0-beta.1 log.

### Changed

- The theme-color defined in the manifest.json-file.
- The Dialog-component now uses the slot-pattern for its buttons and content, rather than them being passed as props.

### Added

- Added back the geofencing-handler.
- A gray marker to indicate mobile events with an outdated position.
- useStaleTimestamp for determining if a timestamp has gone stale; useful for positions.

## [0.8.0-beta.1] - 05-09-2025

### Removed

- Previous geofencing-logic.

### Changed

- Mobile event position updates are now done by a dedicated component, instead of the EventProvider itself, allowing omission of
  the functionality where needed.
- Event position management is now done by a dedicated component, instead of the EventProvider itself.
- Events can now be created with a manual position.
- Event feed to be a map showing the events as markers on it.
- EventCard now applies the HostBadge and EventStatusBadge as slots if they are passed as children, allowing omission of either one.

## [0.8.0-alpha.3] - 02-09-2025

### Changed

- The implementations of registerUserAction and sendVerificationEmailAction.
- The implementation of join- and leave-logic. The user has to now have been outside an event geofence for three consequtive measurements before they are triggered.

### Added

- The user- repository and service.

### Fixed

- Dysfunctional --ghost button css-selector.

## [0.8.0-alpha.2] - 31-08-2025

### Added

- Repositories and services for attendance- and event data.

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
