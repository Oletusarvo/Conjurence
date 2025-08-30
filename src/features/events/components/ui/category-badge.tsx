'use client';

import { Pill } from '@/components/ui/pill-temp';
import { useEventContext } from '../../providers/event-provider';
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
