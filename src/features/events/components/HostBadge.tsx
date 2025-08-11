'use client';

import { AtSign } from 'lucide-react';
import { useEventContext } from '../providers/EventProvider';

export function HostBadge() {
  const {
    event: { host },
  } = useEventContext();
  return (
    <div className='flex items-center gap-1 text-sm'>
      <AtSign size={'14px'} />
      {host || 'host'}
    </div>
  );
}
