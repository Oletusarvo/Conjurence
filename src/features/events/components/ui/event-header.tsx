'use client';

import { useEventContext } from '../../providers/event-provider';
import { HostBadge } from '../host-badge';
import { EventStatusBadge } from './event-status-badge';

export function EventHeader() {
  const { event } = useEventContext();
  return (
    <div
      id='event-header'
      className='flex gap-2 items-start justify-between w-full'>
      <div className='flex flex-col gap-1'>
        <div className='flex gap-2'>
          <h2>{event?.title}</h2>
        </div>

        <HostBadge />
      </div>
      <EventStatusBadge />
    </div>
  );
}
