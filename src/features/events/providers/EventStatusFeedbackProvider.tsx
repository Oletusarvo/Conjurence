'use client';

import { useEffect, useState } from 'react';
import { Modal } from '@/components/Modal';
import { BaseEventModalBody } from '@/features/events/components/BaseEventModalBody';
import { EventActionButton } from '@/features/events/components/EventActionButton';
import { useToggle } from '@/hooks/useToggle';
import { useAttendanceContext } from '@/features/attendance/providers/AttendanceProvider';
import { TAttendanceStatus } from '@/features/attendance/schemas/attendanceSchema';
import {
  EventAttendanceAccepted,
  EventAttendancePending,
  EventAttendanceRejected,
  EventEndedNotice,
} from '../components/EventNotice';
import { EventActionProvider } from './EventActionProvider';
import { useUserContext } from '@/features/users/providers/UserProvider';
import { useEventContext } from './EventProvider';

type EventProviderProps = React.PropsWithChildren;

export function EventStatusFeedback({ children }: EventProviderProps) {
  const { updateSession } = useUserContext();
  const { getAttendanceByEventId } = useAttendanceContext();
  const { event } = useEventContext();
  const participantRecord = getAttendanceByEventId(event.id);

  //Determines whether to display the modal or not. Will show it on all statuses except joined and host.
  const [mode, setMode] = useState<'main' | TAttendanceStatus>(() => {
    if (
      !participantRecord ||
      participantRecord.status === 'joined' ||
      participantRecord.status === 'host' ||
      participantRecord.status === 'interested'
    ) {
      return 'main';
    }

    return participantRecord.status;
  });

  const [showModal, toggleModal] = useToggle(mode !== 'main' || event.ended_at !== null);

  const getModalContent = () => {
    if (event.ended_at) {
      return <EventEndedNotice />;
    } else if (mode === 'pending') {
      return <EventAttendancePending />;
    } else if (mode === 'accepted') {
      return <EventAttendanceAccepted />;
    } else if (mode === 'rejected') {
      return <EventAttendanceRejected />;
    } else if (mode === 'kicked') {
      return (
        <>
          <h2>You were kicked!</h2>
          <button className='--contained --accent'>Back to feed</button>
        </>
      );
    }
  };

  useEffect(() => {
    if (!participantRecord) return;
    const { status } = participantRecord;
    if (
      status === 'pending' ||
      status === 'canceled' ||
      status === 'kicked' ||
      status === 'joined'
    ) {
      toggleModal(true);
    }
  }, [participantRecord?.status]);

  useEffect(() => {
    if (event.ended_at) {
      updateSession({ attended_event_id: null });
    }
  }, [event.ended_at]);

  return (
    <>
      {children}
      <EventActionProvider>
        <div className='px-2 pb-2'>
          <EventActionButton />
        </div>
        <Modal
          title='Status'
          show={showModal}
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
