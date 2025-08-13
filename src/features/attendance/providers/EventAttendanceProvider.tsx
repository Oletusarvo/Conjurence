'use client';

import { useState } from 'react';
import { TAttendance } from '../schemas/attendanceSchema';
import { createContextWithUseHook } from '@/util/createContextWithUseHook';
import { useEventSocket } from '@/features/events/hooks/useEventSocket';
import { useEventContext } from '@/features/events/providers/EventProvider';

const [EventAttendanceContext, useEventAttendanceContext] = createContextWithUseHook<{
  eventAttendanceRecords: TAttendance[];
  joinedCount: number;
}>('useEventAttendanceContext can only be used within the scope of an EventAttendanceContext!');

type EventAttendanceProviderProps = React.PropsWithChildren & {
  initialAttendanceRecords: TAttendance[];
};

/**Holds the attendees to on event. Responsible for listening to socket-events related to them and updating each accordingly.
 * This provider is different from the UserAttendanceProvider, in that it holds the data of all users attending the event, not
 * which events the logged in user is attending.
 */
export function EventAttendanceProvider({
  children,
  initialAttendanceRecords,
}: EventAttendanceProviderProps) {
  const { event } = useEventContext();
  const [attendanceRecords, setAttendanceRecords] = useState(initialAttendanceRecords);
  const joinedCount = attendanceRecords.filter(
    a => a.status === 'host' || a.status === 'joined'
  ).length;

  const updateAttendee = ({
    username,
    status,
  }: {
    username: string;
    status: TAttendance['status'];
  }) => {
    setAttendanceRecords(prev => {
      const newAttendees = [...prev];
      const a = newAttendees.find(a => a.username === username);
      a.status = status;
      return newAttendees;
    });
  };

  useEventSocket({
    eventId: event.id,
    onInterest: payload => {
      setAttendanceRecords(prev => [payload.newAttendanceRecord, ...prev]);
    },
    onAttendanceUpdate: payload => updateAttendee(payload),
  });

  return (
    <EventAttendanceContext.Provider
      value={{ eventAttendanceRecords: attendanceRecords, joinedCount }}>
      {children}
    </EventAttendanceContext.Provider>
  );
}

export { useEventAttendanceContext };
