'use client';

import { useUserAttendanceContext } from '@/features/attendance/providers/user-attendance-provider';
import { JoinDistanceBadge } from './join-distance-badge';
import { LeaveDistanceBadge } from './leave-distance-badge';

/**Displays a JoinDistanceBadge if the user has not joined the event; a LeaveDistanceBadge otherwise. */
export function DistanceThresholdDisplay() {
  const { attendanceRecord } = useUserAttendanceContext();

  return attendanceRecord?.status === 'interested' ? (
    <JoinDistanceBadge />
  ) : attendanceRecord?.status === 'joined' || attendanceRecord?.status === 'host' ? (
    <LeaveDistanceBadge />
  ) : null;
}
