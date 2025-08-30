'use client';

import { useEventStatus } from '@/features/events/hooks/use-event-status';
import { StatusBadge } from '../../../../components/ui/status-badge';

export function EventStatusBadge({ createdAt }: { createdAt?: string }) {
  const { variant, timeString } = useEventStatus(createdAt, true);

  return (
    <div className='flex items-center gap-2 text-sm'>
      <span>{timeString}</span>
      <StatusBadge variant={variant} />
    </div>
  );
}
