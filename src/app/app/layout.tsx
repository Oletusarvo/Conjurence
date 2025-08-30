import { HeaderProvider } from '@/components/header/header-provider';
import { MainMenuButton } from '@/components/header/main-menu-button';
import db from '@/dbconfig';
import { getAttendance } from '@/features/attendance/dal/get-attendance';
import { UserAttendanceManager } from '@/features/attendance/managers/user-attendance-manager';
import { UserAttendanceProvider } from '@/features/attendance/providers/user-attendance-provider';
import { DistanceProvider } from '@/features/distance/providers/distance-provider';
import { getEvent } from '@/features/events/dal/get-event';
import { EventProvider } from '@/features/events/providers/event-provider';
import { GeolocationProvider } from '@/features/geolocation/providers/geolocation-provider';
import { UserProvider } from '@/features/users/providers/user-provider';
import { TUser } from '@/features/users/schemas/user-schema';
import { ServiceWorkerManager } from '@/managers/service-worker-manager';
import { WindowResizeManager } from '@/managers/window-resize-manager';
import { QueryProvider } from '@/providers/query-provider';
import { tablenames } from '@/tablenames';
import { loadSession } from '@/util/load-session';

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
