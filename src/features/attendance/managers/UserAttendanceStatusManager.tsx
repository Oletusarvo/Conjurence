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
  const { getAttendanceByEventId, attendanceStatus } = useUserAttendanceContext();
  const { event, hasEnded } = useEventContext();
  const attendance = getAttendanceByEventId(event.id);

  const getModalContent = () => {
    if (hasEnded) {
      if (attendance.status !== 'host') {
        return <EventEndedNotice variant='attendee' />;
      } else {
        return <EventEndedNotice variant='host' />;
      }
    } else if (attendanceStatus !== null) {
      return <AttendanceStatusNotice status={attendanceStatus} />;
    }

    if (attendance) {
      if (attendance.status === 'left') {
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
      show={hasEnded || attendanceStatus !== null}
      fullHeight>
      <BaseEventModalBody>
        <div className='flex w-full h-full items-center justify-center'>{getModalContent()}</div>
      </BaseEventModalBody>
    </Modal>
  );
}
