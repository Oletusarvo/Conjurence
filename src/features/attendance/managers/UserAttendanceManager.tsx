'use client';

import { useEventContext } from '@/features/events/providers/EventProvider';
import { useEffect, useState } from 'react';
import { useUserAttendanceContext } from '../providers/UserAttendanceProvider';
import { useDistanceContext } from '@/features/distance/providers/DistanceProvider';
import { useTimeout } from '@/hooks/useTimeout';
import { endEventAction } from '@/features/events/actions/endEventAction';

const joinThreshold = 15;
const leaveThreshold = 25;

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
        attendance.setAttendanceStatus('joining');
        addTimeout(
          'join-timeout',
          async () => {
            await attendance.join(event.id);
            attendance.setAttendanceStatus(null);
          },
          300
        );
      } else if (distance >= joinThreshold) {
        attendance.setAttendanceStatus(null);
        removeTimeout('join-timeout');
      }
    }

    if (currentAttendance.status === 'joined') {
      //Automatically leave an event if far enough from it.
      if (distance >= leaveThreshold) {
        attendance.setAttendanceStatus('leaving');
        addTimeout(
          'leave-timeout',
          async () => {
            await attendance.leave(event.id);
            attendance.setAttendanceStatus(null);
          },
          3000
        );
      } else {
        removeTimeout('leave-timeout');
        attendance.setAttendanceStatus(null);
      }
    }

    if (currentAttendance.status === 'host') {
      //Automatically end the event if the host moves far enough from it.
      if (distance >= leaveThreshold) {
        console.log('Ending event...');
        addTimeout(
          'end-timeout',
          async () => {
            await endEventAction(event.id);
          },
          300
        );
      }
    } else {
      removeTimeout('end-timeout');
    }
  }, [currentAttendance, distancePending, distance, event.id, attendance]);
  return null;
}
