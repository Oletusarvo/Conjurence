import { TAttendance } from '@/features/attendance/schemas/attendance-schema';
import { useSocketHandlers } from '@/hooks/use-socket-handlers';
import { useSocketRoom } from '@/hooks/use-socket-room';
import { TEvent } from '../schemas/event-schema';

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
  onPositionUpdate,
  onAttendanceUpdate,
}: {
  eventId: string;
  onInterest?: (payload: {
    currentInterestCount: number;
    newAttendanceRecord: TAttendance;
  }) => void;
  onEnd?: (payload: { eventId: string }) => void;
  onUpdate?: (payload: Partial<TEvent>) => void;
  onPositionUpdate?: (payload: { eventId: string; position: GeolocationPosition }) => void;
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
    'event:position_update': (payload: { eventId: string; position: GeolocationPosition }) => {
      if (eventId !== payload.eventId) return;
      onPositionUpdate && onPositionUpdate(payload);
    },
    'event:attendance_update': (payload: {
      eventId: string;
      updatedAttendanceRecord: {
        username: string;
        status: TAttendance['status'];
      };
    }) => {
      if (payload.eventId !== eventId) return;
      onAttendanceUpdate && onAttendanceUpdate(payload.updatedAttendanceRecord);
    },
  });
}
