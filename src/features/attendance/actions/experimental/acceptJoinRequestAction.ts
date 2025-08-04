'use server';

import { getAttendance } from '@/features/attendance/dal/getAttendance';
import db from '@/dbconfig';
import { tablenames } from '@/tablenames';
import { loadSession } from '@/util/loadSession';
import z from 'zod';

export async function acceptJoinRequestAction(event_id: string, user_id: string) {
  //Make sure the event_id and user_id are uuids.
  z.uuid().parse(event_id);
  z.uuid().parse(user_id);

  const session = await loadSession();
  const userParticipantRecord = await getAttendance(db).where({ user_id: session.user.id }).first();

  if (!userParticipantRecord) {
    throw new Error('The logged in user is not a participant of the event; cannot accept others!');
  }

  if (userParticipantRecord.event_id === event_id && userParticipantRecord.status !== 'host') {
    throw new Error('Only the host of an event can accept join requests!');
  }

  const currentParticipantRecord = await getAttendance(db).where({ event_id, user_id }).first();
  if (!currentParticipantRecord) {
    throw new Error('User is not participating in an event; cannot accept join!');
  }

  if (currentParticipantRecord.status !== 'pending') {
    throw new Error('Can only accept participants with status pending!');
  }

  const statusRecord = await db(tablenames.event_attendance_status)
    .where({ label: 'accepted' })
    .select('id')
    .first();

  await db(tablenames.event_attendance).where({ event_id, user_id }).update({
    event_participant_status_id: statusRecord.id,
  });

  global.io.to(`event:${event_id}`).emit('attendance_update');
  global.io.to(`event:${event_id}`).emit('attendance_accepted', { user_id });
  global.io.to('user:' + user_id).emit('attendance_accepted');
}
