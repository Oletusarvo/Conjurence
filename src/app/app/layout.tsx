import { HeaderProvider } from '@/components/header/HeaderProvider';
import { MainMenuButton } from '@/components/header/MainMenuButton';
import db from '@/dbconfig';
import { UserAttendanceProvider } from '@/features/attendance/providers/UserAttendanceProvider';
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
  const initialAttendanceRecords = await db(db.raw('?? AS p', [tablenames.event_attendance]))
    .leftJoin(
      db.raw('?? AS ps ON ps.id = p.attendance_status_id', [tablenames.event_attendance_status])
    )
    .where({ user_id: session.user.id })
    .select('p.*', 'ps.label as status');

  return (
    <>
      <QueryProvider>
        <UserProvider user={session.user}>
          <ServiceWorkerManager />
          <WindowResizeManager />
          <UserAttendanceProvider initialAttendanceRecords={initialAttendanceRecords}>
            <GeolocationProvider>
              <HeaderProvider>
                <MainMenuButton />
              </HeaderProvider>
              {children}
            </GeolocationProvider>
          </UserAttendanceProvider>
        </UserProvider>
      </QueryProvider>
    </>
  );
}
