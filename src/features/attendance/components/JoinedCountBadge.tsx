'use client';

import { User } from 'lucide-react';
import { withIcon } from '@/hoc/withIcon';
import { useEventAttendanceContext } from '../providers/EventAttendanceProvider';
import { useEventContext } from '@/features/events/providers/EventProvider';

export function JoinedCountBadge() {
  const { event } = useEventContext();
  const Component = withIcon(({ children, ...props }) => {
    return <div className='flex gap-1 items-center'>{children}</div>;
  });

  return <Component icon={<User size={'14px'} />}>{event.attendance_count}</Component>;
}
