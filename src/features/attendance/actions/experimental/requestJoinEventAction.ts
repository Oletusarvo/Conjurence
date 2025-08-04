'use server';

import { getAttendance } from '@/features/attendance/dal/getAttendance';
import db from '@/dbconfig';
import { tablenames } from '@/tablenames';
import { loadSession } from '@/util/loadSession';
import z from 'zod';

export async function requestJoinEventAction(eventId: string) {
  z.uuid().parse(eventId);

  const session = await loadSession();

  const event = await db(tablenames.event_instance)
    .where({ id: eventId })
    .select('created_at', 'ended_at')
    .first();

  if (!event) {
    throw new Error('Event does not exist!');
  }

  if (event.ended_at !== null) {
    throw new Error('Event has ended!');
  }

  const currentParticipantRecord = await getAttendance(db)
    .where({
      event_instance_id: eventId,
      user_id: session.user.id,
    })
    .first();

  if (
    currentParticipantRecord &&
    currentParticipantRecord.status !== 'left' &&
    currentParticipantRecord.status !== 'canceled'
  ) {
    throw new Error('Cannot request to join at this time!');
  }

  try {
    const statusRecord = await db(tablenames.event_attendance_status)
      .where({ label: 'pending' })
      .select('id')
      .first();

    await db(tablenames.event_attendance)
      .insert(
        {
          user_id: session.user.id,
          event_instance_id: eventId,
          event_participant_status_id: statusRecord.id,
          requested_at: new Date(),
          left_at: null,
        },
        ['user_id', 'event_id']
      )
      .onConflict(['event_id', 'user_id'])
      .merge(['attendance_status_id', 'requested_at', 'left_at']);

    global.io.to(`event:${eventId}`).emit('attendance_update');
    global.io.to(`user:${session.user.id}`).emit('attendace_request');
  } catch (err: any) {
    const msg = err.message.toLowerCase() as string;
    if (msg.includes('duplicate') || msg.includes('unique')) {
      throw new Error('Already requested a join!');
    } else {
      throw err;
    }
  }
}
