'use client';

import { ConfirmDialog } from '@/components/feature/ConfirmDialog';
import { useUserAttendanceContext } from '../../providers/UserAttendanceProvider';
import { useEventContext } from '@/features/events/providers/EventProvider';

export function CancelInterestDialog() {
  const attendance = useUserAttendanceContext();
  const { event } = useEventContext();

  return (
    <ConfirmDialog
      title='Confirm Interest Cancel'
      cancelContent={'Cancel'}
      confirmContent={'Yes, Cancel Interest'}
      action={async () => await attendance.cancelInterest(event.id)}>
      Are you sure you wish to cancel your interest in the event? This cannot be undone.
    </ConfirmDialog>
  );
}
