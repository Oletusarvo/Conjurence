import { createEventAction } from '../actions/createEventAction';
import { eventDataSchema, eventSchema, TEventData } from '../schemas/eventSchema';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/features/users/providers/UserProvider';
import { useUserAttendanceContext } from '@/features/attendance/providers/UserAttendanceProvider';
import { useOnSubmit } from '@/hooks/useOnSubmit';
import { useGeolocationContext } from '@/features/geolocation/providers/GeolocationProvider';
import { EventError } from '@/errors/events';

export function useCreateEventForm(template?: TEventData) {
  const { user, updateSession } = useUserContext();
  const { addAttendanceRecord } = useUserAttendanceContext();

  const router = useRouter();
  const { position } = useGeolocationContext();

  const {
    onSubmit: submitEvent,
    isPending,
    status,
  } = useOnSubmit({
    action: async payload => {
      if (!position) {
        return { success: false, error: EventError.locationDisabled };
      }
      console.log(position);
      const pos = JSON.stringify(position);

      console.log(pos);
      payload.set('location', pos);

      return await createEventAction(payload, template?.id);
    },
    onSuccess: async res => {
      await updateSession({
        attended_event_id: res.data,
      });

      addAttendanceRecord({
        event_instance_id: res.data as string,
        status: 'host',
        username: user.username,
      });
      router.push(`/app/event/` + res.data);
    },
    onParseError: err => console.log(err),
    validationSchema: eventDataSchema,
  });

  return { submitEvent, status, isPending };
}
