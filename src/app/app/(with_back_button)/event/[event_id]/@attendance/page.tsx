import db from '@/dbconfig';
import { getAttendance } from '@/features/attendance/dal/getAttendance';
import { Feed } from '@/features/eventFeed/components/Feed';

export default async function AttendanceSlot({ params }) {
  const { event_id } = await params;
  /**The join requests to initially display. */
  const initialParticipants = await getAttendance(db)
    .where(
      db.raw("event_instance_id = ? AND ejs.label IN ('host', 'verified', 'interested')", [
        event_id,
      ])
    )
    .orderBy('requested_at', 'desc');

  return (
    <Feed
      initialParticipants={initialParticipants}
      eventId={event_id}
    />
  );
}
