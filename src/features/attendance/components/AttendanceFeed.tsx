'use client';

import { List } from '@/components/List';
import { AttendantEntry } from './AttendantEntry';
import { useEventContext } from '@/features/events/providers/EventProvider';
import { useEventAttendanceContext } from '../providers/EventAttendanceProvider';

export function AttendanceFeed() {
  const { event } = useEventContext();
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
