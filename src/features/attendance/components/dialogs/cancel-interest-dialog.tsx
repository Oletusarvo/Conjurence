'use client';

import { ConfirmDialog } from '@/components/feature/confirm-dialog';
import { useUserAttendanceContext } from '../../providers/user-attendance-provider';
import { useEventContext } from '@/features/events/providers/event-provider';

export function CancelInterestDialog() {
  const attendance = useUserAttendanceContext();
  const { event } = useEventContext();

  return (
    <ConfirmDialog
      title='Confirm Interest Cancel'
      cancelContent={'No'}
      confirmContent={'Yes'}
      action={async () => await attendance.cancelInterest(event.id)}>
      Are you sure you wish to cancel your interest in the event? This cannot be undone.
    </ConfirmDialog>
  );
}
