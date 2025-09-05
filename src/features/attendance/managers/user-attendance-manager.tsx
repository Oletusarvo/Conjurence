'use client';

import { useEventContext } from '@/features/events/providers/event-provider';
import { useEffect } from 'react';
import {
  TAttendanceStatusType,
  useUserAttendanceContext,
} from '../providers/user-attendance-provider';
import { useDistanceContext } from '@/features/distance/providers/distance-provider';
import { useTimeout } from '@/hooks/use-timeout';
import { endEventAction } from '@/features/events/actions/end-event-action';
import { useUserContext } from '@/features/users/providers/user-provider';
import { useGeolocationContext } from '@/features/geolocation/providers/geolocation-provider';
import { shouldJoin, shouldLeave } from '@/features/attendance/util/auto-join';
import toast from 'react-hot-toast';

const joinThreshold = 5;
const leaveThreshold = 15;
const timeout = 3000;

/**
 * Handles automatic joining and leaving from an event when within or outside a set distance from it.
 * Will only join the event if the user has expressed interest in it.
 * Depends on the User-, Event-, Geolocation-, Distance-, and Attendance contexts.
 * @returns
 */
export function UserAttendanceManager() {
  const { updateSession } = useUserContext();
  const { event, hasEnded } = useEventContext();
  const { position } = useGeolocationContext();
  const { distance, distancePending, joinThreshold, leaveThreshold } = useDistanceContext();
  const attendance = useUserAttendanceContext();

  const currentAttendance = attendance.attendanceRecord;
  const { addTimeout, removeTimeout } = useTimeout();

  useEffect(() => {
    if (distancePending || !currentAttendance || !event) {
      return;
    }

    const handleAction = (
      predicate: () => boolean,
      action: TAttendanceStatusType,
      tname: string,
      cb: () => Promise<void>
    ) => {
      if (predicate()) {
        if (attendance.currentAction !== action) {
          attendance.setCurrentAction(action);
          addTimeout(
            tname,
            async () => {
              try {
                await cb();
              } catch (err) {
                toast.error('Something went wrong!');
              } finally {
                attendance.setCurrentAction(null);
              }
            },
            timeout
          );
        }
      } else {
        removeTimeout(tname);
        attendance.setCurrentAction(null);
      }
    };

    if (currentAttendance.status === 'interested') {
      //Automatically join an event if close enough to it.
      handleAction(
        () =>
          !hasEnded &&
          shouldJoin(
            distance,
            position.coords.accuracy,
            event.position.accuracy,
            event?.auto_join_threshold
          ),
        'joining',
        'join-timeout',
        async () => {
          await attendance.join(event.id);
        }
      );
    }

    if (currentAttendance.status === 'joined') {
      //Automatically leave an event if far enough from it.
      handleAction(
        () =>
          shouldLeave(
            distance,
            position.coords.accuracy,
            event.position.accuracy,
            event.auto_leave_threshold
          ),
        'leaving',
        'leave-timeout',
        async () => await attendance.leave(event.id)
      );
    }

    if (currentAttendance.status === 'host') {
      //Automatically end the event if it isn't mobile and the host moves far enough from it.
      handleAction(
        () =>
          !hasEnded &&
          !event.is_mobile &&
          shouldLeave(
            distance,
            position.coords.accuracy,
            event.position.accuracy,
            event?.auto_leave_threshold
          ),
        'ending',
        'end-timeout',
        async () => {
          await endEventAction(event.id);
        }
      );
    }
  }, [
    currentAttendance?.status,
    distancePending,
    distance,
    event?.id,
    event?.position.accuracy,
    event?.is_mobile,
    position?.coords.accuracy,
    hasEnded,
    attendance?.currentAction,
    addTimeout,
    removeTimeout,
    shouldJoin,
    shouldLeave,
    endEventAction,
  ]);

  useEffect(() => {
    if (!hasEnded) return;

    updateSession({
      attended_event_id: null,
    });
  }, [hasEnded]);

  return null;
}
