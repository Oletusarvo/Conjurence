'use client';

import { Pill } from '@/components/Pill';
import { useEventContext } from '../../providers/EventProvider';
import { capitalize } from '@/util/capitalize';

export function CategoryBadge() {
  const { event } = useEventContext();
  return (
    <Pill
      variant='outlined'
      size='small'
      color='accent'>
      {capitalize(event.category) || 'Other'}
    </Pill>
  );
}
