'use client';

import { useUserAttendanceContext } from '@/features/attendance/providers/user-attendance-provider';
import { useMemo } from 'react';
import { ConfirmEndEventDialog } from '../../attendance/components/dialogs/confirm-end-event-dialog';
import { CancelInterestDialog } from '@/features/attendance/components/dialogs/cancel-interest-dialog';
import { LeaveEventDialog } from '@/features/attendance/components/dialogs/leave-event-dialog';
import { ConfirmInterestDialog } from '@/features/attendance/components/dialogs/confirm-interest-dialog';

/**Renders a different dialog after the EventActionButton is pressed, based on the attendance-status of the user to the event,
 */
export function EventActionDialog() {
  const attendance = useUserAttendanceContext();
  const currentAttendance = attendance.attendanceRecord;

  const dialog = useMemo(() => {
    if (!currentAttendance) return <ConfirmInterestDialog />;

    if (currentAttendance.status === 'host') {
      return <ConfirmEndEventDialog />;
    } else if (currentAttendance.status === 'interested') {
      return <CancelInterestDialog />;
    } else if (currentAttendance.status === 'joined') {
      return <LeaveEventDialog />;
    }
  }, [currentAttendance?.status]);

  return dialog;
}
