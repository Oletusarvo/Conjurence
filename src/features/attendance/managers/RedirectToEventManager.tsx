'use client';

import { redirect, usePathname } from 'next/navigation';
import { useUserAttendanceContext } from '../providers/UserAttendanceProvider';
import { useEffect } from 'react';
import toast from 'react-hot-toast';

export function RedirectToEventManager() {
  const pathname = usePathname();
  const { attendanceRecords } = useUserAttendanceContext();
  const anchoringAttendance = attendanceRecords.find(
    r => ['joined', 'interested', 'host'].includes(r.status) && !r.event_ended
  );

  useEffect(() => {
    if (anchoringAttendance) {
      const anchoredUrl = `/app/event/${anchoringAttendance.event_instance_id}`;
      if (pathname !== anchoredUrl) {
        toast.error(
          "You cannot leave the event-screen while you're joined, interested or hosting!"
        );
        return redirect(anchoredUrl);
      }
    }
  });

  return null;
}
