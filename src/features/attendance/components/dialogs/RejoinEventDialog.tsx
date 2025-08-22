'use client';

import { ConfirmDialog } from '@/components/feature/ConfirmDialog';
import { useUserAttendanceContext } from '../../providers/UserAttendanceProvider';
import { useEventContext } from '@/features/events/providers/EventProvider';

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
