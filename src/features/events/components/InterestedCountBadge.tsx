'use client';

import { useUserAttendanceContext } from '@/features/attendance/providers/UserAttendanceProvider';
import { useEventContext } from '../providers/EventProvider';
import { useToggle } from '@/hooks/useToggle';
import { Star } from 'lucide-react';

export function InterestedCountBadge({ ...props }) {
  const { interestCount } = useEventContext();
  const { attendanceRecord } = useUserAttendanceContext();
  const thisEventParticipation = attendanceRecord;
  const selected = !!thisEventParticipation;

  const isHost = thisEventParticipation?.status === 'host';

  return (
    <div className='flex gap-2 items-center'>
      <Star
        size={'14px'}
        fill={isHost ? 'var(--color-green-500)' : selected ? 'var(--color-accent)' : null}
      />
      <span>{interestCount}</span>
    </div>
  );
}
