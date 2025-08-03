'use client';

import { createContextWithUseHook } from '@/util/createContextWithUseHook';
import { useEffect, useState } from 'react';
import { TAttendance } from '../schemas/attendanceSchema';
import { redirect } from 'next/navigation';

const [EventAttendanceContext, useAttendanceContext] = createContextWithUseHook<{
  attendanceRecords: TODO[];
  addAttendanceRecord: (data: TAttendance) => void;
  getAttendanceByEventId: (eventId: string) => TAttendance;
}>('useAttendanceContext can only be called within the scope of an EventAttendanceContext!');

type EventParticipantProviderProps = React.PropsWithChildren & {
  initialAttendanceRecords: TODO[];
};

export function EventAttendanceProvider({
  children,
  initialAttendanceRecords,
}: EventParticipantProviderProps) {
  const [attendanceRecords, setAttendanceRecords] = useState(initialAttendanceRecords);

  const addAttendanceRecord = (data: TAttendance) =>
    setAttendanceRecords([...attendanceRecords, data]);

  const getAttendanceByEventId = (eventId: string) =>
    attendanceRecords.find(a => a.event_instance_id === eventId);

  return (
    <EventAttendanceContext.Provider
      value={{ attendanceRecords, addAttendanceRecord, getAttendanceByEventId }}>
      {children}
    </EventAttendanceContext.Provider>
  );
}

export { useAttendanceContext };
