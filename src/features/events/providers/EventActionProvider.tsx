'use client';

import { createContextWithUseHook } from '@/util/createContextWithUseHook';
import { useEventContext } from './EventProvider';
import { useStatus } from '@/hooks/useStatus';
import { useUserContext } from '@/features/users/providers/UserProvider';
import { endEventAction } from '../actions/endEventAction';
import toast from 'react-hot-toast';

const [EventActionContext, useEventActionContext] = createContextWithUseHook<
  ReturnType<typeof useEventActions>
>('useEventActionContext can only be used within the scope of an EventActionContext!');

/**Provides the methods for updating the state of an event, like ending it.
 * The reason these are not inside the EventProvider, is that they aren't needed
 * in every situation the event data is needed.
 */
export function EventActionProvider({ children }) {
  const { event } = useEventContext();
  const hook = useEventActions(event.id);

  return <EventActionContext.Provider value={hook}>{children}</EventActionContext.Provider>;
}

function useEventActions(eventId: string) {
  const [status, isPending, setStatus] = useStatus();
  const { updateSession } = useUserContext();

  /**Attempts to update the user's session with a new attended event id.
   * @todo figure out why sometimes the updateSession does not update the attended event id.
   */
  const updateAttendanceOnAction = async ({
    action,
    attended_event_id,
  }: {
    action: () => Promise<void>;
    attended_event_id: string | null;
  }) => {
    await updateSession({ attended_event_id });
    await action();
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
    } catch (err) {
      toast.error(err.message);
    } finally {
      setStatus(prev => (prev === 'loading' ? 'idle' : prev));
    }
  };

  return { endEvent, isPending };
}

export { useEventActionContext };
