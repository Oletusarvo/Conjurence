'use server';

import { getAttendance } from '@/features/attendance/dal/getAttendance';
import db from '@/dbconfig';
import { tablenames } from '@/tablenames';
import z from 'zod';

export async function cancelJoinRequestAction(user_id: string, event_id: string) {
  z.uuid().parse(event_id);
  z.uuid().parse(user_id);

  const currentParticipantRecord = await getAttendance(db).where({ user_id, event_id }).first();
  if (!currentParticipantRecord) {
    throw new Error('User is not participating in an event; cannot cancel!');
  }

  console.log(currentParticipantRecord.status);
  if (
    currentParticipantRecord.status !== 'pending' &&
    currentParticipantRecord.status !== 'accepted'
  ) {
    throw new Error('Can only cancel a pending participation!');
  }

  const statusRecord = await db(tablenames.event_attendance_status)
    .where({ label: 'canceled' })
    .select('id')
    .first();

  await db(tablenames.event_attendance).where({ user_id, event_id }).update({
    event_participant_status_id: statusRecord.id,
  });

  const cp = await getAttendance(db).where({ event_id });

  global.io.to(`event:${event_id}`).emit('attendance_update');
  global.io.to('event:' + event_id).emit('attendance_canceled', { user_id });
  global.io.to('user:' + user_id).emit('attendance_canceled');
}
