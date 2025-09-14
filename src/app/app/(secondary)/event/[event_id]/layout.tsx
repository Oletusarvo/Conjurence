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
import { DistanceThresholdDisplay } from '@/features/distance/components/distance-threshold-display';
import { EventControlBar } from '@/features/events/components/event-control-bar';
import {
  AttendanceFeedTarget,
  AttendanceFeedTrigger,
} from '@/features/attendance/components/attendance-feed-trigger';
import { eventService } from '@/features/events/services/event-service';
import { EventMapSpecific } from '@/features/events/components/event-map-specific';
import { EventHeader } from '@/features/events/components/ui/event-header';
import { EventDescription } from '@/features/events/components/ui/event-description';
import { EventOverviewContainer } from '@/features/events/components/ui/event-overview-container';
import { InterestedCountBadge } from '@/features/attendance/components/interested-count-badge';
import { JoinedCountBadge } from '@/features/attendance/components/joined-count-badge';
import { ToggleProvider } from '@/providers/toggle-provider';
import { EventPositionUpdater } from '@/features/events/managers/event-position-updater';
import { EventPositionListener } from '@/features/events/managers/event-position-listener';
import { EventPositionProvider } from '@/features/events/providers/event-position-provider';
import { tablenames } from '@/tablenames';

export const revalidate = 0;

export default async function EventPage({ params, attendance }) {
  const { event_id } = await params;
  const event = await eventService.repo.findById(event_id, db);
  if (!event) return <span>Event does not exist!</span>;
  console.log(event);
  return (
    <EventProvider initialEvent={event}>
      <EventPositionListener />
      {event.is_mobile && <EventPositionUpdater />}
      <DistanceProvider>
        <UserAttendanceManager />
        <ToggleProvider>
          <UserAttendanceStatusManager />
        </ToggleProvider>

        <EventActionProvider>
          <ModalStackProvider>
            <div className='flex flex-col h-full'>
              <EventOverviewContainer>
                <EventHeader />
                <EventDescription />
                <div className='flex w-full justify-between'>
                  <ToggleProvider>
                    <AttendanceFeedTrigger>
                      <InterestedCountBadge />
                      <JoinedCountBadge />
                    </AttendanceFeedTrigger>

                    <Suspense fallback={<AttendanceLoading />}>
                      <AttendanceFeedTarget>{attendance}</AttendanceFeedTarget>
                    </Suspense>
                  </ToggleProvider>

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
