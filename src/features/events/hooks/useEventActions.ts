import { useStatus } from '@/hooks/useStatus';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { useUserContext } from '@/features/users/providers/UserProvider';
import { endEventAction } from '../actions/endEventAction';
import { toggleInterestAction } from '@/features/attendance/actions/toggleInterestAction';

export function useEventActions(eventId: string) {
  const [status, isPending, setStatus] = useStatus();
  const { user, updateSession } = useUserContext();
  const router = useRouter();

  /**Attempts to update the user's session with a new attended event id.
   * @todo figure out why sometimes the attended event id does not update.
   */
  const updateAttendanceOnAction = async ({
    action,
    attended_event_id,
  }: {
    action: () => Promise<void>;
    attended_event_id: string | null;
  }) => {
    await action();
    await updateSession({ attended_event_id });
  };

  /**@deprecated */
  const showInterest = async () => {
    if (isPending) return;
    setStatus('loading');

    try {
      await toggleInterestAction(eventId);
    } catch (err) {
      toast.error('Something went wrong!');
      console.log(err.message);
    } finally {
      setStatus(prev => (prev === 'loading' ? 'idle' : prev));
    }
  };

  const endEvent = async () => {
    if (isPending) return;
    setStatus('loading');

    try {
      await updateAttendanceOnAction({
        action: async () => {
          const res = await endEventAction(eventId);
          if (res.success === false) {
            toast.error(res.error);
          }
        },
        attended_event_id: null,
      });

      toast.success('Event ended!');
      router.push('/app/feed');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setStatus(prev => (prev === 'loading' ? 'idle' : prev));
    }
  };

  return { endEvent, showInterest, isPending };
}
