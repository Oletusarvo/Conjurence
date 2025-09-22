import db from '@/dbconfig';
import { getAttendance } from '@/features/attendance/dal/get-attendance';
import { AttendanceFeed } from '@/features/attendance/components/attendance-feed';
import { EventAttendanceProvider } from '@/features/attendance/providers/event-attendance-provider';

export default async function AttendanceSlot({ params }) {
  const { event_id } = await params;
  /**The join requests to initially display. */
  const initialAttendanceRecords = await getAttendance(db)
    .whereIn('ejs.label', ['host', 'joined', 'interested', 'left', 'canceled'])
    .andWhere({
      event_instance_id: event_id,
    })
    .orderBy('requested_at', 'desc');

  return (
    <EventAttendanceProvider initialAttendanceRecords={initialAttendanceRecords}>
      <AttendanceFeed />
    </EventAttendanceProvider>
  );
}
