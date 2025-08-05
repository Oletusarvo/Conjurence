'use client';

import { List } from '@/components/List';
import { TAttendance } from '@/features/attendance/schemas/attendanceSchema';
import { FeedEntry } from './FeedEntry';
import { useState } from 'react';
import { useEventSocket } from '@/features/events/hooks/useEventSocket';

type FeedProps = {
  eventId: string;
  initialParticipants: TAttendance[];
};
export function Feed({ initialParticipants, eventId }: FeedProps) {
  const [participants, setParticipants] = useState(initialParticipants);

  useEventSocket({
    eventId,
    onInterest: ({ newInterestRecord }) => {
      setParticipants(prev => [newInterestRecord, ...prev]);
    },
  });

  return (
    <List
      data={participants}
      component={({ item }) => (
        <FeedEntry
          username={item.username}
          timestamp={new Date(item.requested_at).toLocaleTimeString('fi')}>
          {item.status === 'interested' ? <>Is interested.</> : 'Started the event.'}
        </FeedEntry>
      )}
    />
  );
}
