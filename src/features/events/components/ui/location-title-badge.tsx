'use client';

import { Pin } from 'lucide-react';
import { useEventContext } from '../../providers/event-provider';
import { Badge } from '@/components/ui/badge-temp';

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
