'use client';

import { useUserAttendanceContext } from '@/features/attendance/providers/user-attendance-provider';
import { EventActionButton } from './event-action-button';
import Link from 'next/link';
import { ToggleProvider } from '@/providers/toggle-provider';
import { EventActionDialog } from './event-action-dialog';

export function EventControlBar() {
  const { attendanceRecord } = useUserAttendanceContext();
  return (
    <ToggleProvider>
      <div className='flex gap-2 w-full px-default items-center bottom-0 z-10 py-2 absolute'>
        {!attendanceRecord ||
        !['joined', 'interested', 'host'].includes(attendanceRecord.status) ? (
          <Link
            href='/app/feed'
            className='w-full shadow-md'>
            <button className='--contained --secondary --full-width'>Back To Feed</button>
          </Link>
        ) : null}
        <ToggleProvider.Trigger>
          <EventActionButton />
        </ToggleProvider.Trigger>
      </div>

      <ToggleProvider.Target>
        <EventActionDialog />
      </ToggleProvider.Target>
    </ToggleProvider>
  );
}
