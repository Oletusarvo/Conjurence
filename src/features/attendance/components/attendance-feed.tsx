'use client';

import { List } from '@/components/feature/list-temp';
import { AttendantEntry } from './attendant-entry';
import { useEventContext } from '@/features/events/providers/event-provider';
import { useEventAttendanceContext } from '../providers/event-attendance-provider';

/**Renders the feed showing the current attendants to an event. */
export function AttendanceFeed() {
  const { eventAttendanceRecords } = useEventAttendanceContext();

  return (
    <List
      data={eventAttendanceRecords}
      component={({ item }) => (
        <AttendantEntry
          username={item.username}
          timestamp={new Date(item.requested_at).toLocaleTimeString('fi')}>
          {item.status === 'interested' ? (
            <>Is interested.</>
          ) : item.status === 'joined' ? (
            <>Joined the event!</>
          ) : item.status === 'left' ? (
            <>Left the event.</>
          ) : item.status === 'canceled' ? (
            <>Canceled</>
          ) : (
            'Started the event.'
          )}
        </AttendantEntry>
      )}
    />
  );
}
