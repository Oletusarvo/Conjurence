'use client';

import { User } from 'lucide-react';
import { withIcon } from '@/hoc/withIcon';
import { useEventAttendanceContext } from '../providers/EventAttendanceProvider';
import { useEventContext } from '@/features/events/providers/EventProvider';
import { Badge } from '@/components/ui/Badge';

/**Renders a user-icon with the current attendant-count on an event. */
export function JoinedCountBadge() {
  const { event } = useEventContext();
  const Component = withIcon(({ children, ...props }) => {
    return <div className='flex gap-1 items-center'>{children}</div>;
  });

  return <Badge icon={props => <User {...props} />}>{event.attendance_count}</Badge>;
}
