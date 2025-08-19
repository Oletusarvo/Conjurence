import { HeaderProvider } from '@/components/header/HeaderProvider';
import { MainMenuButton } from '@/components/header/MainMenuButton';
import db from '@/dbconfig';
import { getAttendance } from '@/features/attendance/dal/getAttendance';
import { UserAttendanceManager } from '@/features/attendance/managers/UserAttendanceManager';
import { UserAttendanceProvider } from '@/features/attendance/providers/UserAttendanceProvider';
import { DistanceProvider } from '@/features/distance/providers/DistanceProvider';
import { getEvent } from '@/features/events/dal/getEvent';
import { EventProvider } from '@/features/events/providers/EventProvider';
import { GeolocationProvider } from '@/features/geolocation/providers/GeolocationProvider';
import { UserProvider } from '@/features/users/providers/UserProvider';
import { TUser } from '@/features/users/schemas/userSchema';
import { ServiceWorkerManager } from '@/managers/ServiceWorkerManager';
import { WindowResizeManager } from '@/managers/WindowResizeManager';
import { QueryProvider } from '@/providers/QueryProvider';
import { tablenames } from '@/tablenames';
import { loadSession } from '@/util/loadSession';

export const revalidate = 0;

export default async function AppLayout({ children }) {
  const session = (await loadSession()) as { user: TUser };

  const [initialAttendanceRecord, attendedEvent] = await getAttendance(db)
    .whereIn(
      'attendance_status_id',
      db
        .select('id')
        .from(tablenames.event_attendance_status)
        .whereIn('label', ['joined', 'interested', 'host'])
    )
    .where({
      user_id: session.user.id,
      event_ended_at: null,
    })
    .orderBy('requested_at', 'desc')
    .first()
    .then(async attendanceRecord => {
      const attendedEvent = attendanceRecord
        ? await getEvent(db)
            .where({ 'e.id': attendanceRecord.event_instance_id, ended_at: null })
            .first()
        : null;
      return [attendanceRecord || null, attendedEvent];
    });

  return (
    <>
      <QueryProvider>
        <UserProvider user={session.user}>
          <ServiceWorkerManager />
          <WindowResizeManager />
          <GeolocationProvider>
            <UserAttendanceProvider initialAttendanceRecord={initialAttendanceRecord}>
              <HeaderProvider>
                <MainMenuButton />
              </HeaderProvider>
              {children}
            </UserAttendanceProvider>
          </GeolocationProvider>
        </UserProvider>
      </QueryProvider>
    </>
  );
}
