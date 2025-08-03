'use server';

import db from '@/dbconfig';
import { eventDataSchema } from '@/features/events/schemas/eventSchema';
import { tablenames } from '@/tablenames';
import { loadSession } from '@/util/loadSession';

export async function createEventAction(payload: FormData, templateId?: string) {
  const session = await loadSession();
  const oldParticipantRecord = await db(tablenames.event_attendance)
    .where(
      db.raw(
        "user_id = ? AND attendance_status_id IN (SELECT id FROM ?? WHERE label IN ('host', 'verified'))",
        [session.user.id, tablenames.event_attendance_status]
      )
    )
    .select('user_id', 'event_instance_id')
    .first();

  if (oldParticipantRecord) {
    const oldEventRecord = await db(tablenames.event_instance)
      .where({ id: oldParticipantRecord.event_instance_id })
      .select('ended_at')
      .first();
    if (oldEventRecord.ended_at === null) {
      throw new Error('Cannot create an event while hosting or joined to another!');
    }
  }

  const data = Object.fromEntries(payload);
  const parsedData = eventDataSchema.parse(data);
  const trx = await db.transaction();

  let newEventRecord = null;
  if (!templateId) {
    //Not using a template; save new data.
    [newEventRecord] = await trx(tablenames.event_data)
      .insert({
        ...parsedData,
        author_id: session.user.id,
        is_template: parsedData.is_template,
      })
      .returning('id');
  } else {
    //Update the current template.
    await trx(tablenames.event_data)
      .where({ id: templateId })
      .update({
        ...parsedData,
      });
  }

  //Create an event instance for the data.
  const [eventInstanceRecord] = await trx(tablenames.event_instance).insert(
    {
      event_data_id: templateId || newEventRecord.id,
    },
    ['id']
  );

  //Insert the logged in user as the host.
  const requestStatusRecord = await trx(tablenames.event_attendance_status)
    .where({ label: 'host' })
    .select('id')
    .first();

  await trx(tablenames.event_attendance).insert({
    user_id: session.user.id,
    event_instance_id: eventInstanceRecord.id,
    attendance_status_id: requestStatusRecord.id,
  });

  await trx.commit();
  return eventInstanceRecord.id;
}
