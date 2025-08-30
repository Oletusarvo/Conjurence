'use client';

import { ConfirmDialog } from '@/components/feature/confirm-dialog';
import { useUserAttendanceContext } from '../../providers/user-attendance-provider';
import { useEventContext } from '@/features/events/providers/event-provider';

export function ConfirmInterestDialog() {
  const attendance = useUserAttendanceContext();
  const { event } = useEventContext();

  return (
    <ConfirmDialog
      title='Confirm Interest'
      cancelContent='Cancel'
      confirmContent="I'm Interested!"
      action={async () => await attendance.showInterest(event.id)}>
      No pressure — marking interest just means you’re genuinely considering showing up. It helps
      hosts get a feel for the crowd and keeps things flowing naturally. Sound good?
    </ConfirmDialog>
  );
}
