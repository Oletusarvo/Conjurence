'use server';

import db from '@/dbconfig';
import { EventError, TEventError } from '@/errors/events';
import { eventDataSchema } from '@/features/events/schemas/eventSchema';
import { tablenames } from '@/tablenames';
import { createGeographyRow } from '@/util/geolocation/createGeographyRow';
import { loadSession } from '@/util/loadSession';

/**Creates a new event.
 * @param payload The data for the event.
 * @param templateId An optional id of the template to use. If not provided, creates a new template, otherwise updates the existing one.
 */
export async function createEventAction(
  payload: FormData,
  templateId?: string
): Promise<ActionResponse<string, TEventError>> {
  const session = await loadSession();
  const data = Object.fromEntries(payload);

  const parseResult = eventDataSchema.safeParse(data);
  if (!parseResult.success) {
    const msg = parseResult.error.issues.at(0)?.message as TEventError;
    return { success: false, error: msg };
  }

  const parsedData = parseResult.data;

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
        return {
          success: false,
          error: EventError.maximumTemplateCount,
        };
      }
    }
  }

  const oldParticipantRecord = await db(tablenames.event_attendance)
    .whereIn(
      'attendance_status_id',
      db
        .select('id')
        .from(tablenames.event_attendance_status)
        .whereIn('label', ['host', 'verified'])
    )
    .andWhere({ user_id: session.user.id })
    .select('user_id', 'event_instance_id')
    .first();

  if (oldParticipantRecord) {
    const oldEventRecord = await db(tablenames.event_instance)
      .where({ id: oldParticipantRecord.event_instance_id })
      .select('ended_at')
      .first();

    if (oldEventRecord.ended_at === null) {
      return {
        success: false,
        error: EventError.singleAttendance,
      };
    }
  }

  const trx = await db.transaction();

  try {
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
          is_template: parsedData.is_template,
        });
    }

    const location = JSON.parse(data.location.toString());
    const [eventInstanceRecord] = await trx(tablenames.event_instance).insert(
      {
        event_data_id: templateId || newEventRecord.id,
        position: createGeographyRow(location.coords),
        position_accuracy: location.coords.accuracy,
      },
      ['id']
    );

    await trx(tablenames.event_attendance).insert({
      user_id: session.user.id,
      event_instance_id: eventInstanceRecord.id,
      attendance_status_id: db(tablenames.event_attendance_status)
        .where({ label: 'host' })
        .select('id')
        .limit(1),
    });

    await trx.commit();
    return {
      success: true,
      data: eventInstanceRecord.id,
    };
  } catch (err) {
    console.log(err.message);
    await trx.rollback();
    throw err;
  }
}
