'use server';

import db from '@/dbconfig';
import { tablenames } from '@/tablenames';
import { loadSession } from '@/util/loadSession';
import z from 'zod';

/**Ends an event, deleting it.
 * @event_id The instance id of the event to delete. If the data for the instance is a template, only the instance is deleted.
 */

export async function endEventAction(event_id: string): Promise<ActionResponse<void, string>> {
  z.uuid().parse(event_id);

  //Only allow the host to end the event.
  const session = await loadSession();
  const eventRecord = await db(tablenames.event_instance)
    .where({ id: event_id })
    .select('id', 'ended_at', 'event_data_id')
    .first();

  if (!eventRecord) {
    return {
      success: false,
      error: 'Event does not exist!',
    };
  }

  if (eventRecord.ended_at) {
    //throw new Error('Event has already ended!');
  }

  const hostParticipantRecord = await db(tablenames.event_attendance)
    .where({
      user_id: session.user.id,
      attendance_status_id: db
        .select('id')
        .from(tablenames.event_attendance_status)
        .where({ label: 'host' })
        .limit(1),
    })

    .select('user_id');

  if (!hostParticipantRecord) {
    return {
      success: false,
      error: 'Only the host of an event can end it!',
    };
  }

  const eventDataRecord = await db(tablenames.event_data)
    .where({ id: eventRecord.event_data_id })
    .select('is_template')
    .first();

  if (eventDataRecord.is_template) {
    //Delete the instance only.
    await db(tablenames.event_instance).where({ id: eventRecord.id }).del();
  } else {
    //Delete the data, cascading to the instance.
    await db(tablenames.event_data).where({ id: eventRecord.event_data_id }).del();
  }

  /*
  await db(tablenames.event_instance).where({ id: eventRecord.id }).update({
    ended_at: new Date(),
  });

  
  global.io.to('user:' + session.user.id).emit('event_ended')*/
  global.io.to('event:' + event_id).emit('event:end', { eventId: event_id });
  return { success: true };
}
