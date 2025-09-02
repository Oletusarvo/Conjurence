import { createEventAction } from '../actions/create-event-action';
import { eventDataSchema, eventSchema, TEventData } from '../schemas/event-schema';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/features/users/providers/user-provider';
import { useUserAttendanceContext } from '@/features/attendance/providers/user-attendance-provider';
import { useOnSubmit } from '@/hooks/use-on-submit';
import { useGeolocationContext } from '@/features/geolocation/providers/geolocation-provider';
import { EventError } from '@/features/events/errors/events';
import { useRef, useState } from 'react';
import { ZodType } from 'zod';
import { useStep } from '@/providers/step-provider';
import { TAttendance } from '@/features/attendance/schemas/attendance-schema';

export function useCreateEventForm(template?: TEventData) {
  const { user, updateSession } = useUserContext();

  const [payload, setPayload] = useState(() => {
    const fd = new FormData();
    if (template) {
      for (const [key, val] of Object.entries(template)) {
        fd.set(key, val.toString());
      }
    }
    return fd;
  });

  const steps = useStep(0);

  const [inputStatus, setStatus] = useState({
    title: template?.title ? 'success' : null,
    location_title: null,
    description: template?.description ? 'success' : null,
  });

  console.log(Object.values(inputStatus));

  const handleChange = (e: TODO, schema?: ZodType) => {
    if (schema) {
      const key = e.target.name;
      const parseResult = schema.safeParse(e.target.value);
      if (!parseResult.success) {
        setStatus(prev => ({
          ...prev,
          [key]: parseResult.error.issues.at(0)?.message,
        }));
      } else {
        setStatus(prev => ({ ...prev, [key]: 'success' }));
      }
    }

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

  const attendance = useUserAttendanceContext();

  const router = useRouter();
  const { position } = useGeolocationContext();

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
      payload.set(
        'position_metadata',
        JSON.stringify({
          accuracy: position.coords.accuracy,
          timestamp: position.timestamp,
        })
      );

      console.log(payload);
      return await createEventAction(payload, template?.id);
    },
    onSuccess: async res => {
      await updateSession({
        attended_event_id: res.data,
      });
      const at = res.data as TAttendance;
      await attendance.updateAttendanceRecord(at);
      router.push(`/app/event/` + at.event_instance_id);
    },
    onParseError: err => {
      console.log(payload);
      console.log(err);
    },
    onError: (err: any) => console.log(err.message),
    onFailure: res => console.log(res.error),
    validationSchema: eventDataSchema,
  });

  return { payload, submitEvent, status, isPending, handleChange, steps, inputStatus };
}
