import { useStatus } from '@/hooks/useStatus';
import { requestJoinEventAction } from '../../attendance/actions/experimental/requestJoinEventAction';
import { useRouter } from 'next/navigation';
import toast from 'react-hot-toast';
import { cancelJoinRequestAction } from '../../attendance/actions/experimental/cancelJoinRequestAction';
import { useUserContext } from '@/features/users/providers/UserProvider';
import { endEventAction } from '../actions/endEventAction';
import { leaveEventAction } from '../../attendance/actions/experimental/leaveEventAction';

export function useEventActions(eventId: string) {
  const [status, isPending, setStatus, setIsPending] = useStatus();
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

  const requestJoin = async () => {
    if (isPending) return;
    setIsPending(true);

    try {
      await updateAttendanceOnAction({
        action: async () => await requestJoinEventAction(eventId),
        attended_event_id: eventId,
      });

      router.refresh();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsPending(false);
    }
  };

  const cancelJoinRequest = async () => {
    if (isPending) return;
    setIsPending(true);

    try {
      await updateAttendanceOnAction({
        action: async () => await cancelJoinRequestAction(user.id, eventId),
        attended_event_id: null,
      });

      router.refresh();
      toast.success('Join cancelled!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsPending(false);
    }
  };

  const leaveEvent = async () => {
    if (isPending) return;
    setIsPending(true);

    try {
      await updateAttendanceOnAction({
        action: async () => await leaveEventAction(eventId, user.id),
        attended_event_id: null,
      });

      router.push('/app/feed');
      toast.success('Left event successfully!');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsPending(false);
    }
  };

  const endEvent = async () => {
    if (isPending) return;

    const c = confirm('Are you sure you want to end the event?');
    if (!c) return;

    setIsPending(true);

    try {
      await updateAttendanceOnAction({
        action: async () => await endEventAction(eventId),
        attended_event_id: null,
      });

      toast.success('Event ended!');
      router.push('/app/feed');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setIsPending(false);
    }
  };

  return { requestJoin, cancelJoinRequest, endEvent, leaveEvent, isPending };
}
