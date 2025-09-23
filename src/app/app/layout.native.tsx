'use client';

import { HeaderProvider } from '@/components/header/header-provider';
import { MainMenuButton } from '@/components/header/main-menu-button';
import { Spinner } from '@/components/ui/spinner-temp';
import { UserAttendanceProvider } from '@/features/attendance/providers/user-attendance-provider';
import { GeolocationProvider } from '@/features/geolocation/providers/geolocation-provider';
import { NotificationsProvider } from '@/features/notifications/providers/notifications-provider';
import { UserProvider } from '@/features/users/providers/user-provider';
import { networkConfig } from '@/network.config';
import { AppProvider } from '@/providers/app-provider';
import { QueryProvider } from '@/providers/query-provider';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { useSession } from 'next-auth/react';
import { redirect } from 'next/navigation';

export default function ClientAppLayout({ children }) {
  const { data: session, status } = useSession();
  if (status === 'unauthenticated') {
    return redirect('/login');
  }

  const {
    data: initialAttendanceRecord,
    isPending,
    isError,
  } = useQuery({
    queryKey: ['initial-attendance'],
    queryFn: async () => {
      const res = await axios.get(`${networkConfig.api}/attendance`);
      if (res.status === 200) {
        return res.data;
      }
      throw new Error('Failed to fetch initial attendance!');
    },
  });

  return status === 'loading' || isPending ? (
    <Spinner />
  ) : (
    <AppProvider>
      <UserProvider user={session.user as any}>
        <NotificationsProvider initialNotifications={[]}>
          <GeolocationProvider>
            <UserAttendanceProvider initialAttendanceRecord={initialAttendanceRecord}>
              <HeaderProvider>
                <MainMenuButton />
              </HeaderProvider>
              {children}
            </UserAttendanceProvider>
          </GeolocationProvider>
        </NotificationsProvider>
      </UserProvider>
    </AppProvider>
  );
}
