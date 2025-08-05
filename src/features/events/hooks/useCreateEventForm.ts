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
  const [status, isPending, setStatus] = useStatus<string>();
  const { user, updateSession } = useUserContext();
  const { addAttendanceRecord } = useAttendanceContext();

  const router = useRouter();
  const submitEvent = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setStatus('loading');
    const payload = new FormData(e.currentTarget);
    const parseResult = eventDataSchema.safeParse(Object.fromEntries(payload));
    if (parseResult.success) {
      try {
        const res = await createEventAction(payload, template?.id);
        if (res.success === true) {
          await updateSession({
            attended_event_id: res.data,
          });

          addAttendanceRecord({
            event_instance_id: res.data,
            status: 'host',
            username: user.username,
          });

          setStatus('success');
          router.push(`/app/event/` + res.data);
          toast.success('Event created!');
        }
      } catch (err: any) {
        toast.error(err.message);
        setStatus('error');
      }
    } else {
      const msg = parseResult.error.issues.at(0)?.message;
      toast.error(msg || '');
      setStatus(msg);
    }

    setStatus(prev => (prev === 'loading' ? 'idle' : prev));
  };
  return { submitEvent, status, isPending };
}
