import { EventStatusBadge } from '@/features/events/components/ui/event-status-badge';
import { getEvent } from '@/features/events/dal/get-event';
import db from '@/dbconfig';
import { UserAttendanceStatusManager } from '@/features/attendance/managers/user-attendance-status-manager';
import { Suspense } from 'react';
import { Spinner } from '@/components/ui/spinner-temp';
import { EventProvider } from '@/features/events/providers/event-provider';
import { ModalStackProvider } from '@/providers/modal-stack-provider';
import { EventActionProvider } from '@/features/events/providers/event-action-provider';
import { DistanceBadge } from '@/features/distance/components/distance-badge';
import { DistanceProvider } from '@/features/distance/providers/distance-provider';
import { UserAttendanceManager } from '@/features/attendance/managers/user-attendance-manager';
import { CategoryBadge } from '@/features/events/components/ui/category-badge';
import { SpotsAvailableBadge } from '@/features/events/components/ui/spots-available-badge';
import { HostBadge } from '@/features/events/components/host-badge';
import { DistanceThresholdDisplay } from '@/features/distance/components/distance-threshold-display';
import { LocationTitleBadge } from '@/features/events/components/ui/location-title-badge';
import { MobileEventBadge } from '@/features/events/components/ui/mobile-event-badge';
import { EventControlBar } from '@/features/events/components/event-control-bar';
import { GeolocationMap } from '@/features/geolocation/components/geolocation-map';
import { AttendanceFeedTrigger } from '@/features/attendance/components/attendance-feed-trigger';
import { eventService } from '@/features/events/services/event-service';
import { EventMapSpecific } from '@/features/geolocation/components/event-map-specific';
import { EventHeader } from '@/features/events/components/ui/event-header';
import { EventDescription } from '@/features/events/components/ui/event-description';
import { EventOverviewContainer } from '@/features/events/components/ui/event-overview-container';

export const revalidate = 0;

const getData = async (event_id: string) => {
  const event = await getEvent(db).where({ 'ei.id': event_id }).first();
  return event;
};

export default async function EventPage({ params, attendance }) {
  const { event_id } = await params;
  const event = await eventService.repo.findById(event_id, db);
  if (!event) return <span>Event does not exist!</span>;

  return (
    <EventProvider initialEvent={event}>
      <DistanceProvider>
        <UserAttendanceManager />
        <UserAttendanceStatusManager />
        <EventActionProvider>
          <ModalStackProvider>
            <div className='flex flex-col h-full'>
              <EventOverviewContainer>
                <EventHeader />
                <EventDescription />
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
              </EventOverviewContainer>
              <div
                className='overflow-hidden flex flex-1 flex-col'
                style={{
                  width: '100%',
                }}>
                <EventMapSpecific />
              </div>
              <EventControlBar />
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
