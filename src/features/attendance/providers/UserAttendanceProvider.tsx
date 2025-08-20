'use client';

import { createContextWithUseHook } from '@/util/createContextWithUseHook';
import { Dispatch, SetStateAction, useState } from 'react';
import { TAttendance } from '../schemas/attendanceSchema';
import { useUserContext } from '@/features/users/providers/UserProvider';
import { updateAttendanceAction } from '../actions/updateAttendanceAction';
import { createAttendanceAction } from '../actions/createAttendanceAction';
import toast from 'react-hot-toast';
import { useEventSocket } from '@/features/events/hooks/useEventSocket';
import { useReloadData } from '@/hooks/useReloadData';

export type TAttendanceStatusType = 'joining' | 'leaving' | 'ending';

const [UserAttendanceContext, useUserAttendanceContext] = createContextWithUseHook<{
  attendanceRecord: TAttendance | null;
  updateAttendanceRecord: (attendance: TAttendance | null) => Promise<void>;
  join: (eventId: string) => Promise<void>;
  leave: (eventId: string) => Promise<void>;
  showInterest: (eventId: string) => Promise<void>;
  cancelInterest: (eventId: string) => Promise<void>;
  currentAction: TAttendanceStatusType;
  setCurrentAction: Dispatch<SetStateAction<TAttendanceStatusType>>;
}>('useAttendanceContext can only be called within the scope of an EventAttendanceContext!');

type EventParticipantProviderProps = React.PropsWithChildren & {
  initialAttendanceRecord: TAttendance | null;
};

/**Holds the event attendance-records of the current user. Provides methods to join, leave and showing interest on events. */
export function UserAttendanceProvider({
  children,
  initialAttendanceRecord,
}: EventParticipantProviderProps) {
  const [attendanceRecord, setAttendanceRecord] = useState(initialAttendanceRecord);
  const { updateSession } = useUserContext();
  const [currentAction, setCurrentAction] = useState<TAttendanceStatusType | null>(null);

  const reloadAttendance = useReloadData(
    `/api/attendance?event_id=${attendanceRecord?.event_instance_id || ''}`,
    setAttendanceRecord,
    300
  );

  const updateAttendanceRecord = async (attendance: TAttendance | null) => {
    setAttendanceRecord(attendance);
    updateSession({ attended_event_id: attendance?.event_instance_id || null });
  };

  const showInterest = async (eventId: string) => {
    try {
      const res = await createAttendanceAction(eventId, 'interested');
      if (res.success) {
        await updateAttendanceRecord(res.data);
      }
    } catch (err) {
      toast.error('Something went wrong!');
    }
  };

  const cancelInterest = async (eventId: string) => {
    try {
      const res = await updateAttendanceAction(eventId, 'canceled');
      if (res.success) {
        await updateAttendanceRecord(null);
      }
    } catch (err) {
      toast.error('Something went wrong!');
    }
  };

  /**Joins an event. Calls updateAttendanceAction with the given id, and afterwards updates the current attendance records, setting the attendance-status to "joined".
   * @param args The id of the event to join to.
   */
  const join = async (eventId: string) => {
    try {
      const res = await updateAttendanceAction(eventId, 'joined');
      if (res.success) {
        await updateAttendanceRecord(res.data);
      }
    } catch (err) {
      toast.error('Something went wrong!');
    }
  };

  const leave = async (eventId: string) => {
    try {
      const res = await updateAttendanceAction(eventId, 'left');
      if (res.success) {
        await updateAttendanceRecord(res.data);
      }
    } catch (err) {
      toast.error('Something went wrong!');
    }
  };

  useEventSocket({
    eventId: attendanceRecord?.event_instance_id,
    onEnd: () => {
      updateAttendanceRecord(null);
    },
  });

  return (
    <UserAttendanceContext.Provider
      value={{
        attendanceRecord,
        updateAttendanceRecord,
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
