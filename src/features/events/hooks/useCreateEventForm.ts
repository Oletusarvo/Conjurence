import { createEventAction } from '../actions/createEventAction';
import { eventDataSchema, eventSchema, TEventData } from '../schemas/eventSchema';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/features/users/providers/UserProvider';
import { useUserAttendanceContext } from '@/features/attendance/providers/UserAttendanceProvider';
import { useOnSubmit } from '@/hooks/useOnSubmit';
import { useGeolocationContext } from '@/features/geolocation/providers/GeolocationProvider';
import { EventError } from '@/errors/events';
import { useRef, useState } from 'react';
import { ZodType } from 'zod';
import { useStep } from '@/providers/StepProvider';
import { TAttendance } from '@/features/attendance/schemas/attendanceSchema';

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
