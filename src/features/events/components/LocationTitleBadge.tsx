'use client';

import { Pin } from 'lucide-react';
import { useEventContext } from '../providers/EventProvider';

export function LocationTitleBadge() {
  const { event } = useEventContext();

  return (
    <div className='flex gap-2 items-center text-sm'>
      <Pin size={'14px'} />
      <span>{event.location_title || 'No location.'}</span>
    </div>
  );
}
