'use client';

import { useUserAttendanceContext } from '@/features/attendance/providers/UserAttendanceProvider';
import { EventActionButton } from './EventActionButton';
import Link from 'next/link';

export function EventActionButtons() {
  const { attendanceRecord } = useUserAttendanceContext();

  return (
    <div className='flex gap-2 w-full px-default mb-2 items-center'>
      {!attendanceRecord || !['joined', 'interested', 'host'].includes(attendanceRecord.status) ? (
        <Link
          href='/app/feed'
          className='w-full'>
          <button className='--outlined --secondary --full-width'>Back To Feed</button>
        </Link>
      ) : null}
      <EventActionButton />
    </div>
  );
}
