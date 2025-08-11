'use client';

import { createContextWithUseHook } from '@/util/createContextWithUseHook';
import { Dispatch, SetStateAction, useState } from 'react';
import { TAttendance } from '../schemas/attendanceSchema';
import { useUserContext } from '@/features/users/providers/UserProvider';
import { updateAttendanceAction } from '../actions/updateAttendanceAction';
import { toggleInterestAction } from '../actions/toggleInterestAction';

export type TAttendanceStatusType = 'joining' | 'leaving' | 'ending';

const [UserAttendanceContext, useUserAttendanceContext] = createContextWithUseHook<{
  attendanceRecords: TODO[];
  /**@deprecated */
  addAttendanceRecord: (data: TAttendance) => void;
  getAttendanceByEventId: (eventId: string) => TAttendance;
  join: (eventId: string) => Promise<void>;
  leave: (eventId: string) => Promise<void>;
  showInterest: (eventId: string) => Promise<void>;
  cancelInterest: (eventId: string) => Promise<void>;
  currentAction: TAttendanceStatusType;
  setCurrentAction: Dispatch<SetStateAction<TAttendanceStatusType>>;
}>('useAttendanceContext can only be called within the scope of an EventAttendanceContext!');

type EventParticipantProviderProps = React.PropsWithChildren & {
  initialAttendanceRecords: TODO[];
};

/**Holds the event attendance-records of the current user. Provides methods to join, leave and showing interest on events. */
export function UserAttendanceProvider({
  children,
  initialAttendanceRecords,
}: EventParticipantProviderProps) {
  const { user, updateSession } = useUserContext();
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

  const cancelInterest = async (eventId: string) => {
    await updateAttendanceAction(eventId, 'canceled');
    updateAttendance(eventId, 'canceled');
    //setAttendanceRecords(prev => prev.filter(r => r.event_instance_id !== eventId));
  };

  /**Joins an event. Calls updateAttendanceAction with the given id, and afterwards updates the current attendance records, setting the attendance-status to "joined".
   * @param args The id of the event to join to.
   */
  const join = async (eventId: string) => {
    await updateAttendanceAction(eventId, 'joined');
    updateAttendance(eventId, 'joined');
    await updateSession({
      attended_event_id: eventId,
    });
  };

  const leave = async (eventId: string) => {
    await updateAttendanceAction(eventId, 'left');
    updateAttendance(eventId, 'left');
    await updateSession({
      attended_event_id: null,
    });
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
        cancelInterest,
        currentAction,
        setCurrentAction,
      }}>
      {children}
    </UserAttendanceContext.Provider>
  );
}

export { useUserAttendanceContext };
