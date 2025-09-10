import { createEventAction } from '../actions/create-event-action';
import { useRouter } from 'next/navigation';
import { useUserContext } from '@/features/users/providers/user-provider';
import { useUserAttendanceContext } from '@/features/attendance/providers/user-attendance-provider';
import { useOnSubmit } from '@/hooks/use-on-submit';
import { useGeolocationContext } from '@/features/geolocation/providers/geolocation-provider';
import { EventError } from '@/features/events/errors/events';
import { useRef, useState } from 'react';
import z, { ZodType } from 'zod';
import { useStep } from '@/providers/step-provider';
import { TAttendance } from '@/features/attendance/schemas/attendance-schema';
import { useEventContext } from '../providers/event-provider';
import { cloneFormData } from '@/util/clone-form-data';
import { createEventSchema } from '../schemas/event-schema';
import { formDataToObject } from '@/util/form-data-to-object';
import { getParseResultErrorMessage } from '@/util/get-parse-result-error-message';

export function useCreateEventForm() {
  const { event: template } = useEventContext();
  const { user, updateSession } = useUserContext();
  const steps = useStep(0);
  const [inputStatus, setInputStatus] = useState(() => {
    if (template) {
      return {
        title: { errors: null },
        description: { errors: null },
        spots_available: { errors: null },
        size: { errors: null },
        category: { errors: null },
      };
    }
    return null;
  });

  const handleParse = (e: TODO) => {
    if (e.target.name === 'category' || e.target.name === 'size' || e.target.name === 'is_mobile')
      return;
    const result = createEventSchema.shape[e.target.name].safeParse(e.target.value);
    if (!result.success) {
      setInputStatus({
        ...inputStatus,
        [e.target.name]: z.treeifyError(result.error),
      });
    } else {
      setInputStatus({ ...inputStatus, [e.target.name]: { errors: null } });
    }
  };

  const attendance = useUserAttendanceContext();

  const router = useRouter();

  const {
    onSubmit: submitEvent,
    isPending,
    status,
  } = useOnSubmit({
    action: async payload => {
      if (!payload.get('position')) {
        return { success: false, error: EventError.locationDisabled };
      }
      return await createEventAction(payload, template?.id);
    },
    onSuccess: async res => {
      updateSession({
        attended_event_id: res.data,
      });
      const at = res.data as TAttendance;
      await attendance.updateAttendanceRecord(at);
      router.push(`/app/event/` + at.event_instance_id);
    },
    onParseError: err => {
      console.log(err);
    },
    onError: (err: any) => console.log(err.message),
    onFailure: res => console.log(res.error),
    onValidate: payload => {
      const result = createEventSchema.safeParse(formDataToObject(payload));
      if (!result.success) {
        return getParseResultErrorMessage(result);
      }
      return null;
    },
  });

  return { submitEvent, handleParse, status, isPending, steps, inputStatus };
}
