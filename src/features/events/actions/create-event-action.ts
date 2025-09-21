'use server';

import db from '@/dbconfig';
import { TEventError } from '@/features/events/errors/events';

import { tablenames } from '@/tablenames';
import { loadSession } from '@/util/load-session';
import { parseFormDataUsingSchema } from '@/util/parse-form-data-using-schema';
import { getParseResultErrorMessage } from '@/util/get-parse-result-error-message';
import { TAttendance } from '@/features/attendance/schemas/attendance-schema';
import { getAttendance } from '@/features/attendance/dal/get-attendance';

import { createEventSchema } from '../schemas/event-schema';
import { userService } from '@/features/users/services/user-service';
import { eventService } from '../services/event-service';
import { attendanceService } from '@/features/attendance/services/attendance-service';
import { dispatcher } from '@/features/dispatcher/dispatcher';
import { eventTemplateService } from '../services/event-template-service';

/**Creates a new event.
 * @param payload The data for the event.
 * @param templateId An optional id of the template to use. If not provided, creates a new template, otherwise updates the existing one.
 */
export async function createEventAction(
  payload: FormData,
  templateId?: string
): Promise<ActionResponse<TAttendance, TEventError | string>> {
  const session = await loadSession();

  const parseResult = parseFormDataUsingSchema(payload, createEventSchema);
  if (!parseResult.success) {
    return { success: false, error: getParseResultErrorMessage<TEventError>(parseResult) };
  }

  const subscriptionRecord = await userService.repo.getSubscription(session.user.id, db);
  if (!subscriptionRecord) {
    return { success: false, error: 'Failed to load subscription record!' };
  }

  const parsedData = parseResult.data;

  //Prevent mobile events if the subscription disallows it.
  if (parsedData.is_mobile && !subscriptionRecord.allow_mobile_events) {
    return { success: false, error: 'event:mobile_not_allowed' };
  }

  //Prevent adding events of bigger size than allowed by the subscription.
  if (subscriptionRecord) {
    const eventSizeRecord = await db(tablenames.event_threshold)
      .where({ label: parsedData.size })
      .select('id')
      .first();
    if (subscriptionRecord.maximum_event_size_id > eventSizeRecord.id) {
      return { success: false, error: 'event:size_not_allowed' };
    }
  }

  //Prevent creation of events if already hosting or joined to another.
  if (await isAttending(session)) {
    return { success: false, error: 'event:single_attendance' };
  }

  const trx = await db.transaction();
  try {
    const eventInstanceRecord = await eventService.repo.create(
      {
        ...parsedData,
        author_id: session.user.id,
      },
      trx
    );

    if (parsedData.is_template) {
      await eventTemplateService.repo.create(
        {
          ...parsedData,
          author_id: session.user.id,
        },
        trx
      );
    }

    const attendance = await attendanceService.repo.create(
      {
        user_id: session.user.id,
        event_instance_id: eventInstanceRecord.id,
        status: 'host',
      },
      trx
    );

    await trx.commit();

    return {
      success: true,
      data: attendance,
    };
  } catch (err) {
    console.log(err.message);
    await trx.rollback();
    throw err;
  }
}

async function isAttending(session: TODO) {
  const currentAttendanceRecord = await db(tablenames.event_attendance)
    .whereIn(
      'attendance_status_id',
      db
        .select('id')
        .from(tablenames.event_attendance_status)
        .whereIn('label', ['host', 'joined', 'interested'])
    )
    .andWhere({ user_id: session.user.id })
    .select('user_id', 'event_instance_id')
    .orderBy('requested_at', 'desc')
    .first();

  if (currentAttendanceRecord) {
    const oldEventRecord = await db(tablenames.event_instance)
      .where({ id: currentAttendanceRecord.event_instance_id })
      .select('ended_at')
      .first();

    if (oldEventRecord.ended_at === null) {
      return true;
    }
  }
  return false;
}
