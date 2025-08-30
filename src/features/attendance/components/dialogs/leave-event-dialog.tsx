'use client';

import { ConfirmDialog } from '@/components/feature/confirm-dialog';
import { useUserAttendanceContext } from '../../providers/user-attendance-provider';
import { useEventContext } from '@/features/events/providers/event-provider';

export function LeaveEventDialog() {
  const attendance = useUserAttendanceContext();
  const { event } = useEventContext();

  return (
    <ConfirmDialog
      title='Confirm Leave'
      cancelContent={'Cancel'}
      confirmContent={'Yes, leave'}
      action={async () => await attendance.leave(event.id)}>
      Are you sure you want to leave the event?
    </ConfirmDialog>
  );
}
