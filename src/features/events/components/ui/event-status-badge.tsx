'use client';

import { useEventStatus } from '@/features/events/hooks/use-event-status';
import { StatusBadge } from '../../../../components/ui/status-badge';
import { useEventContext } from '../../providers/event-provider';

export function EventStatusBadge() {
  const { event } = useEventContext();
  const { variant, timeString } = useEventStatus(event?.created_at, true);

  return (
    <div className='flex items-center gap-2 text-sm'>
      <span>{timeString}</span>
      <StatusBadge variant={variant} />
    </div>
  );
}
