'use client';

import { useUserAttendanceContext } from '@/features/attendance/providers/user-attendance-provider';
import { useEventContext } from '../../events/providers/event-provider';
import { useToggle } from '@/hooks/use-toggle';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge-temp';

/**Renders a star-icon with the current interest count on an event. */
export function InterestedCountBadge({ ...props }) {
  const { interestCount } = useEventContext();
  const { attendanceRecord } = useUserAttendanceContext();
  const thisEventParticipation = attendanceRecord;
  const selected = !!thisEventParticipation;

  const isHost = thisEventParticipation?.status === 'host';

  return (
    <Badge
      icon={props => (
        <Star
          {...props}
          fill={isHost ? 'var(--color-green-500)' : selected ? 'var(--color-accent)' : null}
        />
      )}>
      {interestCount}
    </Badge>
  );
}
