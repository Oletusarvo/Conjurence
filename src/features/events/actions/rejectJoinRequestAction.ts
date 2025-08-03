'use server';

import { getAttendance } from '@/features/attendance/dal/getAttendance';
import db from '@/dbconfig';
import { tablenames } from '@/tablenames';
import { loadSession } from '@/util/loadSession';
import z from 'zod';

export async function rejectJoinRequestAction(event_id: string, user_id: string) {
  z.uuid().parse(event_id);
  z.uuid().parse(user_id);

  const session = await loadSession();
  const sessionParticipantRecord = await getAttendance(db)
    .where({ user_id: session.user.id, event_id })
    .first();
  if (!sessionParticipantRecord) {
    throw new Error('User is not participated in the event; cannot proceed with reject!');
  }

  if (sessionParticipantRecord.status !== 'host') {
    throw new Error('Only the host of an event can reject join requests!');
  }

  const rejecteeParticipantRecord = await getAttendance(db).where({ event_id, user_id }).first();
  if (!rejecteeParticipantRecord) {
    throw new Error('The user to be rejected is not participated in the event!');
  }

  if (rejecteeParticipantRecord.status !== 'pending') {
    throw new Error('Only pending join requests can be rejected!');
  }

  const rejectedStatusRecord = await db(tablenames.event_attendance_status)
    .where({ label: 'rejected' })
    .select('id')
    .first();

  const left_at = new Date();
  await db(tablenames.event_attendance).where({ user_id, event_id }).update({
    event_participant_status_id: rejectedStatusRecord.id,
    left_at,
  });

  global.io.to('room:' + event_id).emit('attendance_rejected', {
    user_id,
  });
}
