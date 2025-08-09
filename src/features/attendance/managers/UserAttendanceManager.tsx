'use client';

import { useEventContext } from '@/features/events/providers/EventProvider';
import { useEffect, useState } from 'react';
import { useUserAttendanceContext } from '../providers/UserAttendanceProvider';
import { useDistanceContext } from '@/features/distance/providers/DistanceProvider';
import { useTimeout } from '@/hooks/useTimeout';
import { endEventAction } from '@/features/events/actions/endEventAction';

const joinThreshold = 15;
const leaveThreshold = 3;

/**
 * Handles automatic joining and leaving from an event when within or outside a set distance from it.
 * Will only join the event if the user has expressed interest in it.
 * @returns
 */
export function UserAttendanceManager() {
  const { event } = useEventContext();
  const { distance, distancePending } = useDistanceContext();
  const attendance = useUserAttendanceContext();
  const currentAttendance = attendance.getAttendanceByEventId(event.id);
  const { addTimeout, removeTimeout } = useTimeout();

  useEffect(() => {
    if (distancePending || !currentAttendance) {
      return;
    }

    if (currentAttendance.status === 'interested') {
      //Automatically join an event if close enough to it.
      if (distance <= joinThreshold) {
        if (attendance.currentAction !== 'joining') {
          attendance.setCurrentAction('joining');
          addTimeout(
            'join-timeout',
            async () => {
              console.log('Joining...');
              await attendance.join(event.id);
              attendance.setCurrentAction(null);
            },
            5000
          );
        }
      } else {
        attendance.setCurrentAction(null);
        removeTimeout('join-timeout');
      }
    }

    if (currentAttendance.status === 'joined') {
      //Automatically leave an event if far enough from it.
      if (distance >= leaveThreshold) {
        if (attendance.currentAction !== 'leaving') {
          attendance.setCurrentAction('leaving');
          addTimeout(
            'leave-timeout',
            async () => {
              await attendance.leave(event.id);
              attendance.setCurrentAction(null);
            },
            5000
          );
        }
      } else {
        removeTimeout('leave-timeout');
        attendance.setCurrentAction(null);
      }
    }

    if (currentAttendance.status === 'host') {
      //Automatically end the event if the host moves far enough from it.
      if (distance >= leaveThreshold) {
        if (attendance.currentAction !== 'ending') {
          attendance.setCurrentAction('ending');
          addTimeout(
            'end-timeout',
            async () => {
              await endEventAction(event.id);
              attendance.setCurrentAction(null);
            },
            5000
          );
        }
      } else {
        removeTimeout('end-timeout');
        attendance.setCurrentAction(null);
      }
    }
  }, [currentAttendance, distancePending, distance, event.id, attendance]);
  return null;
}
