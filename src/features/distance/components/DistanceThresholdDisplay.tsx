'use client';

import { useUserAttendanceContext } from '@/features/attendance/providers/UserAttendanceProvider';
import { useEventContext } from '@/features/events/providers/EventProvider';
import { JoinDistanceBadge } from './JoinDistanceBadge';
import { LeaveDistanceBadge } from './LeaveDistanceBadge';

/**Displays a JoinDistanceBadge if the user has not joined the event; a LeaveDistanceBadge otherwise. */
export function DistanceThresholdDisplay() {
  const { event } = useEventContext();
  const { attendanceRecord } = useUserAttendanceContext();

  return attendanceRecord?.status === 'interested' ? <JoinDistanceBadge /> : <LeaveDistanceBadge />;
}
