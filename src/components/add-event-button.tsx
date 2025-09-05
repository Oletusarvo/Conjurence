'use client';

import { useUserAttendanceContext } from '@/features/attendance/providers/user-attendance-provider';
import { HighlightLink } from './ui/highlight-link';
import { Calendar, Plus } from 'lucide-react';
import { RoundButton } from './ui/round-button';

/**@deprecated */
export function AddEventButton() {
  const { attendanceRecord } = useUserAttendanceContext();
  console.log(attendanceRecord);

  return attendanceRecord ? (
    <HighlightLink href={`/app/event/${attendanceRecord.event_instance_id}`}>
      <Calendar />
    </HighlightLink>
  ) : (
    <HighlightLink href='/app/event/create'>
      <RoundButton>
        <Plus />
      </RoundButton>
    </HighlightLink>
  );
}
