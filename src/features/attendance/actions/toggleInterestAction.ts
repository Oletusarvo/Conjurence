'use server';

import db from '@/dbconfig';
import { tablenames } from '@/tablenames';
import { loadSession } from '@/util/loadSession';
import { getAttendance } from '../dal/getAttendance';
import { TAttendance } from '../schemas/attendanceSchema';

export async function toggleInterestAction(
  event_id: string
): Promise<ActionResponse<TAttendance, string>> {
  const session = await loadSession();

  const currentParticipationRecord = await db(db.raw('?? AS p', [tablenames.event_attendance]))
    .join(
      db.raw('?? AS ps ON ps.id = p.attendance_status_id', [tablenames.event_attendance_status])
    )
    .where({ user_id: session.user.id, event_instance_id: event_id })
    .select('user_id', 'ps.label as status')
    .orderBy('requested_at')
    .first();

  if (currentParticipationRecord) {
    return {
      success: false,
      error: 'The user has already show interest in the event!',
    };
  }

  const interestCountRecord = await db(tablenames.event_attendance)
    .where({ event_instance_id: event_id })
    .andWhereNot({
      attendance_status_id: db(tablenames.event_attendance_status)
        .where({ label: 'host' })
        .select('id')
        .limit(1),
    })

    .count('* AS count')
    .first();

  await db(tablenames.event_attendance).insert({
    user_id: session.user.id,
    event_instance_id: event_id,
    attendance_status_id: db(tablenames.event_attendance_status)
      .where({ label: 'interested' })
      .select('id')
      .limit(1),
  });

  const newInterestRecord = await getAttendance(db)
    .where({ user_id: session.user.id, event_instance_id: event_id })
    .orderBy('requested_at', 'desc')
    .first();

  const room = `event:${event_id}`;
  global.io.to(room).emit('event:interest', {
    eventId: event_id,
    currentInterestCount: +interestCountRecord.count + 1,
    newInterestRecord,
  });

  return {
    success: true,
    data: newInterestRecord,
  };
}
