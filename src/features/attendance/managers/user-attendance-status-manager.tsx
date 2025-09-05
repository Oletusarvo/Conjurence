'use client';

import { Modal } from '@/components/modal-temp';
import { BaseEventModalBody } from '@/features/events/components/base-event-modal-body';
import { useUserAttendanceContext } from '@/features/attendance/providers/user-attendance-provider';
import {
  AttendanceStatusNotice,
  EventEndedNotice,
  EventLeftNotice,
} from '../../events/components/event-notice';
import { useEventContext } from '../../events/providers/event-provider';

export function UserAttendanceStatusManager() {
  const attendance = useUserAttendanceContext();
  const { hasEnded } = useEventContext();
  const currentAttendance = attendance.attendanceRecord;

  const getModalContent = () => {
    if (hasEnded) {
      if (currentAttendance?.status !== 'host') {
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

  return (
    <Modal
      title='Status'
      closeable={false}
      show={hasEnded || attendance.currentAction !== null}
      fullHeight>
      <BaseEventModalBody>
        <div className='flex w-full h-full items-center justify-center'>{getModalContent()}</div>
      </BaseEventModalBody>
    </Modal>
  );
}
