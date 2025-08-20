'use client';

import { Pin } from 'lucide-react';
import { useEventContext } from '../../providers/EventProvider';
import { Badge } from '@/components/Badge';

export function LocationTitleBadge() {
  const { event } = useEventContext();
  return (
    <Badge
      textSize='small'
      icon={Pin}>
      {event.location_title || 'No location.'}
    </Badge>
  );
}
