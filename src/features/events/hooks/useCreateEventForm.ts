import toast from 'react-hot-toast';
import { createEventAction } from '../actions/createEventAction';
import { eventDataSchema, TEventData } from '../schemas/eventSchema';
import { FormEvent } from 'react';
import { useRouter } from 'next/navigation';
import { useStatus } from '@/hooks/useStatus';
import { useUserContext } from '@/features/users/providers/UserProvider';
import { useAttendanceContext } from '@/features/attendance/providers/AttendanceProvider';
import { TAttendance } from '@/features/attendance/schemas/attendanceSchema';

export function useCreateEventForm(template?: TEventData) {
  const [status, isPending, setStatus, setIsPending] = useStatus();
  const { user, updateSession } = useUserContext();
  const { addAttendanceRecord } = useAttendanceContext();

  const router = useRouter();
  const submitEvent = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsPending(true);
    const payload = new FormData(e.currentTarget);
    const parseResult = eventDataSchema.safeParse(Object.fromEntries(payload));
    if (parseResult.success) {
      try {
        const id = await createEventAction(payload, template?.id);
        await updateSession({
          attended_event_id: id,
        });

        addAttendanceRecord({
          event_instance_id: id,
          status: 'host',
          username: user.username,
        });

        setStatus('success');
        router.push(`/app/event/` + id);
        toast.success('Event created!');
      } catch (err: any) {
        toast.error(err.message);
      }
    } else {
      const msg = parseResult.error.issues.at(0)?.message;
      toast.error(msg || '');
      setStatus(msg || null);
    }

    setIsPending(false);
  };
  return { submitEvent, status, isPending };
}
