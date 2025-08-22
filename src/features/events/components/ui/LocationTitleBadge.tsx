'use client';

import { Pin } from 'lucide-react';
import { useEventContext } from '../../providers/EventProvider';
import { Badge } from '@/components/ui/Badge';

export function LocationTitleBadge() {
  const { event } = useEventContext();
  return (
    <Badge
      textSize='small'
      icon={Pin}>
      {'No location.'}
    </Badge>
  );
}
