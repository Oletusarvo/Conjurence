'use server';

import db from '@/dbconfig';
import { tablenames } from '@/tablenames';
import { loadSession } from '@/util/load-session';
import { TAttendance } from '../schemas/attendance-schema';
import { updateAttendanceAction } from './update-attendance-action';
import { attendanceService } from '../services/attendance-service';
import { eventService } from '@/features/events/services/event-service';
import { dispatcher } from '@/features/dispatcher/dispatcher';

/**Creates a new interested-attendance record on the database. If a record already exists for the logged in user on the event with the provided id, updateAttendanceAction is called instead. */
export async function createAttendanceAction(
  event_id: string,
  status: 'interested'
): Promise<ActionResponse<TAttendance, string>> {
  const session = await loadSession();
  const currentAttendanceRecord = await attendanceService.repo
    .findBy({ user_id: session.user.id, event_instance_id: event_id }, db)
    .first();

  if (currentAttendanceRecord) {
    return await updateAttendanceAction(event_id, status);
  }

  const newAttendanceRecord = await attendanceService.repo.create(
    {
      user_id: session.user.id,
      event_instance_id: event_id,
      status,
    },
    db
  );

  const interestCount = await eventService.repo.countInterestedById(event_id, db);

  console.log(newAttendanceRecord);
  dispatcher.dispatch({
    to: `event:${event_id}`,
    message: 'event:interest',
    payload: {
      username: session.user.username,
      eventId: event_id,
      currentInterestCount: interestCount,
      newAttendanceRecord,
    },
  });

  return {
    success: true,
    data: newAttendanceRecord,
  };
}
