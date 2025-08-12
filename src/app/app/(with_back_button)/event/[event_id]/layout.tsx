import { BaseEventModalBody } from '@/features/events/components/BaseEventModalBody';
import { EventStatusBadge } from '@/features/events/components/EventStatusBadge';
import { getEvent } from '@/features/events/dal/getEvent';
import db from '@/dbconfig';
import { loadSession } from '@/util/loadSession';
import { getAttendance } from '@/features/attendance/dal/getAttendance';
import { UserAttendanceStatusManager } from '@/features/attendance/managers/UserAttendanceStatusManager';
import { Suspense } from 'react';
import { Spinner } from '@/components/Spinner';
import { EventProvider } from '@/features/events/providers/EventProvider';
import { ModalStackProvider } from '@/providers/ModalStackProvider';
import { EventActionProvider } from '@/features/events/providers/EventActionProvider';
import { MapPin } from 'lucide-react';
import { DistanceBadge } from '@/features/distance/components/DistanceBadge';
import { DistanceProvider } from '@/features/distance/providers/DistanceProvider';
import { UserAttendanceManager } from '@/features/attendance/managers/UserAttendanceManager';
import { EventActionButton } from '@/features/events/components/EventActionButton';
import { EventAttendanceProvider } from '@/features/attendance/providers/EventAttendanceProvider';
import { JoinedCountBadge } from '@/features/attendance/components/JoinedCountBadge';
import { AttendanceFeed } from '@/features/attendance/components/AttendanceFeed';
import { CategoryBadge } from '@/features/events/components/CategoryBadge';
import { SpotsAvailableBadge } from '@/features/events/components/SpotsAvailableBadge';
import { HostBadge } from '@/features/events/components/HostBadge';
import { ContactHostLink } from '@/features/events/components/ContactHostLink';
import { tablenames } from '@/tablenames';
import { getContact } from '@/features/users/dal/getContact';

export const revalidate = 0;

const getData = async (event_id: string) => {
  const event = await getEvent(db).where({ 'ei.id': event_id }).first();
  return event;
};

export default async function EventPage({ params, attendance }) {
  const { event_id } = await params;
  const event = await getData(event_id);
  if (!event) return <span>Event does not exist!</span>;
  const hostInfo = await getContact(event.host, db);

  console.log(hostInfo);

  return (
    <EventProvider initialEvent={event}>
      <DistanceProvider>
        <UserAttendanceManager />
        <UserAttendanceStatusManager />
        <EventActionProvider>
          <ModalStackProvider>
            <BaseEventModalBody>
              <div className='flex flex-col gap-4 bg-background-light w-full px-default py-4 border-b border-gray-600'>
                <div className='flex items-start px-2 w-full'>
                  <div className='flex flex-col items-start gap-4 w-full'>
                    <div className='flex gap-2 items-center justify-between w-full'>
                      <div className='flex flex-col gap-2'>
                        <h3>{event?.title}</h3>
                        <div className='flex gap-2'>
                          <HostBadge />
                          <ContactHostLink hostInfo={hostInfo} />
                        </div>
                      </div>{' '}
                      <EventStatusBadge createdAt={event?.created_at} />
                    </div>

                    <div className='flex gap-2'>
                      <CategoryBadge />
                      <SpotsAvailableBadge />
                    </div>

                    <p className='tracking-tight leading-[18px]'>{event?.description}</p>
                    <div className='flex gap-4 items-center'>
                      <DistanceBadge />
                      <JoinedCountBadge />
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-col w-full flex-1 px-default gap-2 max-h-full overflow-y-scroll'>
                <Suspense fallback={<AttendanceLoading />}>{attendance}</Suspense>
              </div>
            </BaseEventModalBody>
            <div className='w-full px-default mb-2'>
              <EventActionButton />
            </div>
          </ModalStackProvider>
        </EventActionProvider>
      </DistanceProvider>
    </EventProvider>
  );
}

function AttendanceLoading() {
  return (
    <div className='flex w-full h-full items-center justify-center flex-col'>
      <Spinner />
      <span>Loading feed...</span>
    </div>
  );
}
