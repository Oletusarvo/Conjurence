'use client';

import { ReactNode, useMemo } from 'react';
import { useUserAttendanceContext } from '@/features/attendance/providers/user-attendance-provider';

/**
 * Renders the action-button displayed on the bottom of app/event/[event_id].
 * The contents of the button change based on what the attendance-status of
 * the user is to the event.
 */

export function EventActionButton(props: React.ComponentProps<'button'>) {
  const attendance = useUserAttendanceContext();
  const currentAttendance = attendance.attendanceRecord;
  const hideButton = currentAttendance?.status === 'canceled';

  const buttonContent = useMemo((): ReactNode => {
    if (currentAttendance) {
      if (currentAttendance.status === 'host') {
        return <>End Event</>;
      } else if (currentAttendance.status === 'interested') {
        return <>Cancel Interest</>;
      } else if (currentAttendance.status === 'joined') {
        return <>Leave Event</>;
      } else if (currentAttendance.status === 'left') {
        return <>Rejoin Event</>;
      }
    }
    return <>I'm Interested</>;
  }, [currentAttendance?.status]);

  return (
    !hideButton && (
      <button
        {...props}
        className='--contained --accent --full-width'>
        {buttonContent}
      </button>
    )
  );
}
