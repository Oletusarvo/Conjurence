'use server';

import db from '@/dbconfig';
import { eventDataSchema, eventInstanceSchema } from '../schemas/event-schema';
import { parseFormDataUsingSchema } from '@/util/parse-form-data-using-schema';
import { getParseResultErrorMessage } from '@/util/get-parse-result-error-message';
import { TEventError } from '@/errors/events';
import { createGeographyRow } from '@/features/geolocation/util/create-geography-row';
import { eventService } from '../services/event-service';

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
    const data = parsedDataResult.data;
    await eventService.repo.updateDataByInstanceId(data.id, data, trx);

    const position = JSON.parse(parsedInstanceResult.data.position);
    await eventService.repo.updateInstanceById(
      data.id,
      {
        ...parsedInstanceResult.data,
        position: createGeographyRow(position),
      },
      trx
    );

    await trx.commit();
    return { success: true };
  } catch (err) {
    await trx.rollback();
    console.log(err.message);
    return { success: false };
  }
}
