import { HeaderProvider } from '@/components/header/header-provider';
import { MainMenuButton } from '@/components/header/main-menu-button';
import db from '@/dbconfig';
import { UserAttendanceProvider } from '@/features/attendance/providers/user-attendance-provider';
import { attendanceService } from '@/features/attendance/services/attendance-service';
import { GeolocationProvider } from '@/features/geolocation/providers/geolocation-provider';
import { NotificationsTrigger } from '@/features/notifications/components/notifications-trigger';
import { NotificationsProvider } from '@/features/notifications/providers/notifications-provider';
import { UserProvider } from '@/features/users/providers/user-provider';
import { TUser } from '@/features/users/schemas/user-schema';
import { ServiceWorkerManager } from '@/managers/service-worker-manager';
import { WindowResizeManager } from '@/managers/window-resize-manager';
import { QueryProvider } from '@/providers/query-provider';
import { loadSession } from '@/util/load-session';
import { Bell } from 'lucide-react';

export const revalidate = 0;

export default async function AppLayout({ children }) {
  const session = (await loadSession()) as { user: TUser };
  const initialAttendanceRecord = await attendanceService.repo.findRecentActiveByUserId(
    session.user.id,
    db
  );

  return (
    <>
      <QueryProvider>
        <UserProvider user={session.user}>
          <NotificationsProvider initialNotifications={[]}>
            <ServiceWorkerManager />
            <WindowResizeManager />
            <GeolocationProvider>
              <UserAttendanceProvider initialAttendanceRecord={initialAttendanceRecord}>
                <HeaderProvider>
                  <NotificationsTrigger />
                  <MainMenuButton />
                </HeaderProvider>
                {children}
              </UserAttendanceProvider>
            </GeolocationProvider>
          </NotificationsProvider>
        </UserProvider>
      </QueryProvider>
    </>
  );
}
