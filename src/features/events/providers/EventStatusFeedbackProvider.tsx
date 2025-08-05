'use client';

import { useEffect } from 'react';
import { Modal } from '@/components/Modal';
import { BaseEventModalBody } from '@/features/events/components/BaseEventModalBody';
import { EventActionButton } from '@/features/events/components/EventActionButton';
import { useAttendanceContext } from '@/features/attendance/providers/AttendanceProvider';
import { EventEndedNotice } from '../components/EventNotice';
import { EventActionProvider } from './EventActionProvider';
import { useUserContext } from '@/features/users/providers/UserProvider';
import { useEventContext } from './EventProvider';

type EventProviderProps = React.PropsWithChildren;

export function EventStatusFeedback({ children }: EventProviderProps) {
  const { updateSession } = useUserContext();
  const { getAttendanceByEventId } = useAttendanceContext();
  const { hasEnded } = useEventContext();

  const getModalContent = () => {
    if (hasEnded) {
      return <EventEndedNotice />;
    }
  };

  useEffect(() => {
    if (hasEnded) {
      updateSession({ attended_event_id: null });
    }
  }, [hasEnded]);

  return (
    <>
      {children}
      <EventActionProvider>
        <div className='px-2 pb-2'>
          <EventActionButton />
        </div>
        <Modal
          title='Status'
          show={hasEnded}
          fullHeight>
          <BaseEventModalBody>
            <div className='flex w-full h-full items-center justify-center'>
              {getModalContent()}
            </div>
          </BaseEventModalBody>
        </Modal>
      </EventActionProvider>
    </>
  );
}
