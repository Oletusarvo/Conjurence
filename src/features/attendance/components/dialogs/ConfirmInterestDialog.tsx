'use client';

import { ConfirmDialog } from '@/components/feature/ConfirmDialog';
import { useUserAttendanceContext } from '../../providers/UserAttendanceProvider';
import { useEventContext } from '@/features/events/providers/EventProvider';

export function ConfirmInterestDialog() {
  const attendance = useUserAttendanceContext();
  const { event } = useEventContext();

  return (
    <ConfirmDialog
      title='Confirm Interest'
      cancelContent='Cancel'
      confirmContent="Yes, I'm Interested!"
      action={async () => await attendance.showInterest(event.id)}>
      No pressure — marking interest just means you’re genuinely considering showing up. It helps
      hosts get a feel for the crowd and keeps things flowing naturally. Sound good?
    </ConfirmDialog>
  );
}
