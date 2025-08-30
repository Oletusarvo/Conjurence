'use server';

import db from '@/dbconfig';
import { eventDataSchema, eventInstanceSchema, TEvent } from '../schemas/event-schema';
import { tablenames } from '@/tablenames';
import { parseFormDataUsingSchema } from '@/util/parse-form-data-using-schema';
import { getParseResultErrorMessage } from '@/util/get-parse-result-error-message';
import { TEventError } from '@/errors/events';
import { createGeographyRow } from '@/features/geolocation/util/create-geography-row';

export async function updateEventAction(payload: FormData) {
  const parsedDataResult = parseFormDataUsingSchema(payload, eventDataSchema);
  if (!parsedDataResult.success) {
    return getParseResultErrorMessage<TEventError>(parsedDataResult);
  }
  const parsedInstanceResult = parseFormDataUsingSchema(payload, eventInstanceSchema);
  if (!parsedInstanceResult.success) {
    return getParseResultErrorMessage<TEventError>(parsedInstanceResult);
  }

  const trx = await db.transaction();
  try {
    await trx(tablenames.event_data).update({
      ...parsedDataResult.data,
    });

    const position = JSON.parse(parsedInstanceResult.data.position);
    await trx(tablenames.event_instance).update({
      ...parsedInstanceResult.data,
      position: createGeographyRow(position),
    });
    await trx.commit();
    return { success: true };
  } catch (err) {
    await trx.rollback();
    console.log(err.message);
    return { success: false };
  }
}
