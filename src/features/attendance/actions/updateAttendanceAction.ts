'use server';

import db from '@/dbconfig';
import { tablenames } from '@/tablenames';
import { loadSession } from '@/util/loadSession';
import { getAttendance } from '../dal/getAttendance';
import { TAttendance } from '../schemas/attendanceSchema';

/**Updates the attendance record of the currently logged in user on the event with the provided id. */
export async function updateAttendanceAction(
  eventId: string,
  status: string
): Promise<ActionResponse<TAttendance, string>> {
  const session = await loadSession();
  const updatedAttendanceRecord = await db(tablenames.event_attendance)
    .where({ event_instance_id: eventId, user_id: session.user.id })
    .update({
      attendance_status_id: db
        .select('id')
        .from(tablenames.event_attendance_status)
        .where({ label: status })
        .limit(1),
      updated_at: new Date(),
    })
    .then(async () => {
      return (await getAttendance(db)
        .where({ event_instance_id: eventId, user_id: session.user.id })
        .orderBy('requested_at', 'desc')
        .first()) as TAttendance;
    });

  global.io.to(`event:${eventId}`).emit('event:attendance_update', {
    eventId,
    updatedAttendanceRecord,
  });
  return { success: true, data: updatedAttendanceRecord };
}
