'use client';

import { ConfirmDialog } from '@/components/feature/confirm-dialog';
import { useUserAttendanceContext } from '../../providers/user-attendance-provider';
import { useEventContext } from '@/features/events/providers/event-provider';

export function RejoinEventDialog() {
  const attendance = useUserAttendanceContext();
  const { event } = useEventContext();

  return (
    <ConfirmDialog
      title='Confirm Rejoin'
      cancelContent={'Cancel'}
      confirmContent={'Yes, Rejoin'}
      action={async () => await attendance.join(event.id)}>
      Are you sure you wish to rejoin the event?
    </ConfirmDialog>
  );
}
