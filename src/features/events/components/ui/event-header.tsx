'use client';

import { useEventContext } from '../../providers/event-provider';
import { HostBadge } from '../host-badge';
import { CategoryBadge } from './category-badge';
import { EventStatusBadge } from './event-status-badge';
import { MobileEventBadge } from './mobile-event-badge';
import { SpotsAvailableBadge } from './spots-available-badge';

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

        <div className='flex flex-col gap-2'>
          <HostBadge />
          <div className='flex gap-2'>
            <CategoryBadge />
            <SpotsAvailableBadge />
            {event.is_mobile && <MobileEventBadge />}
          </div>
        </div>
      </div>{' '}
      <EventStatusBadge />
    </div>
  );
}
