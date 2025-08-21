'use client';

import { useUserAttendanceContext } from '@/features/attendance/providers/UserAttendanceProvider';
import { JoinDistanceBadge } from './JoinDistanceBadge';
import { LeaveDistanceBadge } from './LeaveDistanceBadge';

/**Displays a JoinDistanceBadge if the user has not joined the event; a LeaveDistanceBadge otherwise. */
export function DistanceThresholdDisplay() {
  const { attendanceRecord } = useUserAttendanceContext();

  return attendanceRecord?.status === 'interested' ? (
    <JoinDistanceBadge />
  ) : attendanceRecord?.status === 'joined' || attendanceRecord?.status === 'host' ? (
    <LeaveDistanceBadge />
  ) : null;
}
