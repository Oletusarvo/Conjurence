'use server';

import db from '@/dbconfig';
import { eventDataSchema } from '@/features/events/schemas/eventSchema';
import { tablenames } from '@/tablenames';
import { loadSession } from '@/util/loadSession';

/**Creates a new event.
 * @param payload The data for the event.
 * @param templateId An optional id of the template to use. If not provided, creates a new template, otherwise updates the existing one.
 */
export async function createEventAction(payload: FormData, templateId?: string) {
  const session = await loadSession();
  const data = Object.fromEntries(payload);
  const parsedData = eventDataSchema.parse(data);

  //Prevent adding more templates than allowed
  if (parsedData.is_template) {
    const maxTemplateCount = process.env.MAX_TEMPLATE_COUNT;
    if (maxTemplateCount) {
      const currentTemplateCountRecord = await db(tablenames.event_data)
        .where({ author_id: session.user.id, is_template: true })
        .count('* AS count')
        .first();
      if (
        currentTemplateCountRecord &&
        +currentTemplateCountRecord.count >= parseInt(maxTemplateCount)
      ) {
        throw new Error('Maximum template count exceeded!');
      }
    }
  }

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
