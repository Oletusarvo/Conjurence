'use client';

import { createContextWithUseHook } from '@/util/createContextWithUseHook';
import { SetStateAction, useState } from 'react';
import { TAttendance } from '../schemas/attendanceSchema';
import { useUserContext } from '@/features/users/providers/UserProvider';
import { updateAttendanceAction } from '../actions/updateAttendanceAction';
import { toggleInterestAction } from '../actions/toggleInterestAction';

type TAttendanceStatusType = 'joining' | 'leaving' | 'ending';

const [UserAttendanceContext, useUserAttendanceContext] = createContextWithUseHook<{
  attendanceRecords: TODO[];
  /**@deprecated */
  addAttendanceRecord: (data: TAttendance) => void;
  getAttendanceByEventId: (eventId: string) => TAttendance;
  join: (eventId: string) => Promise<void>;
  leave: (eventId: string) => Promise<void>;
  showInterest: (eventId: string) => Promise<void>;
  currentAction: TAttendanceStatusType;
  setCurrentAction: React.Dispatch<SetStateAction<TAttendanceStatusType | null>>;
}>('useAttendanceContext can only be called within the scope of an EventAttendanceContext!');

type EventParticipantProviderProps = React.PropsWithChildren & {
  initialAttendanceRecords: TODO[];
};

/**Holds the event attendance-records of the current user. Provides methods to join, leave and showing interest on events. */
export function UserAttendanceProvider({
  children,
  initialAttendanceRecords,
}: EventParticipantProviderProps) {
  const { user } = useUserContext();
  const [attendanceRecords, setAttendanceRecords] = useState(initialAttendanceRecords);
  const [currentAction, setCurrentAction] = useState<TAttendanceStatusType | null>(null);

  const updateAttendance = (eventId: string, status: TAttendance['status']) => {
    const newAttendance = [...attendanceRecords];
    const a = newAttendance.find(a => a.event_instance_id === eventId);
    if (!a) return;
    a.status = status;
    setAttendanceRecords(newAttendance);
  };

  const showInterest = async (eventId: string) => {
    await toggleInterestAction(eventId);
    addAttendanceRecord({
      event_instance_id: eventId,
      username: user.username,
      status: 'interested',
    });
  };

  /**Joins an event. Calls updateAttendanceAction with the given id, and afterwards updates the current attendance records, setting the attendance-status to "joined".
   * @param args The id of the event to join to.
   */
  const join = async (eventId: string) => {
    await updateAttendanceAction(eventId, 'joined');
    updateAttendance(eventId, 'joined');
  };

  const leave = async (eventId: string) => {
    await updateAttendanceAction(eventId, 'left');
    updateAttendance(eventId, 'left');
  };

  const addAttendanceRecord = (data: TAttendance) =>
    setAttendanceRecords([...attendanceRecords, data]);

  const getAttendanceByEventId = (eventId: string) =>
    attendanceRecords.find(a => a.event_instance_id === eventId);

  return (
    <UserAttendanceContext.Provider
      value={{
        attendanceRecords,
        addAttendanceRecord,
        getAttendanceByEventId,
        join,
        leave,
        showInterest,
        currentAction,
        setCurrentAction: setCurrentAction,
      }}>
      {children}
    </UserAttendanceContext.Provider>
  );
}

export { useUserAttendanceContext };
