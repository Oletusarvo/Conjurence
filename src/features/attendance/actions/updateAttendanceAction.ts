'use server';

import db from '@/dbconfig';
import { tablenames } from '@/tablenames';
import { loadSession } from '@/util/loadSession';

export async function updateAttendanceAction(
  eventId: string,
  status: string
): Promise<ActionResponse<void, string>> {
  const session = await loadSession();
  await db(tablenames.event_attendance)
    .where({ event_instance_id: eventId, user_id: session.user.id })
    .update({
      attendance_status_id: db
        .select('id')
        .from(tablenames.event_attendance_status)
        .where({ label: status })
        .limit(1),
      updated_at: new Date(),
    });

  global.io.to(`event:${eventId}`).emit('event:attendance_update', {
    eventId,
    newAttendanceRecord: { username: session.user.username, status },
  });
  return { success: true };
}
