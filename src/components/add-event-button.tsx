'use client';

import { useUserAttendanceContext } from '@/features/attendance/providers/user-attendance-provider';
import { HighlightLink } from './ui/highlight-link';
import { Calendar, Plus } from 'lucide-react';

export function AddEventButton() {
  const { attendanceRecord } = useUserAttendanceContext();

  return attendanceRecord ? (
    <HighlightLink href={`/app/event/${attendanceRecord.event_instance_id}`}>
      <Calendar />
    </HighlightLink>
  ) : (
    <HighlightLink href='/app/event/create'>
      <Plus />
    </HighlightLink>
  );
}
