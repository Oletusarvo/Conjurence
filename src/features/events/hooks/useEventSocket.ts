import { TAttendance } from '@/features/attendance/schemas/attendanceSchema';
import { useSocketHandlers } from '@/hooks/useSocketHandlers';
import { useSocketRoom } from '@/hooks/useSocketRoom';
import { TEvent } from '../schemas/eventSchema';

/**
 * Sets up the local socket instance to handle events related to the events made by users. Joins the room event:eventId using useSocketRoom.
 * @param eventId The id of the event to listen for events on.
 * @param onInterest Callback fired when receiving an interest-event. Will only call it if the interest event happened on the event with eventId.
 */
export function useEventSocket({
  eventId,
  onInterest,
  onEnd,
  onUpdate,
  onAttendanceUpdate,
}: {
  eventId: string;
  onInterest?: (payload: {
    currentInterestCount: number;
    newAttendanceRecord: TAttendance;
  }) => void;
  onEnd?: (payload: { eventId: string }) => void;
  onUpdate?: (payload: Partial<TEvent>) => void;
  onAttendanceUpdate?: (newAttendanceRecord: {
    username: string;
    status: TAttendance['status'];
  }) => void;
}) {
  useSocketRoom([`event:${eventId}`]);
  useSocketHandlers({
    'event:interest': payload => {
      if (payload.eventId !== eventId) return;
      onInterest && onInterest(payload);
    },

    'event:end': payload => {
      if (payload.eventId !== eventId) return;
      onEnd && onEnd(payload);
    },
    'event:update': payload => {
      if (payload.eventId !== eventId) return;
      onUpdate && onUpdate(payload);
    },
    'event:attendance_update': (payload: {
      eventId: string;
      newAttendanceRecord: {
        username: string;
        status: TAttendance['status'];
      };
    }) => {
      if (payload.eventId !== eventId) return;
      onAttendanceUpdate && onAttendanceUpdate(payload.newAttendanceRecord);
    },
  });
}
