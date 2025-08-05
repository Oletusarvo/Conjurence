import { HeaderProvider } from '@/components/header/HeaderProvider';
import { MainMenuButton } from '@/components/header/MainMenuButton';
import db from '@/dbconfig';
import { EventAttendanceProvider } from '@/features/attendance/providers/AttendanceProvider';
import { UserProvider } from '@/features/users/providers/UserProvider';
import { TUser } from '@/features/users/schemas/userSchema';
import { ModalStackProvider } from '@/providers/ModalStackProvider';
import { QueryProvider } from '@/providers/QueryProvider';
import { tablenames } from '@/tablenames';
import { loadSession } from '@/util/loadSession';
import { redirect } from 'next/navigation';

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
    <QueryProvider>
      <UserProvider user={session.user}>
        <EventAttendanceProvider initialAttendanceRecords={initialAttendanceRecords}>
          <HeaderProvider>
            <MainMenuButton />
          </HeaderProvider>
          {children}
        </EventAttendanceProvider>
      </UserProvider>
    </QueryProvider>
  );
}
