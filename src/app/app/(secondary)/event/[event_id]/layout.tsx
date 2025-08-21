import { EventStatusBadge } from '@/features/events/components/ui/EventStatusBadge';
import { getEvent } from '@/features/events/dal/getEvent';
import db from '@/dbconfig';
import { UserAttendanceStatusManager } from '@/features/attendance/managers/UserAttendanceStatusManager';
import { Suspense } from 'react';
import { Spinner } from '@/components/Spinner';
import { EventProvider } from '@/features/events/providers/EventProvider';
import { ModalStackProvider } from '@/providers/ModalStackProvider';
import { EventActionProvider } from '@/features/events/providers/EventActionProvider';
import { DistanceBadge } from '@/features/distance/components/DistanceBadge';
import { DistanceProvider } from '@/features/distance/providers/DistanceProvider';
import { UserAttendanceManager } from '@/features/attendance/managers/UserAttendanceManager';
import { CategoryBadge } from '@/features/events/components/ui/CategoryBadge';
import { SpotsAvailableBadge } from '@/features/events/components/ui/SpotsAvailableBadge';
import { HostBadge } from '@/features/events/components/HostBadge';
import { DistanceThresholdDisplay } from '@/features/distance/components/DistanceThresholdDisplay';
import { LocationTitleBadge } from '@/features/events/components/ui/LocationTitleBadge';
import { MobileEventBadge } from '@/features/events/components/ui/MobileEventBadge';
import { EventActionButtons } from '@/features/events/components/EventActionButtons';
import { GeolocationMap } from '@/features/geolocation/components/GeolocationMap';
import { AttendanceFeedTrigger } from '@/features/attendance/components/AttendanceFeedTrigger';

export const revalidate = 0;

const getData = async (event_id: string) => {
  const event = await getEvent(db).where({ 'ei.id': event_id }).first();
  return event;
};

export default async function EventPage({ params, attendance }) {
  const { event_id } = await params;
  const event = await getData(event_id);
  if (!event) return <span>Event does not exist!</span>;

  return (
    <EventProvider initialEvent={event}>
      <DistanceProvider>
        <UserAttendanceManager />
        <UserAttendanceStatusManager />
        <EventActionProvider>
          <ModalStackProvider>
            <div className='flex flex-col h-full'>
              <div className='flex flex-col bg-background-light w-full px-default py-4 border-b border-background-light-border'>
                <div className='flex items-start w-full'>
                  <div className='flex flex-col items-start gap-4 w-full'>
                    <div
                      id='event-header'
                      className='flex gap-2 items-start justify-between w-full'>
                      <div className='flex flex-col gap-1'>
                        <div className='flex gap-2'>
                          <h2>{event?.title}</h2>
                        </div>

                        <div className='flex flex-col gap-2'>
                          <HostBadge />
                          <div className='flex gap-2'>
                            <CategoryBadge />
                            <SpotsAvailableBadge />
                            {event.is_mobile && <MobileEventBadge />}
                          </div>
                        </div>
                      </div>{' '}
                      <EventStatusBadge createdAt={event?.created_at} />
                    </div>

                    <p className='tracking-tight leading-[18px]'>{event?.description}</p>
                    <div className='flex w-full justify-between'>
                      <AttendanceFeedTrigger>
                        <div className='flex flex-col w-full flex-1 gap-2 max-h-full overflow-y-scroll'>
                          <Suspense fallback={<AttendanceLoading />}>{attendance}</Suspense>
                        </div>
                      </AttendanceFeedTrigger>

                      <div className='flex gap-2'>
                        <DistanceBadge />
                        <DistanceThresholdDisplay />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className='overflow-hidden flex flex-1 flex-col relative'
                style={{
                  width: '100%',
                }}>
                <GeolocationMap />
                <EventActionButtons />
              </div>

              {/** */}
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
