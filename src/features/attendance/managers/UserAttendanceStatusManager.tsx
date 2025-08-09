'use client';

import { useEffect } from 'react';
import { Modal } from '@/components/Modal';
import { BaseEventModalBody } from '@/features/events/components/BaseEventModalBody';
import { useUserAttendanceContext } from '@/features/attendance/providers/UserAttendanceProvider';
import {
  AttendanceStatusNotice,
  EventEndedNotice,
  EventLeftNotice,
} from '../../events/components/EventNotice';
import { useUserContext } from '@/features/users/providers/UserProvider';
import { useEventContext } from '../../events/providers/EventProvider';

export function UserAttendanceStatusManager() {
  const { updateSession } = useUserContext();
  const attendance = useUserAttendanceContext();
  const { event, hasEnded } = useEventContext();
  const currentAttendance = attendance.getAttendanceByEventId(event.id);

  const getModalContent = () => {
    if (hasEnded) {
      if (currentAttendance.status !== 'host') {
        return <EventEndedNotice variant='attendee' />;
      } else {
        return <EventEndedNotice variant='host' />;
      }
    } else if (currentAttendance !== null) {
      return <AttendanceStatusNotice status={attendance.currentAction} />;
    }

    if (currentAttendance) {
      if (currentAttendance.status === 'left') {
        return <EventLeftNotice />;
      }
    }
  };

  useEffect(() => {
    if (hasEnded) {
      updateSession({ attended_event_id: null });
    }
  }, [hasEnded]);

  return (
    <Modal
      title='Status'
      show={hasEnded || attendance.currentAction !== null}
      fullHeight>
      <BaseEventModalBody>
        <div className='flex w-full h-full items-center justify-center'>{getModalContent()}</div>
      </BaseEventModalBody>
    </Modal>
  );
}
