'use server';

import db from '@/dbconfig';
import { tablenames } from '@/tablenames';
import { loadSession } from '@/util/load-session';
import { TAttendance } from '../schemas/attendance-schema';
import { attendanceService } from '../services/attendance-service';
import { dispatcher } from '@/features/dispatcher/dispatcher';

/**Updates the attendance record of the currently logged in user on the event with the provided id. */
export async function updateAttendanceAction(
  eventId: string,
  status: string
): Promise<ActionResponse<TAttendance, string>> {
  const session = await loadSession();
  const updatedAttendanceRecord = await attendanceService.repo.updateBy(
    {
      query: { event_instance_id: eventId, user_id: session.user.id },
      payload: {
        attendance_status_id: db
          .select('id')
          .from(tablenames.event_attendance_status)
          .where({ label: status })
          .limit(1),
        updated_at: new Date(),
      },
    },
    db
  );

  dispatcher.dispatch({
    to: `event:${eventId}`,
    message: 'event:attendance_update',
    payload: {
      username: updatedAttendanceRecord.username,
      eventId,
      updatedAttendanceRecord,
    },
  });

  return { success: true, data: updatedAttendanceRecord };
}
