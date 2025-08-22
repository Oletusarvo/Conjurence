'use client';

import { useUserAttendanceContext } from '@/features/attendance/providers/UserAttendanceProvider';
import { useMemo } from 'react';
import { ConfirmEndEventDialog } from './dialogs/ConfirmEndEventDialog';
import { CancelInterestDialog } from '@/features/attendance/components/dialogs/CancelInterestDialog';
import { LeaveEventDialog } from '@/features/attendance/components/dialogs/LeaveEventDialog';
import { ConfirmInterestDialog } from '@/features/attendance/components/dialogs/ConfirmInterestDialog';

/**Renders a different dialog after the EventActionButton is pressed, based on the attendance-status of the user to the event,
 */
export function EventActionDialog() {
  const attendance = useUserAttendanceContext();
  const currentAttendance = attendance.attendanceRecord;

  const dialog = useMemo(() => {
    if (!currentAttendance) return null;
    if (currentAttendance.status === 'host') {
      return <ConfirmEndEventDialog />;
    } else if (currentAttendance.status === 'interested') {
      return <CancelInterestDialog />;
    } else if (currentAttendance.status === 'joined') {
      return <LeaveEventDialog />;
    } else {
      return <ConfirmInterestDialog />;
    }
  }, [currentAttendance?.status]);

  return dialog;
}
