'use client';

import { Pill } from '@/components/ui/pill-temp';
import { Armchair } from 'lucide-react';
import { useEventContext } from '../../providers/event-provider';

export function SpotsAvailableBadge() {
  const { event } = useEventContext();
  return (
    <Pill
      variant='outlined'
      size='small'>
      <div className='flex gap-2 items-center'>
        <Armchair size={'14px'} />
        <span>{event.spots_available}</span>
      </div>
    </Pill>
  );
}
