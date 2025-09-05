import { createEventAction } from '../actions/create-event-action';
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
import { useEventContext } from '../providers/event-provider';
import { cloneFormData } from '@/util/clone-form-data';
import { createEventSchema } from '../schemas/event-schema';

export function useCreateEventForm() {
  const { event: template } = useEventContext();
  const { user, updateSession } = useUserContext();

  const [payload, setPayload] = useState(() => {
    const fd = new FormData();
    if (template) {
      for (const [key, val] of Object.entries(template)) {
        fd.set(key, typeof val === 'string' ? val : JSON.stringify(val));
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

  const handleParse = (e: TODO, schema: ZodType) => {
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
  };

  const handleChange = (e: TODO, schema?: ZodType) => {
    if (schema) {
      handleParse(e, schema);
    }

    setPayload(prev => {
      const newPayload = cloneFormData(prev);

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

  if (position) {
    payload.set(
      'position',
      JSON.stringify({
        coordinates: [position.coords.longitude, position.coords.latitude],
        accuracy: position.coords.accuracy,
        timestamp: position.timestamp,
      })
    );
  }

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
    validationSchema: createEventSchema,
  });

  return { payload, submitEvent, status, isPending, handleChange, setPayload, steps, inputStatus };
}
