'use client';

import { ConfirmDialog } from '@/components/feature/confirm-dialog';
import { useEventActionContext } from '../../../events/providers/event-action-provider';

export function ConfirmEndEventDialog() {
  const { endEvent } = useEventActionContext();

  return (
    <ConfirmDialog
      title='Confirm Event Ending'
      cancelContent={'Cancel'}
      confirmContent={'End Event'}
      action={async () => await endEvent()}>
      Are you sure you want to end the event? This cannot be undone.
    </ConfirmDialog>
  );
}
