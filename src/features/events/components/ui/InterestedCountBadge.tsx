'use client';

import { useUserAttendanceContext } from '@/features/attendance/providers/UserAttendanceProvider';
import { useEventContext } from '../../providers/EventProvider';
import { useToggle } from '@/hooks/useToggle';
import { Star } from 'lucide-react';
import { Badge } from '@/components/Badge';

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
