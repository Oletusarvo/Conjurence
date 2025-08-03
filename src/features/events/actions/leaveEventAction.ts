'use server';

import { getAttendance } from '@/features/attendance/dal/getAttendance';
import db from '@/dbconfig';
import { tablenames } from '@/tablenames';
import z from 'zod';

export async function leaveEventAction(event_id: string, user_id: string) {
  z.uuid().parse(event_id);
  z.uuid().parse(user_id);

  const currentParticipantRecord = await getAttendance(db).where({ user_id, event_id }).first();
  if (!currentParticipantRecord) {
    throw new Error('User is not participated in any event!');
  }

  if (currentParticipantRecord.status !== 'joined') {
    throw new Error('Cannot leave an event if not joined, or being the host of it!');
  }

  //Update the participant record to "left".
  const statusRecord = await db(tablenames.event_attendance_status)
    .where({ label: 'left' })
    .select('id')
    .first();

  await db(tablenames.event_attendance).where({ event_id, user_id }).update({
    event_participant_status_id: statusRecord.id,
  });

  const currentParticipants = await getAttendance(db).where({ event_id });
  global.io.to(`event:${event_id}`).emit('attendance_update', currentParticipants);
}
