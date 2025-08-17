import { createEventAction } from '../actions/createEventAction';
import { eventDataSchema, eventSchema, TEventData } from '../schemas/eventSchema';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/features/users/providers/UserProvider';
import { useUserAttendanceContext } from '@/features/attendance/providers/UserAttendanceProvider';
import { useOnSubmit } from '@/hooks/useOnSubmit';
import { useGeolocationContext } from '@/features/geolocation/providers/GeolocationProvider';
import { EventError } from '@/errors/events';
import { useRef, useState } from 'react';

export function useCreateEventForm(template?: TEventData) {
  const { user, updateSession } = useUserContext();
  const [payload, setPayload] = useState(new FormData());

  const { addAttendanceRecord } = useUserAttendanceContext();

  const router = useRouter();
  const { position } = useGeolocationContext();

  const handleChange = e => {
    console.log('val at handle', e.target.checked);
    setPayload(prev => {
      const newPayload = new FormData();
      for (const [key, val] of prev) {
        newPayload.set(key, val);
      }

      newPayload.set(
        e.target.name,
        e.target.type === 'checkbox' ? e.target.checked : e.target.value
      );
      return newPayload;
    });
  };

  const {
    onSubmit: submitEvent,
    isPending,
    status,
  } = useOnSubmit({
    payload: payload,
    action: async () => {
      if (!position) {
        return { success: false, error: EventError.locationDisabled };
      }

      payload.set('location', JSON.stringify(position));
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
    onParseError: err => {
      console.log(payload);
      console.log(err);
    },
    onError: (err: any) => console.log(err.message),
    onFailure: res => console.log(res.error),
    validationSchema: eventDataSchema,
  });

  return { payload, submitEvent, status, isPending, handleChange };
}
