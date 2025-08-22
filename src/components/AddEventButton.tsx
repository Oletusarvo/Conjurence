'use client';

import { useUserAttendanceContext } from '@/features/attendance/providers/UserAttendanceProvider';
import { HighlightLink } from './ui/HighlightLink';
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
