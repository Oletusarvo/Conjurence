import { BaseEventModalBody } from '@/features/events/components/BaseEventModalBody';
import { EventStatusBadge } from '@/features/events/components/EventStatusBadge';
import { getEvent } from '@/features/events/dal/getEvent';
import db from '@/dbconfig';
import { loadSession } from '@/util/loadSession';
import { getAttendance } from '@/features/attendance/dal/getAttendance';
import { EventStatusFeedback } from '@/features/events/providers/EventStatusFeedbackProvider';
import { Suspense } from 'react';
import { Spinner } from '@/components/Spinner';
import { EventProvider } from '@/features/events/providers/EventProvider';
import { ModalStackProvider } from '@/providers/ModalStackProvider';
import { EventActionProvider } from '@/features/events/providers/EventActionProvider';
import { MapPin } from 'lucide-react';

export const revalidate = 0;

const getData = async (event_id: string) => {
  const event = await getEvent(db).where({ 'ei.id': event_id }).first();
  return event;
};

export default async function EventPage({ params, attendance }) {
  const { event_id } = await params;
  const session = await loadSession();

  const attendanceRecord = await getAttendance(db)
    .where({ user_id: session.user.id, event_instance_id: event_id })
    .first();

  const event = await getData(event_id);

  return (
    <EventProvider initialEvent={event}>
      <EventActionProvider>
        <ModalStackProvider>
          <EventStatusFeedback>
            <BaseEventModalBody>
              <div className='flex flex-col gap-4 bg-background-light w-full px-2 py-4 border-b border-gray-600'>
                <div className='flex items-start px-2 w-full'>
                  <div className='flex flex-col items-start gap-4 w-full'>
                    <div className='flex gap-2 items-center justify-between w-full'>
                      <div className='flex items-center gap-4'>
                        <h3>{event.title}</h3>
                      </div>{' '}
                      <EventStatusBadge createdAt={event.created_at} />
                    </div>

                    <div className='pill --small --outlined --accent'>{event.category}</div>
                    <p className='tracking-tight leading-[18px]'>{event.description}</p>
                    <div className='flex gap-1 items-center'>
                      <MapPin size={'14px'} />
                      <span>{event.location || 'No location.'}</span>
                    </div>
                  </div>
                </div>
              </div>
              <div className='flex flex-col w-full flex-1 px-4 gap-2 max-h-full overflow-y-scroll'>
                <Suspense fallback={<AttendanceLoading />}>{attendance}</Suspense>
              </div>
            </BaseEventModalBody>
          </EventStatusFeedback>
        </ModalStackProvider>
      </EventActionProvider>
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
